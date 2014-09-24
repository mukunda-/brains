<?php
 
require_once 'lib/password.php';

//-----------------------------------------------------------------------------
final class UserAuth {

public class InvalidAccountException extends Exception { }

private static $logged_in = FALSE;
private static $account_id = 0;
private static $secret_charset = 
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

public static function LoggedIn() {
	return $logged_in;
}

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
 * Hash an email address and return a 32-bit/8-digit hex code
 *
 * @return string 8-digit hex code
 */
public static function HashEmail( $email ) {
	return hash( "crc32b", $email );
}

/** ---------------------------------------------------------------------------
 * Get account ID from an email address.
 *
 * @param  string $email Email address to query.
 * @return int           Account ID matching the email, or 0 if no match.
 */
public static function GetAccountIDFromEmail( $email ) {
	$hash = HashEmail( $email );
	$sql = GetSQL();
	$result = $sql->safequery( 
		"SELECT email, account
		FROM Accounts WHERE email_hash=0x$hash" );
	
	if( $result->num_rows == 0 ) return 0; // unrecognized email.
	
	while( $row = $result->fetch_row( $result ) ) {
		if( $row[0] === $email ) {
			return (int)$row[1];
		}
	}
	return 0; // unrecognized email.
}

/** ---------------------------------------------------------------------------
 * Do an account database query.
 *
 * @param int    $id     ID of account to read
 * @param string $fields Fields of the account to read, separated by commas.
 * @return array         Assoc array containing the account field values.
 * @throws InvalidAccountException If the account doesn't exist.
 * @throws SQL exception on database failure
 */
public static function ReadAccount( $id, $fields ) {
	$id = (int)$id; // safety
	
	$sql = GetSQL();
	$result = $sql->safequery( 	
		"SELECT $fields
		FROM Accounts  
		WHERE id = $id" );
	
	$row = $result->fetch_assoc();
	if( $row === FALSE ) {
		throw new InvalidAccountException( 
			"Invalid account ID: $id" );
	}
	$row['id'] = $id;
	return $row;
}

/** ---------------------------------------------------------------------------
 * Read the login cookie and parse it.
 *
 * @param int &$id     (Out) ID of login cookie
 * @param int &$secret (Out) MD5 hex of secret of login cookie
 * @return bool        FALSE if cookie missing or invalid
 */
public static function ParseLoginToken( &$id, &$secret ) {
	if( !isset( $_COOKIE['login'] ) ) return FALSE;
	$a = $_COOKIE['login'];
	$split = strpos($a,'/');
	if( $split === FALSE ) return FALSE;
	$id = intval( substring( $a, 0, $split ) );
	$secret = md5( substring( $a, $split +1 ) );
	if( $id == 0 ) return FALSE;
	return TRUE;
}

/** ---------------------------------------------------------------------------
 * Check if a user is logged in, and try to log them in if they aren't.
 *
 * @return int|false Account ID or FALSE if they are not logged in 
 *                   and do not have a valid login token.
 */
public static function LoggedIn() {
	if( self::$logged_in ) {
		return sefl::$account_id;
	}
	
	$id     = 0;
	$secret = 0;
	
	if( !ParseLoginToken( $id, $secret ) ) return FALSE;
	
	$time = time();
	$sql = GetSQL();
	$result = $sql->safequery( 
		"SELECT account, expires FROM LoginTokens
		WHERE id=$id AND secret=x'$secret' AND $time < expires" );
	
	$row = $result->fetch_assoc();
	if( $row === FALSE ) {
		// TODO record login strike
		// and tempban ip if they accumulate.
		return FALSE;
	}
	
	// extend remaining time if it's low.
	$remaining = $row['expires'] - $time;
	if( $remaining < \Config::$AUTHTOKEN_EXTEND_MIN ) {
		$expires = $time + \Config::$AUTHTOKEN_EXTEND_DURATION;
		$sql->safequery( 
			"UPDATE ACCOUNT SET expires = $expires
			WHERE id=$token" );
		
		setcookie( "login", $_COOKIE['login'], 
			$expires, $config->AbsPath() );
	}
	
	self::$logged_in = true;
	self::$account_id = $row['account'];
	
	return self::$account_id;
}

/** ---------------------------------------------------------------------------
 * Log in a user using their email and password
 *
 * @param string $email Email address.
 * @param string $password Password.
 * @param string $remember TRUE to create a long lasting login token. FALSE
 *                         to expire after a short while.
 * @return int|false Account ID or FALSE if the authentication is invalid.
 */
public static function LogIn( $email, $password, $remember ) {
	$sql = GetSQL();
	
	$email_hash = HashEmail( $email );
	$email_safe = $sql->real_escape_string($email);
	$result = $sql->safequery( 
		"SELECT id, password FROM Accounts
		WHERE email_hash=x'$email_hash' AND email='$email_safe'" );
	
	$row = $result->fetch_assoc();
	if( $row === FALSE ) return FALSE;
	
	if( !password_verify( $password, $row['password'] ) ) {
		// TODO record strike and tempban ip.
		return FALSE;
	}
	
	self::$logged_in = true;
	self::$account_id = $row['account']; 
	CreateLoginToken( $remember );
	
}

/** ---------------------------------------------------------------------------
 * Create a login token for a user to login easily for their next request.
 *
 * @param bool $long Create a long lasting token.
 */
private static function CreateLoginToken( $long ) {
	
	$secret = GenerateSecret();
	$id = self::$account_id;
	
	$secrethash = md5($secret);
	$expires = time() + ($long ? \Config::$AUTHTOKEN_LONG_DURATION : \Config::$AUTHTOKEN_EXTEND_DURATION );
	$sql->safequery( 
		"INSERT INTO LoginTokens (account, secret, expires)
		VALUES ( $id, '$secrethash', $expires )" ); 
	
	$result = $sql->safequery( "SELECT LAST_INSERT_ID()" );
	$row = $result->fetch_row();
	
	setcookie( "login", $row[0] . '/' . $secret, 
		$expires, $config->AbsPath(), $config->SecureMode() );
	
}
	
} // class UserAuth

?>