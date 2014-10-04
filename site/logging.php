<?php

class Logger {

	public static function LogStamp() {
		$time = date( 'm/d/y h:i:s' );
		return "[$time]";
	}

	public static function PrintInfo( $text ) {
		if( $GLOBALS['config']->InfoLogging() ) {
			file_put_contents( "logs/info.log", self::LogStamp() . " $text\n", FILE_APPEND ); 
		}
	}

	public static function PrintException( $e ) {
		if( $GLOBALS['config']->ErrorLogging() ) {
			file_put_contents( "logs/error.log", self::LogStamp() . print_r( $e, true ) ."\n", FILE_APPEND ); 
		}
	}

}

?>