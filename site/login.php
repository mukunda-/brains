<?php

namespace Brains;

/*
  login.php
  
  POST (
    create: 
	  username
	  password
	  nickname
	-----------
	  username
	  password
	  [rememberme]
  )
  
  log in a user or create an account
*/

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
			
			exit();
		}
		
		// if they didn't submit a captcha and the session is not
		// currently validated by one, ask them for one.
		Captcha::Validate();
		if( !Captcha::Valid() ) {
			Response::SendSimple( R_CAPTCHA );
		}
		
		$result = User::CreateAccount( 
						$_POST['username'], 
						$_POST['password'],
						$_POST['nickname'] );
		
		if( $result == 'exists' ) {
			Response::SendSimple( R_EXISTS );
		} else if( $result != 'okay' ) {
			Response::SendSimple( R_ERROR );
		}
		
	} else {
		// login
		if( !CheckArgsPOST( 'username', 'password' ) ) exit();
		
		if( !User::LogIn( $_POST['username'], 
							  $_POST['password'],
							  isset($_POST['remember']) ) ) {
			
			Response::SendSimple( R_INVALID );
		}
	}
	
	$response = new Response();
	$response->data['username'] = User::GetUsername();
	$response->data['accountid'] = User::AccountID();
	$response->data['nickname'] = User::GetNickname();
	$response->Send( R_OKAY );
	
} catch( \Exception $e ) {
	Logger::PrintException( $e );
}

Response::SendSimple( R_ERROR );

?>