<?php

namespace Brains;

if( substr(getcwd(),-3) == 'dev' ) {	
	// running from dev folder, change to main
	chdir( '..' );
}

require_once 'core.php';
/*
spl_autoload_register( function ($class) {
	if( $class === "JShrink\Minifier" ) {
		require_once 'libs/JShrink/Minifier.php';
	}
});*/

//-----------------------------------------------------------------------------
function GetNewestFileTime( $list ) { 
	array_walk( $list, function( &$item, $key ) {
		
		$item = file_exists($item) ? filemtime($item) : 0;
	});
	$list[] = 0;
	return max($list);
}
  
//-----------------------------------------------------------------------------
function Build() {
	global $config;
	
	if( !file_exists( "logs" ) ) {
		mkdir( "logs", 0700 );
	}
	
	if( !file_exists( "build" ) ) {
		mkdir( "build", 0755 );
	}
	
	//----------------------------------------------------------
 
	$newtime = GetNewestFileTime( glob( 'css/*.scss', GLOB_NOSORT ) );
	$gentime = GetNewestFileTime( [ "build/style.min.css", "build/style.css" ] ); //file_exists( $css_target ) ? filemtime( $css_target ) : 0;

	if( $newtime >= $gentime ) {
		Logger::PrintInfo( "building css..." );
		
		exec( "%RUBY%/bin/ruby \"%RUBY%/bin/sass\" css/main.scss build/style.css", $output, $aaa ); 
		exec( "%RUBY%/bin/ruby \"%RUBY%/bin/sass\" css/main.scss build/style.min.css --sourcemap=none --style compressed"  );
		 
	}
	
	//---------------------------------------------------------- 
	$js = array_merge( glob( "js/lib/*.js", GLOB_NOSORT ), 
					   glob( "js/*.js", GLOB_NOSORT ) 
					 );
	$newtime = GetNewestFileTime( $js );
	$gentime = GetNewestFileTime( [ "build/scripts.min.js", "build/scripts.js" ] ); 
	
	if( $newtime >= $gentime ) {
		Logger::PrintInfo( "building javascript..." );
		
		$code = "";
		foreach( $js as $jsfile ) {
			$code .= file_get_contents( $jsfile ) . "\n\n";
		}
		
		file_put_contents( "build/scripts.js", $code );
		$code = \JShrink\Minifier::Minify( $code );	
		file_put_contents( "build/scripts.min.js", $code );
			 
	}
}

Build();

?>