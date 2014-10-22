/*!
 * Copyright 2014 Mukunda Johnson
 */
 
(function() { window.brains = window.brains || {};
                                                            
console.log( 
[	"\n",
	"------------------------------------------------------------\n",
	"                                  ,---,                     \n",
	"         .---.  ,---.   __  ,-. ,---.'|                     \n",
	"        /. ./| '   ,'\\,' ,'/ /| |   | :         ,--,  ,--,  \n",
	"     .-'-. ' |/   /   '  | |' | |   | |  ,---.  |'. \\/ .`|  \n",
	"    /___/ \\: .   ; ,. |  |   ,,--.__| | /     \\ '  \\/  / ;  \n",
	" .-'.. '   ' '   | |: '  :  //   ,'   |/    /  | \\  \\.' /   \n",
	"/___/ \\:     '   | .; |  | '.   '  /  .    ' / |  \\  ;  ;   \n",
	".   \\  ' .\\  |   :    ;  : |'   ; |:  '   ;   /| / \\  \\  \\  \n",
	" \\   \\   ' \\ |\\   \\  /|  , ;|   | '/  '   |  / ./__;   ;  \\ \n",
	"  \\   \\  |--\"  `----'  ---' |   :    :|   :    |   :/\\  \\ ; \n",
	"   \\   \\ |                   \\   \\  /  \\   \\  /`---'  `--`  \n",
	"    '---\"                     `----'    `----'              \n",
	"\n",
	"    Is this what the cool kids do?\n",
	"------------------------------------------------------------\n"
]
	
	.join("") );
//----------------------------

var current_button = null;

var m_vertical;
 
var m_async = AsyncGroup.Create();

var m_logged_in;
var m_userdata;
var m_captcha_validated;

var m_current_thought = null;

var s_thoughts;
var s_votebuttons;

var s_loaders = $(); // loader icons on the page.

var m_stats; // stats returned from ShowInfoPage
 
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
	
	if( width < 470 ) {
		$("#loader_top").css( "left", "16px" );
	} else {
		var query = $("#query");
		var left = query.offset().left + query.width() + 16;
		$("#loader_top").css( "left", left + "px" );
	}
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
	out.push( 
		ReadTemplate( "#template_newlink", {
			"query": query 
		}) 
	);
}

/** ---------------------------------------------------------------------------
 * Content generator for the signin bugger.
 *
 * @param array out Output html array.
 */
function PageContent_Bugger( out ) {
	out.push( 
		ReadTemplate( "#template_signin_reminder" )
	);
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
	if( score < 95 ) return "rank_good";
	if( score < 99 ) return "rank_great" ;
	return "rank_god";
}

/** ---------------------------------------------------------------------------
 * Content generator for the discovery block.
 *
 * @param array out Output html array.
 * @param object data Discovery from response.
 */
function PageContent_LastLink( out, data ) {

	var rank_class = ScoreRank( data.score );
	var creator_class;
	var creator_name;
	
	if( data.creator == 0 ) {
		creator_name = "anonymous";
		creator_class = "static";
	} else if( m_logged_in && data.creator == brains.GetAccountID() ) {
		creator_name = "you";
		creator_class = "static";
	} else {
		creator_name = data.creator_nick;
		creator_class = "other";
	}
	
	out.push( 
		ReadTemplate( "#template_discovery", {
			"rank_class": rank_class,
			"score": data.score,
			"from": data.from,
			"to": data.to,
			"creator_class": creator_class,
			"creator_account": data.creator,
			"creator_name": creator_name
		})
	);
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
function PageContent_Links( out, links, title, full ) { 

	if( links.length == 0 ) return; // no links made yet.
	
	var html_links = [];
	
	for( var i = 0; i < links.length; i++ ) {
	
		var score = links[i].score;
		biased_score = BiasScore( score, links[i].vote );
		
		var scoreclass = "";
		if( links[i].vote === true ) scoreclass = "up";
		if( links[i].vote === false ) scoreclass = "down";
		
		var upclass = links[i].vote === true ? "selected" : "";
		var downclass = links[i].vote === false ? "selected" : "";
		
		var caption = full ? 
			(links[i].source + ' <i class="fa fa-arrow-right"></i> ' + links[i].dest) :
			links[i].dest;
		
		html_links.push( 
			ReadTemplate( "#template_link", {
				"source": links[i].source,
				"dest": links[i].dest,
				"score": score,
				"scoreclass": scoreclass,
				"biased_score": biased_score,
				"upclass": upclass,
				"downclass": downclass,
				"caption": caption
			})
		);
				
	 
	} 
	
	out.push( 
		ReadTemplate( "#template_links", {
			"title": title,
			"links": html_links.join("")
		})
	);
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

	ShowLoadingIcon( "#loader_top" );
	MakeQuery( thought );
}

/** ---------------------------------------------------------------------------
 * Make a thought query.
 *
 * @param string input   Thought to lookup.
 * @param string from    Optional thought to lookup a link.
 * @param bool   startup Startup query, suppresses certain error messages, and
 *                       doesn't push a history state.
 */
function MakeQuery( input, from, startup ) {
	if( brains.Loader.IsLoading() ) return;
	
	var request = { input: input };
	if( from ) request.from = from;
	 
	brains.Loader.Load( { 
		url: "query.php", 
		data: request, 
		process: function( response ) {
			
			if( response === null && startup ) {
				return false;
			}
			
			if( response === null || response.status != "okay." ) {
				alert( "An error occurred. Please try again later." );
				
				// this may be called from the newlink box.
				HideLoadingIcons();
				$("#newlink").removeClass( "following" );
				
				return false;
			}
			
			var html = [];
			
			// todo: discovery block.
			if( response.data.discovery ) {
				PageContent_LastLink( html, response.data.discovery );
			}
			PageContent_NewLink( html, response.data.query );
			PageContent_Links( html, response.data.links, "What other people thought of:", false );
			
			
			html = html.join("");
			
			$("#query").val( response.data.query );
			
			PushHistory( html, response.data.query, response.data.from, startup );
			
			m_current_thought = response.data.query;
			
			return html;
		} 
		
	});
}

/** ---------------------------------------------------------------------------
 * Load and show the startup page.
 */
function ShowInfoPage() {
	if( brains.Loader.IsLoading() ) return;
	
	brains.Loader.Load( {
		url: "stats.php",
		data: {},
		process: function( response ) {
			if( response === null || response.status != "okay." ) {
				
				return false;
			}
			
			m_stats = response.data;
			var html = [$("#template_info").html()];
			PageContent_Links( html, response.data.links, "Recently discovered links:", true );
			
			
			html.push( "<br><br><br><br>" );
			html = html.join("");
			
			$("#query").val( "" );
			PushHistory( html );
			m_current_thought = "";
			return html;
		}
	});
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
// anonymous voting is now here
//	if( !m_logged_in ) {
//		brains.ShowLoginDialog( "To vote on links you need to be signed in." );
//		return;
//	}
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
		  t1: element.attr( "data-source" ), 
		  t2: element.attr( "data-dest" ),
		  vote: vote ? "good" : "bad" } )
		  
		  /*
		.done( function( data ) {
			alert(data);
			
		})*/
		
	; // <--
	
}

