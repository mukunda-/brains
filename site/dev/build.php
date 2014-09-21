<?php

namespace Builder {

require_once 'config.php';
require_once 'logging.php';

//-----------------------------------------------------------------------------
function GetNewestFileTime( $folder ) {
	$newtime = 0;
	$files = glob( "$folder/*.scss", GLOB_NOSORT );
	foreach( $files as &$file ) {
		$newtime = max( filemtime( "$file" ), $newtime );
	}
	return $newtime;
}

//-----------------------------------------------------------------------------
function Build() {
	global $config;
	
	if( !file_exists( "logs" ) ) {
		mkdir( "logs", 0700 );
	}
	
	LogInfo( "rebuilding css..." );
	//-----------------------------------------------------------------------------
	if( !file_exists( "min" ) ) {
		mkdir( "min", 0755 );
	}
	
	$css_target = 'min/style.min.css';
	$newtime = GetNewestFileTime( 'css' );
	$gentime = file_exists( $css_target ) ? filemtime( $css_target ) : 0;

	if( $newtime >= $gentime ) {
		if( $config->DebugMode() ) {
			// debug mode, don't compress.
			 
			exec( "%RUBY%/bin/ruby \"%RUBY%/bin/sass\" css/main.scss $css_target", $output, $aaa ); 
			  
		} else {
			
			exec( "%RUBY%/bin/ruby \"%RUBY%/bin/sass\" css/main.scss $css_target --style compressed"  );
		}
	}
}

Build();
}

?>