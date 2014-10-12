<?php

namespace Brains;

/*
  link.php
  
  POST (
     a: first target string
     b: second target string
	 [vote]: when visiting an existing link:
	       "no": dont give upvote to link. 
	       "yes": give upvote to link.
	       "maybe": give upvote only if the vote is not currently set.
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
define( 'R_LOGIN' , 'login.'  ); // (error) user is not logged in.
define( 'R_SAME'  , 'same.'   ); // (error) the inputs entered were identical.
//define( 'R_EXISTS', 'exists.' ); // the link already exists.
define( 'R_OKAY'  , 'okay.'   ); // the link was returned
 
try {
	if( !CheckArgsPOST( 'a', 'b' ) ) exit();
	
	$votemode = isset( $_POST['vote'] ) ? $_POST['vote'] : "no";
	
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
	$response->data['creator'] = $link->creator;
	$response->data['creator_nick'] = User::ReadAccount( 
										$link->creator, 
										'nickname'
									  )['nickname'];
			
	
	if( $thought2->created ) {
		$response->CopyLinks( [] );
	} else {
		if( ($votemode == "yes" && $link->vote !== TRUE)
			|| ($votemode == "maybe" && $link->vote === null) ) {
			
			$link->Upvote();
		}
		
		// add links.
		$response->CopyLinks(
			ThoughtLink::FindLinks( $thought2, User::AccountID() ) );
		
	}
	
	$response->data['score'] = $link->score;
	$response->data['vote'] = $link->vote;

	$response->Send( R_OKAY );
	     
} catch( Exception $e ) {
	Logger::PrintException( $e );
}

Response::SendSimple( R_ERROR );

?>