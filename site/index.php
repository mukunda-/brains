<?php

namespace Brains;

date_default_timezone_set( 'America/Chicago' );

require_once 'core.php';

User::CheckLogin( FALSE );

if( Config::DebugMode() ) {
	require_once 'dev/build.php';
}
 
?><!DOCTYPE html>
<html> 
	<head> 
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta charset="UTF-8">
		<link rel="shortcut icon" href="/favicon.png">

		<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">

		<link rel="stylesheet" href="min/style.min.css" type="text/css">

		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<!--<link href='http://fonts.googleapis.com/css?family=Roboto:400,300,700' rel='stylesheet' type='text/css'>-->
		<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300' rel='stylesheet' type='text/css'>
		<link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300italic,700' rel='stylesheet' type='text/css'>
		<script src="min/scripts.min.js"></script>
		 
		<?php
			echo '<script>';
			if( User::LoggedIn() ) {
			
				$login_data = [ 
					'account'  => User::AccountID(), 
					'username' => User::GetUsername(), 
					'nickname' => User::GetNickname() 
				];
				
				echo 'brains.SetLoggedIn( true, '.json_encode( $login_data ).' ); ';
				 
			}
			
			if( Captcha::Valid() ) {
				echo 'brains.SetCaptchaValidated( true ); ';
			}
			echo '</script>';
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
	//		$svg = new \SVG( 'img/gear-2.svg' );
	//		$svg->SetID( 'user' );
	//		$svg->Output();
			echo '<div id="user">';
				echo '<span></span>';
				echo '<i class="icon fa fa-sign-in" id="user"></i>';
			echo '</div>';
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
						<div class="fieldname">Nickname</div><div class="optdesc">What other people will see you as. This can be changed later.</div>
						<input type="text" class="textinput" id="ca_nickname"><hr>
						<div class="fieldname">Username/E-mail</div><div class="optdesc">What you will use to log in. Has to be unique. You can use your e-mail address as your username.</div>
						<input type="text" class="textinput" id="ca_username"><hr>
						<div class="fieldname">Password</div><div class="optdesc">Don't forget this.</div>
						<input type="password" class="textinput" id="ca_password"><hr>
						<div class="fieldname">Re-type Password</div>
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
					
					<label>Username/E-mail</label><br>
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
			<div class="desc" id="dialog_desc">Profile for ...</div>
			
			<div class="profile_content">
			<!--	<div class="profile_entry" id="profile_nickname">Nickname: <span></span></div>
				<div class="profile_entry" id="profile_realname">Real name: <span></span></div>
				<div class="profile_entry" id="profile_website">Website: <span></span></div>
				<div class="profile_entry" id="profile_links">Links discovered: <span></span></div>
				<div class="profile_entry" id="profile_stronglinks">Strong links: <span></span></div>
				<div class="profile_entry" id="profile_perfectlinks">Perfect links: <span></span> </div>
				<div class="profile_entry" id="profile_bio">Bio: <span></span></div> -->
			</div>
			<div class="profile_content_loading_text">loading...</div>
			<center>
				<button id="profile_button_close">Okay</button> 
				<span id="profile_selfbuttons" class="hidden">
					<button id="profile_button_edit">Edit</button>
					<button id="profile_button_chgpassword">Change password</button>
				</span>
			</center>
		</template>
		
		<template id="dialog_editprofile">
			<div class="desc" id="dialog_desc">Edit profile</div>
			
			<center><div id="dialog_error" class="dialog_error"></div></center>
			<label>Nickname:</label><br>
			<input type="text" name="nickname" class="textinput" id="text_nickname"><br>
			
			<label>Real name:</label><br>
			<input type="text" name="realname" class="textinput" id="text_realname"><br>
			
			<label>Website:</label><br>
			<input type="text" name="website" class="textinput" id="text_website"><br>
			
			<label>Bio:</label><br>
			<textarea name="bio" class="textinput" id="text_bio"></textarea>
				
			<center>
				<input type="button" class="submitinput" id="button_save" value="Save"> 
				<input type="button" class="submitinput" id="button_cancel" value="Cancel"><br>
			</center>
			</form>
		</template>
	</body>
</html>
