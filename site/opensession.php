<?php

require_once 'config.php'; 

function OpenSession( $ping = false ) {
	global $session_timeout, $apath;
	session_set_cookie_params( $session_timeout, $apath );
	session_start(); 
	setcookie(session_name(),session_id(),time()+$session_timeout,$apath);

	if( $ping ) {
		
		if( isset( $_SESSION['sessionstart'] ) ) {
			$_SESSION['sessionstart'] = $_SESSION['sessionstart'];
		}
		return;
	}
	
	if(isset($_GET['logout'])) {
		$_SESSION = array(); 
		
		if( isset( $_COOKIE['savedlogin'] ) ) {
			setcookie( "savedlogin", "", 0, $apath );
			$_COOKIE['savedlogin'] = "";
		}
	}
	if(isset($_SESSION['remotehost'])) {

		if( $_SESSION['remotehost'] != $_SERVER['REMOTE_ADDR'] ) {

		
			$_SESSION = array(); // ip mismatch, erase session
			$_SESSION['remotehost'] = $_SERVER['REMOTE_ADDR'];
		}
	} else {


		$_SESSION = array(); // no ip, erase session
		$_SESSION['remotehost'] = $_SERVER['REMOTE_ADDR'];
	}
	 
	if(!isset($_SESSION['sessionstart'])) {

		$_SESSION['sessionstart'] = 1;
		$_SESSION['loggedin'] = 0;
		//$_SESSION['loggedin_name'] = "";
		//$_SESSION['accountid'] = "";
	}
}


?>