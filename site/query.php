<?php

/* 
  query.php
  
  ORGANIC QUERY
  
  GET {
    thought: thought_string
	
  }
  
  searches for a thought.
  
  if it isn't found, a page is still returned as if it exists.
  
  query doesn't create links or thoughts. newlink does.
  
  RESPONSE "new" {} // The thoguht doesn't exist yet
  
  RESPONSE "exists" { // The thought exists
    data {
	  links[
	    { dest: destination thought
		  score: score of link
		  vote: user's vote (if logged in)
		}
	  ]
	}
  }
*/

require_once 'core.php'; 
  
if( !CheckArgsGET( 'thought' ) ) exit();

$thought_string = Thought::Scrub( $_GET['thought'] );
if( $thought_string === FALSE ) {
	exit();
}

$thought = Thought::Get( $thought_string );

$response = new Response;
$response->data['source'] = $thought_string;

if( $thought === FALSE ) {
	$response->Send( 'new' ); 
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

$response->Send( 'exists' );

?>