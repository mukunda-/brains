<?php

/*
  mklink.php
  
  POST (
     a: first target string
     b: second target string
  )
*/

function Swap( &$a, &$b ) {
	$c = $a;
	$a = $b;
	$b = $c;
}

function ParseThought( $string ) {
	// thoughts are letters and spaces, dashes are also considered spaces.
	
	if( !preg_match( $string, '/$[a-z -]+$/' ) ) {
		return FALSE;
	}
	
	$string = str_replace( '-', ' ', $string );
	$string = trim(preg_replace( '/[ ]+/', ' ' ));
	
	if( strlen($string) == 0 ) return FALSE;
	return $string;
}

if( !LoggedIn() ) exit( 'login.' );


if( !isset( $_POST['a'] ) || !isset( $_POST['b'] ) {
	exit( 'error.' );
}

$thought1 = ParseThought( $_POST['a'] );
if( $thought1 === FALSE ) exit( 'error.' );
$thought2 = ParseThought( $_POST['b'] );
if( $thought2 === FALSE ) exit( 'error.' );

$sql = GetSQL();

$thought1 = GetThoughtID( $thought1 );
if( $thought1 === 0 ) {
	exit( 'error' );
}

$thought2 = GetThoughtID( $thought2, true );


?>