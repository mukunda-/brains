<?php

namespace Brains;

/* 
  query.php
  
  ORGANIC QUERY
  
  GET {
    input: thought_string
	[from]: thought_string 
  }
  
  searches for a thought.
  
  if it isn't found, a page is still returned as if it exists.
  
  query doesn't create links or thoughts. newlink does.
  
  RESPONSE "okay." { // normal response
    data {
	  query: <input string>
	  discovery {
	    from:
		to:
		creator:
		creator_nick:
		score:
		vote:
	  }
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

	// required input
	if( !CheckArgsGET( 'input' ) ) exit();
	$from = isset($_GET['from']) ? $_GET['from'] : FALSE;
	
	$thought_string = Thought::Scrub( $_GET['input'] );
	if( $thought_string === FALSE ) exit();
	
	if( $from ) {
		$from = Thought::Scrub( $from );
		if( $from === FALSE ) exit();
		if( $from == $thought_string ) exit();
	}

	$thought = Thought::Get( $thought_string );

	$response = new Response;
	$response->data['query'] = $thought_string;
	if( $from && $thought ) {
		$from = Thought::Get( $from );
		if( $from !== FALSE ) {
			$link = ThoughtLink::Get( $from, $thought, User::AccountID(), 
								      false );
			if( $link !== FALSE ) {
				$response->data['from'] = $from->phrase;
				$response->SetDiscovery( $link );
			}
		}
	}

	if( $thought === FALSE ) {
		$response->CopyLinks( [] );
		$response->Send( R_OKAY );
	}
	
	User::CheckLogin( FALSE );
	
	$response->CopyLinks(
		ThoughtLink::FindLinks( $thought, User::AccountID() ) );
	
	$response->Send( R_OKAY );
} catch( \Exception $e ) {
	Logger::PrintException( $e );
}

Response::SendSimple( R_ERROR );

?>