<?php
date_default_timezone_set( 'America/Chicago' );

require_once 'config.php';

if( $config->DebugMode() ) {
	require_once 'dev/build.php';
}
 
?><!DOCTYPE html>
<html> 
	<head> 
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta charset="UTF-8">
		<link rel="shortcut icon" href="/favicon.png">
		
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300' rel='stylesheet' type='text/css'>
		
		<link rel="stylesheet" href="min/style.min.css" type="text/css">
		<title>brains</title>
	</head>
	<body>
		
		<div class="test">aaa</div><div class="test">bbb</div>
		<input type="text" placeholder="start...">
	</body>
</html>
