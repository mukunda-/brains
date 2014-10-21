<?php

/*
  loginticket.php
  
  POST (
    username: username
  )
  
  sends an email to a email-based username for a special login ticket
  the ticket allows the user to log themselves in using the email.
  
  RETURNS
    "okay." - the email was sent.
	"no." - the username is not an email
	"error." - couldn't send email
*/

namespace Brains;

require_once 'core.php';

try {
	if( !CheckArgsPOST( 'username' ) ) exit();

	$username = trim( filter_var( $_POST['username'], FILTER_SANITIZE_EMAIL ) );
	if( $username == '' ) exit( 'no.' );

	$account_id = User::GetAccountIDFromUsername( $username );

	$subject = 'Your login ticket.';

	if( $account_id != 0 ) {
		
		$ticket = User::MakeLoginTicket( $account_id );
		
		$url = "http://wordex.link/recover.php?id={$ticket['id']}&code={$ticket['code']}";
		
		$message = 'Hi, 
		You are receiving this message because you or someone has requested 
		to sign in with this e-mail. To sign in please follow this link:
		
		'.$url.'
		
		After you sign in you may change your password by clicking on the settings
		button, located in the top right corner, and pressing Change Password.';
	} else {
		$message = 'Hi, 
		You are receiving this message because you or someone has requested 
		to sign in with this e-mail; however, no account is associated with
		this e-mail!';
	}
	
	if( !mail( $username,
			$subject,
			$message,
			"From: Wordex\r\n" .
			'X-Mailer: PHP/' . phpversion() ) ) {
		
		exit( 'error.' );
	}
	
	exit( 'okay.' );
	
} catch( \Exception $e ) {
	Logger::PrintException( $e );
}

exit( 'error.' );

?>