<?php

namespace Brains;

date_default_timezone_set( 'America/Chicago' );

require_once 'core.php';

User::CheckLogin();

if( Config::DebugMode() ) {
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
		<link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300italic,700' rel='stylesheet' type='text/css'>
		<link rel="stylesheet" href="min/style.min.css" type="text/css">
		<script src="min/scripts.min.js"></script>
		 
		<?php
			if( User::LoggedIn() ) {
				echo '<script>brains.SetLoggedIn( true, "'.User::GetUsername().'", '.User::AccountID().' );</script>';
			}
			
			if( Captcha::Valid() ) {
				echo '<script>brains.SetCaptchaValidated( true );</script>';
			}
		?>
		 
		<title>brains</title>
	</head>
	<body>
	
		<?php
		
		echo '<div id="magicbox"></div>';
		echo '<span id="magicbox2"></span>';
		echo '<div id="magicbox3"></div>';
	
		
		echo '<div id="margintop"></div>';
		echo '<div id="trail"></div>';
		
		echo '<div id="content">hi';
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
			$svg = new \SVG( 'img/logo1.svg' );
			$svg->SetID( 'logo' );
			$svg->Output();
			//echo '<div class="logo"></div>';
			echo '<form autocomplete="off" id="queryform">';
			echo '<input id="query" maxlength="20" >';
			echo '</form>';
			$svg = new \SVG( 'img/person.svg' );
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
		
		//$recaptcha = recaptcha_get_html( '6LdsGvsSAAAAAP1H8FgcBG-KrIkswRWe90I8oUqU' );
		
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
		
			<div class="dialog_createaccount">
				
				<div class="title">Create an account</div>
				<!--<div class="desc">Creating an account here is easy and fun! Just fill out the info and the captcha and you will be logged in instantly. Accounts are required if you want to create new thought links or vote on links. You don't need an account if you just want to browse.</div>-->
				<center>
					<div id="dialog_error" class="dialog_error"></div>
					<form id="form_createaccount">
						<label><span class="fieldname">Nickname</span><br><span class="optdesc">What other people will see you as. Doesn't have to be unique. This can be changed later.</span></label><br>
						<input type="text" class="textinput" id="ca_nickname"><hr>
						<label><span class="fieldname">Username/E-mail</span><br><span class="optdesc">What you will use to log in. Has to be unique. You can use your e-mail address as your username if you don't want to think of something else.</span></label><br>
						<input type="text" class="textinput" id="ca_username"><hr>
						<label><span class="fieldname">Password</span><br><span class="optdesc">Don't forget this.</span></label><br>
						<input type="password" class="textinput" id="ca_password"><hr>
						<label><span class="fieldname">Re-type Password</span></label><br>
						<input type="password" class="textinput" id="ca_password2"><hr><br>
						<div id="ca_captcha"></div>
						
						<input type="submit" class="submitinput" value="Create Account">
						<input type="button" class="submitinput" id="button_cancel" value="Cancel">
					</form>
					<div style="height: 12px"></div>
					<a href="privacy.html" target="_blank">Privacy Policy</a>
				</center>
				
				
			</div>
		</template>
		
		<template id="dialog_login">
			<div class="desc" id="dialog_desc">To create a link you need to be logged in.</div>
			<center>
				<div id="dialog_error" class="dialog_error"></div>
				<form id="form_login">
					
					<label>Username</label><br>
					<input type="text" name="username" class="textinput" id="text_username"><br>
					<label>Password</label><br>
					<input type="password" name="password" class="textinput" id="text_password"><br>
					<input type="checkbox" name="rememberme" id="check_rememberme">
					<label for="check_rememberme">Remember me</label><br>
					<input type="submit" class="submitinput" value="Log In"> 
					<input type="button" class="submitinput" id="button_cancel" value="Cancel"><br>
					
				</form>
				<div style="height: 12px"></div>
				<a href="javascript:;" id="button_createaccount">Create an account in 15 seconds</a>
			</center>

		</template>
		
		<template id="dialog_profile">
			<div class="desc" id='dialog_desc'>Profile for ...</div>
			<center>
				<div id="profile_email"></div>
				<div id="profile_bio"></div>
			</center>
		</template>
	</body>
</html>
