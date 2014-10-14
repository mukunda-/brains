<?php

/*
  logout.php
  
  End the user's session.
*/

namespace Brains;

require_once 'core.php';

try {
	User::SetLoggedIn( 0 );
	exit();
} catch ( \Exception $e ) {
	Logger::PrintException( $e );
}

exit( "error." );

?>