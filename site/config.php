<?php

class Config {
	public static $DEBUG = 0;
	public static $ERRLOG = 0;
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
}

// absolute path to site directory
// ie /brain/site/
Config::$ABSPATH = rtrim(dirname($_SERVER['PHP_SELF']), '/\\').'/';

Config::$ERRLOG = TRUE; // log exceptions to err.log
Config::$DEBUG = TRUE;

if( $_SERVER['HTTP_HOST'] != 'localhost' ) {
	// hack to disable debug in production
	Config::$DEBUG = FALSE;
}

$config = new Config();

?>