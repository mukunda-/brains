<?php

class Config {
	public static $DEBUG = TRUE;
	public static $ERRLOG = TRUE;
	public static $INFOLOG = TRUE;
	public static $AUTHTOKEN_EXTEND_MIN = 20*60;
	public static $AUTHTOKEN_EXTEND_DURATION = 30*60;
	public static $ABSPATH;
	
	public function __construct() {
		// absolute path to site directory
		// ie /brains/site/
		self::$ABSPATH = str_replace( "\\", "/", substr( rtrim(dirname(__FILE__), '/\\'), strlen($_SERVER["DOCUMENT_ROOT"]) ) ).'/';

		if( $_SERVER['HTTP_HOST'] != 'localhost' ) {
			// hack to disable debug in production
			Config::$DEBUG = FALSE;
		}
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
}

$config = new Config();

?>