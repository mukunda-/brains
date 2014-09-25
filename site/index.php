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
		<div class="thought">lorem</div><div class="thought">ipsum</div><div class="thought">itosa</div>
		
		<div class="thought">varry quad</div>
		<div class="thought">arctosa</div>
		<div class="thought">mega trizoid</div>
		
		<div class="thought">latin</div>
		<div class="thought">smilies</div>
		<div class="thought">emoticon</div>
		<div class="thought">mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm</div>
		<div class="thought">internet</div>
		<div class="thought">dial up</div>
		<div class="thought">phone</div>
		<div class="thought">operator</div>
		<div class="thought">plugs</div>
		<div class="thought">controllers</div>
		<input type="text" placeholder="start...">
	</body>
</html>
