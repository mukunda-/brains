
(function() {

var my_buffer = null;
var my_shader = null;

var m_source;
  
function ResizeScreen() {
	HC_Resize( window.innerWidth, window.innerHeight );
	
}

function Start() {
	if( !HC_Init( "glcanvas" ) ) return;
	
	hc_gl.clearColor(0.0, 0.0, 0.0, 1.0);                         // Set clear color to black, fully opaque
	hc_gl.enable(hc_gl.DEPTH_TEST);                               // Enable depth testing
	hc_gl.depthFunc(hc_gl.LEQUAL);                                // Near things obscure far things
	hc_gl.clear(hc_gl.COLOR_BUFFER_BIT|hc_gl.DEPTH_BUFFER_BIT);   // Clear the color as well as the depth buffer.
	
	
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

$(window).resize( function() {
	ResizeScreen();
	DrawScene();
});

$( function()	 {
	Start();
	$.get( "../site/tree.php", {} )
		.done( function( data ) {
			Source.Load( data );
		})
		.fail( function() {
			alert( "An error occurred." );
		});
});

})();