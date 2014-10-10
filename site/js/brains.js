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
var m_username;
var m_captcha_validated;

var m_current_thought;

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

	// make escape close the dialog box.
	if( e.keyCode == 27 ) {
		brains.Dialog.Close();
	}
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
	
		
	} );
	 
	$("#queryform").submit( function() {
		OnNewQuery();
		return false;
	});
	
	$("#queryform").keypress( function( e ) {
		if( (e.which >= 65 && e.which <= 90)  // A-Z
			|| (e.which >= 97 && e.which <= 122) // a-z
			|| e.which <= 32 ) { // space and control characters
			
			return true;
		}
		
		return false;
	});
	
	$("#user").click( function( e ) {
		if( m_logged_in ) {
			brains.Dialog.Show( "profile" );
		} else {
			brains.ShowLoginDialog( "Please log in." );
		}
	});
	
	//brains.Dialog.Show( "login" );
});

/** ---------------------------------------------------------------------------
 * Content generator for a "new" thought page.
 *
 * @param array out Output buffer.
 * @param object data Data from response.
 */
function PageContent_NewThought( out, data ) {
	
	out.push( '<h2>What does "' + data.query + '" make you think of?</h2>' );
	out.push( '<div class="newlink">' );
	out.push(    '<form id="newlinkform">' );
	out.push(       '<input type="text" autocomplete="off" id="newlink" maxlength="20">' );
	out.push(    '</form>' );
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
 * Content generator for an existing thought. Appends links to the new
 * thought content.
 *
 * @param array out Output buffer.
 * @param object data Data from response.
 */
function PageContent_ExistingThought( out, data ) {
	
	PageContent_NewThought( out, data );

	out.push( '<h2>What other people thought of:</h2>' );
	out.push( '<div id="links">' );
	
		for( var i = 0; i < data.links.length; i++ ) {
			var score = data.links[i].score;
			score = BiasScore( score, data.links[i].vote );
			out.push( '<div class="thought" data-dest="'+ data.links[i].dest 
					+'" data-score="'+ data.links[i].score +'">' );
				out.push( '<div class="score">'+ score +'</div>' );
				
				var voteclass = "vote up";
				if( data.links[i].vote === true ) voteclass += " selected";
				
				out.push( '<div class="'+ voteclass +'"><div class="image"></div></div>' );
				
				voteclass = "vote down";
				if( data.links[i].vote === false ) voteclass += " selected";
				
				out.push( '<div class="'+ voteclass +'"><div class="image"></div></div>' );
				out.push( '<span>'+ data.links[i].dest +'</span>' );
			out.push( '</div>' );
		}

	out.push( '</div>' );
}


/** ---------------------------------------------------------------------------
 * Handler for the main query box
 */
function OnNewQuery() {
	if( brains.Loader.IsLoading() ) return;
	
	var thought = $("#query").val().trim();
	if( thought == "" ) return;
	thought = thought.toLowerCase();
	if( !thought.match( /^[a-z ]+$/ ) ) {	
		alert( "Query must contain letters and spaces only." );
		return;
	}
	$("#query").blur();
	
	var failure = function() {
		alert( "An error occurred. Please try again." );
		return false;
	}
	
	brains.Loader.Load( { 
		url: "query.php", 
		data: { "input": thought }, 
		process: function( response ) {
			
			if( response === null ) {
				return failure();
			}
			
			var html = [];
			
			if( response.status == "error." ) {
				return failure();
			} else if( response.status == "new." ) {
				PageContent_NewThought( html, response.data );
			} else if( response.status == "exists." ) {
				PageContent_ExistingThought( html, response.data );
			}
			
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
 * Called after the content is filled with a new page.
 *
 */
brains.InitializePostLoad = function() {
	var newlink = $( "#newlink" );
	if( newlink.length ) {
		
		newlink.focus()
			.keydown( function() {
				setTimeout( AdjustNewLinkInputSize, 0 );
			} );
			
		$("#newlinkform").submit( NewLinkForm_OnSubmit );
		
		s_thoughts = $("#links").children( ".thought" );
		
		s_thoughts.mousedown( function( e ) {
			
			current_button = $(this);
			$(this).addClass( "held" );
		});
		
		s_thoughts.click( function( e ) {
			// follow link.
		} );
		
		s_votebuttons = s_thoughts.children( ".vote" );
		s_votebuttons.mousedown( function( e ) {
			e.stopPropagation();
		});
		
		s_votebuttons.click( function( e ) {
			e.stopPropagation();
		});
		
		
	}
}

/** ---------------------------------------------------------------------------
 * Callback for the newlink form.
 */
function NewLinkForm_OnSubmit() {
	if( brains.Loader.IsLoading() ) return false;
	
	var show_login = function() {
		
		brains.ShowLoginDialog( 
				"To create a link you need to be logged in.",
				NewLinkForm_OnSubmit );
		return false;
	}
	
	if( !m_logged_in ) {
		return show_login();
	}
	
		
	var failure = function() {
		alert( "An error occurred. Please try again." );
		return false;
	}
	
	brains.Loader.Load( {
		url: "newlink.php",
		data: {a: m_current_thought, b: $("#newlink").val() },
		post: true,
		process: function( response ) {
			alert( response );
			
			if( response === null ) {
				return failure();
			}
			
			switch( response.status ) {
			case "error.":
			default:
				return failure();
			case "login.":
				return show_login();
			case "same.":
				alert( "You can't make a link to the same thought." );
				return false;
			case "okay.":
			}
			
			var html = [];
			
			
			//if( response.status == "error." ) {
			//} else if( 
			
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
brains.SetLoggedIn = function( value, username ) {
	m_logged_in = value;
	if( value ) {
		m_username = username;
	} else {
		m_username = "";
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

} )();
