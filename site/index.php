<?php

namespace Brains;

date_default_timezone_set( 'America/Chicago' );

require_once 'core.php';

User::CheckLogin();
User::RefreshCToken();

if( Config::DebugMode() ) {
	require_once 'dev/build.php';
}

 
?><!DOCTYPE html>
<html> 
	<head> 
		<!-- ----------------------------------------------
		
		  Wordex
		  
		  Copyright 2014 Mukunda Johnson (www.mukunda.com)
		  All rights reserved.
		  
		----------------------------------------------- -->
		
		<!-- Font Awesome by Dave Gandy - http://fontawesome.io -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta charset="UTF-8">
		<meta name="description" content="A database of thought relations, populated by brainstorming.">
		<meta name="keywords" content="brainstorm,thought,think,word,links,creative,thesaurus,human,modern,sexy">
		<link rel="shortcut icon" href="favicon.png">

		<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
		
		<?php
			if( Config::DebugMode() ) {
				echo '<link rel="stylesheet" href="build/style.css" type="text/css">';
			} else {
				echo '<link rel="stylesheet" href="build/style.min.css" type="text/css">';
			}
		?>

		<!-- Google Analytics -->
		<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', 'UA-52426023-4', 'auto');

		</script>
		<!-- End Google Analytics -->

		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<!--<link href='http://fonts.googleapis.com/css?family=Roboto:400,300,700' rel='stylesheet' type='text/css'>-->
		<link href='http://fonts.googleapis.com/css?family=Open+Sans:700,600,300,300italic' rel='stylesheet' type='text/css'>
		<link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300italic,700' rel='stylesheet' type='text/css'>
		
		<?php
			if( Config::DebugMode() ) {
				echo '<script src="build/scripts.js"></script>';
			} else {
				echo '<script src="build/scripts.min.js"></script>';
			} 
			
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
		 
		<title>wordex - the word machine</title>
	</head>
	<body>
	
		<div id="aura"></div>
		
		<div id="magicbox"></div>
		<span id="magicbox2"></span>
		<div id="magicbox3"></div>
		
		<div id="margintop"></div>
		
		<div id="trail"></div>
		
		<div id="content"></div>
		
		<div id="top">
		
			<?php			
				$svg = new \SVG( 'img/logo1.svg' );
				$svg->SetID( 'logo' );
				$svg->Output();
			?>
			
			<div class="loader" id="loader_top"></div>
				
			<form autocomplete="off" id="queryform">
				<input id="query" maxlength="20">
			</form>
	 
			<div id="user">
				<span></span>
				<i class="icon fa fa-sign-in"></i>
			</div>
			
			
		</div>
		
		
		<div id="overlay">
			<br>
			<div id="dialog_wrapper"> 
				<div id="dialog">
					
				</div>
			</div>
			
		</div>
		
		<?php
		
			ImportTemplates( [
				'dialog_createaccount',
				'dialog_login',
				'dialog_profile',
				'dialog_editprofile',
				'dialog_chgpassword',
				'dialog_lostpassword',
				'template_newlink',
				'template_discovery',
				'template_links',
				'template_link',
				'template_info',
				'template_signin_reminder'
			]);
			
			
		?>
	     
	</body>
</html>
