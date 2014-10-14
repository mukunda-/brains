<?php

/*
  editprofile.php
  
  POST (
    ctoken: login token
	nickname: new nickname
	realname: new real name
	website: new website
	bio: new bio
  )
  
  Edits a profile.
  
  RESPONSE "okay." - success.
  RESPONSE "error." - bad request or failed.
  RESPONSE "login." - user is not logged in.
  
*/

define( 'R_ERROR', 'error.' );  
define( 'R_LOGIN', 'login.' ); 
define( 'R_OKAY', 'okay.' ); 


try {
	if( !CheckArgsPOST( 'ctoken', 'nickname', 'realname', 
	                    'website', 'bio' ) ) exit();
	
	if( !User::CheckLogin( $_POST['ctoken'] ) ) {
		Response::SendSimple( R_LOGIN );
	}
	
	User::EditProfile( $_POST['nickname'], $_POST['realname'], 
					   $_POST['website'], $_POST['bio'] );
	
} catch( Exception $e ) {
	Logger::PrintException( $e );
}

Response::SendSimple( R_ERROR );

?>