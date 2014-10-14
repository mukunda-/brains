/*!
 * Copyright 2014 Mukunda Johnson
 */
 
// Login and Create account dialogs.
 
(function() { window.brains = window.brains || {};

var m_on_login;

/** ---------------------------------------------------------------------------
 * Cook a soup.
 *
 * @param string recipe Recipe to follow.
 * @param string seasoning Special seasoning to apply.
 */
function Soup( recipe, seasoning ) {
	seasoning = Sha256.hash( seasoning );
	
	// lets get started
	soup = Sha256.hash( recipe );
	
	// i think they actually recommended 15000 iterations for 2014
	// we dont have all day though.
	var cooking_time = 100;
	
	// the recipe might require some extra time, but the customer 
	// has things to do and we can only cook their soup for so long
	var max_extra_time = 40;
	
	while( cooking_time > 0 ) {
	
		// heh heh. this oughta throw off them GPUs
		if( soup[0] == "1" ) {
			soup += "potato"; // more potato
		} else if( soup[1] == "5" ) {
			soup += "black pepper"; // more black pepper
		} else if( soup[1] == "6" ) {
			soup += "SALT"; // more salt
		} else if( soup[13] == "9" ) {
			soup += "carrots"; // more carrots
		} else if( soup[2] == "2" ) {
			soup = "broccoli" + soup; // who puts broccoli in soup
		} else if( soup[4] == "4" ) {
			soup += "noodles"; // i could use some noodles right now
		}
		
		if( soup[8] == "7" ) {
			soup += "tumeric"; // dont get it on your clothes
		} else if( soup[5] == "2" ) {
			soup = "asafoetida" + soup; //  the dried latex exuded from the rhizome or tap root of several species of Ferula, a perennial herb that grows 1 to 1.5 m tall
		} else if( soup[0] == "3" ) {
			soup += "cilantro"; // coriander leaves
		}
		
		if( soup[0] == "4" ) {
			soup += "cumin" // get that flavor in there
		} else if( soup[3] == "9" ) {
			soup += "coriander"; // balance out the cumin
		} else if( soup[6] == "3" && soup[0] == "7" ) {
			soup += "gerbil"; // the secret ingredient
		}
		
		if( soup[1] == "1" || soup[2] == "2" || soup[3] == "3"
			|| soup[4] == "4" || soup[5] == "5" || soup[6] == "6" ) {
			
			soup += seasoning; // salty
		}
		
		// cook
		soup = Sha256.hash( soup );
		
		if( soup[0] == "5" ) {
			// not cooked enough
			if( max_extra_time ) {
				max_extra_time--;
				continue;
			}
		}
		
		cooking_time--;
	}
	
	// tag
	soup = "$3" + soup;
	
	// Delicious~
	return soup;
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
	
	password = Soup( password, username );
	
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
						brains.Dialog.ShowError( "Invalid username or password." );
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
				brains.Dialog.ShowError( "An error occurred. Please try again later." );
				return;
			}
		})
		.fail( function() {
			brains.Dialog.Unlock();
			brains.Dialog.ShowError( "An error occurred, please try again later." );
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
		brains.Dialog.ShowError( "The passwords you entered didn't match." );
		$("#ca_password").val("");
		$("#ca_password2").val("");
		brains.Dialog.MarkErrorField( "ca_password" );
		brains.Dialog.MarkErrorField( "ca_password2" );
		return false;
	}
	
	password = Soup( password, username );
	
	var post = {
		"nickname": nickname,
		"username": username,
		"password": password,
		"create": 1
	};
	
	if( !brains.IsCaptchaValidated() ) {
		var recaptcha_response = $("#recaptcha_response_field").val();
		if( recaptcha_response == "" ) {
			brains.Dialog.ShowError( "Please fill out the captcha." );
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
							brains.Dialog.ShowError( "Please fill out the CAPTCHA." );
						} else {
							brains.Dialog.ShowError( "Invalid CAPTCHA please try again." );
						}
						ShowCaptcha( true );
						break;
					case "exists.":
						$("#ca_captcha").html("");
						brains.Dialog.ShowError( "That username is already taken." );
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
				brains.Dialog.ShowError( "An error occurred. Please try again later." );
				return;
			}
		})
		.fail( function() {
			
			brains.Dialog.Unlock();
			brains.Dialog.ShowError( "An error occurred, please try again later." );
		});
	
	return false;
}


brains.ShowLoginDialog = ShowLoginDialog;

})();