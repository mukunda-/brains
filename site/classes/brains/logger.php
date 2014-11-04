<?php

namespace Brains;

class Logger {

	public static $path = "logs/";

	/** -----------------------------------------------------------------------
	 * Format a log timestamp code.
	 */
	public static function LogStamp() {
		$time = date( 'm/d/y h:i:s' );
		$addr = $_SERVER['REMOTE_ADDR'];
		return "[$time | $addr]";
	}
	
	/** -----------------------------------------------------------------------
	 * Format a username and ID into a text block
	 */
	public static function FormatUser( $username, $id ) {
		return "\"$username/$id\"";
	}

	/** -----------------------------------------------------------------------
	 * Print a line to the info log file.
	 *
	 * @param string $text Text to print.
	 */
	public static function PrintInfo( $text ) {
		if( Config::InfoLogging() ) {
			file_put_contents( self::$path."info.log", self::LogStamp() . " $text\n", FILE_APPEND ); 
		}
	}
	
	/** -----------------------------------------------------------------------
	 * Alias of PrintInfo
	 */
	public static function Info( $text ) {
		self::PrintInfo( $text );
	}

	/** -----------------------------------------------------------------------
	 * Print an exception description to the error log file.
	 *
	 * @param Exception $e Exception to print.
	 */
	public static function PrintException( $e ) {
		if( Config::ErrorLogging() ) {
			file_put_contents( self::$path."error.log", self::LogStamp() . " " . print_r( $e, true ) ."\n", FILE_APPEND ); 
		}
	}

}

date_default_timezone_set( 'America/Chicago' );

?>