<?php

/*
  newlink.php
  
  POST (
     a: first target string
     b: second target string
  )
*/ 

require_once 'config.php';
require_once 'sql.php';
require_once 'common.php'
require_once 'userauth.php';

// response status codes
define( 'R_ERROR' , 'error.'  ); // an error occurred.
define( 'R_LOGIN' , 'login.'  ); // user is not logged in.
define( 'R_EXISTS', 'exists.' ); // the link already exists.
define( 'R_OKAY'  , 'okay.'   ); // the link was created.
 
try {
	if( !CheckArgs( 'a', 'b' ) ) Response::SendSimple( R_ERROR );
	
	if( !UserAuth::LoggedIn() ) Response::SendSimple( R_LOGIN );
	
	$thought1 = Thought::Scrub( $_POST['a'] );
	if( $thought1 === FALSE ) Response::SendSimple( R_ERROR );
	$thought2 = Thought::Scrub( $_POST['b'] );
	if( $thought2 === FALSE ) Response::SendSimple( R_ERROR );
	
	$db = GetSQL();
	
	$thought1 = Thoughts::Get( $thought1, true );
	$thought2 = Thoughts::Get( $thought2, true );
	
	if( $thought1->id == $thought2->id ) Response::SendSimple( R_ERROR );
	
	$response = new Response;
	$response->data['from'] = $thought1->phrase;
	$response->data['to'] = $thought2->phrase;
	
	//Thought::Order( $thought1, $thought2 );
	
	$link = ThoughtLink::Get( $thought1, $thought2, UserAuth::AccountID() );
	if( $link !== FALSE ) {
		$response->data['link']['creator_id'] = $link->creator;
		$response->data['link']['creator_nick'] = UserAuth::GetNick( $link->creator );
		$response->data['link']['score'] = $link->score;
		
	}
	if( Thought::LinkExists( $thought1, thought2 ) ) {
		
		$response->Send( R_EXISTS );
	}
	
	$time = time();
	$creator = UserAuth::AccountID(); 
	
	try {
		$db->RunQuery(
			"INSERT INTO Links (thought1, thought2, time, creator )
			VALUES ( $thought1->id, $thought2->id, $time, $creator )" );
	} catch( SQLException $e ) {
		if( $e->code == 2601 ) { // 2601: duplicate key.
			// we collided with another user making the same link
			// pretty lucky eh?
			exit( R_EXISTS );
		}
		throw $e;
	}
	 
	exit( R_OKAY );
	
} catch( Exception $e ) {
	Logger::PrintException( $e );
}

Response::SendSimple( R_ERROR );

?>