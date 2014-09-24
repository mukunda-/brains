<?php

/*
  mklink.php
  
  POST (
     a: first target string
     b: second target string
  )
*/ 

function CheckExists( $a, $b ) {
	$result = $sql->safequery( 
		"SELECT 1 FROM Links 
		WHERE thought1=$a->id AND thought2=$b->id" );
	
	if( $result->num_rows != 0 ) {
		exit( 'exists.' );
	}
}

require_once "userauth.php";

try {

	if( !UserAuth::LoggedIn() ) exit( 'login.' );

	if( !isset( $_POST['a'] ) || !isset( $_POST['b'] ) {
		exit( 'error.' );
	}
	
	$thought1 = Thought::Scrub( $_POST['a'] );
	if( $thought1 === FALSE ) exit( 'error.' );
	$thought2 = Thought::Scrub( $_POST['b'] );
	if( $thought2 === FALSE ) exit( 'error.' );
	
	
	$sql = GetSQL();
	
	$thought1 = Thoughts::Get( $thought1 );
	if( $thought1 === FALSE ) {
		exit( 'error.' );
	}
	
	$thought2 = Thoughts::Get( $thought2, true );
	
	if( $thought1->id == $thought2->id ) exit( 'error' );
	
	Thought::Order( $thought1, $thought2 );
	
	CheckExists( $thought1, $thought2 );
	
	$time = time();
	$creator = UserAuth::AccountID();
	
	$sql->safequery( 
		"INSERT IGNORE INTO Links (thought1, thought2, time, creator )
		VALUES ( $thought1->id, $thought2->id, $time, $creator )" );
	
	if( $sql->affected_rows == 0 ) {
		CheckExists( $thought1, $thought2 );
	}
	
	exit( 'okay.' ); 
	
} catch( Exception $e ) {
	Logger::PrintException( $e );
}

exit( 'error.' );

?>