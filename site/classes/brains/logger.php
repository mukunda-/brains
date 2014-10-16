<?php

namespace Brains;

class Logger {

	public static function LogStamp() {
		$time = date( 'm/d/y h:i:s' );
		$addr = $_SERVER['REMOTE_ADDR'];
		return "[$time | $addr]";
	}
	
	public static function FormatUser( $username, $id ) {
		return "\"$username/$id\"";
	}

	public static function PrintInfo( $text ) {
		if( Config::InfoLogging() ) {
			file_put_contents( "logs/info.log", self::LogStamp() . " $text\n", FILE_APPEND ); 
		}
	}
	
	public static function Info( $text ) {
		self::PrintInfo( $text );
	}

	public static function PrintException( $e ) {
		if( Config::ErrorLogging() ) {
			file_put_contents( "logs/error.log", self::LogStamp() . print_r( $e, true ) ."\n", FILE_APPEND ); 
		}
	}

}

?>