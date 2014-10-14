<?php

namespace Brains;

require_once 'libs/password.php';

/** ---------------------------------------------------------------------------
 * Interface for managing user properties and authentication.
 */
final class User {
 
private static $logged_in = FALSE;
private static $account_id = 0;

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
 * Check if the user is logged in.
 *
 * CheckLogin should be called before this function is used.
 *
 * @return bool TRUE if the user is logged in.
 */
public static function LoggedIn() {
	return self::$logged_in;
}

/** ---------------------------------------------------------------------------
 * Generate a new ctoken
 */
private static function RefreshCToken() {
	$ctoken = Garbage::Produce( 24 );
	setcookie( "ctoken", $ctoken, 
			   time() + 60*60*24*90, GetDocumentRoot() );
	$_COOKIE['ctoken'] = $ctoken;
}

/** ---------------------------------------------------------------------------
 * Set if the current session is logged in.
 *
 * @param int $account_id  Account ID to associate with the session, or 0 to
 *                         set a logged out state.
 * @param string $username Username of the user, leave null to query the db
 *                         for it.
 * @param string $nickname Nickname of the user, leave null to query the db
 *                         for it.
 */
public static function SetLoggedIn( $account_id, 
									$username = null, 
									$nickname = null ) {
	OpenSession();
	if( $account_id ) {
		self::$logged_in = true;
		self::$account_id = $account_id;
		$_SESSION['account_id'] = self::$account_id;
		
		if( $username === null || $nickname === null ) {
			// if these aren't provided, get them from the db.
			$query = self::ReadAccount( $account_id, ['username','nickname'] );
			$username = $query['username'];
			$nickname = $query['nickname'];
		}
		$_SESSION['account_username'] = $username;
		$_SESSION['account_nickname'] = $nickname;
		
		if( !isset( $_COOKIE['ctoken'] ) ) {
			self::RefreshCToken();
		}
	} else {
		self::$logged_in = false;
		self::$account_id = 0;
		self::DeleteLoginToken();
		if( isset( $_SESSION['account_id'] ) ) {
			unset( $_SESSION['account_id'] );
		}
	}
}

/** ---------------------------------------------------------------------------
 * Get the user's Username
 *
 * @return string|false Username or FALSE if the user is not logged in.
 */
public static function GetUsername() {
	if( self::$logged_in ) {
		return $_SESSION['account_username'];
	}
	return FALSE;
}

/** ---------------------------------------------------------------------------
 * Get the user's nickname.
 *
 * @return string|false Nickname or FALSE if the user is not logged in.
 */
public static function GetNickname() {
	if( self::$logged_in ) {
		return $_SESSION['account_nickname'];
	}
	return FALSE;
}

/** ---------------------------------------------------------------------------
 * Get the account id of the user.
 *
 * @return int User account id, or 0 if not logged in.
 */
public static function AccountID() {
	return self::$account_id;
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
	$db = \SQLW::Get();
	$username_sql = $db->real_escape_string( $username );
	$result = $db->RunQuery( 
		"SELECT id FROM Accounts 
		WHERE user_hash=0x$hash
		AND username='$username_sql'" );
	
	$row = $result->fetch_row();
	if( $row === NULL ) return 0; // unrecognized username.
	return (int)$row[0];
}

/** ---------------------------------------------------------------------------
 * Read fields from an account in the database.
 *
 * @param int   $id      ID of account to read
 * @param array|string $fields String array of fields to read. 
 *                       This is not sanitized for the SQL query. This can
 *                       also be a string for a single field reading.
 *
 * @return array         Assoc array containing the requested account 
 *                       field values.
 * @throws InvalidAccountException If the account doesn't exist.
 * @throws SQL exception on database failure
 */
public static function ReadAccount( $id, $fields ) {
	if( gettype( $fields ) == "string" ) {
	} else if( gettype( $fields ) == "array" ) { 
		$fields = implode( ',', $fields );
	} else {
		throw new InvalidArgumentException( 
			'$fields must be an array or a string.' );
	}
	$id = (int)$id; // safety
	
	$db = \SQLW::Get();
	$result = $db->RunQuery( 	
		"SELECT $fields FROM Accounts WHERE id=$id" );
	
	$row = $result->fetch_assoc();
	if( $row === NULL ) {
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
	$db = \SQLW::Get();
	
	$set = [];
	foreach( $fields as $key => $value ) {
		if( !isset( self::$account_field_types[$key] ) ) {
			throw new InvalidArgumentException( "$key is not a valid field." );
		}
		
		$type = self::$account_field_types[$key];
		if( $type == self::FIELD_STRING ) {
			
			$set[] = "$key='" . $db->real_escape_string( $value ) . "'";
		} else {
			$value = (int)$value;
			$set[] = "$key=$value";
		}
		
	}
	if( empty( $set ) ) return;
	 
	$db->RunQuery( 	
		"UPDATE Accounts
		SET ". implode( ',' , $set ) . "
		WHERE id = $id" );
	
	if( $db->affected_rows == 0 ) {
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
	$id = intval( substr( $a, 0, $split ) );
	$secret = substr( $a, $split +1 );
	if( $id == 0 ) return FALSE;
	return TRUE;
}

/** ---------------------------------------------------------------------------
 * Check if a user is logged in, and try to log them in if they aren't.
 *
 * @param string $ctoken CSRF token.
 * @return int|false Account ID or FALSE if they are not logged in 
 *                   and do not have a valid login token.
 */
public static function CheckLogin( $ctoken ) {
	if( self::$logged_in ) {
		return self::$account_id;
	}
	
	if( !isset( $_COOKIE['ctoken'] ) ) return FALSE;
	
	if( $ctoken !== FALSE ) {
		if( $_COOKIE['ctoken'] != $ctoken ) {
			// csrf attack :o
			return FALSE;
		}
	} else {
		// bypass check from non-request login
		
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
	$db = \SQLW::Get();
	$result = $db->RunQuery( 
		"SELECT account, secret, expires FROM LoginTokens
		WHERE id=$id AND $time < expires" );
	
	$row = $result->fetch_assoc();
	if( $row === NULL
		|| !password_verify( $secret, $row['secret'] ) ) {
		// TODO record login strike
		// and tempban ip if they accumulate.
		
		// clear saved login cookie
		setcookie( "login", 0, 0, GetDocumentRoot() );
		return FALSE;
	}
	 
	self::RefreshCToken(); // new session refresh
	self::SetLoggedIn( (int)$row['account'], null, null );
 
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
	$db = \SQLW::Get();
	$a = (int)$remember;

	$username = trim($username);
	if( $username == "" || strlen( $username ) > 255 ) return FALSE;
	if( $password == "" ) return FALSE;
	
	$user_hash = self::HashUsername( $username );
	$user_safe = $db->real_escape_string( $username );
	$result = $db->RunQuery( 
		"SELECT id, password, nickname FROM Accounts
		WHERE user_hash=x'$user_hash' AND username='$user_safe'" );
	
	$row = $result->fetch_assoc();
	if( $row === NULL ) return FALSE;
	
	if( !password_verify( $password, $row['password'] ) ) {
		// TODO record strike and tempban ip.
		return FALSE;
	}
	
	self::SetLoggedIn( (int)$row['id'], $username, $row['nickname'] );
	 
	if( $remember ) {
		self::CreateLoginToken();
	} 
	return TRUE;
}

/** ---------------------------------------------------------------------------
 * Create a "saved login" token for a user. ("remember me")
 *
 * @param bool $long Create a long lasting token.
 */
private static function CreateLoginToken() {
	
	$db = \SQLW::Get();
	$secret = Garbage::Produce( 32 );
	$id = self::$account_id;
	
	$secrethash = password_hash( $secret, PASSWORD_DEFAULT );
	if( $secrethash === FALSE ) return; // failure
	$expires = time() + Config::$AUTHTOKEN_DURATION;
	
	$db->RunQuery( 
		"INSERT INTO LoginTokens (account, secret, expires)
		VALUES ( $id, '$secrethash', $expires )" ); 
	
	$result = $db->RunQuery( "SELECT LAST_INSERT_ID()" );
	$row = $result->fetch_row();
	
	setcookie( "login", $row[0] . '/' . $secret, 
		$expires, GetDocumentRoot(), Config::SecureMode() );
	
}

/** ---------------------------------------------------------------------------
 * Remove the login token cookie. Doesn't delete the token in the database
 * but who cares.
 *
 * A scheduled task should clean up expired tokens.
 */
private static function DeleteLoginToken() {
	setcookie( "login", "", 0, GetDocumentRoot() );
}

/** ---------------------------------------------------------------------------
 * Tests if a given string is a valid "Normal" string.
 *
 * This is for testing for a valid username or nickname, basically doesn't
 * allow strange characters.
 *
 * @param  string $string Input to test.
 * @return bool           TRUE if valid.
 */
 /*
private static function IsNormalString( $string ) {
	return preg_match( '/^[a-zA-Z0-9 _+=~,.@#-]+$/', $string );
}*/

/** ---------------------------------------------------------------------------
 * Tests if a given string is valid for a password field.
 *
 * Allows any "real" ascii character, not control codes or characters values
 * past 126.
 *
 * @param  string $string Input to test.
 * @return bool           TRUE if valid.
 */
 /*
private static function IsValidPassword( $string ) {
	return preg_match( '/^[\\x20-\\x7E]+$/', $string );
}*/

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
	$db = \SQLW::Get();
	
	$username = trim($username);
	if( strlen( $username ) > 255 || $username == "" ) {// !self::IsNormalString( $username ) ) {
		return 'error';
	}
	
	if( $password == "" ) {// !self::IsValidPassword( $password ) ) {
		return 'error';
	}
	
	$nickname = trim($nickname);
	if( $nickname == "" || strlen($nickname) > 64 ) {
		return 'error';
	} 
	
	$user_hash = self::HashUsername( $username );
	
	$password = password_hash( $password, PASSWORD_DEFAULT );
	if( $password === FALSE ) return 'error';
	
	$username = $db->real_escape_string( $username );
	$password = $db->real_escape_string( $password );
	$nickname = $db->real_escape_string( $nickname );
	 
	$account_id = 0;
	try {
		$db->RunQuery( 'START TRANSACTION' );
		
		$result = $db->RunQuery( 
			"SELECT 1 FROM Accounts 
			WHERE user_hash=x'$user_hash' AND username='$username'" );
			
		if( $result->num_rows != 0 ) {
			$db->RunQuery( 'ROLLBACK' );
			return 'exists';
		}
		
		$db->RunQuery( 
			"INSERT INTO Accounts 
			(user_hash, username, password, nickname)
			VALUES (x'$user_hash','$username','$password','$nickname')" );
			
		$account_id = $db->insert_id;
		
		$result = $db->RunQuery( 
			"SELECT COUNT(*) FROM Accounts 
			WHERE user_hash=x'$user_hash' AND username='$username'" );
				
		if( $result->num_rows != 1 ) {
			// collision with another query or something...
			$db->RunQuery( 'ROLLBACK' );
			return 'error';
		}
		
		
		
	} catch ( \SQLException $e ) {
		$db->RunQuery( 'ROLLBACK' );
		throw $e;
	}
	
	$db->RunQuery( 'COMMIT' );
	
	self::SetLoggedIn( $account_id, $username, $nickname );
	
	// one captcha per account creation.
	Captcha::Reset();
	
	return 'okay';
}

/** ---------------------------------------------------------------------------
 * Edit the user's profile. The user must be logged in.
 *
 * @param string $nickname New nickname. Cannot be empty.
 * @param string $realname New real name.
 * @param string $website New website.
 * @param string $bio New bio.
 * @throws SQLException if a database error occurs.
 */
public static function EditProfile( $nickname, $realname, $website, $bio ) {
	if( !User::LoggedIn() ) throw new \Exception( "not logged in." );
	$db = \SQLW::Get();
	
	$nickname = trim($nickname);
	$realname = trim($realname);
	$website = trim($website);
	$bio = trim($bio);
	
	if( $nickname == "" ) throw new \Exception( "nickname cannot be empty." );
	$_SESSION['account_nickname'] = $nickname;
	$nickname = $db->real_escape_string( $nickname );
	$realname = $db->real_escape_string( $realname );
	$website = $db->real_escape_string( $website );
	$bio = $db->real_escape_string( $bio );
	
	self::WriteAccount( self::AccountID(), [
			'nickname' => $nickname, 
			'name' => $realname, 
			'website' => $website, 
			'bio' => $bio 
	]);
}

/** ---------------------------------------------------------------------------
 * Change the user's password. The user must be logged in.
 *
 * @param string $current The user's current password.
 * @param string $new     The desired password.
 * @return bool  TRUE if the password was changed, FALSE if the $current did
 *               not match the user's current password.
 */
public static function ChangePassword( $current, $new ) {
	if( !User::LoggedIn() ) throw new \Exception( "not logged in." );
	if( $new == "" ) throw new \Exception( "password cannot be empty" );
	
	$db = \SQLW::Get(); 
	
	$password = self::ReadAccount( self::AccountID(), 'password' )['password'];
	if( !password_verify( $current, $password ) ) {
		return FALSE;
	}
	
	$new = password_hash( $new, PASSWORD_DEFAULT );
	WriteAccount( self::AccountID(), [ 'password' => $new ] );
	
	return TRUE;
}
 
} // class User

User::init();

?>