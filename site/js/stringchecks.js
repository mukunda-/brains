/*!
 * Copyright 2014 Mukunda Johnson
 */
(function() {

/** ---------------------------------------------------------------------------
 * Tests if a given string is a valid "Normal" string.
 *
 * This is for testing for a valid username or nickname, basically doesn't
 * allow certain special characters.
 *
 * @param  string string Input to test.
 * @return bool           TRUE if valid.
 */
 /*
function IsNormalString( string ) {
	return string.match( /^[a-zA-Z0-9 _+=~,.@#-]+$/ );
}*/

/** ---------------------------------------------------------------------------
 * Tests if a given string is valid for a password field.
 *
 * Allows any "real" ascii character, not control codes or characters values
 * past 126.
 *
 * @param  string string Input to test.
 * @return bool          TRUE if valid.
 */
 /*
function IsValidPassword( string ) {
	return string.match( /^[\x20-\x7E]+$/ );
}*/

var max_string_lengths = { 
	"username": 255, "nickname": 64, "realname": 64, 
	"password":1024, "website": 128, "bio": 32000 
};

var friendly_names = { 
	"username": "Username/E-mail", "nickname": "Nickname", 
	"realname": "Real name", "password": "Password", 
	"website": "Website", "bio": "Bio"
};

/** --------------------------------------------------------------------------- 
 * Read a field from a dialog with trimming and validation.
 *
 * @param int id      ID of element to read
 * @param string name Name of the field being read.
 *                    can be: "username", "nickname", "realname",
 *                    "password", "website", or "bio"
 */
function ReadDialogField( id, name ) {
	if( !max_string_lengths.hasOwnProperty( name ) ) {
		throw "invalid field type.";
	}
	var value = $("#"+id).val();
	if( name != "password" ) value = value.trim();
	
	if( value == "" ) {
		if( name == "username" || name == "nickname" ||
			name == "password" ) {
			brains.Dialog.ShowError( friendly_names[name] + 
										" cannot be blank." );
										
			brains.Dialog.MarkErrorField( id );
		}
		return false;
	}
	/*
	var valid = password ? brains.IsValidPassword( value ) : 
						   brains.IsNormalString( value );
	if( !valid ) {
		ShowError( name + " contains invalid characters." );
		MarkErrorField( id );
		return false;
	}*/
	
	// max length
	if( value.length > max_string_lengths[name] ) {
		brains.Dialog.ShowError( friendly_names[name] + 
									" is too long." );
									
		brains.Dialog.MarkErrorField( id );
		return false;
	}
	
	return value;
}

window.brains = window.brains || {};
brains.ReadDialogField = ReadDialogField;
//brains.IsNormalString = IsNormalString;
//brains.IsValidPassword = IsValidPassword;

})()