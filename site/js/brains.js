/*!
 * Copyright 2014 Mukunda Johnson
 */
 
(function() { window.brains = window.brains || {};

console.log( 'hi' );

var current_button = null;

var m_vertical;

//var s_nav;
//var s_navboxes;
//var s_navphrases;
//var s_navarrows;

var m_async = AsyncGroup.Create();

var m_logged_in;
var m_account;
var m_username;
var m_captcha_validated;

var m_current_thought = null;

var s_thoughts;
var s_votebuttons;
 
/** ---------------------------------------------------------------------------
 * Adjust the size of a thought based on its text length.
 *
 * (e.g. scale down the text if it is very long.)
 */
function AdjustThoughtSize() {
	var e = $(this);
	var length = $("#magicbox2").text( e.text() ).innerWidth();
	console.log( "ajs - " + length );
	if( length < 240 ) {
			
	} else {
		
		var factor = Math.max( (240/length), 0.75 );
		
		var size = Math.floor(24 * factor);
		e.css( "font-size", size + "px" );
	}
	
} 
 
/** ---------------------------------------------------------------------------
 * Adjust the size of all thoughts based on their text length.
 *
 * (e.g. scale down the text if it is very long.)
 */
function AdjustThoughtSizes() {
	$("#links").children(".thought span").each( AdjustThoughtSize ); 
}

/** ---------------------------------------------------------------------------
 * Adjust sizes and positioning of elements according to the new
 * window dimensions.
 */
function AdjustSizes() {
	 
	var width = $(window).width(); 
	$("#newlink").css( "max-width", (width - 80 - 14) + "px" );
	
	
	var disc = $("#discovery");
	disc.css( "max-width", (width - 128 - 14) + "px" );
	// i cannot believe this isn't feasible with css
	disc.children(".score").css( "top", ((disc.height() + 5) / 2 - 17) + "px" );
	//$("#view").height( $(window).height() - 48 + "px" );
}


/** ---------------------------------------------------------------------------
 * Adjust window sizes when the user resizes or zooms his screen.
 */
$(window).resize( function() {
	AdjustSizes()
});

/** ---------------------------------------------------------------------------
 * On global key-down.
 */
$(window).keydown( function(e) {

/*
	// make escape close the dialog box.
	if( e.keyCode == 27 ) {
		brains.Dialog.Close();
	}*/
	return true;
});

/** ---------------------------------------------------------------------------
 * Make the mousewheel scroll the page.
 */
$(window).bind( "mousewheel", function( ev, delta ) {
	
	// idk how this got made lol.
	var scrollTop = $(window).scrollTop() - Math.round( delta )*51;
	
	$(window).scrollTop( scrollTop - Math.round( delta )*51 ); 
}); 

/** ---------------------------------------------------------------------------
 * Expand the newlink input box according to the text in it.
 */
function AdjustNewLinkInputSize() {
	var newlink = $("#newlink");
	$("#magicbox3").text( newlink.val() );
		var width = $("#magicbox3").width();
	
		newlink.width( width );
}

function FilterThoughtKeys( e ) {
	if( (e.which >= 65 && e.which <= 90)  // A-Z
		|| (e.which >= 97 && e.which <= 122) // a-z
		|| e.which <= 32 ) { // space and control characters
		
		return true;
	}
	
	return false;
}

$( function() {
	// content initialization. 
	
	AdjustNewLinkInputSize();
	
	AdjustSizes();
	AdjustThoughtSizes();
	
	
	setTimeout(  // god i fucking hate the web.
		function () {
			
			AdjustSizes();
			AdjustThoughtSizes();
		}, 100 );
	 
	$(window).mouseup( function( e ) {
		if( current_button != null ) {
			current_button.removeClass( "held" );
		}
		
	} );
	$(".thought").click( function( e ) {
		
		
	});
	 
	$("#queryform").submit( function() {
		OnNewQuery();
		return false;
	});
	
	$("#queryform").keypress( FilterThoughtKeys );
	
	$("#user").click( function( e ) {
		if( m_logged_in ) {
			brains.Dialog.Show( "profile" );
		} else {
			brains.ShowLoginDialog( "Please log in." );
		}
	});
	
	$("#overlay").click( function() {
		brains.Dialog.Close();
	});
	$("#dialog").click( function( e) {
		e.stopPropagation();
	});
	
	//brains.Dialog.Show( "login" );
});

/** ---------------------------------------------------------------------------
 * Content generator for the newlink block.
 *
 * @param array out Output html array.
 * @param string query The current query. eg if the user searches for "asdf"
 *                     or visits a link to "asdf" the query is "asdf".
 */
function PageContent_NewLink( out, query ) {
	
	out.push( '<h2>What does "' + query + '" make you think of?</h2>' );
	out.push( '<div class="newlink">' );
	out.push(    '<form id="newlinkform">' );
	out.push(       '<input type="text" autocomplete="off" id="newlink" maxlength="20">' );
	out.push(    '</form>' );
	out.push( '</div>' );
	
}

/** ---------------------------------------------------------------------------
 * Content generator for the discovery block.
 *
 * @param array out Output html array.
 * @param object data Data from response.
 */
function PageContent_LastLink( out, data ) {
	var nick = data.creator == m_account ? 
			'<span class="creator owner">you' :
			'<span class="creator other">'+ data.creator_nick;
	out.push( '<div class="discovery" id="discovery">' );
	out.push(   '<div class="score">'+ data.score +'</div>' );
	out.push(   '<div class="link">'+ data.from 
				+' <div class="arrow"></div> '+ data.to +'</div>' );
	out.push(   '<div class="creator">discovered by '+ nick
				+'</span></div>' );
	out.push( '</div>' );
}

/** ---------------------------------------------------------------------------
 * Tweak a score according to the user's vote.
 * Adds or subtracts 1, but clamps to 0, 98 (to not make a false 99)
 *
 * @param int score Score of thought.
 * @param int vote Vote of user. TRUE FALSE or NULL.
 */
function BiasScore( score, vote ) {
	if( vote === null ) return score;
	if( score == 99 ) return score;
	if( vote === true ) {
		return Math.min( 98, score+1 );
	} else {
		return Math.max( 0, score-1 );
	}
}

/** ---------------------------------------------------------------------------
 * Content generator for the "links" block.
 *
 * @param array out Output html array.
 * @param array links out Output buffer.
 */
function PageContent_Links( out, links ) { 

	if( links.length == 0 ) return; // no links made yet.
	
	out.push( '<h2>What other people thought of:</h2>' );
	out.push( '<div id="links">' );
	
		for( var i = 0; i < links.length; i++ ) {
			var score = links[i].score;
			score = BiasScore( score, links[i].vote );
			out.push( '<div class="thought" data-dest="'+ links[i].dest 
					+'" data-score="'+ links[i].score +'">' );
					
					
				var voteclass = "score";
				if( links[i].vote === true ) voteclass += " up";
				if( links[i].vote === false ) voteclass += " down";
				out.push( '<div class="'+voteclass+'">'+ score +'</div>' );
				
				voteclass = "vote up";
				if( links[i].vote === true ) voteclass += " selected";
				
				out.push( '<div class="'+ voteclass +'"><div class="image"></div></div>' );
				
				voteclass = "vote down";
				if( links[i].vote === false ) voteclass += " selected";
				
				out.push( '<div class="'+ voteclass +'"><div class="image"></div></div>' );
				out.push( '<span>'+ links[i].dest +'</span>' );
			out.push( '</div>' );
		}

	out.push( '</div>' );
}

/** ---------------------------------------------------------------------------
 * Sanitize a thought string, for passing to
 * and rejecting invalid data.
 *
 * @param string input Input string from the user.
 * @param function on_invalid Optional function to call if the input was invalid.
 * @param function on_empty   Optional function to call if the input was empty.
 * @return mixed Sanitized thought string OR the response from one of the 
 *                  callbacks if they are triggered, or FALSE if the 
 *                  callback wasn't set.
 */
function SanitizeThought( input, on_invalid, on_empty ) {
	input = input.trim();
	if( input == "" ) {
		if( on_empty ) return on_empty();
		return false;
	}
	input = input.toLowerCase();
	if( !input.match( /^[a-z ]+$/ ) ) {	
		if( on_invalid ) return on_invalid();
		return false;
	}
	return input;
}

/** ---------------------------------------------------------------------------
 * Called when the main query box form is submitted.
 */
function OnNewQuery() {
	if( brains.Loader.IsLoading() ) return;
	
	function invalid() {
		alert( "Query must contain letters and spaces only." );
		return false;
	}
	
	thought = SanitizeThought( $("#query").val(), invalid );
	if( thought === false ) return;
	
	$("#query").blur();

	brains.Loader.Load( { 
		url: "query.php", 
		data: { "input": thought }, 
		process: function( response ) {
			
			if( response === null || response.status != "okay." ) {
				alert( "An error occurred. Please try again." );
				return false;
			}
			
			var html = [];
			
			PageContent_NewLink( html, response.data.query );
			PageContent_Links( html, response.data.links );
			
			m_current_thought = response.data.query;
			
			return html.join("");
		} 
		
	});
	
	return;
}

/** ---------------------------------------------------------------------------
 * Called when the old content was erased and new content is about to
 * be loaded.
 */
brains.InitializePreLoad = function() {
	
}

/** ---------------------------------------------------------------------------
 * Cast a vote on a thought.
 *
 * @param Element DOM element that holds the thought. Should have
 *                the class "thought"
 * @param bool vote Vote to apply, true for upvote, false for downvote.
 */
function VoteThought( element, vote ) {
	if( !m_logged_in ) {
		brains.ShowLoginDialog( "To vote on links you need to be logged in." );
		return;
	}
	var sel = vote ? element.children( ".vote.up" ) : 
				     element.children( ".vote.down" );
	
	if( sel.hasClass( "selected" ) ) return;
	
	element.children( ".vote" ).removeClass( "selected" );
	sel.addClass( "selected" );
	
	var score = element.data( "score" );
	score = BiasScore( score, vote );
	element.children( ".score" ).text( score )
		   .removeClass( vote ? "down" : "up" )
		   .addClass( vote ? "up" : "down" );
	
	$.post( "votelink.php", 
		{ t1: m_current_thought, 
		  t2: element.data( "dest" ),
		  vote: vote ? "good" : "bad" } )
		.done( function( data ) {
			alert(data); // DEBUG
			// just care about the login response, to invalidate
			// the user's login.
			if( data == "login." ) {
				brains.SetLoggedIn( false );
			}
		});
	
}

/** ---------------------------------------------------------------------------
 * Called after the content is filled with a new page.
 *
 */
brains.InitializePostLoad = function() {
	var newlink = $( "#newlink" );
	if( newlink.length ) {
		
		newlink.focus();
		
		newlink.keydown( function() {
				setTimeout( AdjustNewLinkInputSize, 0 );
			});
			
		newlink.keypress( FilterThoughtKeys );
			
		$("#newlinkform").submit( NewLinkForm_OnSubmit );
		
		s_thoughts = $("#links").children( ".thought" );
		
		s_thoughts.mousedown( function( e ) {
			
			current_button = $(this);
			$(this).addClass( "held" );
		});
		
		s_thoughts.click( function( e ) {
			// follow link.
			FollowLink( $(this).data( "dest"), "maybe"  );
			
		} );
		
		s_votebuttons = s_thoughts.children( ".vote" );
		s_votebuttons.mousedown( function( e ) {
			e.stopPropagation();
			
			VoteThought( $(this).parent(), $(this).hasClass( "up" ) );
			
		});
		
		s_votebuttons.click( function( e ) {
			e.stopPropagation();
		});
		
		
	}
	AdjustSizes();
}

/** ---------------------------------------------------------------------------
 * Callback for the newlink form.
 */
function NewLinkForm_OnSubmit() {
	if( brains.Loader.IsLoading() ) return false;
	
	function invalid() {
		alert( "Thought must contain letters and spaces only." );
		return false;
	}
	
	var input = SanitizeThought( $("#newlink").val(), invalid );
	if( input === false ) return false;
	
	FollowLink( input, "yes" );
	return false;
}

/** ---------------------------------------------------------------------------
 * Follow a link. Called by the new link form, or by clicking on an
 * existing link button.
 *
 * @param string input The next thought to jump to.
 * @param string vote For existing links:
 *                    "yes" = give an upvote.
 *                    "no" = do not upvote.
 *                    "maybe" = give an upvote only if a vote has not
 *                              been given yet.
 */
function FollowLink( input, vote ) {
	if( brains.Loader.IsLoading() ) return;
	
	if( m_current_thought == null ||
		m_current_thought == "" ) return;
	
	if( input == m_current_thought ) {
		alert( "You can't make a link to the same thought." );
		return;
	}
	
	var show_login = function() {
		
		brains.ShowLoginDialog( 
				"To create a link you need to be logged in.",
				NewLinkForm_OnSubmit );
	}
	
	if( !m_logged_in ) {
		show_login();
		return;
	}
	
		
	var failure = function() {
		alert( "An error occurred. Please try again." ); 
	}
	
	brains.Loader.Load( {
		url: "link.php",
		data: { a: m_current_thought, b: input, vote: vote },
		post: true,
		process: function( response ) {
			alert( response );
			
			if( response === null ) {
				return failure();
			}
			
			switch( response.status ) {
			case "error.":
			default:
				failure();
				return;
			case "login.":
				brains.SetLoggedIn( false );
				show_login();
				return;
			case "same.":
				alert( "You can't make a link to the same thought." );
				return false;
			case "okay.":
			}
			
			var html = [];
			
			PageContent_LastLink( html, response.data );
			PageContent_NewLink( html, response.data.to );
			PageContent_Links( html, response.data.links );
			
			m_current_thought = response.data.to;
			
			return html.join( "" );
			
		}
	});
	
	return false;
}

/** ---------------------------------------------------------------------------
 * Set the logged in state.
 *
 * @param bool value Value of logged in state.
 * @param string username The username they are logged in with.
 */
brains.SetLoggedIn = function( value, username, account ) {
	m_logged_in = value;
	if( value ) {
		m_username = username;
		m_account = account;
	} else {
		m_username = "";
		m_account = 0;
	}
}

/** ---------------------------------------------------------------------------
 * Get the logged in state.
 *
 * @return bool TRUE if logged in.
 */
brains.LoggedIn = function() {
	return m_logged_in;
}

/** ---------------------------------------------------------------------------
 * Set whether or not the session is validated by a captcha.
 *
 * @return bool New value of the state.
 */
brains.SetCaptchaValidated = function( value ) {
	m_captcha_validated = value;
}

/** ---------------------------------------------------------------------------
 * Get whether or not the session is validated by a captcha.
 */
brains.IsCaptchaValidated = function() {
	return m_captcha_validated;
}

//-----------------------------------------------------------------------------

brains.OnNewQuery = OnNewQuery;
brains.AdjustSizes = AdjustSizes;

} )();
