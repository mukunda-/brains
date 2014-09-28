<?php

/*
    content.php
	
	GET {
		thought: thought-string		thought to query.
		[prev]: thought-string		previous thought; to show link.
		
	}
	
	returns main content page

 */
 
require_once 'config.php';
require_once 'sql.php';
require_once 'common.php';
require_once 'userauth.php';

if( !CheckArgsGET( 'thought' ) ) exit( 'error' ); // TODO error message

$thought =  Thought::Scrub( $_GET['thought'] );
if( $thought=== FALSE ) {
	// thought notfound.
}



?>