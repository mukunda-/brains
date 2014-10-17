<?php

namespace Brains;

if( substr(getcwd(),-3) == 'dev' ) {	
	// running from dev folder, change to main
	chdir( '..' );
}

require_once 'core.php';
require_once 'htaccess.php';
/*
spl_autoload_register( function ($class) {
	if( $class === "JShrink\Minifier" ) {
		require_once 'libs/JShrink/Minifier.php';
	}
});*/

//-----------------------------------------------------------------------------
function GetNewestFileTime( $list ) { 
	array_walk( $list, function( &$item, $key ) {
		$item = filemtime($item);
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
	
	if( !file_exists( "min" ) ) {
		mkdir( "min", 0755 );
	}
	
	//----------------------------------------------------------
	$css_target = 'min/style.min.css';
	$newtime = GetNewestFileTime( glob( 'css/*.scss', GLOB_NOSORT ) );
	$gentime = file_exists( $css_target ) ? filemtime( $css_target ) : 0;

	if( $newtime >= $gentime ) {
		Logger::PrintInfo( "building css..." );
		if( Config::DebugMode() ) {
			// debug mode, don't compress.
			 
			exec( "%RUBY%/bin/ruby \"%RUBY%/bin/sass\" css/main.scss $css_target", $output, $aaa ); 
			
		} else {
			
			exec( "%RUBY%/bin/ruby \"%RUBY%/bin/sass\" css/main.scss $css_target --style compressed"  );
		}
	}
	
	//---------------------------------------------------------
	$js_target = 'min/scripts.min.js';
	$js = array_merge( glob( "js/lib/*.js", GLOB_NOSORT ), 
					   glob( "js/*.js", GLOB_NOSORT ) 
					 );
	$newtime = GetNewestFileTime( $js );
	$gentime = file_exists( $js_target ) ? filemtime( $js_target ) : 0;
	if( $newtime >= $gentime ) {
		Logger::PrintInfo( "building javascript..." );
		
		$code = "";
		foreach( $js as $jsfile ) {
			$code .= file_get_contents( $jsfile ) . "\n\n";
		}
		
		if( Config::DebugMode() ) {
			// debug mode, don't minify.
			
			file_put_contents( $js_target, $code );
			
		} else {
			$code = \JShrink\Minifier::Minify( $code );	
			file_put_contents( $js_target, $code );
		}
	}
		
	
}

Build();

?>