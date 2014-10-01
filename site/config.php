<?php

class Config {
	public static $DEBUG = TRUE;
	public static $ERRLOG = TRUE;
	public static $INFOLOG = TRUE;
	public static $AUTHTOKEN_EXTEND_MIN;
	public static $AUTHTOKEN_EXTEND_DURATION;
	public static $AUTHTOKEN_DURATION;
	public static $ABSPATH;
	public static $SECURE = FALSE;
	public static $SESSIONTIME = 1440;
	public static $SCORERAMPCONST = 50;
	
	public function __construct() {
		// absolute path to site directory
		// ie /brains/site/
		self::$ABSPATH = str_replace( "\\", "/", substr( rtrim(dirname(__FILE__), '/\\'), strlen($_SERVER["DOCUMENT_ROOT"]) ) ).'/';

		if( $_SERVER['SERVER_NAME'] != 'localhost' ) {
			// disable debug in non local servers.
			Config::$DEBUG = FALSE;
		}
		
		//self::$AUTHTOKEN_EXTEND_MIN = 20*60;
		//self::$AUTHTOKEN_EXTEND_DURATION = 30*60;
		self::$AUTHTOKEN_DURATION = 60*60*24*90; // 90 days
		
		session_set_cookie_params( 
			self::$SESSIONTIME,  // 24 minutes
			$this->AbsPath() );
	}
	 
	public function AbsPath() {
		return self::$ABSPATH;
	}
	
	public function DebugMode() {
		return self::$DEBUG;
	}
	
	public function ErrorLogging() {
		return self::$ERRLOG;
	}
	
	public function InfoLogging() {
		return self::$INFOLOG;
	}
	
	public function SecureMode() {
		return self::$SECURE;
	}
}

$config = new Config();

?>