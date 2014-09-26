/*!
 * Copyright 2014 Mukunda Johnson
 */
 
(function() { 

console.log( 'hi' );

var current_button = null;

$( function() {
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