/** ---------------------------------------------------------------------------
 * Called after the content is filled with a new page.
 *
 */
brains.InitializePostLoad = function() {
	FindLoadingIcons();
	HideLoadingIcons();
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
			if( brains.Loader.IsLoading() ) return;
			current_button = $(this);
			$(this).addClass( "held" );
		});
		
		s_thoughts.click( function( e ) {
			if( brains.Loader.IsLoading() ) return;
			// follow link. use query mode if not logged in.
			
			$(this).addClass( "following" );
			FollowLink( $(this).attr( "data-source" ), 
						$(this).attr( "data-dest" ), 
						OnWelcomePage() ? "query" : "soft" );
		} );
		
		s_votebuttons = s_thoughts.children( ".vote" );
		s_votebuttons.mousedown( function( e ) {
			e.stopPropagation();
			
			if( brains.Loader.IsLoading() ) return;
			if( e.which == 1 ) {
				VoteThought( $(this).parent(), $(this).hasClass( "up" ) );
			}
			
		});
		
		s_votebuttons.click( function( e ) {
			e.stopPropagation();
		}); 
		
		
	}
	var discovery = $("#discovery");
	if( discovery.length ) {
		var creatorlink = discovery.find( "span.nick.other" );
		if( creatorlink.length ) {
			creatorlink.click( function() {
			
				brains.ShowProfileDialog( 
					creatorlink.data( "account" ), 
					creatorlink.text() );
			});
		}
	}
	
	var welcome = $("#content").children( ".welcome" );
	if( welcome.length ) {
		$("#info_tlinks").children( "span" ).text( m_stats.total_links );
		$("#info_glinks").children( "span" ).text( m_stats.good_links );
		$("#info_slinks").children( "span" ).text( m_stats.strong_links );
	}
	
	$("#bugger_signin").click( function() {
		brains.ShowLoginDialog( "" );
	});
	
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
	
	$("#newlink").blur()
				 .addClass( "following" );
	$("#loader_newlink").addClass( "show" );
	
	var from;
	if( OnWelcomePage() ) {
		from = "";
	} else {
		from = m_current_thought;
	}
	
	FollowLink( from, input, "new" );
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
function FollowLink( from, target, method ) {
	if( brains.Loader.IsLoading() ) return;
	
	if( from == "" ) {
		 
		// make a normal query.
		MakeQuery( target );
		return;
	}
	  
	if( target == from ) {
		alert( "You can't make a link to the same thought." );
		HideLoadingIcons();
		$("#newlink").removeClass( "following" );
		$("#newlink").focus();
		return;
	}
	
	var show_login = function() {
		HideLoadingIcons();
		$("#newlink").removeClass( "following" );
		brains.ShowLoginDialog( 
				"To create a link you need to be signed in.",
				NewLinkForm_OnSubmit );
		
		
	} 
	 
	var failure = function() {
		alert( "An error occurred. Please try again." ); 
		HideLoadingIcons();
		$("#links").children( ".thought" ).removeClass( "following" );
		$("#newlink").removeClass( "following" );
		$("#newlink").focus();
	}
	
	brains.Loader.Load( {
		url: "link.php",
		data: { 
			ctoken: CToken(), 
			a: from, 
			b: target, 
			method: method 
		},
		post: true,
		process: function( response ) {
			
			if( response === null ) {
				return failure();
			}
			
			switch( response.status ) {
			case "error.":
			default:
				failure();
				return false; 
			case "login.":
				brains.SetLoggedIn( false );
				show_login();
				return false;
			case "same.":
				alert( "You can't make a link to the same thought." );
				HideLoadingIcons();
				$("#newlink").removeClass( "following" );
				$("#newlink").focus();
				return false;
			case "okay.":
			}
			
			if( response.data.logged_in == false && m_logged_in ) {
				
				brains.SetLoggedIn( false );
			}
			
			var html = [];
			
			if( !m_logged_in ) {
				PageContent_Bugger( html );
			}
			
			PageContent_LastLink( html, response.data.discovery );
			PageContent_NewLink( html, response.data.to );
			PageContent_Links( html, response.data.links, "What other people thought of:", false );
			
			
			html = html.join("");
			
			$("#query").val( response.data.to );
			
			PushHistory( html, response.data.to, response.data.from );
			m_current_thought = response.data.to;
			
			return html;
			
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
		$("#content > .bugger").remove();
		
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


/** ---------------------------------------------------------------------------
 * Parse the tag between the request query and after the base URL
 *
 * @return string Parsed tag, or "" if it's empty.
 */
function ParsePageTag() {
	var url = window.location.href;

	var split = url.indexOf( '?' );
	if( split != -1 ) {
		url = url.substring( 0, split );
	}
	
	split = url.lastIndexOf( '/' );
	if( split != -1 ) {
		return url.substring( split+1 );
	} else {
		return "";
	}
}

/** ---------------------------------------------------------------------------
 * Make a query if the tag asks for it.
 *
 * @param string tag URL tag.
 */
function LoadPageFromTag( tag ) {
	if( tag == "" ) {
		ShowInfoPage();
		//SetContent("");
		$("#query").val( "" );
		console.log( "Loading info page..." );
		
	} else {
		console.log( "Loading page: \""+tag+"\"" );
		var split = tag.indexOf( '+' );
		
		var from = "";
		var to;
		if( split != -1 ) {
			from = tag.substring( 0, split ).trim();
			to = tag.substring( split+1 ).trim();
			if( !from.match( /^[a-z-]+$/ ) ) {
				return; // invalid link.
			}
		} else {
			to = tag.trim();
			
		}
		if( !to.match( /^[a-z-]+$/ ) ) {	
			return;
		}
		$("#query").val( to );
		
	
		ShowLoadingIcon( "#loader_top" );
		MakeQuery( to, from == "" ? undefined : from, true );
		
	}
}

/** ---------------------------------------------------------------------------
 * Make the page fade out if the user presses refresh.
 * It might not fade out all the way before the page reloads but this
 * is the best we can do.
 */
$( window ).on ( 'beforeunload', function(){ 
	$('#content').removeClass( "visible" );
}); 

/** ---------------------------------------------------------------------------
 * Add a history entry, this is ignored if it matches the current page.
 *
 * @param string content The page content.
 * @param string to   Thought that they are going to.
 * @param string from Thought that they came from.
 * @param bool replace Replace the current state (default=false)
 */
function PushHistory( content, to, from, replace ) {
	if( !isSet(to) ) to = "";
	
	if( m_current_thought == to ) replace=true;//return;
	
	var url = to.replace( / /g, "-" );
	if( from ) {
		url = from.replace( / /g, "-" ) + "+" + url;
	}
	
	if( to == "" ) {
		url = ".";
	}
	
	title = "wordex - the word machine";
	
	var state = { content: content, tag: url, thought: to }

	if( replace ) {
		history.replaceState( state, title, url );
	} else {
		history.pushState( state, title, url );
	}
}

window.onpopstate = function(event) {
	//alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
	//LoadPageFromTag( event.state.link, undefined, true );

	if( event.state === null ) {	
		 
		var tag = ParsePageTag();
		LoadPageFromTag( tag );
		//brains.Loader.SetContent( "" );
		return;
	}
	
	brains.Loader.SetContent( event.state.content );
	m_current_thought = event.state.thought;
	//$("#content").html( event.state.content );
	$("#query").val( event.state.thought );

}

function FindLoadingIcons() {
	s_loaders = $(".loader");
}

function ShowLoadingIcon( id ) {
	$(id).addClass( "show" );
}

function HideLoadingIcons() {
	s_loaders.removeClass( "show" );
}

function OnWelcomePage() {
	return $("#welcome_page").length != 0;
}

//-----------------------------------------------------------------------------
$( function() {
	// content initialization. 
	
	//AdjustNewLinkInputSize();
	
	AdjustSizes();
	//AdjustThoughtSizes();
	
	setTimeout(  // god i fucking hate the web.
		function () {
			
			AdjustSizes();
	//		AdjustThoughtSizes();
		}, 100 );
	 
	$(window).mouseup( function( e ) {
		if( current_button != null ) {
			current_button.removeClass( "held" );
		}
		
	} );
	//$(".thought").click( function( e ) {
	//	 
	//});
	 
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
	$("#dialog").click( function( e ) {
		e.stopPropagation();
	});
	
	$("#logo").click( function()  {
		ShowInfoPage();
	});
	
	FindLoadingIcons();
	
	//brains.Dialog.Show( "login" );
	
	UpdateUserBlock();
	
	var tag = ParsePageTag();
	LoadPageFromTag( tag );
	
	if( $("#query").val() == "" ) {
	
		$("#query").addClass( "pointout" )
			.focusin( function() {
				$(this).removeClass( "pointout" )
					   .unbind( "focusin" );
				
			});
		
	}
	
});

//-----------------------------------------------------------------------------

brains.OnNewQuery = OnNewQuery;
brains.AdjustSizes = AdjustSizes;
brains.CToken = CToken;


brains.HideLoadingIcons = HideLoadingIcons;
brains.ShowLoadingIcon = ShowLoadingIcon;

} )();
