<?php
date_default_timezone_set( 'America/Chicago' );

require_once 'config.php';
require_once 'svg.php';

if( $config->DebugMode() ) {
	require_once 'dev/build.php';
}

require_once 'libs/recaptchalib.php';
 
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
		
		echo '<div id="magicbox"></div>';
		echo '<span id="magicbox2"></span>';
		echo '<div id="magicbox3"></div>';
	
		
		echo '<div id="margintop"></div>';
		echo '<div id="trail"></div>';
		
		echo '<div id="content">';
		/*
		echo '<div class="discovery" id="discovery">';
			echo '<div class="score">48</div>';
			echo '<div class="link">aqwerqwefafaweaa <div class="arrow"></div> bbawefawefaf</div>';
			echo '<div class="creator">discovered by <span>nigger</span></div>';
		echo '</div>';
		
		echo '<h2>What does <q>aweofiawoefi</q> make you think of?</h2>';
		echo '<div id="newlink">';
			echo '<input type="text" id="newlink" maxlength="20">';
		echo '</div>';
		 
		
		echo '<h2>What other people thought of:</h2>';
		echo '<div id="links">';
		
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
		*/
		echo '</div>'; // content
		
		echo '<div id="top">';
			$svg = new SVG( 'img/logo1.svg' );
			$svg->SetID( 'logo' );
			$svg->Output();
			//echo '<div class="logo"></div>';
			echo '<form autocomplete="off" id="queryform">';
			echo '<input id="query" maxlength="20" >';
			echo '</form>';
			$svg = new SVG( 'img/person.svg' );
			$svg->SetID( 'user' );
			$svg->Output();
		 
		echo '</div>';
		
		?>
		
		<div id="overlay">
		<br>
		<div id="dialog_wrapper"> 
			<div id="dialog">
				
			</div>
		</div>
		
		</div>
		<?php
		
		$recaptcha = recaptcha_get_html( '6LdsGvsSAAAAAP1H8FgcBG-KrIkswRWe90I8oUqU' );
		$recaptcha = str_replace( array("\r","\n"), '', $recaptcha );
		/*
		function RegisterDialogContent( $name, $contents ) {
			global $recaptcha;
			$contents = str_replace( array("\r","\n"), '', $contents );
			$contents = str_replace( "'", '\\\'', $contents );
			$contents = str_replace( "'", '\\\'', $contents );
			
			$contents = str_replace( '[[[RECAPTCHA]]]', $recaptcha, $contents );
			echo "<script type='text/javascript'>brains.Dialog.RegisterContent( '$name', '$contents' );</script>\r\n";
			
			file_put_contents( $name, "<script>brains.Dialog.RegisterContent( '$name', '$contents' );</script>\r\n" );
		}*/
		
		?>
		<template id="dialog_createaccount">
			<div class="title">Create an account</div>
			<center>
			<form>
			<label>Nickname: (what other people will see you as.)</label><br>
			<input type="text" class="textinput"><br>
			<label>Username: (what you will use to log in.)</label><br>
			<input type="text" class="textinput"><br>
			<label>Password: (don\'t forget this.)</label><br>
			<input type="password" class="textinput"><br>
			<label>Re-type Password:</label><br>
			<input type="password" class="textinput"><br>
			
			<?php echo $recaptcha ?>
		
			<input type="submit" class="submitinput" value="Create Account"><br>
			</form>
			</center>
		</template>
		
		<template id="dialog_login">
			<div class="title">Log in</div>
			<center>
				<form>
				
				<label>Username</label><br>
				<input type="text" name="username" class="textinput"><br>
				<label>Password</label><br>
				<input type="password" name="password" class="textinput"><br>
				<input type="submit" class="submitinput" value="Login"> <input type="button" class="submitinput" value="Create Account"><br>
				</form>
			</center>
		</template>
		
		 
	</body>
</html>
