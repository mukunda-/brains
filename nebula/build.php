<?php
   
require_once 'libs/JShrink/Minifier.php';

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
	$js = array_merge( glob( "js/lib/*.js", GLOB_NOSORT ), 
					   glob( "js/*.js", GLOB_NOSORT ) 
					 );
	$newtime = GetNewestFileTime( $js );
	$gentime = GetNewestFileTime( [ "build/scripts.min.js", "build/scripts.js" ] ); 
	
	if( $newtime >= $gentime ) { 
		
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