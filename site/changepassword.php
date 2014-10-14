<?php

/*
   changepassword.php
   
   POST (
     ctoken: login token (not really needed but whatever)
     current: current password
	 new: new password
   )
   
   Changes a user's password.
   
   RETURNS:
     "login.": User is not logged in
	 "invalid.": 'current' does not match the user's password.
	 "error.": Invalid input or database error.
	 "okay.": The password was changed.
*/

namespace Brains;

require_once 'core.php';

try {
	if( !CheckArgsPOST( 'ctoken', 'current', 'new' ) ) exit();
	
	if( !User::CheckLogin( $_POST['ctoken'] ) ) {
		exit( 'login.' );
	}
	
	if( !User::ChangePassword( $_POST['current'], $_POST['new'] ) ) {
		exit( 'invalid.' );
	}
	
	exit( 'okay.' );
} catch( \Exception $e ) {
	Logger::PrintException( $e );
}

exit( 'error.' );

?>