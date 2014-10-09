<?php

namespace Brains;

/*
  newlink.php
  
  POST (
     a: first target string
     b: second target string
  )
*/ 

require_once 'core.php';

// response status codes
define( 'R_ERROR' , 'error.'  ); // an error occurred.
define( 'R_LOGIN' , 'login.'  ); // user is not logged in.
define( 'R_SAME', 'same.' ); // the inputs entered were identical.
define( 'R_EXISTS', 'exists.' ); // the link already exists.
define( 'R_OKAY'  , 'okay.'   ); // the link was created.
 
try {
	if( !CheckArgsPOST( 'a', 'b' ) ) exit();
	
	$thought1 = Thought::Scrub( $_POST['a'] );
	if( $thought1 === FALSE ) exit();
	$thought2 = Thought::Scrub( $_POST['b'] );
	if( $thought2 === FALSE ) exit();
	
	if( !User::CheckLogin() ) Response::SendSimple( R_LOGIN );
	
	$thought1 = Thought::Get( $thought1, true );
	$thought2 = Thought::Get( $thought2, true );
	
	if( $thought1->id == $thought2->id ) Response::SendSimple( R_SAME );
	
	$response = new Response;
	$response->data['from'] = $thought1->phrase;
	$response->data['to'] = $thought2->phrase;
	
	$link = ThoughtLink::Get( $thought1, $thought2, User::AccountID(), true );
	$response->data['score'] = $link->score;
	$response->data['creator'] = $link->creator;
	$response->data['creator_nick'] = User::ReadAccount( $link->creator, ['nickname'] )['nickname'];
	$response->data['vote'] = $link->vote;
	
	if( $link->created ) {
		$response->Send( R_OKAY );
	} else {
		// add links.
		$response->CopyLinks(
			ThoughtLink::FindLinks( $thought2, User::AccountID() ) );
		
		$response->Send( R_EXISTS );
	}
	     
} catch( Exception $e ) {
	Logger::PrintException( $e );
}

Response::SendSimple( R_ERROR );

?>