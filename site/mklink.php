<?php

require_once "userauth.php";

/*
  mklink.php
  
  POST (
     a: first target string
     b: second target string
  )
*/

try {
	if( !UserAuth::LoggedIn() ) exit( 'login.' );

	if( !isset( $_POST['a'] ) || !isset( $_POST['b'] ) {
		exit( 'error.' );
	}

	$thought1 = Thoughts::Parse( $_POST['a'] );
	if( $thought1 === FALSE ) exit( 'error.' );
	$thought2 = Thoughts::Parse( $_POST['b'] );
	if( $thought2 === FALSE ) exit( 'error.' );

	$sql = GetSQL();

	$thought1 = GetThoughtID( $thought1 );
	if( $thought1 === 0 ) {
		exit( 'error.' );
	}

	$thought2 = GetThoughtID( $thought2, true );
	
	
} catch( Exception $e ) {
	Logger::PrintException( $e );
}

exit( 'error.' );

?>