<?php

// login.php
// used to log in a user
//

require_once 'common.php';
require_once 'userauth.php';
require_once 'captcha.php';
 
// an error occurred.
define( 'R_ERROR', 'error.' );

// invalid login
define( 'R_INVALID', 'invalid.' ); 

// failed the captcha
define( 'R_CAPTCHA', 'captcha.' ); 

// create: the username already exists
define( 'R_EXISTS', 'exists.' ); 
 
// login successful, or an account was created successfully.
define( 'R_OKAY', 'okay.' ); 
 
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