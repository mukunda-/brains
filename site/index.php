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
		<!--<link href='http://fonts.googleapis.com/css?family=Roboto:400,300,700' rel='stylesheet' type='text/css'>-->
		<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300' rel='stylesheet' type='text/css'>
		<link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,700' rel='stylesheet' type='text/css'>
		<link rel="stylesheet" href="min/style.min.css" type="text/css">
		<script src="min/scripts.min.js"></script>
		<title>brains</title>
	</head>
	<body>
	
		<?php
		
		echo '<div class="top">aaa</div>';
		echo '<div class="margintop"></div>';
		echo '<div class="trail"></div>';
		echo '<div class="navigator">';
			
			echo '<div class="box last"><div class="wrap"><div class="phrase">aaaaaa</div></div></div>';
			echo '<div class="box current"><div class="wrap"><div class="phrase">testingtestingtestingtestes</div></div></div>';
			echo '<div class="box next"><div class="wrap"><div class="phrase">aaaaaa</div></div></div>';
		
		echo '</div>';
		
		echo '<div class="links">';
		
		function TestThought( $text, $score ) {
			echo '<div class="thought">';
				echo "<div class='score'>$score</div>";
				echo '<div class="vote up"><div class="image"></div></div>';
				echo '<div class="vote down"><div class="image"></div></div>';
				echo "<span>$text</span>";
			echo '</div>';
		}
		
		TestThought( 'lorem', 56 );
		TestThought( 'ipsum', 98 );
		TestThought( 'arctosa', 15 );
		TestThought( 'varry quad', 15 );
		TestThought( 'mega trizoid', 15 );
		TestThought( 'latin', 15 );
		TestThought( 'smilies', 15 );
		TestThought( 'mmmmmmmmmmmmm<br>mmmmmmmmmm', 15 );
		TestThought( 'dial up', 15 );
		TestThought( 'phone', 15 );
		TestThought( 'operator', 15 );
		TestThought( 'plugs', 15 );
		TestThought( 'controllers', 15 );
		
		?>
		
		<input type="text" placeholder="start...">
	</body>
</html>
