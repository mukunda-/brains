<?php

namespace Brains;

/**
 * Site configuration.
 *
 */
final class Config {

	// debug mode, make sure to turn this off!
	// controls minification and allows major setup features
	public static $DEBUG = FALSE;
	
	// log errors/exceptions to disk
	public static $ERRLOG = TRUE; 
	
	// log additional information to disk
	public static $INFOLOG = TRUE; 
	//public static $AUTHTOKEN_EXTEND_MIN;
//	public static $AUTHTOKEN_EXTEND_DURATION;

	// duration (seconds) when saved logins expire
	public static $AUTHTOKEN_DURATION; 
	
	// absolute path to site directory
//	public static $ABSPATH; 
	
	// using https mode
	public static $SECURE = FALSE; 
	
	// length of server session time (seconds)
	public static $SESSIONTIME = 1440; 
	
	// number of votes needed for a score to have a real value.
	public static $SCORERAMPCONST = 50; //
	
	// time that is required before a link can be voted on by the same ip again.
	public static $VOTELOCK_TIME = 14400; //60*60*4
	
	public static $LOGIN_TICKET_EXPIRY = 600; // 10 minutes.
	
	// time before the tree file is invalidated.
	public static $TREE_REFRESH_TIME = 600; // 10 minutes
	
	public static function init() {
		// absolute path to site directory
		// ie /brains/site/
//		self::$ABSPATH = str_replace( 
//			"\\", "/", 
//			substr( rtrim(dirname(__FILE__), '/\\'), 
//			strlen($_SERVER["DOCUMENT_ROOT"]) ) 
//			) . '/';
		
		if( $_SERVER['SERVER_NAME'] != 'localhost' ) {
			// disable debug in non local servers.
			Config::$DEBUG = FALSE;
		} else {
			// enable debug on local servers
			Config::$DEBUG = TRUE;
		}
		
		self::$AUTHTOKEN_DURATION = 60*60*24*90; // 90 days
		
		session_set_cookie_params(
			self::$SESSIONTIME,  // 24 minutes
			GetDocumentRoot() );
	}
	
	// some fancy functions
	public static function AbsPath() {
		return self::$ABSPATH;
	}
	
	public static function DebugMode() {
		return self::$DEBUG;
	}
	
	public static function ErrorLogging() {
		return self::$ERRLOG;
	}
	
	public static function InfoLogging() {
		return self::$INFOLOG;
	}
	
	public static function SecureMode() {
		return self::$SECURE;
	}
}

Config::init();
 
?>