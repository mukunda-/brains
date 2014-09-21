<?php

date_default_timezone_set( 'America/Chicago' );

require_once 'config.php';

if( $config->DebugMode() ) {
	require_once 'dev/build.php';
}


?>

<!DOCTYPE html>
<html>
	
	<head>
	
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta charset="UTF-8">
		<link rel="shortcut icon" href="/favicon.png">
		<link rel="stylesheet" href="min/style.min.css" type="text/css">
		<title>brains</title>
	</head>
	<body>
		
	</body>
</html>
