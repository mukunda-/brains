<?php

namespace Brains;

/*
  link.php
  
  POST (
     a: first target string
     b: second target string
	 method: Method to use
	       "query": dont create links, query only. doesnt require login.
	       "new": create missing links and give an upvote. requires login.
	       "soft": dont create, and only give upvote only if the user is logged in
		           and hasnt voted yet. doesnt require login.
  )
  
  Creates thoughts if they don't exist, and then creates a link between them if
  it doesn't exist. The link will come with an upvote from the creator.
  
  RESPONSE "okay." { // A new link was created or an existing link was returned.
    data: {
      from: <a> (scrubbed)
      to: <b> (scrubbed)
	  score: score of link
	  creator: account id of creator
	  creator_nick: nickname of creator
	  vote: the user's vote, true=up, false=down, null=neither
    }
  } 
  
*/ 

require_once 'core.php';

// response status codes
define( 'R_ERROR' , 'error.'  ); // (error) an error occurred.
define( 'R_MISSING' , 'missing.'  ); // (error) link doesn't exist.
define( 'R_LOGIN' , 'login.'  ); // (error) user is not logged in.
define( 'R_SAME'  , 'same.'   ); // (error) the inputs entered were identical.
//define( 'R_EXISTS', 'exists.' ); // the link already exists.
define( 'R_OKAY'  , 'okay.'   ); // the link was returned

define( 'METHOD_QUERY', '0' );
define( 'METHOD_NEW', '1' );
define( 'METHOD_SOFT', '2' );

$methods = [ 'query' => METHOD_QUERY, 
			 'new' => METHOD_NEW, 
			 'soft' => METHOD_SOFT ];
 
try {
	// validate input
	if( !CheckArgsPOST( 'a', 'b', 'method' ) ) exit();
	if( !isset( $methods[ $_POST['method'] ] ) ) exit();
	$method = $methods[ $_POST['method'] ];
	
	$thought1 = Thought::Scrub( $_POST['a'] );
	if( $thought1 === FALSE ) exit();
	$thought2 = Thought::Scrub( $_POST['b'] );
	if( $thought2 === FALSE ) exit();
	
	User::CheckLogin();
	if( !User::LoggedIn() ) {
		if( $method == METHOD_NEW ) {
			
			// new requires a session.
			Response::SendSimple( R_LOGIN );
		}
	}
	
	// get thoughts, exit if missing
	$thought1 = Thought::Get( $thought1, $method == METHOD_NEW );
	$thought2 = Thought::Get( $thought2, $method == METHOD_NEW );
	if( $thought1 === FALSE || $thought2 === FALSE ) {
		Response::SendSimple( R_MISSING );
	}
	
	// catch "same" error
	if( $thought1->id == $thought2->id ) Response::SendSimple( R_SAME );
	
	// query link
	$link = ThoughtLink::Get( $thought1, $thought2, User::AccountID(), 
							  $method == METHOD_NEW );
	if( $link === FALSE ) {
		Response::SendSimple( R_MISSING );
	}
	
	// start building response
	$response = new Response;
	$response->data['from'] = $thought1->phrase;
	$response->data['to'] = $thought2->phrase;
	$response->data['creator'] = $link->creator;
	$response->data['creator_nick'] = 
			User::ReadAccount( $link->creator, 'nickname' )['nickname'];
	
	if( $thought2->created ) {
		// the thought was just created, so there are no links yet
		$response->CopyLinks( [] );
	} else {
	
		// give an upvote depending on the method used.
		if( ($method == METHOD_NEW && $link->vote !== TRUE)
			|| ($method == METHOD_SOFT && $link->vote === null && User::LoggedIn() ) ) {
			
			$link->Upvote();
		}
		
		// query and add links
		$response->CopyLinks(
			ThoughtLink::FindLinks( $thought2, User::AccountID() ) );
	}
	
	// finish response and send.
	$response->data['score'] = $link->score;
	$response->data['vote'] = $link->vote;
	$response->data['logged_in'] = User::LoggedIn();
	$response->Send( R_OKAY );
	 
} catch( Exception $e ) {
	Logger::PrintException( $e );
}

Response::SendSimple( R_ERROR );

?>