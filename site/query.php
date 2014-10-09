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
  
  RESPONSE "new." { // The thought doesn't exist yet
    data {
      query: <input string>
    }
  } 
  
  RESPONSE "exists." { // The thought exists
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
define( 'R_NEW', 'new.' ); // the thought is new and no links exist yet.
define( 'R_EXISTS', 'exists.' ); // the thought exists and may have links.

try {

	if( !CheckArgsGET( 'input' ) ) exit();

	$thought_string = Thought::Scrub( $_GET['input'] );
	if( $thought_string === FALSE ) exit();

	$thought = Thought::Get( $thought_string );

	$response = new Response;
	$response->data['query'] = $thought_string;

	if( $thought === FALSE ) {
		$response->Send( R_NEW );
	}

	$links = ThoughtLink::FindLinks( $thought, User::AccountID() );

	$response->data['links'] = [];

	foreach( $links as $link ) {
		$a = [ 
			'dest' => $link->dest,
			'score' => $link->score,
			'vote' => $link->vote
		];
		$response->data['links'] = $a;
	}

	Response::SendSimple( R_EXISTS );
} catch( Exception $e ) {
	Logger::LogException( $e );
}

Response::SendSimple( R_ERROR );

?>