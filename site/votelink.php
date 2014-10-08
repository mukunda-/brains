<?php

/*
  votelink - upvotes or downvotes a link
  POST (
     t1, t2: thoughts that form the link.
	 vote: 'good' for upvote or 'bad' for downvote
  )
*/

require_once 'core.php';

// response codes
define( 'R_ERROR', 'error.' ); // input or database error
define( 'R_NOTFOUND', 'notfound.' ); // link doesn't exist
define( 'R_LOGIN', 'login.' ); // user needs to log in
define( 'R_OKAY', 'okay.' ); // vote was added or updated.

try {
	if( !CheckArgsPOST( 't1', 't2', 'vote' ) ) exit( R_ERROR );
	
	if( $_POST['vote'] == 'good' ) {
		$votevalue = true;
	} else if( $_POST['vote'] == 'bad' ) {
		$votevalue = false;
	} else {
		Response::SendSimple( R_ERROR );
	}
	
	if( !User::CheckLogin() ) Response::SendSimple( R_LOGIN );
	
	// scrub and catch invalid input
	$thought1 = Thought::Scrub( $_POST['t1'] );
	if( $thought1 === FALSE ) Response::SendSimple( R_ERROR );
	$thought2 = Thought::Scrub( $_POST['t2'] );
	if( $thought2 === FALSE ) Response::SendSimple( R_ERROR );
	
	// get thoughts, or error if not found.
	$thought1 = Thought::Get( $thought1 );
	if( $thought1 === FALSE ) Response::SendSimple( R_NOTFOUND );
	$thought2 = Thought::Get( $thought2 );
	if( $thought2 === FALSE ) Response::SendSimple( R_NOTFOUND );
	
	if( !ThoughtLink::Vote( $thought1, $thought2, User::AccountID(), $votevalue ) ) {
		Response::SendSimple( R_ERROR );
	}
	
	Response::SendSimple( R_OKAY );
	
} catch( Exception $e ) {
	Logger::PrintException( $e );
}

exit( R_ERROR );

?>