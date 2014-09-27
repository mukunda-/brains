/*!
 * Copyright 2014 Mukunda Johnson
 */
 
(function() { 

console.log( 'hi' );

var current_button = null;

var m_vertical;

var s_nav;
var s_navboxes;
var s_navphrases;
var s_navarrows;

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
	
	if( length < 240 ) {
		// normal size.
		
	} else {// if( length < 200 ) {
		size = Math.floor( size * (240 / length) );
		// small size
//		size = size * 0.75;
//	} else {
	//	size = size * 0.5;
	}
	e.css( "font-size", size + "px" );
}

function AdjustThoughtSize() {
	var e = $(this);
	var length = $("#magicbox2").text( e.text() ).width();

	if( length < 240 ) {
			
	} else {
		var size = Math.floor(24 * (240/length));
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

$(window).resize( function() {
	ResizeNavBoxes();
});

$( function() {
	s_nav = $(".navigator");
	s_navboxes = s_nav.children( ".box" );
	s_navphrases = s_navboxes.children( ".phrase" );
	s_navarrows = s_nav.children( ".arrow" );
	
	ResizeNavBoxes();
	
	//$(".thought span").each( AdjustThoughtSize );
	
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
	
		alert( "poop" );
	} );
	
	$(".thought .vote").mousedown( function(e) {
		e.stopPropagation();
	} );
	
	$(".thought .vote").click( function(e) {
		//alert( "poop1" );
		e.stopPropagation();
	} );
});

} )();
