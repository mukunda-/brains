<?php

/*
  votelink
  POST (
     a: thought phrase
	 b: thought phrase
	 vote: 'good' or 'bad'
  )
*/

require_once 'config.php';
require_once 'sql.php';
require_once 'common.php';
require_once 'userauth.php';

$r_error = 'error.';
$r_login = 'login.';
$r_okay = 'okay.';

try {
	if( !CheckArgs( 'a', 'b', 'vote' ) ) exit( $r_error );
	
	$votevalue = '';
	if( $_POST['vote'] == 'good' ) {
		$votevalue = 1;
	} else if( $_POST['vote'] == 'bad' ) {
		$votevalue = 0;
	} else {
		exit( $r_error );
	}
	
	if( !UserAuth::LoggedIn() ) exit( $r_login );
	
	$thought1 = Thought::ScrubGet( $_POST['a'] );
	if( $thought1 === FALSE ) exit( $r_error );
	$thought2 = Thought::ScrubGet( $_POST['b'] );
	if( $thought2 === FALSE ) exit( $r_error );
	
	$sql = GetSQL();
	
	$time = time();
	$sql->safequery( 
		"INSERT INTO Votes 
		(thought1, thought2, account, time, vote)
		VALUES ($thought1->id, $thought2->id, 
		".UserAuth::AccountID().", $time, $votevalue )
		ON DUPLICATE KEY UPDATE vote = $votevalue" );
		
	exit( $r_okay );
	
} catch( Exception $e ) {
	Logger::PrintException( $e );
}

exit( $r_error );

?>