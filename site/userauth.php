<?php
 
require_once 'common.php';
require_once 'libs/password.php';

class InvalidAccountException extends Exception { 
	public $id;
	public function __construct( $id ) {
		$this->id = $id;
		parent::__construct( "Invalid account ID: $id" );
	}

}
class InvalidAccountFieldException extends Exception { }

//-----------------------------------------------------------------------------
final class UserAuth {


private static $logged_in = FALSE;
private static $account_id = 0;
private static $secret_charset = 
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	
private static $account_field_types;

const FIELD_STRING = 0;
const FIELD_INT = 1; 

public static function init() {
	self::$account_field_types = array(
		'password'     => self::FIELD_STRING,
		'nickname'     => self::FIELD_STRING,
		'name'         => self::FIELD_STRING,
		'website'      => self::FIELD_STRING,
		'bio'          => self::FIELD_STRING,
		'linksmade'    => self::FIELD_INT,
		'stronglinks'  => self::FIELD_INT,
		'perfectlinks' => self::FIELD_INT,
		'banned'       => self::FIELD_INT,
		'banreason'    => self::FIELD_INT
	);
}

/** ---------------------------------------------------------------------------
 * Check if the user is logged in
 *
 * @return bool TRUE if the user is logged in.
 */
public static function LoggedIn() {
	return $logged_in;
}

/** ---------------------------------------------------------------------------
 * Get the account id of the user.
 *
 * @return int User account id, or 0 if not logged in.
 */
public static function AccountID() {
	return $account_id;
}

/** ---------------------------------------------------------------------------
 * Generate a random secret string.
 *
 * @return string 32-char secret string
 */
public static function GenerateSecret() {
	$secret = '';
    $count = strlen($charset) - 1;
	for( $i = 0; $i < 32; $i++ ) {
		$secret .= $charset[mt_rand( 0, $count )];
	}
	return $secret;
}

/** ---------------------------------------------------------------------------
 * Hash a username for a database query.
 *
 * @return string 8-digit hex code
 */
public static function HashUsername( $username ) {
	return hash( "crc32b", $username );
}

/** ---------------------------------------------------------------------------
 * Get account ID from a username.
 *
 * @param  string $username Username address to query.
 * @return int              Matching Account ID, or 0 if no match.
 */
public static function GetAccountIDFromUsername( $username ) {
	$hash = HashUsername( $username );
	$db = GetSQL();
	$result = $db->safequery( 
		"SELECT username, account
		FROM Accounts WHERE user_hash=0x$hash" );
	
	if( $result->num_rows == 0 ) return 0; // unrecognized username.
	
	while( $row = $result->fetch_row( $result ) ) {
		if( $row[0] === $username ) {
			return (int)$row[1];
		}
	}
	return 0; // unrecognized username.
}

/** ---------------------------------------------------------------------------
 * Do an account database query.
 *
 * @param int    $id     ID of account to read
 * @param array $fields String array of fields to read. this is not sanitized.
 * @return array         Assoc array containing the account field values.
 * @throws InvalidAccountException If the account doesn't exist.
 * @throws SQL exception on database failure
 */
public static function ReadAccount( $id, $fields ) {
	$id = (int)$id; // safety
	
	$db = GetSQL();
	$result = $db->safequery( 	
		"SELECT ". implode( ',' , $fields ) . "
		FROM Accounts  
		WHERE id = $id" );
	
	$row = $result->fetch_assoc();
	if( $row === FALSE ) {
		throw new InvalidAccountException( $id );
	}
	$row['id'] = $id;
	return $row;
}

/** ---------------------------------------------------------------------------
 * Modify an account in the database.
 *
 * Only certain fields can be written to.
 *
 * @param int    $id     ID of account to modify
 * @param array $fields  Array of fields to write to. Key is the field, value
 *                       is the value. Values are handled safely.
 *                       e.g. array( "email" => "abc@example.com" )
 *
 * @throws InvalidAccountException If the account doesn't exist.
 * @throws InvalidArgumentException If the $fields argument contains errors.
 * @throws SQL exception on database failure
 */
public static function WriteAccount( $id, $fields ) {
	$db = GetSQL();
	
	$set = array();
	foreach( $fields as $key => $value ) {
		if( !isset( self::$account_field_types[$key] ) ) {
			throw new InvalidArgumentException( "$key is not a valid field." );
		}
		
		$type = self::$account_field_types[$key];
		if( $type == self::FIELD_STRING ) {
			
			$set[] = "$key='" + $db->real_escape_string( $value ) + "'";
		} else {
			$value = (int)$value;
			$set[] = "$key=$value";
		}
		
	}
	if( empty( $set ) ) return;
	
	$result = $db->safequery( 	
		"UPDATE Accounts
		SET ". implode( ',' , $set ) . "
		WHERE id = $id" );
	
	if( $result->affected_rows == 0 ) {
		throw new InvalidAccountException( $id );
	}
}

/** ---------------------------------------------------------------------------
 * Read the login cookie and parse it.
 *
 * @param int &$id     (Out) ID of login cookie
 * @param int &$secret (Out) secret of login cookie
 * @return bool        FALSE if cookie missing or invalid
 */
public static function ParseLoginToken( &$id, &$secret ) {
	if( !isset( $_COOKIE['login'] ) ) return FALSE;
	$a = $_COOKIE['login'];
	$split = strpos($a,'/');
	if( $split === FALSE ) return FALSE;
	$id = intval( substring( $a, 0, $split ) );
	$secret = substring( $a, $split +1 );
	if( $id == 0 ) return FALSE;
	return TRUE;
}

/** ---------------------------------------------------------------------------
 * Check if a user is logged in, and try to log them in if they aren't.
 *
 * @return int|false Account ID or FALSE if they are not logged in 
 *                   and do not have a valid login token.
 */
public static function CheckLogin() {
	if( self::$logged_in ) {
		return self::$account_id;
	}
	
	// first check if they are logged in via their session.
	OpenSession();
	if( isset($_SESSION['account_id']) ) {
		self::$logged_in = true;
		self::$account_id = $_SESSION['account_id'];
		return $_SESSION['account_id'];
	}
	
	// and then check if they have a saved login
	$id     = 0;
	$secret = 0;
	
	if( !self::ParseLoginToken( $id, $secret ) ) return FALSE;
	
	$time = time();
	$db = GetSQL();
	$result = $db->RunQuery( 
		"SELECT account, secret, expires FROM LoginTokens
		WHERE id=$id AND $time < expires" );
	
	$row = $result->fetch_assoc();
	if( $row === FALSE 
		|| !password_verify( $secret, $row['secret'] ) ) {
		// TODO record login strike
		// and tempban ip if they accumulate.
		
		// clear saved login cookie
		setcookie( "login", 0, 0, $config->AbsPath() );
		return FALSE;
	}
	
	// extend remaining time if it's low.
	//$remaining = $row['expires'] - $time;
	//if( $remaining < \Config::$AUTHTOKEN_EXTEND_MIN ) {
	//	$expires = $time + \Config::$AUTHTOKEN_EXTEND_DURATION;
	//	$db->RunQuery( 
	//		"UPDATE ACCOUNT SET expires = $expires
	//		WHERE id=$token" );
	//	
	//	setcookie( "login", $_COOKIE['login'], 
	//		$expires, $config->AbsPath() );
	//}
	
	self::$logged_in = true;
	self::$account_id = $row['account'];
	$_SESSION['account_id'] = self::$account_id;
	
	return self::$account_id;
}

/** ---------------------------------------------------------------------------
 * Log in a user using their username and password
 *
 * @param string $username Username.
 * @param string $password Password.
 * @param string $remember TRUE to create a long lasting login token. FALSE
 *                         to expire after a short while.
 * @return int|false Account ID or FALSE if the credentials are invalid.
 */
public static function LogIn( $username, $password, $remember ) {
	$db = GetSQL();
	
	$username = trim($username);
	if( !IsValidString( $username ) ) return FALSE;
	if( !IsValidString( $password ) ) return FALSE;
	
	$user_hash = HashUsername( $username );
	$user_safe = $db->real_escape_string( $username );
	$result = $db->RunQuery( 
		"SELECT id, password FROM Accounts
		WHERE user_hash=x'$user_hash' AND username='$user_safe'" );
	
	$row = $result->fetch_assoc();
	if( $row === FALSE ) return FALSE;
	
	if( !password_verify( $password, $row['password'] ) ) {
		// TODO record strike and tempban ip.
		return FALSE;
	}
	
	OpenSession();
	self::$logged_in = true;
	self::$account_id = (int)$row['account']; 
	 
	$_SESSION['account_id'] = self::$account_id;
	
	if( $remember ) {
		self::CreateLoginToken();
	} 
}

/** ---------------------------------------------------------------------------
 * Create a "saved login" token for a user. ("remember me")
 *
 * @param bool $long Create a long lasting token.
 */
private static function CreateLoginToken() {
	
	$db = GetSQL();
	$secret = GenerateSecret();
	$id = self::$account_id;
	
	$secrethash = password_hash($secret);
	$expires = time() + \Config::$AUTHTOKEN_DURATION;
	$db->RunQuery( 
		"INSERT INTO LoginTokens (account, secret, expires)
		VALUES ( $id, '$secrethash', $expires )" ); 
	
	$result = $db->RunQuery( "SELECT LAST_INSERT_ID()" );
	$row = $result->fetch_row();
	
	setcookie( "login", $row[0] . '/' . $secret, 
		$expires, $config->AbsPath(), $config->SecureMode() );
	
}

/** ---------------------------------------------------------------------------
 * Tests if a given string is valid for a username, password, or nickname.
 *
 * @param  string $string Input to test.
 * @return bool           TRUE if valid.
 */
private static function IsValidString( $string ) {
	return preg_match( $string, '^[\x20-\x7E]+$' );
}

/** ---------------------------------------------------------------------------
 * Create a new account.
 *
 * @param string $username Username for account.
 * @param string $password Password for account.
 * @param string $nickname Initial nickname for the account.
 *
 * @return string "okay" if the account was created.
 *                "exists" if the username already exists.
 *                "error" if the input is not valid (invalid chars)
 *
 * @throws SQLException if a database error occurs.
 */
public static function CreateAccount( $username, $password, $nickname ) {
	$db = GetSQL();
	
	$username = trim($username);
	if( !IsValidString( $username ) ) {
		return 'error';
	}
	if( !IsValidString( $password ) ) {
		return 'error';
	}
	$nickname = trim($nickname);
	if( !IsValidString( $nickname ) ) {
		return 'error';
	} 
	
	$user_hash = HashUsername( $username );
	
	$username = $db->real_escape_string( $username );
	$password = $db->real_escape_string( $password );
	$nickname = $db->real_escape_string( $nickname );
	
	try {
		$db->RunQuery( 
			"INSERT INTO Accounts 
			(user_hash, username, password, nickname)
			VALUES ('$username','$password','$nickname')" );
	} catch( SQLException $e ) {
		if( $e->errno == 1169 ) { // ER_DUP_UNIQUE
			return 'exists';
		}
		throw $e;
	}
	
	return 'okay';
}

	
} // class UserAuth

UserAuth::init();

?>