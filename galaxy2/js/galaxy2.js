
(function() {

var my_buffer = null;
var my_shader = null;

var m_source;

var m_zoom = 1.0; // 1.0 = 1 pixel = 1 unit.

var MAXZOOM = 50.0;
var MINZOOM = 0.01;

function SetZoom() {
	var w = window.innerWidth;
	var h = window.innerHeight;
	var u_scale = my_shader.GetUniform( "u_screen_scale" );
	hc_gl.uniform2f( u_scale, m_zoom / (w/2), m_zoom / (h/2) );
}
  
function ResizeScreen() {
	var w = window.innerWidth;
	var h = window.innerHeight;
	HC_Resize( w, h );
	
	SetZoom();
}

function Start() {
	if( !HC_Init( "glcanvas" ) ) return;
	
	hc_gl.clearColor(0.0, 0.0, 0.0, 1.0);                         // Set clear color to black, fully opaque
	hc_gl.enable(hc_gl.DEPTH_TEST);                               // Enable depth testing
	hc_gl.depthFunc(hc_gl.LEQUAL);                                // Near things obscure far things
	hc_gl.clear(hc_gl.COLOR_BUFFER_BIT|hc_gl.DEPTH_BUFFER_BIT);   // Clear the color as well as the depth buffer.
	
	
	my_shader = new HC_Shader();
	my_shader.Attach( "shader-vs" );
	my_shader.Attach( "shader-fs" );
	my_shader.Link();
	my_shader.Use();
	
	
	var a_position = my_shader.GetAttribute( "a_position" );
	hc_gl.enableVertexAttribArray( a_position );
	 
	var vertices = [
		1.0,  1.0,
		-1.0, 1.0,
		0.8,  -1.0,
		-1.0, -0.2
	];
	
	//my_buffer = new HC_Buffer();
	//my_buffer.Load( new Float32Array(vertices), hc_gl.STATIC_DRAW );
	
	ResizeScreen();
} 

function DrawScene() {
	hc_gl.clear( hc_gl.COLOR_BUFFER_BIT|hc_gl.DEPTH_BUFFER_BIT ); 
	my_buffer.Bind();
	var a_position = my_shader.GetAttribute( "a_position" );
	hc_gl.vertexAttribPointer( a_position, 2, hc_gl.FLOAT, false, 0, 0 );
	hc_gl.drawArrays( hc_gl.TRIANGLES, 0, 6*7 );
}

$(window).resize( function() {
	ResizeScreen();
	DrawScene();
});

$( function()	 {
	Start();
	$.get( "../site/tree.php", {} )
		.done( function( data ) {
			Source.Load( data, OnLoaded );
		})
		.fail( function() {
			alert( "An error occurred." );
		});
});

function CreateSquare( out, x, y, width,height ) {
	width /= 2;
	height /= 2;
	out.push( 
	
		x+width, y+height,
		x-width, y+height,
		x-width, y-height,
		x-width, y-height,
		x+width, y-height,
		x+width, y+height
	);
}

function OnLoaded() {
	
	var elements = Source.GetElements();
	var vertices = [];
	for( var i = 0; i < 15; i++ ) {
		if( elements[i].type == Source.E_WORD ) {
		 
						
			CreateSquare( 
				vertices,
				elements[i].location.x,
				elements[i].location.y,
				16,16
			);
			// lol.
			
		}
	}
	console.log( vertices );
	
	my_buffer = new HC_Buffer();
	my_buffer.Load( new Float32Array(vertices), hc_gl.STATIC_DRAW );
	
	setInterval( OnFrame, 16.66666 );
}


$(window).bind( "mousewheel", function( ev, delta ) {
	
	if( delta > 0 ) {
		m_zoom /= Math.pow(1.1,delta);
	} else {
		m_zoom *= Math.pow(1.1,-delta);
	}
	m_zoom = Math.max( MINZOOM, m_zoom );
	m_zoom = Math.min( MAXZOOM, m_zoom );
	
	SetZoom();
//	DrawScene();
	
}); 

function OnFrame() {
	DrawScene();
}

})();