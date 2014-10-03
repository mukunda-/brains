/*!
 * Copyright 2014 Mukunda Johnson
 */

(function() { window.brains = window.brains || {};

brains.Dialog = this;
var m_dialog = this;

var m_init_function = null;
var m_locked = false;


/** ---------------------------------------------------------------------------
 * Show the dialog box.
 *
 * @param string name Dialog box name to display.
 */
function Show( name ) {

	m_init_function = null;
	$("#dialog").html( $("#dialog_" + name).html() );
	$("#overlay").addClass( 'show' );
	if( m_init_function !== null ) {
		m_init_function();
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
	while( salt.length < 32 ) {
		salt += salt;
	}
	product = Sha256.hash( password );
	
	// recommended 15000+ iterations for 2014 :(
	for( var i = 0; i < 100; i++ ) { 
		product = Sha256.hash( product + salt );
		// salty
	}
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
		return false;
	}
	if( !StringIsValid( username ) ) {
		ShowError( "Username is not valid." );
		return false;
	}
	if( password == "" ) {
		ShowError( "Password cannot be blank." );
		return false;
	}
	if( !StringIsValid( password ) ) {
		ShowError( "Password is not valid." );
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
 * Initializer for the Create Account dialog.
 */
this.InitCreateAccountDialog = function() {
	$("#form_createaccount").submit( CreateAccount_OnSubmit );
}

/** --------------------------------------------------------------------------- 
 * Callback for #form_createaccount.submit
 */
function CreateAccount_OnSubmit() {
	
	return false;
}

})();