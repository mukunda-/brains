var hc_gl; // A global variable for the WebGL context
var hc_canvas;// = document.getElementById("glcanvas");

function HC_Init( canvas_id ) {	
	hc_canvas = document.getElementById( canvas_id );
	hc_gl = null;
	
	try {
		// Try to grab the standard context. If it fails, fallback to experimental.
		hc_gl = hc_canvas.getContext("webgl") || hc_canvas.getContext("experimental-webgl");
	}
	catch(e) {}

	// If we don't have a GL context, give up now
	if( !hc_gl ) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
		console.log( "Failed to get WebGL context." );
		hc_gl = null;
		return false;
	}

	return true;
}

function HC_Resize( width, height ) {
	if( hc_gl == null ) return;
	hc_canvas.width = width;
	hc_canvas.height = height;
	hc_gl.viewport( 0, 0, width, height );
}
