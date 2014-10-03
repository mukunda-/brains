/*!
 * Copyright 2014 Mukunda Johnson
 */
 
(function() { window.brains = window.brains || {};

console.log( 'hi' );

var current_button = null;

var m_vertical;

var s_nav;
var s_navboxes;
var s_navphrases;
var s_navarrows;

var m_async = AsyncGroup.Create();

var m_logged_in;

/** ---------------------------------------------------------------------------
 * Adjust the font size of a phrase element to fit inside the box.
 *
 * @param e The element to be modified.
 * @param size The size scale of the box.
 */
function AdjustPhraseSize( e, size ) {
	//var length = e.text().length;
	$("#magicbox").text( e.text() );
	var length = $("#magicbox").width();
	
	size = 32 * size; // base px size * scale
	var factor = 1.0;
	if( length < 240 ) {
		// normal size.
		
	} else {
		factor = (240 / length);
	}
	e.css( "font-size", Math.floor(size*factor) + "px" );
}

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
 * Adjust the size of the navboxes according to the window size.
 *
 */
function ResizeNavBoxes() {
	
	var ww = $(window).width();
	var size = 0.5;

	if( ww < 600 ) {
		// stacked.
		size = 0.8;
		s_nav.addClass( "vertical" );
		m_vertical = true;
	} else {
		s_nav.removeClass( "vertical" );
		if( ww < 770 ) {
			size = 0.6;
		} else if( ww < 970 ) {
			size = 0.8;
		} else {
			size = 1.0;
		}
		m_vertical = false;
	}
	
	
	var width = 240 * size;
	var height = 80 * size;
	var padding_h = 30 * size;
	var padding_v = 10 * size;
	//var fontsize = 32 * size;
	
	s_navboxes.width( width )
		.height( height )
		//.css( "font-size", fontsize + "px" )
		.css( "padding", padding_v + "px " + padding_h + "px" );
	
	if( m_vertical ) {
		s_navarrows.css( "top", "0px" );
	} else {
		s_navarrows.css( "top", (((height+padding_v*2)/2)-8) + "px" );
	}
	
	s_navphrases.css( "top", ((height+padding_v*2)/2) + "px" );
	
	s_navphrases.each( function() {
		AdjustPhraseSize( $(this), size );
	} );
	
}

/** ---------------------------------------------------------------------------
 * Adjust sizes and positioning of elements according to the new
 * window dimensions.
 */
function AdjustSizes() {
	
	ResizeNavBoxes();
	
	var width = $(window).width();
	
	$("#newlink").css( "max-width", (width - 80 - 14) + "px" );
	$("#discovery").css( "max-width", (width - 128 - 14) + "px" );
	
	var disc = $("#discovery");
	
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
$(window).bind("mousewheel",function(ev, delta) {
	
	var scrollTop = $(window).scrollTop()-Math.round(delta)*51;
	
	$(window).scrollTop(scrollTop-Math.round(delta)*51); 
}); 

function AdjustNewLinkInputSize() {
	var newlink = $("#newlink");
	$("#magicbox3").text( newlink.val() );
		var width = $("#magicbox3").width();
	
		newlink.width( width );
}

$( function() {
	s_nav = $(".navigator");
	s_navboxes = s_nav.children( ".box" );
	s_navphrases = s_navboxes.children( ".phrase" );
	s_navarrows = s_nav.children( ".arrow" );
	
	
	AdjustNewLinkInputSize();
	
	AdjustSizes();
	$(".thought span").each( AdjustThoughtSize );
	
	setTimeout(  // god i fucking hate the web.
		function () {
			
			AdjustSizes();
			$(".thought span").each( AdjustThoughtSize );
		}, 100 );
	 
	
 
	$(".thought").mousedown( function( e ) {
		current_button = $(this);
		$(this).addClass( "held" );
	} );
	
	$(window).mouseup( function( e ) {
		if( current_button != null ) {
			current_button.removeClass( "held" );
		}
		
	} );
	$(".thought").click( function( e ) {
	
		
	} );
	
	$(".thought .vote").mousedown( function(e) {
		e.stopPropagation();
	} );
	
	$(".thought .vote").click( function(e) {
		
		e.stopPropagation();
	} );
	
	
	$("#queryform").submit( function() {
		OnNewQuery();
		return false;
	});
	
	$("#queryform").keypress( function(e) {
		if( (e.which >= 65 && e.which <= 90)  // A-Z
			|| e.which >= 97 && e.which <= 122 // a-z
			|| e.which <= 32 ) { // space and control characters
			
			return true;
		}
		
		return false;
	});
	
	brains.Dialog.Show( "login" );
});

/** ---------------------------------------------------------------------------
 * Handler for the main query box
 */
function OnNewQuery() {
	var thought = $("#query").val().trim();
	if( thought == "" ) return;
	thought = thought.toLowerCase();
	if( !thought.match( /^[a-z ]+$/ ) ) {	
		alert( "Query must contain letters and spaces only." );
		return;
	}
	$("#query").blur();
	
	brains.Loader.Load( "query.php", undefined, { "thought": thought } );
	/*
	m_async.AddAjax( $.get( "query.php", { "thought": thought } ) )
		.done( function(data) {
			$("#content").html( data );
		})
		.fail( function( handle ) {
			if( handle.ag_cancelled ) return;
		});*/
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
			
		$("#newlinkform").submit( function() {
			if( !m_logged_in ) {
				brains.Dialog.Show( "login" );
				return false;
			}
			return false;
		} );
		
	}
}

/** ---------------------------------------------------------------------------
 * Set the logged in state.
 *
 * @param bool value Value of logged in state.
 */
brains.SetLoggedIn = function( value ) {
	m_logged_in = value;
}

/** ---------------------------------------------------------------------------
 * Get the logged in state.
 *
 * @return bool TRUE if logged in.
 */
brains.LoggedIn = function() {
	return m_logged_in;
}

//-----------------------------------------------------------------------------

brains.OnNewQuery = OnNewQuery;

} )();
