(function(){Math.clamp=function(a,b,c){return Math.max(b,Math.min(c,a));}})();

(function() {

var my_buffer = null;
var my_shader = null;

var test_words = 0;

var m_source;

var m_zoom = 1.0; // 1.0 = 1 pixel = 1 unit.
var m_translate = { x: 0.0, y: 0.0 };

var m_zooming = 0.0;
var m_flying = {x :0.0, y:0.0};
var m_zoom_accel = 0.0;

var MAXZOOM = 50.0;
var MINZOOM = 0.01;

var m_next_tick;

var m_texture_font = null;

var m_drag = {
	x:0,
	y:0,
	active: false,
	vel: { 
		x: 0.0, 
		y: 0.0 
	}
};

var glyph_width = [
	6,6,5,6,6,5,6,6,
	2,3,6,2,10,6,6,6,
	6,5,5,4,6,6,10,6,
	6,6
];

function SetTranslate() {
	var u_translate = my_shader.GetUniform( "u_translate" );
	hc_gl.uniform2f( u_translate, m_translate.x, m_translate.y );
}

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
	
	m_texture_font = new HC_Texture( "texture/chicago.png" );
	
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
	hc_gl.drawArrays( hc_gl.TRIANGLES, 0, test_words*6);
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
	
	for( var i = 0; i < 400; i++ ) {
		if( elements[i].type == Source.E_WORD ) {
		 
						
			CreateSquare( 
				vertices,
				elements[i].location.x,
				elements[i].location.y,
				16,16
			);
			// lol.
			test_words++;
		}
	}
	console.log( vertices );
	
	my_buffer = new HC_Buffer();
	my_buffer.Load( new Float32Array(vertices), hc_gl.STATIC_DRAW );
	
	m_next_tick = (new Date().getTime());
	OnFrame();
	//setInterval( OnFrame, 16.66666 );
}


$(window).bind( "mousewheel", function( ev, delta ) {
	
	m_zooming -= delta * 0.05 * (2.0 + m_zoom_accel);
	m_zoom_accel += 0.1;
	/*
	if( delta > 0 ) {
		
		m_zoom /= Math.pow(1.1,delta);
	} else {
		m_zoom *= Math.pow(1.1,-delta);
	}
	m_zoom = Math.max( MINZOOM, m_zoom );
	m_zoom = Math.min( MAXZOOM, m_zoom );
	
	SetZoom();*/
//	DrawScene();
	
}); 

$(window).mousedown( function(ev ) {

	if( ev.which == 1 ) {
		m_drag.active = true;
		m_drag.start = { x: m_translate.x, y: m_translate.y };
		 
		m_drag.sx = ev.screenX;
		m_drag.sy = ev.screenY;
		m_drag.lx = ev.screenX;
		m_drag.ly = ev.screenY;
		m_drag.x = 0;
		m_drag.y = 0;
		m_drag.velocity = 0.0;
		m_drag.vel.x = 0.0;
		m_drag.vel.y = 0.0;
	}
}); 

$(window).mousemove( function( ev ) {
	if( m_drag.active ) { 
		m_drag.x = ev.screenX - m_drag.sx;
		m_drag.y = ev.screenY - m_drag.sy;
		var rx = ev.screenX - m_drag.lx;
		var ry = ev.screenY - m_drag.ly;
		m_drag.lx = ev.screenX;
		m_drag.ly = ev.screenY;
		
		m_drag.vel.x += rx * 0.2;
		m_drag.vel.y += ry * 0.2;
		m_drag.vel.x = Math.clamp( m_drag.vel.x, -60, 60 );
		m_drag.vel.y = Math.clamp( m_drag.vel.y, -60, 60 );
		//m_drag.vel.power = 1.0;
	}
});

$(window).mouseup( function(ev ) { 
	if( ev.which == 1 ) {
		m_drag.active = false;
		
		m_flying.x = m_drag.vel.x / m_zoom;
		m_flying.y = -m_drag.vel.y / m_zoom;
	}
}); 

function OnFrame() {
	if( m_drag.active ) {
		m_zooming = 0.0;
		
		m_translate.x = m_drag.start.x + m_drag.x / m_zoom;
		m_translate.y = m_drag.start.y - m_drag.y / m_zoom;
		SetTranslate();
		
		m_drag.vel.x = m_drag.vel.x * 0.8;
		m_drag.vel.y = m_drag.vel.y * 0.8;
	} else {
		if( m_zooming > 0.0001 ) {
			
			m_zoom /= Math.pow(1.1,m_zooming);
		} else if( m_zooming < 0.0001 ) {
			m_zoom *= Math.pow(1.1,-m_zooming);
		} 
		if( m_zoom < MINZOOM ) {
			m_zoom = MINZOOM;
			m_zooming = Math.min( m_zooming, 0.0 );
		} else if( m_zoom > MAXZOOM ) {
			m_zoom = MAXZOOM;
			m_zooming = Math.max( m_zooming, 0.0 );
		}
		
		SetZoom();
		m_zooming *= 0.95;
		
		m_translate.x += m_flying.x;
		m_translate.y += m_flying.y;
		m_flying.x *= 0.994;
		m_flying.y *= 0.994;
		SetTranslate();
	}
	m_zoom_accel *= 0.8;
	DrawScene();
	
	
	var time = (new Date().getTime());
	m_next_tick += 1000.0/60.0;
	
	if( time > m_next_tick ) {
		m_next_tick = time;
		setTimeout( OnFrame, 0 );
	} else {
		setTimeout( OnFrame, m_next_tick - time );
	}
	
}

})();