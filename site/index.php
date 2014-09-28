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
		
		echo '<div class="magic" id="magicbox"></div>';
		echo '<span class="magic2" id="magicbox2"></span>';
		echo '<div class="magic3" id="magicbox3"></div>';
	
		
		echo '<div class="margintop"></div>';
		echo '<div class="trail"></div>';
		
		echo '<div id="content">';
		
		echo '<div class="discovery" id="discovery">';
			echo '<div class="score">48</div>';
			echo '<div class="link">aqwerqwefafaweaa <div class="arrow"></div> bbawefawefaf</div>';
			echo '<div class="creator">discovered by <span>nigger</span></div>';
		echo '</div>';
		
		echo '<h2>What does <q>aweofiawoefi</q> make you think of?</h2>';
		echo '<div class="newlink">';
			echo '<input type="text" id="newlink" maxlength="20">';
		echo '</div>';
		
		/*
		echo '<div class="navigator">';
			
			echo '<div class="box last" id="navlast"><div class="phrase">some really small pooping text</div></div>';
			echo '<div class="arrow"></div>';
			echo '<div class="box current" id="navcur"><div class="phrase">disecta</div></div>';
			echo '<div class="arrow"></div>';
			echo '<div class="box next" id="navnext"><div class="phrase placeholder">33</div><input class="phraseinput"></div>';
			
		echo '</div>'; // navigator
		*/
		
		echo '<h2>What other people thought of:</h2>';
		echo '<div class="links">';
		
		function TestThought( $text, $score ) {
			echo '<div class="thought">';
				echo "<div class='score'>$score</div>";
				echo '<div class="vote up "><div class="image"></div></div>';
				echo '<div class="vote down selected"><div class="image"></div></div>';
				echo "<span>$text</span>";
			echo '</div>';
		}
		
		TestThought( 'lorem', 56 );
		TestThought( 'ipsum', 98 );
		TestThought( 'arctosa', 15 );
		TestThought( 'varry quad', 25 );
		TestThought( 'mega trizoid', 15 );
		TestThought( 'latin', 15 );
		TestThought( 'smilies', 50 );
		TestThought( 'mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm',34 );
		TestThought( 'aetakryh aworrj tkretvjrkle awejke', 15 );
		TestThought( 'dial up', 1 );
		TestThought( 'phone', 15 );
		TestThought( 'operator', 0 );
		TestThought( 'plugs', 15 );
		TestThought( 'controllers', 72 );
	
		echo '</div>'; // links
		echo '</div>'; // content
		
		echo '<div class="top">';
			include ('img/logo1.svg');
			//echo '<div class="logo"></div>';
			echo '<form onsubmit="alert(\'hi\')">';
			echo '<input class="query" maxlength="20" >';
			echo '</form>';
			echo '<svg class="user" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xml:space="preserve">';
				include( 'img/person.svg' );
				
			echo '</svg>';
		echo '</div>';
		
		?>
		
	</body>
</html>
