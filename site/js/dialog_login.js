/*!
 * Copyright 2014 Mukunda Johnson
 */
 
// Login and Create account dialogs.
 
(function() { window.brains = window.brains || {};

var m_on_login;

/** ---------------------------------------------------------------------------
 * Mangle a password with seasoning.
 *
 * @param string salt     Salt to apply to the password.
 * @param string password Password to mangle.
 */
function Fubar( password, salt ) {

	// fine process the salt
	while( salt.length < 32 ) {
		salt += salt;
	}
	salt = Sha256.hash( salt );
	
	product = Sha256.hash( password );
	
	// recommended 15000+ iterations for 2014 :(
	for( var i = 0; i < 100; i++ ) { 
	
		// heh heh. this oughta throw off them GPUs
		if( i == 3 ) {
			product += "potato";
		} else if( i == 29 ) {
			product += "gerbil";
		} else if( i == 71 ) {
			product += "fluff";
		}
		product = Sha256.hash( product + salt );
		// salty
	}
	
	// version
	product = "$2" + product;
	return product;
}

/** ---------------------------------------------------------------------------
 * Show the login dialog box.
 *
 * @param function() on_login 
 *                     Function to call after the user logs
 *                     in or creates an account.
 */
function ShowLoginDialog( reason, on_login ) {
	m_on_login = on_login;
	brains.Dialog.Show( "login" );
	InitLoginDialog( reason );
}

/** ---------------------------------------------------------------------------
 * Initializer for the Login dialog.
 */
function InitLoginDialog( reason ) {
	
	$("#text_username").focus();
	$("#button_createaccount").click( function() {
		brains.Dialog.Show( "createaccount"  );
		InitCreateAccountDialog();
	});
	$("#button_cancel").click( function() {
		brains.Dialog.Close();
	});
	$("#form_login").submit( Login_OnSubmit );
	
	if( reason != "" ) {
		$("#dialog_desc").text( reason );
	} else {
		$("#dialog_desc").remove();
	}
}

/** ---------------------------------------------------------------------------
 * Callback for #form_login.submit
 */
function Login_OnSubmit() {

	var username = brains.ReadDialogField( "text_username", "username" );
	if( username === false ) return false;
	var password = brains.ReadDialogField( "text_password", "password" );
	if( password === false ) return false;
	
	password = Fubar( password, username );
	
	brains.Dialog.Lock();
	
	post = {
		'username': username,
		'password': password
	};
	
	if( $("#check_rememberme").prop( 'checked' ) ) {
		post.remember = 1;
	}

	$.post( "login.php", post )
		.done( function( data ) {
			brains.Dialog.Unlock();
			alert(data);
			try {
				if( data == "" ) throw "No data.";
				data = JSON.parse( data );
				
				switch( data.status ) {
					
					case "invalid.":
						ShowError( "Invalid username or password." );
						break;
					case "okay.":
						brains.SetLoggedIn( true, data.data.username, 
						                          data.data.accountid );
						Close();
						if( m_on_login ) {
							m_on_login();
						}
						break;
						
					default:
					case "error.":
						throw "Error.";
				}
			} catch( err ) {
				ShowError( "An error occurred. Please try again later." );
				return;
			}
		})
		.fail( function() {
			brains.Dialog.Unlock();
			ShowError( "An error occurred, please try again later." );
		});
	return false;
}

/** ---------------------------------------------------------------------------
 * Initializer for the Create Account dialog.
 */
function InitCreateAccountDialog() {
	
	if( !brains.IsCaptchaValidated() ) {
		ShowCaptcha();
	}
	$("#form_createaccount").submit( CreateAccount_OnSubmit );
	$("#button_cancel").click( function() {
		brains.Dialog.Close();
	});
}

/** ---------------------------------------------------------------------------
 * Display the captcha field in the CreateAccount dialog.
 *
 * @param bool focus Focus the captcha response field when it loads.
 */
function ShowCaptcha( focus ) {

	var recaptcha_public_key = "6LdsGvsSAAAAAP1H8FgcBG-KrIkswRWe90I8oUqU";
	function CreateCaptcha() {
		
		if( $("#recaptcha_challenge_field").length == 0 ) {
			var options = {theme:"red"};
			if( focus ) {
				options.callback = Recaptcha.focus_response_field;
			}
			Recaptcha.create(
				recaptcha_public_key, // public key
				"ca_captcha",
				options
			);
			
		} else {
			// if the captcha field already exists, just reload() it 
			Recaptcha.reload();
			
			if( focus ) {
				Recaptcha.focus_response_field();
			}
		}
	}

	// if Recaptcha doesn't exist, we need to load it.
	if( typeof Recaptcha === "undefined" ) {
		$.getScript( "http://www.google.com/recaptcha/api/js/recaptcha_ajax.js" )
			.done( function() {
				CreateCaptcha(); 
			})
			.fail( function() {
				$("#ca_captcha").html( "couldn't obtain captcha, please reload the page." );
			});
	} else {
		// otherwise just create the captcha.
		CreateCaptcha();
	}
}


/** --------------------------------------------------------------------------- 
 * Callback for #form_createaccount.submit
 */
function CreateAccount_OnSubmit() {
	
	var nickname = brains.ReadDialogField( "ca_nickname", "nickname" );
	if( nickname === false ) return false;
	var username = brains.ReadDialogField( "ca_username", "username" );
	if( username === false ) return false; 
	var password = brains.ReadDialogField( "ca_password", "password" );
	if( password === false ) return false;
	var password2 = $("#ca_password2").val();
	if( password2 !== password ) {
		ShowError( "The passwords you entered didn't match." );
		$("#ca_password").val("");
		$("#ca_password2").val("");
		brains.Dialog.MarkErrorField( "ca_password" );
		brains.Dialog.MarkErrorField( "ca_password2" );
		return false;
	}
	
	password = Fubar( password, username );
	
	var post = {
		"nickname": nickname,
		"username": username,
		"password": password,
		"create": 1
	};
	
	if( !brains.IsCaptchaValidated() ) {
		var recaptcha_response = $("#recaptcha_response_field").val();
		if( recaptcha_response == "" ) {
			ShowError( "Please fill out the captcha." );
			Recaptcha.focus_response_field();
			return false;
		}
		post.recaptcha_response_field = recaptcha_response;
		post.recaptcha_challenge_field = $("#recaptcha_challenge_field").val();
	}
	
	brains.Dialog.Lock();
	
	$.post( "login.php", post )
		.done( function( data ) {
			brains.Dialog.Unlock();
			alert(data);
			
			try {
				if( data == "" ) throw "No data.";
				data = JSON.parse( data );
			
				switch( data.status ) { 
					case "error.":
					default:
						throw "Error.";
					case "captcha.":
						if( brains.IsCaptchaValidated() ) {
							brains.SetCaptchaValidated( false );
							ShowError( "Please fill out the CAPTCHA." );
						} else {
							ShowError( "Invalid CAPTCHA please try again." );
						}
						ShowCaptcha( true );
						break;
					case "exists.":
						$("#ca_captcha").html("");
						ShowError( "That username is already taken." );
						brains.Dialog.MarkErrorField( "ca_username" );
						break;
					case "okay.":
						brains.SetLoggedIn( true, data.data.username, 
						                          data.data.accountid );
						Close();
						brains.SetCaptchaValidated(false);
						
						if( m_on_login ) {
							m_on_login();
						}
						break;
				}
			
			} catch( err ) {
				ShowError( "An error occurred. Please try again later." );
				return;
			}
		})
		.fail( function() {
			
			brains.Dialog.Unlock();
			ShowError( "An error occurred, please try again later." );
		});
	
	return false;
}


brains.ShowLoginDialog = ShowLoginDialog;

})();