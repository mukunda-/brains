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

define( 'R_ERROR', 'error.' );
define( 'R_NOTFOUND', 'notfound.' );
define( 'R_LOGIN', 'login.' );
define( 'R_OKAY', 'okay.' );

define( 'ERR_DEADLOCK', 1205 );

try {
	if( !CheckArgs( 'a', 'b', 'vote' ) ) exit( R_ERROR );
	
	$votevalue = 0;
	if( $_POST['vote'] == 'good' ) {
		$votevalue = 1;
	} else if( $_POST['vote'] == 'bad' ) {
		$votevalue = 0;
	} else {
		exit( R_ERROR );
	}
	
	if( !UserAuth::LoggedIn() ) exit( R_LOGIN );
	
	$thought1 = Thought::ScrubGet( $_POST['a'] );
	if( $thought1 === FALSE ) exit( R_ERROR );
	$thought2 = Thought::ScrubGet( $_POST['b'] );
	if( $thought2 === FALSE ) exit( R_ERROR );
	
	Thought::Order( $thought1, $thought2 );
	
	$sql = GetSQL();
	
	$accountid = UserAuth::AccountID();
	
	$transaction = function ( $sql ) 
			use ( $thought1, $thought2, 
				  $accountid, $votevalue ) {
	
		$time = time();	
		$sql->safequery( "START TRANSACTION" );
		
		$result = $sql->safequery( 
			"SELECT goods, bads FROM Links 
			WHERE thought1=$thought1->id AND thought2=$thought2->id
			FOR UPDATE" );
		
		$row = $result->fetch_row();
		if( $row === FALSE ) {
			$sql->safequery( "ROLLBACK" );
			exit( R_NOTFOUND );
		}
		
		$goods = $row[0];
		$bads  = $row[1];
		
		// add the vote
		if( $voteval == 1 ) {
			$goods++;
		} else {
			$bads++;
		}
		
		$result = $sql->safequery(
			"SELECT vote FROM Votes WHERE
			thought1=$thought1->id AND thought2=$thought2->id
			AND account=$accountid FOR UPDATE" );
		
		$row = $result->fetch_row();
		if( $row !== FALSE ) {
			// a vote already exists:
			
			// reverse original vote, 
			// or exit if it already matches the request.
			if( !is_null($row[0]) ) {
				if( $row[0] == $voteval ) {
					$sql->safequery( 'ROLLBACK' );
					exit( R_OKAY );
				}
				
				if( $row[0] == 1 ) {
					$goods--;
				} else {
					$bads--;
				}
			}
			
			$sql->safequery( 
				"UPDATE Votes SET vote=$voteval, time=$time
				WHERE thought1=$thought1->id AND thought2=$thought2->id
				AND account=$accountid" );
			
			$sql->safequery( 
				"UPDATE Links SET goods=$goods, bads=$bads
				WHERE thought1=$thought1->id AND thought2=$thought2->id" );
			
		} else {
			$sql->safequery( 
				"INSERT IGNORE INTO Votes (thought1, thought2, account, time, vote )
				VALUES ($thought1->id, $thought2->id, $accountid, $time, $voteval )" );
			if( $sql->affected_rows == 0 ) {
				// error.
				$sql->safequery( 'ROLLBACK' );
				exit( R_ERROR );
			}
		}
		
		$sql->safequery( 'COMMIT' );
		
	}
	
	$sql->DoTransaction( $transaction );
	
	exit( R_OKAY );
	
} catch( Exception $e ) {
	Logger::PrintException( $e );
}

exit( R_ERROR );

?>