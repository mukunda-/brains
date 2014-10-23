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
	hc_gl.uniform2f( u_translate, Math.floor(m_translate.x), Math.floor(m_translate.y) );
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
	
	m_texture_font = new HC_Texture( "texture/chicago.png", undefined, function() {
		
		hc_gl.texParameteri( hc_gl.TEXTURE_2D, hc_gl.TEXTURE_MAG_FILTER, hc_gl.NEAREST );
		
	});
	
	hc_gl.clearColor(0.0, 0.0, 0.0, 1.0);                         // Set clear color to black, fully opaque
	hc_gl.disable(hc_gl.DEPTH_TEST);                               // Enable depth testing
	//hc_gl.depthFunc(hc_gl.LEQUAL);                                // Near things obscure far things
	hc_gl.clear(hc_gl.COLOR_BUFFER_BIT|hc_gl.DEPTH_BUFFER_BIT);   // Clear the color as well as the depth buffer.
	hc_gl.enable( hc_gl.BLEND );
    hc_gl.blendFunc(hc_gl.SRC_ALPHA, hc_gl.GL_ONE_MINUS_SRC_ALPHA);
	
	my_shader = new HC_Shader();
	my_shader.Attach( "shader-vs" );
	my_shader.Attach( "shader-fs" );
	my_shader.Link();
	my_shader.Use();
	
	
	hc_gl.enableVertexAttribArray( my_shader.GetAttribute( "a_position" ) );
	hc_gl.enableVertexAttribArray( my_shader.GetAttribute( "a_texture" ) );
	hc_gl.enableVertexAttribArray( my_shader.GetAttribute( "a_center" ) );
	hc_gl.enableVertexAttribArray( my_shader.GetAttribute( "a_color" ) );
	 
	//my_buffer = new HC_Buffer();
	//my_buffer.Load( new Float32Array(vertices), hc_gl.STATIC_DRAW );
	
	ResizeScreen();
} 

function DrawScene() {
	hc_gl.clear( hc_gl.COLOR_BUFFER_BIT|hc_gl.DEPTH_BUFFER_BIT ); 
	
	m_texture_font.Bind();
	my_buffer.Bind();
	var a_position = my_shader.GetAttribute( "a_position" );
	var a_texture  = my_shader.GetAttribute( "a_texture" );
	var a_center   = my_shader.GetAttribute( "a_center" );
	var a_color    = my_shader.GetAttribute( "a_color" );
	
	var u_sampler  = my_shader.GetUniform( "u_sampler" );
	hc_gl.uniform1i( u_sampler, 0 );
	
	hc_gl.vertexAttribPointer( a_position, 2, hc_gl.FLOAT, false, 40, 0  );
	hc_gl.vertexAttribPointer( a_texture,  2, hc_gl.FLOAT, false, 40, 8  );
	hc_gl.vertexAttribPointer( a_center,   2, hc_gl.FLOAT, false, 40, 16 );
	hc_gl.vertexAttribPointer( a_color,    4, hc_gl.FLOAT, false, 40, 24 );
	
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

/** ---------------------------------------------------------------------------
 * Add a rect to the "word" vertex data
 *
 * @param array out Vertex buffer.
 * @param float x,y Top left position of rect.
 * @param float w,h Dimensions of rect.
 * @param float u,v Top left texture coordinate.
 * @param float tw,th Dimensions of texture.
 * @param float cx,cy Center of element.
 * @param float r,g,b,a Color.
 */
function DrawRect( out, x, y, w, h, u, v, tw, th, cx, cy, r,g,b,a ) {
	
	if(!tw) tw = w;
	if(!th) th = h;
	
	u = u/128.0;// + 0.5/128.0;
	v = v/64.0;// + 0.5/64.0;
	tw = tw / 128.0;// - 0.5/128.0;
	th = th / 64.0;// - 0.5/64.0; 
	
	out.push( 
		
		x+w, y  , u+tw, v   , cx, cy, r,g,b,a,
		x  , y  , u   , v   , cx, cy, r,g,b,a,
		x  , y-h, u   , v+th, cx, cy, r,g,b,a,
		x  , y-h, u   , v+th, cx, cy, r,g,b,a,
		x+w, y-h, u+tw, v+th, cx, cy, r,g,b,a,
		x+w, y  , u+tw, v   , cx, cy, r,g,b,a
	);
}

function DrawText( out, x, y, text, cx, cy, r, g, b, a ) {
	var a_code = "a".charCodeAt(0);
	//y -= 3;
	y += 1;
	for( var i = 0; i < text.length; i++ ) {
		var code = text.charCodeAt(i);
		if( code == 32 ) {
		  x += 3;
		  continue;
		}
		code -= a_code;
		if( code < 0 || code > 25 ) continue;
		DrawRect( out, x, y, glyph_width[ code ], 12, 
				  5 + (code&7)*16, 2 + (code>>3)*16, 0, 0, 
				  cx, cy, r, g, b, a );
		x += glyph_width[code] + 1;
	}
}

/** ---------------------------------------------------------------------------
 * Measure the pixel width of a text string.
 *
 * @param string text Letters and spaces only.
 * @return int Size.
 */
function MeasureText( text ) {
	
	var size = 0;
	var a_code = "a".charCodeAt(0);

	for( var i = 0; i < text.length; i++ ) {
		if( text[i] == " " ) {
			size += 3;
			continue;
		}
		size += glyph_width[ text.charCodeAt(i) - a_code ] +1;
	}
	size -= 1;
	return size;
}

function OnLoaded() {
	
	var elements = Source.GetElements();
	var vertices = [];
	
	for( var i = 0; i < 400; i++ ) {
		if( elements[i].type == Source.E_WORD ) {
		 
			var x = Math.floor(elements[i].location.x);
			var y = Math.floor(elements[i].location.y);
			var phrase = Source.GetPhrase( elements[i].phrase );
			var text_width = MeasureText( phrase );
			 
			
			var box_width = text_width;
			var box_height = 12;
			var box_x = Math.floor( x - box_width/2 );
			var box_y = Math.floor( y + box_height/2 );
			
			DrawRect( 
				vertices,
				box_x-2,
				box_y-2,
				box_width+4,box_height+4,40,56,1,1,
				x,y,
				1.0,1.0,1.0,1.0
			);
			
			
			DrawText(
				vertices,
				box_x,
				y,
				phrase,
				x, y,
				0.0,0.0,0.0,1.0
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

$(window).mousedown( function( ev ) {

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
		
		m_drag.vel.x += rx * 0.3;
		m_drag.vel.y += ry * 0.3;
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
		
		m_drag.vel.x = m_drag.vel.x * 0.5;
		m_drag.vel.y = m_drag.vel.y * 0.5;
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