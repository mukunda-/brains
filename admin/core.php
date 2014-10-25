<?php

namespace Brains;
 
date_default_timezone_set( 'America/Chicago' );

spl_autoload_register( function( $class ) {
	$class = strtolower( $class );
	$class = str_replace( "\\", "/", $class );
	if( file_exists( "classes/$class.php" ) ) {
		include "classes/$class.php";
	}
	
});

spl_autoload_register( function( $class ) {
	$class = str_replace( "\\", "/", $class );
	if( file_exists( "libs/$class.php" ) ) {
		include "libs/$class.php";
	}
});

$docroot = str_replace( 
			"\\", "/", 
			substr( rtrim(dirname(__FILE__), '/\\'), 
			strlen($_SERVER["DOCUMENT_ROOT"]) ) 
			) . '/';
			
function GetDocumentRoot() {
	return $GLOBALS['docroot'];
}

function PrintHead() {
	?>
	<!DOCTYPE html>
	<html>
		<head>
		<meta charset="UTF-8">
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<title>ADMINISTRATOR'S PANEL</title>
		</head>
		<body>
		
	<?php
}
function PrintFoot() {
	?>
		</body>
		</html>
	<?php
}

?>