<?php

namespace Logger;

function LogStamp() {
	$time = date( 'm/d/y h:i:s' );
	return "[$time]";
}

function PrintInfo( $text ) {
	if( $GLOBALS['config']->InfoLogging() ) {
		file_put_contents( "logs/info.log", LogStamp() . " $text\n", FILE_APPEND ); 
	}
}

function PrintException( $e ) {
	if( $GLOBALS['config']->ErrorLogging() ) {
		file_put_contents( "logs/error.log", LogStamp() . print_r( $e, true ) ."\n", FILE_APPEND ); 
	}
}

?>