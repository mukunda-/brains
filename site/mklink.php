<?php

/*
  mklink.php
  
  POST (
     a: first target string
     b: second target string
  )
*/ 

require_once 'config.php';
require_once 'sql.php';
require_once 'common.php'
require_once 'userauth.php';

$r_error  = 'error.';  // an error occurred.
$r_login  = 'login.';  // user is not logged in.
$r_exists = 'exists.'; // the link already exists.
$r_okay   = 'okay.';   // the link was created.

try {
	if( !CheckArgs( 'a', 'b' ) ) exit( $r_error );
	
	if( !UserAuth::LoggedIn() ) exit( $r_login );
	
	$thought1 = Thought::Scrub( $_POST['a'] );
	if( $thought1 === FALSE ) exit( $r_error );
	$thought2 = Thought::Scrub( $_POST['b'] );
	if( $thought2 === FALSE ) exit( $r_error );
	
	$sql = GetSQL();
	
	$thought1 = Thoughts::Get( $thought1 );
	if( $thought1 === FALSE ) {
		exit( $r_error );
	}
	
	$thought2 = Thoughts::Get( $thought2, true );
	
	if( $thought1->id == $thought2->id ) exit( $r_error );
	
	Thought::Order( $thought1, $thought2 );
	
	if( Thought::LinkExists( $thought1, thought2 ) ) exit( $r_exists );
	
	$time = time();
	$creator = UserAuth::AccountID();
	
	$sql->safequery( 
		"INSERT IGNORE INTO Links (thought1, thought2, time, creator )
		VALUES ( $thought1->id, $thought2->id, $time, $creator )" );
	
	if( $sql->affected_rows == 0 ) {
		// error, the link may have been created by another thread.
		if( Thought::LinkExists( $thought1, $thought2 ) ) Quit( 'exists.' );
		
		// otherwise something went wrong.
		exit( $r_error );
	}
	
	exit( $r_okay );
	
} catch( Exception $e ) {
	Logger::PrintException( $e );
}

exit( $r_error );

?>