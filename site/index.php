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
		
		<?php
			if( Config::DebugMode() ) {
				echo '<link rel="stylesheet" href="build/style.css" type="text/css">';
			} else {
				echo '<link rel="stylesheet" href="build/style.min.css" type="text/css">';
			}
		?>

		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<!--<link href='http://fonts.googleapis.com/css?family=Roboto:400,300,700' rel='stylesheet' type='text/css'>-->
		<link href='http://fonts.googleapis.com/css?family=Open+Sans:700,400,300,300italic' rel='stylesheet' type='text/css'>
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
			$svg = new \SVG( 'img/logo1.svg' );
			$svg->SetID( 'logo' );
			$svg->Output();
			
			echo '<div class="loader" id="loader_top"></div>';
			//echo '<div class="logo"></div>';
			echo '<form autocomplete="off" id="queryform">';
			echo '<input id="query" maxlength="20" >';
			echo '</form>';

	//		$svg = new \SVG( 'img/gear-2.svg' );
	//		$svg->SetID( 'user' );
	//		$svg->Output();
	
			echo '<div id="user">';
				echo '<span></span> ';
				echo '<i class="icon fa fa-sign-in"></i>';
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
		
		
		//<div style="height: 12px"></div>
		//			<a href="privacy.html" target="_blank">Privacy Policy</a>
		?>
		<template id="dialog_createaccount">
		
			<div class="dialog_createaccount">
				
				<div class="title">Create an account</div>
				<!--<div class="desc">Creating an account here is easy and fun! Just fill out the info and the captcha and you will be logged in instantly. Accounts are required if you want to create new thought links or vote on links. You don't need an account if you just want to browse.</div>-->
				<center>
					<div id="dialog_error" class="dialog_error"></div>
					<form id="form_createaccount">
						<div class="fieldname">Nickname</div><div class="optdesc">What other people will see you as. This can be changed later.</div>
						<input type="text" class="textinput" id="ca_nickname" autocomplete="off"><hr>
						<div class="fieldname">Username/E-mail</div><div class="optdesc">What you will use to sign in. Has to be unique. You can use your e-mail address as your username.</div>
						<input type="text" class="textinput" id="ca_username" autocomplete="off"><hr>
						<div class="fieldname">Password</div><div class="optdesc">Don't forget this.</div>
						<input type="password" class="textinput" id="ca_password" autocomplete="off"><hr>
						<div class="fieldname">Re-type Password</div>
						<input type="password" class="textinput" id="ca_password2" autocomplete="off"><hr><br>
						<div id="ca_captcha"></div>
						
						<input type="submit" class="submitinput" value="Create Account">
						<input type="button" class="submitinput" id="button_cancel" value="Cancel">
					</form>
					
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
					<input type="submit" class="submitinput" value="Sign In"> 
					<input type="button" class="submitinput" id="button_cancel" value="Cancel"><br>
					
				</form>
				<div style="height: 12px"></div>
				<a href="javascript:;" id="button_lostpassword">Forgot your password?</a><br>
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
			<div class="profile_content_loading_text"><div class="loader" id="loader_profile"></div></div>
			<center>
				<button id="profile_button_close" class="view_profile_button">Okay</button> 
				<span id="profile_selfbuttons" class="hidden">
					<button id="profile_button_edit" class="view_profile_button">Edit</button>
					<button id="profile_button_chgpassword" class="view_profile_button">Change password</button>
					<button id="profile_button_signout" class="view_profile_button">Sign Out</button>
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
		
		<template id="dialog_chgpassword">
			<div class="desc" id="dialog_desc">Change your password</div>
			
			<center>
				<div id="dialog_error" class="dialog_error"></div>
				<form id="form_chgpassword">
					<div class="fieldname">Current password</div>
					<input type="password" class="textinput" id="cp_current" autocomplete="off"><hr>
					<div class="fieldname">New Password</div>
					<input type="password" class="textinput" id="cp_password" autocomplete="off"><hr>
					<div class="fieldname">Re-type Password</div>
					<input type="password" class="textinput" id="cp_password2" autocomplete="off"><hr>
					<input type="submit" class="submitinput" value="Change Password">
					<input type="button" class="submitinput" id="button_cancel" value="Cancel">
				</form>
			</center>
		</template>
		
		<template id="dialog_lostpassword">
			<div class="title">Forgot your password?</div>
			<div style="margin-bottom:16px">
				If you signed up with an e-mail as your username, 
				you can sign in with a special ticket and then change your password. 
				
				If you didn't sign up with an e-mail address, you're best option is 
				to remember harder or make a new account.
			</div>
			<center><div id="dialog_error" class="dialog_error"></div></center>
			<center>
				<div id="dialog_error" class="dialog_error"></div>
				<form id="form_lostpassword">
					<div class="fieldname">E-mail</div>
					<input type="text" class="textinput" id="lp_email"><br>
					
					<input type="submit" class="submitinput" value="Send Ticket">
					<input type="button" class="submitinput" id="button_cancel" value="Cancel">
				</form>
			</center>
		</template>
		
		<template id="template_info">
			<div class="welcome">
				<div class="biglogo">
					<?php
					$svg = new \SVG( 'img/logo1.svg' );
					$svg->SetID( 'biglogo' );
					$svg->Output();?>
				</div>
				<h1>The Wordweb Project</h1>
				<p>The Wordweb is a creative resource that is built from human thoughts. 
				Since you're a human, you're able to contribute to the project! Simply type 
				in a word or phrase (a <i>thought</i>) in the above space, and then continue from there.
				Every thought you type in helps to build the database!</p>
				
				<p>To help even more, you can vote on existing <i>links</i>. 
				When you search for a thought, it might already have links associated with it. 
				If you can see a relation between a link's thought and the current thought
				you are on, you should give it an upvote. If you don't see a relation, then you should
				downvote it. Clicking on a link to follow it also gives it an upvote.</p>
				
				<p>Eventually, the Wordweb will grow into a massive database of relations between
				thoughts. It's kind of like a thesaurus, except with more than just synonyms. Actually, we aren't
				looking for synonyms—that's what a thesaurus is for! For an example of what we <i>are</i> looking for: 
				<i>baby</i> and <i>crib</i> are definitely not the same thing, but cribs are for babies! So, ideally, <i>baby </i>
				and <i>crib</i> should form a <i>strong link</i>!</p>
				
				<p>This only works if a lot of people contribute, so please tell your friends to put in a few words too!</p>
				
				<h3><i>"A crowdsourced brainstorm"!</i></h3>
				
				<div class="stats">
					<div class="linksfound" id="info_tlinks">Total links discovered: <span></span></div>
					<div class="linksfound" id="info_glinks">Good links discovered: <span></span></div>
					<div class="linksfound" id="info_slinks">Strong links discovered: <span></span></div>
				</div>
			</div>
		</template>
		
		<template id="template_newlink">
			<h2>What does {{query}} make you think of?</h2>
			<div class="newlink">
				<form id="newlinkform">
					<input type="text" autocomplete="off" id="newlink" maxlength="20">
					<div class="loader" id="loader_newlink"></div>
				</form>
			</div>
		</template>
	</body>
</html>
