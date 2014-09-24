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

try {
	if( !CheckArgs( 'a', 'b', 'vote' ) ) exit( 'error.' );
	
} catch( Exception $e ) {
	Logger::PrintException( $e );
}

exit( 'error.' );

?>