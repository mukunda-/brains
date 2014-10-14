<?php

/*
  profile.php
  
  GET (
    account: <accountid>
  )
  
  Returns information about a user.
  
  RESPONSE "okay." {
    data {
      id: accountid
	  nickname: nickname
	  realname: real name
	  website: website
	  bio: biography
	  links: links discovered
	  strongs: strong links discovered
	  perfects: perfect links discovered
    }
  }
  
  // all strings are html escaped.
*/

namespace Brains;

require_once 'core.php';

define( 'R_ERROR', 'error.' ); // an error occurred.
define( 'R_INVALID', 'invalid.' ); // invalid account id
define( 'R_OKAY', 'okay.' ); // user data was returned

try {

	if( !CheckArgsGET( 'account' ) ) exit();
	if( !ctype_digit( $_GET['account'] ) ) exit();
	
	$account = $_GET['account'];
	
	$info = User::ReadAccount( $account, [ 'nickname', 'name', 'website',
											'bio', 'linksmade', 'stronglinks',
											'perfectlinks' ] );
											
	if( $info === FALSE ) {
		Response::SendSimple( R_INVALID );
	}
	
	if( $info['realname'] === null ) $info['realname'] = "";
	if( $info['website'] === null ) $info['website'] = "";
	if( $info['bio'] === null ) $info['bio'] = "";
	
	$response = new Response();
	$response->data['id'] = $account;
	$response->data['nickname'] = $info['nickname'];
	$response->data['nickname_html'] = htmlspecialchars($info['nickname']);
	$response->data['realname'] = $info['name'];
	$response->data['realname_html'] = htmlspecialchars($info['name']);
	$response->data['website'] = $info['website'];
	$response->data['website_html'] = htmlspecialchars($info['website']);
	$response->data['bio'] = $info['bio'];
	$response->data['bio_html'] = htmlspecialchars($info['bio']);
	$response->data['links'] = $info['linksmade'];
	$response->data['strongs'] = $info['stronglinks'];
	$response->data['perfects'] = $info['perfectlinks'];
	$response->Send( R_OKAY );
	
} catch( Exception $e ) {
	Logger::PrintException( $e );
}

Response::SendSimple( R_ERROR );

?>
