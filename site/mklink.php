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

define( 'R_ERROR' ,'error.'   ); // an error occurred.
define( 'R_LOGIN' , 'login.'  ); // user is not logged in.
define( 'R_EXISTS', 'exists.' ); // the link already exists.
define( 'R_OKAY'  , 'okay.'   ); // the link was created.


try {
	if( !CheckArgs( 'a', 'b' ) ) exit( R_ERROR );
	
	if( !UserAuth::LoggedIn() ) exit( R_LOGIN );
	
	$thought1 = Thought::Scrub( $_POST['a'] );
	if( $thought1 === FALSE ) exit( R_ERROR );
	$thought2 = Thought::Scrub( $_POST['b'] );
	if( $thought2 === FALSE ) exit( R_ERROR );
	
	$sql = GetSQL();
	
	$thought1 = Thoughts::Get( $thought1 );
	if( $thought1 === FALSE ) {
		exit( R_ERROR );
	}
	
	$thought2 = Thoughts::Get( $thought2, true );
	
	if( $thought1->id == $thought2->id ) exit( R_ERROR );
	
	Thought::Order( $thought1, $thought2 );
	
	if( Thought::LinkExists( $thought1, thought2 ) ) exit( R_EXISTS );
	
	$time = time();
	$creator = UserAuth::AccountID();
	
	$sql->safequery( 
		"INSERT IGNORE INTO Links (thought1, thought2, time, creator )
		VALUES ( $thought1->id, $thought2->id, $time, $creator )" );
	
	if( $sql->affected_rows == 0 ) {
		// error, the link may have been created by another thread.
		if( Thought::LinkExists( $thought1, $thought2 ) ) Quit( 'exists.' );
		
		// otherwise something went wrong.
		exit( R_ERROR );
	}
	
	exit( R_OKAY );
	
} catch( Exception $e ) {
	Logger::PrintException( $e );
}

exit( R_ERROR );

?>