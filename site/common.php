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


?>