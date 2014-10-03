/*!
 * Copyright 2014 Mukunda Johnson
 */

(function() { window.brains = window.brains || {};

brains.Dialog = this;

var m_init_function = null;

/** ---------------------------------------------------------------------------
 * Show the dialog box.
 *
 * @param string name Dialog box name to display.
 */
this.Show = function( name ) {

	m_init_function = null;
	$("#dialog").html( $("#dialog_" + name).html() );
	$("#overlay").addClass( 'show' );
	if( m_init_function !== null ) {
		m_init_function();
	}
	
}

/** ---------------------------------------------------------------------------
 * Close the dialog box.
 */
this.Close = function() {
	$("#overlay").removeClass( 'show' );
	$("#dialog").html( "" );
}

/** ---------------------------------------------------------------------------
 * Set the function to execute after the dialog contents are loaded.
 *
 * This must be done in a script inside the dialog template.
 */
this.SetInit = function( f ) {
	m_init_function = f;
}

function Login_OnSubmit() {
	var username = $("#text_username").text();
	var password = $("#text_password").text();
	username = username.trim();
	if( username == "" ) {
		$("#error").text( "Enter a username." );
		return;
	}
	////if( 
	////$.post( 
	return false;
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
 * Initializer for the Create Account dialog.
 */
this.InitCreateAccountDialog = function() {
	$("#form_createaccount").submit( function() {
	
		return false;
	});
}

})();