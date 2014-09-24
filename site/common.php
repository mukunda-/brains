<?php

$quit_responses = array();

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
 * Set the possible response strings when a script Quits.
 *
 * @param ... vararg array of responses.
 */
function DefineResponses() {
	$GLOBALS[ 'r_' + ] = func_get_args();
}

/** ---------------------------------------------------------------------------
 * Exit the script, $response must match something set by SetQuitResponses.
 *
 */
function Quit( $response ) {
	if( !in_array( $GLOBALS['quit_responses'] ) ) {
		throw new Exception( "Undefined quit response: $response" );
	}
	exit( $response );
}

?>