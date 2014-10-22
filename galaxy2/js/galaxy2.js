
var my_buffer = null;
var my_shader = null;

function initWebGL(canvas) {
	var gl = null;

	try {
		// Try to grab the standard context. If it fails, fallback to experimental.
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	}
	catch(e) {}

	// If we don't have a GL context, give up now
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
		gl = null;
	}

	return gl;
}

function ResizeScreen() {
	HC_Resize( window.innerWidth, window.innerHeight );
	
}

function start() {
	HC_Init( "glcanvas" );
	
	var canvas = document.getElementById("glcanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	hc_gl = initWebGL(canvas);      // Initialize the GL context

	// Only continue if WebGL is available and working
	if( !hc_gl ) return;
	
	hc_gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
	hc_gl.enable(hc_gl.DEPTH_TEST);                               // Enable depth testing
	hc_gl.depthFunc(hc_gl.LEQUAL);                                // Near things obscure far things
	hc_gl.clear(hc_gl.COLOR_BUFFER_BIT|hc_gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
	
	
	my_shader = new HC_Shader();
	my_shader.Attach( "shader-fs" );
	my_shader.Attach( "shader-vs" );
	my_shader.Link();
	my_shader.Use();
	
	
	var a_position = my_shader.GetAttribute( "aVertexPosition" );
	hc_gl.enableVertexAttribArray( a_position );
	 
	var vertices = [
		1.0,  1.0,
		-1.0, 1.0,
		0.8,  -1.0,
		-1.0, -0.2
	];
	
	my_buffer = new HC_Buffer();
	my_buffer.Load( new Float32Array(vertices), hc_gl.STATIC_DRAW );
	
	ResizeScreen();
	DrawScene();
} 

function DrawScene() {
	hc_gl.clear( hc_gl.COLOR_BUFFER_BIT|hc_gl.DEPTH_BUFFER_BIT ); 
	my_buffer.Bind();
	var a_position = my_shader.GetAttribute( "aVertexPosition" );
	hc_gl.vertexAttribPointer( a_position, 2, hc_gl.FLOAT, false, 0, 0 );
	hc_gl.drawArrays( hc_gl.TRIANGLE_STRIP, 0, 4 );
}

window.onresize = function() {
	ResizeScreen();
	DrawScene();
}
