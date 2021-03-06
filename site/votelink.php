<?php

namespace Brains;

/*
  votelink - upvotes or downvotes a link
  POST (
     ctoken: login token
     t1, t2: thoughts that form the link.
	 vote: "good" for upvote or "bad" for downvote
  )
*/

require_once 'core.php';

// response codes
define( 'R_ERROR', 'error.' ); // input or database error
define( 'R_NOTFOUND', 'notfound.' ); // link doesn't exist
//define( 'R_LOGIN', 'login.' ); // user needs to log in
define( 'R_OKAY', 'okay.' ); // vote was added or updated.

try {

	// validate input
	if( !CheckArgsPOST( 'ctoken', 't1', 't2', 'vote' ) ) exit( R_ERROR );
	
	if( $_POST['vote'] == 'good' ) {
		$votevalue = true;
	} else if( $_POST['vote'] == 'bad' ) {
		$votevalue = false;
	} else {
		exit( R_ERROR );
	}
	
	if( !User::VerifyCToken() ) exit( R_ERROR );
	User::CheckLogin();
	//if( !User::CheckLogin() ) exit(R_LOGIN );
	
	// scrub and catch invalid input
	$thought1 = Thought::Scrub( $_POST['t1'] );
	if( $thought1 === FALSE ) exit( R_ERROR );
	$thought2 = Thought::Scrub( $_POST['t2'] );
	if( $thought2 === FALSE ) exit( R_ERROR );
	
	// get thoughts, or error if not found.
	$thought1 = Thought::Get( $thought1 );
	if( $thought1 === FALSE ) exit( R_NOTFOUND );
	$thought2 = Thought::Get( $thought2 );
	if( $thought2 === FALSE ) exit( R_NOTFOUND );
	
	if( !ThoughtLink::Vote( $thought1, $thought2, User::AccountID(), $votevalue ) ) {
		exit( R_ERROR );
	}
	
	exit( R_OKAY );
	
} catch( \Exception $e ) {
	Logger::PrintException( $e );
}

exit( R_ERROR );

?>