/*! [[HC]] 
 *
 * A small WebGL utility library.
 *
 * Copyright 2014 mukunda
 */
 
var hc_gl; // WebGL context
var hc_canvas; // Canvas object

var hc_width;  // width of canvas
var hc_height; // height of canvas

/** ---------------------------------------------------------------------------
 * Initialize WebGL.
 *
 * @param string canvas_id ID of canvas to use.
 * @param object options Options to pass to getContext()
 */
function HC_Init( canvas_id, options ) {	
	hc_canvas = document.getElementById( canvas_id );
	hc_gl = null;
	
	try {
		// Try to grab the standard context. If it fails, fallback to experimental.
		hc_gl = hc_canvas.getContext("webgl", options) ||
			    hc_canvas.getContext("experimental-webgl", options);
	}
	catch(e) {}
	
	// If we don't have a GL context, give up now
	if( !hc_gl ) {
		alert( "Unable to initialize WebGL. Your browser may not support it." );
		console.log( "Failed to get WebGL context." );
		hc_gl = null;
		return false;
	}
	
	return true;
}

/** ---------------------------------------------------------------------------
 * Resize the canvas.
 *
 * @param int width New width.
 * @param int height New height.
 */
function HC_Resize( width, height ) {
	if( hc_gl == null ) return;
	hc_canvas.width = width;
	hc_canvas.height = height;
	hc_gl.viewport( 0, 0, width, height );
	hc_width = width;
	hc_height = height;
}

/** ---------------------------------------------------------------------------
 * Enable a list of vertex attribute arrays.
 *
 * @param array list List of vertex attribute array indexes to enable.
 */
function HC_EnableVertexAttribArrays( list ) {
	for( var i = 0; i < list.length; i++ ) {
		hc_gl.enableVertexAttribArray( list[i] );
	}
}

/** ---------------------------------------------------------------------------
 * Disable a list of vertex attribute arrays.
 *
 * @param array list List of vertex attribute array indexes to disable.
 */
function HC_DisableVertexAttribArrays( list ) {
	for( var i = 0; i < list.length; i++ ) {
		hc_gl.disableVertexAttribArray( list[i] );
	}
}
