<?php

/* 
  query.php
  
  ORGANIC QUERY
  
  GET {
    thought: thought_string
	
  }
  
  searches for a thought
  
  if it isn't found, a page is still returned as if it exists
  query doesn't create links or thoughts. newlink does.
  
  RETURN page contents
  
*/

require_once 'config.php';
require_once 'common.php';
//require_once 'content.php';
require_once 'thought.php';
require_once 'thoughtlink.php';
  
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
	// show an empty thought
	//Content::PrintNewLinkInput( $thought_string );
	//exit();
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




?>