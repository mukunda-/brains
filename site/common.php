<?php

require_once 'config.php';
require_once 'logging.php';

$g_session_open = false;

/** ---------------------------------------------------------------------------
 * Swap two references.
 */
function Swap( &$a, &$b ) {
	$c = $a;
	$a = $b;
	$b = $c;
}

/** ---------------------------------------------------------------------------
 * Check if a list of args are present in a POST request.
 *
 * e.g. CheckArgsPOST( 'param1', 'param2' )
 * 
 * @return TRUE if all of the arguments passed exist in the $_POST array.
 */
function CheckArgsPOST() {
	$args = func_get_args();
	foreach( $args as $arg ) {
		if( !isset( $_POST[$arg] ) ) return FALSE;
	}
	return TRUE;
}

/** ---------------------------------------------------------------------------
 * Check if a list of args are present in a GET request.
 *
 * e.g. CheckArgsGET( 'param1', 'param2' )
 * 
 * @return TRUE if all of the arguments passed exist in the $_GET array.
 */
function CheckArgsGET() {
	$args = func_get_args();
	foreach( $args as $arg ) {
		if( !isset( $_GET[$arg] ) ) return FALSE;
	}
	return TRUE;
}

/** ---------------------------------------------------------------------------
 * Open a session for the user. Does nothing if the session is already open.
 *
 * This also handles an extra verification step.
 */
function OpenSession() {
	global $g_session_open;
	if( $g_session_open ) return;
	
	session_set_cookie_params( Config::$SESSIONTIME, Config::$ABSPATH );
	session_start();
	$g_session_open = true;
	
	// extra verification: match key cookie with session variable.
	if( !isset( $_SESSION['sessionkey'] ) || 
		!isset( $_COOKIE['sessionkey'] ) || 
		$_SESSION['sessionkey'] != $_COOKIE['sessionkey'] ) {
		
		// reset session.
		$_SESSION = array();
		$key = mt_rand() & 0xFFFFFFF;
		$_SESSION['sessionkey'] = $key;
		setcookie( "sessionkey", $key, 
			time() + Config::$SESSIONTIME, Config::$ABSPATH );
	} else {
		
		// extend time.
		setcookie( "sessionkey", $_COOKIE['sessionkey'], 
			time() + Config::$SESSIONTIME, Config::$ABSPATH );
	}
	
}


?>