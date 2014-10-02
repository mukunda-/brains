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

/*
class ContentPage {
	public $
}*/

final class Content {

	public static function PrintNewLinkInput( $thought ) {
		echo "<h2>What does \"$thought\" make you think of?</h2>";
		echo '<div class="newlink">';
			echo '<form id="newlinkform">';
			echo '<input type="text" id="newlink" maxlength="20">';
			echo '</form>';
		echo '</div>';
		
	}
}
/*

if( !CheckArgsGET( 'thought' ) ) exit( 'todo: error' ); // TODO error message

$thought_string = Thought::Scrub( $_GET['thought'] );
if( $thought_string === FALSE ) {
	exit( 'todo: invalid input' );
}

$thought = Thought::Get( $thought_string );

if( $thought === FALSE ) {
	// show an empty thought
	
	PrintNewLinkInput( $thought_string );
	exit();
}

$prev = FALSE;
if( isset( $_GET['prev'] ) ) {
	$prev = Thought::ScrubGet( $_GET['prev'] );
}

if( $prev !== FALSE ) {
	
}
*/




?>