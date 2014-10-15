<?php

namespace Brains;

/* 
  query.php
  
  ORGANIC QUERY
  
  GET {
    input: thought_string
	
  }
  
  searches for a thought.
  
  if it isn't found, a page is still returned as if it exists.
  
  query doesn't create links or thoughts. newlink does.
  
  RESPONSE "okay." { // normal response
    data {
	  query: <input string>
	  links[
	    { dest: <destination thought/string>
		  score: <score of link>
		  vote: <user's vote> (if logged in)
		}
	  ]
	}
  }
*/

require_once 'core.php'; 
  
define( 'R_ERROR', 'error.' ); // an error occurred.
define( 'R_OKAY', 'okay.' ); // a thought was returned

try {

	if( !CheckArgsGET( 'input' ) ) exit();

	$thought_string = Thought::Scrub( $_GET['input'] );
	if( $thought_string === FALSE ) exit();

	$thought = Thought::Get( $thought_string );

	$response = new Response;
	$response->data['query'] = $thought_string;

	if( $thought === FALSE ) {
		$response->CopyLinks( [] );
		$response->Send( R_OKAY );
	}
	
	User::CheckLogin( FALSE );
	
	$response->CopyLinks(
		ThoughtLink::FindLinks( $thought, User::AccountID() ) );
	
	$response->Send( R_OKAY );
} catch( \Exception $e ) {
	Logger::LogException( $e );
}

Response::SendSimple( R_ERROR );

?>