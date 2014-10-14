/*!
 * Copyright 2014 Mukunda Johnson
 */
 
(function() { window.brains = window.brains || {};

var m_profile_data = null;

var m_loader = AsyncGroup.Create();

/** ---------------------------------------------------------------------------
 * Show the profile dialog
 *
 * @param int account ID of account to show profile for.
 */
function ShowProfileDialog( account, self ) {
	brains.Dialog.Show( "profile" );
	InitProfileDialog( account, self );
}

/** ---------------------------------------------------------------------------
 * Hook stuff and load the content.
 */
function InitProfileDialog( account, self ) {
	$("#dialog_desc").text( self ? "Your profile" : "Profile for ..." );
	$("#profile_button_close").click( OnClickedCloseButton );
	$("#profile_button_edit").click( OnClickedEditButton );
	
	function on_fail() {
		$("#dialog").children( ".profile_content_loading_text" ).text( "error. please try again later." );
	}
	
	m_loader.AddAjax( $.get( "profile.php", { account: account } ) )
		
		.done( function( response ) {
			alert(response);
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
	html.push( ProfileEntryTemplate( "Links discovered", data.links ) );
	html.push( ProfileEntryTemplate( "Strong links discovered", data.strongs ) );
	if( data.perfects != 0 ) {
		html.push( ProfileEntryTemplate( "Perfect links discovered:", data.perfects ) );
	}
	if( data.bio != "" ) {
		html.push( ProfileEntryTemplate( "Bio", data.bio ) );
	}
	
	target.html( html.join("") );
	
	$('#dialog').children( ".profile_content_loading_text" ).remove();
	
	if( data.id == brains.GetAccountID() ) {
		$("#profile_selfbuttons").removeClass( "hidden" );
	}
}

//-----------------------------------------------------------------------------
function OnClickedCloseButton() {
	m_loader.ClearAll();
	brains.Dialog.Close();
}

//-----------------------------------------------------------------------------
function OnClickedEditButton() {
	brains.Dialog.Show( "editprofile" );
	InitEditProfileDialog();
}

//-----------------------------------------------------------------------------
function InitEditProfileDialog() {
	$("#button_save").click( OnEditProfileSave );
	$("#button_cancel").click( OnEditProfileClose );
	
	$("#text_nickname").val( m_profile_data.nickname );
	$("#text_realname").val( m_profile_data.realname );
	$("#text_website").val( m_profile_data.website );
	$("#text_bio").text( m_profile_data.bio );
}

//-----------------------------------------------------------------------------
function OnEditProfileSave() {
	// validate input.
	
	
	brains.Dialog.Lock();
}

//-----------------------------------------------------------------------------
function OnEditProfileClose() {
	brains.Dialog.Close();
}

//-----------------------------------------------------------------------------
brains.ShowProfileDialog = ShowProfileDialog;

})();