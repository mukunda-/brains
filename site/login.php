<?php

// login.php
// used to log in a user or create an account
//

require_once 'core.php';

define( 'R_ERROR', 'error.' );      // an error occurred.
define( 'R_INVALID', 'invalid.' );  // invalid login
define( 'R_CAPTCHA', 'captcha.' );  // failed the captcha
define( 'R_EXISTS', 'exists.' );    // create: the username already exists
define( 'R_OKAY', 'okay.' );    // login successful, or an account was 
								// created successfully (and logged into).
 
try {
	
	if( isset( $_POST['create'] ) ) {
		// create new account
		
		if( !CheckArgsPOST( 'username', 'password', 'nickname' ) ) {
			
			exit( R_ERROR );
		}
		
		Captcha::Validate();
		
		if( !Captcha::Valid() ) {
			exit( R_CAPTCHA );
		}
		
		$result = UserAuth::CreateAccount( 
								$_POST['username'], 
								$_POST['password'],
								$_POST['nickname'] );
								
		if( $result == 'exists' ) {
			exit( R_EXISTS );
		} else if( $result != 'okay' ) {
			exit( R_ERROR );
		}
		
		exit( R_OKAY );
		
	} else {
		// login
		if( !CheckArgsPOST( 'username', 'password' ) ) exit( R_ERROR );
		
		if( !UserAuth::LogIn( $_POST['username'], 
							  $_POST['password'],
							  isset($_POST['remember']) ) ) {
							  
			exit( R_INVALID );
		}
		
		exit( R_OKAY );
	}
	
} catch( Exception $e ) {
	Logger::PrintException( $e );
}

exit( R_ERROR );

?>