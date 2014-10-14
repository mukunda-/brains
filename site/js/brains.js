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
var m_userdata;
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
	
	$("#dialog").css( "max-width", (width - 48) + "px" );
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

/** ---------------------------------------------------------------------------
 * Filter certain keypresses from a thought field.
 */
function FilterThoughtKeys( e ) {
	if( (e.which >= 65 && e.which <= 90)  // A-Z
		|| (e.which >= 97 && e.which <= 122) // a-z
		|| e.which <= 32 ) { // space and control characters
		
		return true;
	}
	
	return false;
}


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
 * Get the CSS class name for the score field according to a score.
 *
 * @param int score 0-99.
 */
function ScoreRank( score ) {
	if( score < 25 ) return "rank_cancer";
	if( score < 60 ) return "rank_poop";
	if( score < 80 ) return "rank_ok";
	if( score < 90 ) return "rank_good";
	if( score < 99 ) return "rank_great";
	return "rank_god";
}

/** ---------------------------------------------------------------------------
 * Content generator for the discovery block.
 *
 * @param array out Output html array.
 * @param object data Data from response.
 */
function PageContent_LastLink( out, data ) {
	var nick = data.creator == brains.GetAccountID() ? 
			'<span class="nick owner">you' :
			'<span class="nick other">'+ data.creator_nick;
	var rank = ScoreRank( data.score );
	out.push( '<div class="discovery" id="discovery">' );
	out.push(   '<div class="score '+rank+'">'+ data.score +'</div>' );
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
		brains.ShowLoginDialog( "To vote on links you need to be signed in." );
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
		{ ctoken: CToken(),
		  t1: m_current_thought, 
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
			// follow link. use query mode if not logged in.
			alert('ho');
			FollowLink( $(this).data( "dest"), "soft" );
		} );
		
		s_votebuttons = s_thoughts.children( ".vote" );
		s_votebuttons.mousedown( function( e ) {
			e.stopPropagation();
			
			if( e.which == 1 ) {
				VoteThought( $(this).parent(), $(this).hasClass( "up" ) );
			}
			
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
	
	FollowLink( input, "new" );
	return false;
}

/** ---------------------------------------------------------------------------
 * Follow a link. Called by the new link form, or by clicking on an
 * existing link button.
 *
 * @param string input The next thought to jump to.
 * @param string method Method to use:
 *         "query": dont create links, query only. doesnt require login.
 *	       "new": create missing links and give an upvote. requires login.
 *	       "soft": dont create, and only give upvote only if the user 
 *                 hasnt voted yet.
 */
function FollowLink( input, method ) {
	if( brains.Loader.IsLoading() ) return;
	
	if( m_current_thought == null ||
		m_current_thought == "" ) return;
	
	if( input == m_current_thought ) {
		alert( "You can't make a link to the same thought." );
		return;
	}
	
	var show_login = function() {
		
		brains.ShowLoginDialog( 
				"To create a link you need to be signed in.",
				NewLinkForm_OnSubmit );
	}
	
	if( !m_logged_in && method == "new" ) {
		show_login();
		return;
	}
	
		
	var failure = function() {
		alert( "An error occurred. Please try again." ); 
	}
	
	brains.Loader.Load( {
		url: "link.php",
		data: { 
			ctoken: CToken(), 
			a: m_current_thought, 
			b: input, 
			method: method 
		},
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
			
			if( response.data.logged_in == false && m_logged_in ) {
				
				brains.SetLoggedIn( false );
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
 * @param object userdata Basic account information for the session.
 *                 "account": Account ID
 *                 "username": Username
 *                 "nickname": Nickname
 */
brains.SetLoggedIn = function( value, userdata ) {
	m_logged_in = value;
	if( value ) {
		m_userdata = userdata;
	} else {
		m_userdata = null;
	}
	UpdateUserBlock();
}

/** ---------------------------------------------------------------------------
 * Change the user's nickname (visually only)
 *
 * @param string nickname New nickname.
 */
brains.SetNickname = function( nickname ) {
	m_userdata.nickname = nickname;
	UpdateUserBlock();
}


/** ---------------------------------------------------------------------------
 * Update the HTML for the #user block with their username and adjust the
 * icon accordingly.
 */
function UpdateUserBlock() {
	var icon = $("#user").children( ".icon" )
	icon.removeClass( "fa-sign-in" )
		.removeClass( "fa-cog" )
		
	if( m_logged_in ) {
		icon.addClass( "fa-cog" );
		$("#user").children( "span" ).text( m_userdata.nickname );
	} else {
		icon.addClass( "fa-sign-in" );
		$("#user").children( "span" ).text( "" );
	}
}

/*! QuirksMode.org readCookie() */
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

/** ---------------------------------------------------------------------------
 * Read the ctoken cookie. 
 */
function CToken() {
	var token = readCookie( "ctoken" );
	return token === null ? "" : token;
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
 * Returns active account ID or 0 if not logged in.
 */
brains.GetAccountID = function() {
	return m_logged_in ? m_userdata.account : 0;
}

/** ---------------------------------------------------------------------------
 * Get the user's username or "" if not logged in.
 */
brains.GetUsername = function() {
	return m_logged_in ? m_userdata.username : "";
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
			brains.ShowProfileDialog( m_userdata.account, true );
		} else {
			brains.ShowLoginDialog( "" );
		}
	});
	
	$("#overlay").click( function() {
		brains.Dialog.Close();
	});
	$("#dialog").click( function( e) {
		e.stopPropagation();
	});
	
	//brains.Dialog.Show( "login" );
	
	UpdateUserBlock();
});

//-----------------------------------------------------------------------------

brains.OnNewQuery = OnNewQuery;
brains.AdjustSizes = AdjustSizes;
brains.CToken = CToken;

} )();
