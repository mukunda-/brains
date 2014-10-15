/*!
 * Copyright 2014 Mukunda Johnson
 */

// dialogs for viewing profile, editing profile, and changing password 
(function() { window.brains = window.brains || {};

var m_profile_data = null;

// a little something to save the poor soul who types a long bio
// that gets erased because the login session expired.
// this gets set before the request to save the profile, and if the 
// save fails, it is used to populate the edit profile dialog later on.
var m_edit_cache = null;

var m_loader = AsyncGroup.Create();

/** ---------------------------------------------------------------------------
 * Show the profile dialog
 *
 * @param int account ID of account to show profile for.
 * @param string Nickname Nickname to show, or undefined for unknown.
 * @param object preloaded Preloaded data, or undefined for unknown.
 */
function ShowProfileDialog( account, nickname, preloaded ) {
	brains.Dialog.Show( "profile" );
	InitProfileDialog( account, nickname, preloaded );
}

/** ---------------------------------------------------------------------------
 * Hook stuff and load the content.
 *
 * params are forwarded from ShowProfileDialog.
 */
function InitProfileDialog( account, nickname, preloaded ) {
	
	$("#dialog_desc").text( (account == brains.GetAccountID()) ? 
			"Your profile" : 
			"Profile for " + (isSet( nickname ) ? nickname : "...") );
			
	$("#profile_button_close").click( OnClickedCloseButton );
	$("#profile_button_edit").click( OnClickedEditButton );
	$("#profile_button_chgpassword").click( OnClickedPasswordButton );
	$("#profile_button_signout").click( OnClickedSignOut );
	
	function on_fail() {
		$("#dialog")
			.children( ".profile_content_loading_text" )
			.text( "error. please try again later." );
	}
	
	if( !preloaded ) {
	
		m_loader.AddAjax( $.get( "profile.php", { account: account } ) )
			
			.done( function( response ) {
				 
				try {
					if( response == "" ) throw "no data.";
					response = JSON.parse( response );
					if( response.status != "okay." ) throw "error.";
					
					OutputProfileContent( response.data );
					
				} catch( err ) {
					on_fail();
				}
			}).fail( function() {
				on_fail();
			});
	} else {
		OutputProfileContent( preloaded );
			
	}
//	if( self ) {
//		$("#profile_editbutton").removeClass( "hidden" );
//	}
}

/** ---------------------------------------------------------------------------
 * Formatter for a profile entry
 *
 * @param string entry_label The text to the left of the colon.
 * @param string entry_text The text to the right of the colon. 
 */
function ProfileEntryTemplate( entry_label, entry_text ) {
	return '<div class="profile_entry">' + entry_label + ": <span>" + entry_text + '</span></div>';
}

/** ---------------------------------------------------------------------------
 * Output a profile.php response to the profile dialog.
 *
 * @param object data Response data from profile.php, must be "okay." status.
 *                    (response data is "response.data")
 */
function OutputProfileContent( data ) {
	var target = $("#dialog").children( ".profile_content" );
	
	m_profile_data = data;
	
	var html = [];
	
	var text;
	html.push( ProfileEntryTemplate( "Nickname", data.nickname ) );
	if( data.realname != "" ) {
		html.push( ProfileEntryTemplate( "Real name", data.realname ) );
	}
	if( data.website != "" ) {
		html.push( ProfileEntryTemplate( "Website", data.website ) );
	}
	html.push( ProfileEntryTemplate( "Good links discovered", data.goods ) );
	html.push( ProfileEntryTemplate( "Strong links discovered", data.strongs ) );
	if( data.perfects != 0 ) {
		html.push( ProfileEntryTemplate( "Perfect links discovered", data.perfects ) );
	}
	if( data.bio != "" ) {
		html.push( ProfileEntryTemplate( "Bio", "<br>" + data.bio ) );
	}
	
	target.html( html.join("") );
	
	$('#dialog').children( ".profile_content_loading_text" ).remove();
	
	if( data.id == brains.GetAccountID() ) {
		$("#profile_selfbuttons").removeClass( "hidden" );
	}
}

/** ---------------------------------------------------------------------------
 * Callback for when the Okay button is pressed in the View Profile dialog.
 */
function OnClickedCloseButton() {
	m_loader.ClearAll();
	brains.Dialog.Close();
}


/** ---------------------------------------------------------------------------
 * Callback for when the Edit button is pressed in the View Profile dialog.
 */
function OnClickedEditButton() {
	brains.Dialog.Show( "editprofile" );
	InitEditProfileDialog();
}

/** ---------------------------------------------------------------------------
 * Callback for when the Change Password button is pressed in the 
 * View Profile dialog.
 */
function OnClickedPasswordButton() {
	brains.Dialog.Show( "chgpassword" );
	InitChangePasswordDialog();
}

/** ---------------------------------------------------------------------------
 * When the user presses Sign Out
 */
function OnClickedSignOut() {
	brains.Dialog.Lock();
	$.get( "logout.php" )
		.done( function( data ) {
			
			brains.Dialog.Unlock();
			if( data == "" ) { // if data != "" then an error occurred.
				brains.SetLoggedIn( false );
				brains.Dialog.Close();
			}
		})
		.fail( function() {
			brains.Dialog.Unlock();
		});
}

/** ---------------------------------------------------------------------------
 * Initializer for the Edit Profile dialog.
 */
function InitEditProfileDialog() {
	$("#button_save").click( OnEditProfileSave );
	$("#button_cancel").click( OnEditProfileClose );
	
	if( m_edit_cache === null ) {
		$("#text_nickname").val( m_profile_data.nickname );
		$("#text_realname").val( m_profile_data.realname );
		$("#text_website").val( m_profile_data.website );
		$("#text_bio").text( m_profile_data.bio );
	} else {
		// simple and effective.
		$("#text_nickname").val( m_edit_cache.nickname );
		$("#text_realname").val( m_edit_cache.realname );
		$("#text_website").val( m_edit_cache.website );
		$("#text_bio").text( m_edit_cache.bio );
	}
}

/** ---------------------------------------------------------------------------
 * Callback for when the Save button is clicked in the Edit Profile dialog.
 */
function OnEditProfileSave() {
	// validate input.
	var nickname = brains.ReadDialogField( "text_nickname", "nickname" );
	if( nickname === false ) return;
	var realname = brains.ReadDialogField( "text_realname", "realname" );
	if( realname === false ) return;
	var website = brains.ReadDialogField( "text_website", "website" );
	if( website === false ) return;
	var bio = brains.ReadDialogField( "text_bio", "bio" );
	if( bio === false ) return;
	
	var post = {
		nickname: nickname, 
		realname: realname, 
		website: website, 
		bio: bio,
		ctoken: brains.CToken()
	};
	
	m_edit_cache = post; 
	
	brains.Dialog.Lock();
	$.post( "editprofile.php", post )
		.done( function( data ) {
			brains.Dialog.Unlock();
			try {
				if( data == "" ) throw "No data.";
				data = JSON.parse( data ); 
				
				switch( data.status ) {
					case "login.":
						brains.SetLoggedIn( false );
						brains.ShowLoginDialog( "Your session expired." );
						return;
					case "okay.":
						ShowProfileDialog( brains.GetAccountID(), nickname, { 
								id: brains.GetAccountID(),
								nickname: nickname, 
								realname: realname, 
								website: website, 
								bio: bio, links: 
								m_profile_data.links, 
								strongs: m_profile_data.strongs, 
								perfects: m_profile_data.perfects 
							});
						brains.SetNickname( nickname );
						m_edit_cache = null; 
						return;
					default:
					case "error.":
						brains.Dialog.Unlock();
						throw "Error.";
				}
			} catch( err ) {
				brains.Dialog.ShowError( "An error occurred. Please try again." );
			}
		})
		.fail( function() {
			brains.Dialog.Unlock();
			brains.Dialog.ShowError( "An error occurred. Please try again." );
		})
}

/** ---------------------------------------------------------------------------
 * Callback for when Cancel is clicked in the edit profile dialog.
 */
function OnEditProfileClose() {
	brains.Dialog.Close();
}

/** ---------------------------------------------------------------------------
 * Initializer for the Change Password dialog.
 */
function InitChangePasswordDialog() {
	$("#form_chgpassword").submit( function() {
		OnChangePasswordSubmit();
		return false;
	});
	
	$("#button_cancel").click( OnChangePasswordCancel );
}

/** ---------------------------------------------------------------------------
 * Callback for when "Change Password" is clicked, or the form is submitted.
 */
function OnChangePasswordSubmit() {
	var current = brains.ReadDialogField( "cp_current", "password" );
	if( current === false ) return;
	var desired = brains.ReadDialogField( "cp_password", "password" );
	if( desired === false ) return;
	var verify = $("#cp_password2").val();
		
	if( verify != desired ) {
		brains.Dialog.ShowError( "The passwords you entered didn't match." );
		$("#cp_password").val("");
		$("#cp_password2").val("");
		brains.Dialog.MarkErrorField( "cp_password" );
		brains.Dialog.MarkErrorField( "cp_password2" );
		return;
	}

	current = Soup( current, brains.GetUsername() );
	desired = Soup( desired, brains.GetUsername() );
	 
	brains.Dialog.Lock();
	$.post( "changepassword.php", {
					ctoken: brains.CToken(),
					current: current,
					"new": desired })		
		.done( function( data ) {
			brains.Dialog.Unlock();
		 
			switch( data ) {
			case "login.":
				brains.SetLoggedIn( false );
				alert( "Your session expired. Cannot change password." );
				brains.Dialog.Close();
				return;
			case "invalid.":
				
				$("#cp_current").val("");
				brains.Dialog.ShowError( "That wasn't your current password." );
				brains.Dialog.MarkErrorField( "cp_current" );
				return;
			case "okay.":
				alert( "Your password has been updated." );
				brains.Dialog.Close();
				return;
			default:
			case "error.":
				alert( "An error occurred. Please try again later." );
				return;
			}
		})
		.fail( function() {
			brains.Dialog.Unlock();
			alert( "An error occurred. Please try again later." );
			return;
		});
}

/** ---------------------------------------------------------------------------
 * Callback for when Cancel is clicked in the change password dialog.
 */
function OnChangePasswordCancel() {
	brains.Dialog.Close();
}

//-----------------------------------------------------------------------------
brains.ShowProfileDialog = ShowProfileDialog;

})();