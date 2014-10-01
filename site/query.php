<?php

/* 
  query.php
  
  ORGANIC QUERY
  
  GET {
    thought: thought_string
	
  }
  
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