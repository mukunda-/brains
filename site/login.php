<?php

// login.php
// used to log in a user
//

require_once 'common.php';
require_once 'userauth.php';
 
define( R_ERROR,   'error.'   ); // an error occurred.
define( R_INVALID, 'invalid.' ); // invalid login
define( R_CAPTCHA, 'captcha.' ); // failed the captcha
define( R_EXISTS,  'exists.'  ); // create: the username already exists
define( R_CREATED, 'created.' ); // create: the account was created successfully
define( R_OKAY,    'okay.'    ); // login successful.
 
try {

	if( isset( $_POST['create'] ) ){ 
		// create new account
		
		if( !CheckArgsPOST( 'username', 'password', 
			'email', 'recaptcha_challenge_field', 'recaptcha_response_field' ) ) {
			
			exit( R_ERROR );
		}
		
		
		
	} else {
		// login
		if( !CheckArgsPOST( 'username', 'password' ) ) exit( R_ERROR );
		
		if( !UserAuth::LogIn( $_POST['username'], $_POST['password'] ) ) {
			exit( R_INVALID );
		}
		
		exit( R_OKAY );
	}
	
} catch( Exception $e ) {
	Logger::PrintException( $e );
}

exit( R_ERROR );

?>