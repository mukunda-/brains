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
require_once 'content.php';
require_once 'thought.php';
  
if( !CheckArgsGET( 'thought' ) ) exit();

$thought_string = Thought::Scrub( $_GET['thought'] );
if( $thought_string === FALSE ) {
	exit();
}

$thought = Thought::Get( $thought_string );

if( $thought === FALSE ) {
	// show an empty thought
	Content::PrintNewLinkInput( $thought_string );
	exit();
}



?>