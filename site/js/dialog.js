/*!
 * Copyright 2014 Mukunda Johnson
 */

(function() { window.brains = window.brains || {};

brains.Dialog = this;
var m_dialog = this;

var m_init_function = null;
var m_locked = false;



var ca_loading_captcha;

/** ---------------------------------------------------------------------------
 * Show the dialog box.
 *
 * @param string name Dialog box name to display.
 */
function Show( name ) {
	m_locked = false;
	m_init_function = null;
	$("#dialog").html( $("#dialog_" + name).html() );
	$("#overlay").addClass( 'show' );
	if( m_init_function !== null ) {
		m_init_function();
		
		// hook error highlighter
		$("#dialog").find( ".textinput" ).keyup( function() {
			$(this).removeClass( "error" );
		} );
	}
	
} this.Show = Show;

/** ---------------------------------------------------------------------------
 * Close the dialog box.
 */
function Close() {
	if( m_locked ) return; // can't close a locked dialog.
	$("#overlay").removeClass( 'show' );
	$("#dialog").html( "" );
	
} this.Close = Close;

/** ---------------------------------------------------------------------------
 * Set the function to execute after the dialog contents are loaded.
 *
 * This must be done in a script inside the dialog template.
 */
function SetInit( f ) {
	m_init_function = f;
} this.SetInit = SetInit;

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
		product = Sha256.hash( product + salt );
		// salty
	}
	
	// version
	product = "$1" + product;
	return product;
}

/** ---------------------------------------------------------------------------
 * Lock the dialog box, preventing interaction until a process has completed.
 *
 * Must be unlocked later with Unlock().
 */
function Lock() {
	if( m_locked ) return;
	m_locked = true;
	dialog = $("#dialog");
	dialog.find( "input" ).attr( "disabled", "disabled" );
	
} this.Lock = Lock;

/** ---------------------------------------------------------------------------
 * Unlock the dialog box, allowing interaction or closing.
 */
function Unlock() {
	if( !m_locked ) return;
	m_locked = false;
	dialog = $("#dialog");
	dialog.find( "input" ).removeAttr( "disabled" );
	
} this.Unlock = Unlock;

/** ---------------------------------------------------------------------------
 * Display an error, #dialog_error must be defined.
 *
 * @param string error The error text to display.
 */
function ShowError( error ) {
	var div = $("#dialog_error");
	div.text( error )
		.removeClass( "visible" )
	setTimeout( function() {
		div.addClass("visible");
	}, 50 );
}

/** ---------------------------------------------------------------------------
 * Mark a field as errornous.
 *
 * @param string id ID of input element.
 */
function MarkErrorField( id ) {
	$("#"+id).addClass( "error" )
		.focus();
}

/** ---------------------------------------------------------------------------
 * Initializer for the Login dialog.
 */
this.InitLoginDialog = function() {
	
	$("#text_username").focus();
	$("#button_createaccount").click( function() {
		brains.Dialog.Show( "createaccount" );
	});
	$("#form_login").submit( Login_OnSubmit );
}

/** ---------------------------------------------------------------------------
 * Check if a string contains only valid characters.
 *
 * @param string string String to check.
 */
function StringIsValid( string ) {
	return string.match( /^[\x20-\x7E]+$/ );
}

/** ---------------------------------------------------------------------------
 * Callback for #form_login.submit
 */
function Login_OnSubmit() {

	var username = $("#text_username").val();
	var password = $("#text_password").val();
	username = username.trim();
	if( username == "" ) {
		ShowError( "Username cannot be blank." );
		MarkErrorField( "ca_username" );
		return false;
	}
	if( !StringIsValid( username ) ) {
		ShowError( "Username is not valid." );
		MarkErrorField( "ca_username" );
		return false;
	}
	if( password == "" ) {
		ShowError( "Password cannot be blank." );
		MarkErrorField( "ca_password" );
		return false;
	}
	if( !StringIsValid( password ) ) {
		ShowError( "Password is not valid." );
		MarkErrorField( "ca_password" );
		return false;
	}
	
	password = Fubar( password, username );
	
	Lock();
	
	post = {
		'username': username,
		'password': password
	};
	
	if( $("#check_rememberme").prop( 'checked' ) ) {
		post.rememberme = 1;
	}

	$.post( "login.php", post )
		.done( function( data ) {
			Unlock();
			alert(data);
			switch( data ) {
				
				case "invalid.":
					ShowError( "Invalid username or password." );
					break;
				case "okay.":
					// todo LOGIN.
					Close();
					break;
					
				default:
				case "error.":
					ShowError( "An error occurred, please try again later." );
					break;
			}
		})
		.fail( function() {
			Unlock();
			ShowError( "An error occurred, please try again later." );
		});
	return false;
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
 * Initializer for the Create Account dialog.
 */
this.InitCreateAccountDialog = function() {
	
	if( !brains.IsCaptchaValidated() ) {
		ShowCaptcha();
		
		/*
		$.post( "getcaptcha.php" )
			.done( function( data ) {
				alert(data);
				$("#ca_captcha").html( data );
			})
			.fail( function( data ) {
				$("#ca_captcha").html( "couldn't obtain captcha, please reload the page." );
			});*/
	}
	$("#form_createaccount").submit( CreateAccount_OnSubmit );
}

/** --------------------------------------------------------------------------- 
 * Read a field from the dialog with trimming and validation.
 *
 * @param int id      ID of element to read
 * @param string name Friendly name to display in errors.
 * @param bool trim   Default=true, trim the input string.
 */
function ReadField( id, name, trim ) {
	if( !isSet(trim) ) trim = true;
	var value = $("#"+id).val();
	if( trim ) value = value.trim();
	if( value == "" ) {
		ShowError( name + " cannot be blank." );
		MarkErrorField( id );
		return false;
	}
	if( !StringIsValid( value ) ) {
		ShowError( name + " contains invalid characters." );
		MarkErrorField( id );
		return false;
	}
	return value;
}

/** --------------------------------------------------------------------------- 
 * Callback for #form_createaccount.submit
 */
function CreateAccount_OnSubmit() {
	
	var nickname = ReadField( "ca_nickname", "Nickname" );
	if( nickname === false ) return false;
	var username = ReadField( "ca_username", "Username" );
	if( username === false ) return false; 
	var password = ReadField( "ca_password", "Password", false );
	if( password === false ) return false;
	var password2 = $("#ca_password2").val();
	if( password2 !== password ) {
		ShowError( "The passwords you entered didn't match." );
		MarkErrorField( "ca_password" );
		MarkErrorField( "ca_password2" );
		$("#ca_password").val("");
		$("#ca_password2").val("");
		return false;
	}
	
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
	
	Lock();
	
	$.post( "login.php", post )
		.done( function( data ) {
			Unlock();
			alert(data);
			switch( data ) {
				case "error.":
					ShowError( "An error occurred. Please try again later." );
					break;
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
					MarkErrorField( "ca_username" );
					break;
				case "okay.":
					break;
			}
		})
		.fail( function() {
			
			Unlock();
			ShowError( "An error occurred, please try again later." );
		});
	
	return false;
}

})();
