<?php

class Config {
	public static $DEBUG = 0;
	public static $ERRLOG = 0;
	public static $INFOLOG =0 ;
	public static $ABSPATH;
	 
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

// absolute path to site directory
// ie /brain/site/
Config::$ABSPATH = str_replace( "\\", "/", substr( rtrim(dirname(__FILE__), '/\\'), strlen($_SERVER["DOCUMENT_ROOT"]) ) ).'/';

Config::$ERRLOG = TRUE; // log exceptions to err.log
Config::$DEBUG = TRUE;
Config::$INFOLOG = TRUE;

if( $_SERVER['HTTP_HOST'] != 'localhost' ) {
	// hack to disable debug in production
	Config::$DEBUG = FALSE;
}

$config = new Config();

?>