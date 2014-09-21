<?php

namespace Builder {

require_once 'config.php';

//-----------------------------------------------------------------------------
function GetNewestFileTime( $folder ) {
	$newtime = 0;
	$files = scandir( $folder, SCANDIR_SORT_NONE );
	foreach( $files as $file ) {
		$time = filemtime( "$folder/$file" );
		if( $time > $newtime ) {
			$newtime = $time;
		}
	}
	return $newtime;
}

function Build() {
	global $config;
	
	echo "rebuilding css...";
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
			
			exec( "sass css/main.scss $css_target" );
		} else {
			
			exec( "sass css/main.scss $css_target --style compressed"  );
		}
	}
}

Build();
}

?>