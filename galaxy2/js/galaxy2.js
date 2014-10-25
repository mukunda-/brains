(function(){Math.clamp=function(a,b,c){return Math.max(b,Math.min(c,a));}})();

(function() {
 
var my_shader = null; 
var line_shader = null;

var m_source;

var m_zoom = 0.05; // 1.0 = 1 pixel = 1 unit.
var m_translate = { x: 0.0, y: 0.0 };

var m_zooming = 0.0;
var m_flying = {x:0.0, y:0.0};
var m_zoom_accel = 0.0;

var MAXWORDZOOM = 1.0;
var MAXZOOM = 5.0;
var MINZOOM = 0.01;

var fade_in_time;
var m_start_time;
var m_next_tick;
var m_dirty;

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
	6,6,5,6, 6,5, 6,6,
	2,5,6,2,10,6, 6,6,
	6,5,5,4, 6,6,10,6,
	6,6
];

var m_cells = {};
var CELL_SIZE = 512;

function GetCell2( cx,cy ) {
	if( m_cells.hasOwnProperty( cx ) && m_cells[cx].hasOwnProperty( cy ) ) {
		return m_cells[cx][cy];
	} 
	return null;
}

function GetCell( point, create ) {
	x = point.x >> 9;
	y = point.y >> 9;
	 
	var cell = GetCell2( x, y );
	if( cell ) return cell;
	if( !create ) return null;
	
	if( !m_cells.hasOwnProperty( x ) ) {
		m_cells[x] = {};
	}
	
	m_cells[x][y] = {  
		buffer_words: new HC_Packer( "ssfffffBBBB" ),
		buffer_boxes: new HC_Packer( "ssfffffBBBB" ),
		buffer_lines: new HC_Packer( "ssffffBBBB" )
		//buffer_lines: new HC_Packer()
	};
	return m_cells[x][y];
}
 
function ResizeScreen() {
	var w = window.innerWidth & ~1;
	var h = window.innerHeight & ~1;
	HC_Resize( w, h );
	m_dirty = true;
}

function Start() {

	var options = {
	//	premultipliedAlpha  : false,
		alpha: false,
		depth: false,
		stencil: false,
		
	}
	
	if( !HC_Init( "glcanvas", options ) ) return;
	
	m_texture_font = new HC_Texture( "texture/chicago.png", undefined, function() {
		
		hc_gl.texParameteri( hc_gl.TEXTURE_2D, hc_gl.TEXTURE_MAG_FILTER, hc_gl.LINEAR );
		hc_gl.texParameteri( hc_gl.TEXTURE_2D, hc_gl.TEXTURE_MIN_FILTER, hc_gl.LINEAR_MIPMAP_LINEAR );
		
	});
	
	hc_gl.clearColor(0.01, 0.01, 0.03, 1.0);                         // Set clear color to black, fully opaque
	hc_gl.disable(hc_gl.DEPTH_TEST);      
	
//	hc_gl.clear(hc_gl.COLOR_BUFFER_BIT|hc_gl.DEPTH_BUFFER_BIT);   // Clear the color as well as the depth buffer.
	hc_gl.enable( hc_gl.BLEND ); 

	hc_gl.blendFunc(hc_gl.SRC_ALPHA, hc_gl.ONE_MINUS_SRC_ALPHA);
	//hc_gl.pixelStorei(hc_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
	
	my_shader = new HC_Shader();
	my_shader.Attach( "shader-vs" );
	my_shader.Attach( "shader-fs" );
	my_shader.Link();
	my_shader.Use();
	hc_gl.uniform1i( my_shader.GetUniform( "u_sampler" ), 0 );
  
	line_shader = new HC_Shader();
	line_shader.Attach( "shader-lines-v" );
	line_shader.Attach( "shader-lines-f" );
	line_shader.Link();
	line_shader.Use();
	
	my_shader.Use(); 
	m_dirty = true; 
	ResizeScreen();
} 

function UpdateWordShaderUniforms( time ) {
	hc_gl.uniform1f( my_shader.GetUniform( "u_time" ), time );
	
	hc_gl.uniform2f( my_shader.GetUniform( "u_translate" ), 
		m_translate.x,
		m_translate.y
	);
	
	hc_gl.uniform2f( my_shader.GetUniform( "u_screen_scale" ), 
					 m_zoom / (hc_width/2), m_zoom / (hc_height/2) );
	var word_zoom = Math.min( m_zoom, MAXWORDZOOM );
	
	hc_gl.uniform2f( my_shader.GetUniform( "u_word_scale" ), 
					 word_zoom / (hc_width/2), word_zoom / (hc_height/2) );
	
	hc_gl.uniform1f( my_shader.GetUniform( "u_zoom" ), m_zoom );
	
	hc_gl.uniform2f( my_shader.GetUniform( "u_screen_dimensions" ), 
					 hc_width, hc_height );
}

function UpdateLineShaderUniforms( time ) {
	hc_gl.uniform1f( line_shader.GetUniform( "u_time" ), time );
	
	hc_gl.uniform2f( line_shader.GetUniform( "u_translate" ),
		m_translate.x,
		m_translate.y
	);
	
	hc_gl.uniform2f( line_shader.GetUniform( "u_screen_scale" ),
					 m_zoom / (hc_width/2), m_zoom / (hc_height/2) );
	
	var line_zoom = Math.min( m_zoom, MAXWORDZOOM );
	 
	hc_gl.uniform2f( line_shader.GetUniform( "u_line_scale" ), 
					 line_zoom / (hc_width/2), line_zoom / (hc_height/2) );
	
}

/** ---------------------------------------------------------------------------
 * Iterates over a render box and calls func for each active cell found.
 *
 * @param object renderbox {left,top,right,bottom} Cell positions.
 * @param function( cell ) func Callback for rendering.
 */
function ForRenderBox( renderbox, func ) {
	for( var rx = renderbox.left; rx <= renderbox.right; rx++ ) {
		for( var ry = renderbox.top; ry <= renderbox.bottom; ry++ ) {
			var cell = GetCell2( rx, ry );
			if( cell === null ) continue;
			func( cell );
		}
	}
	
}

function DrawScene() {
	hc_gl.clear( hc_gl.COLOR_BUFFER_BIT ); 
	
	var current_time = (new Date().getTime()) - m_start_time;
	
	var padding = 500;
	var scale = 1.0 / m_zoom;
	var renderbox = {
		left: (-m_translate.x - (hc_width/2) * scale -padding)>>9,
		top: (-m_translate.y - (hc_height/2) * scale -padding)>>9,
		right: (-m_translate.x + (hc_width/2) * scale + padding)>>9,
		bottom: (-m_translate.y + (hc_height/2) * scale + padding)>>9
	};
	
	//
	// line phase
	//
	line_shader.Use();
	UpdateLineShaderUniforms( current_time );
	var a_position = line_shader.GetAttribute( "a_position" );
	var a_center   = line_shader.GetAttribute( "a_center" );
	var a_side     = line_shader.GetAttribute( "a_side" );
	var a_time     = line_shader.GetAttribute( "a_time" );
	var a_color    = line_shader.GetAttribute( "a_color" );
	 
	HC_EnableVertexAttribArrays( 
		[a_position, a_center, a_side, a_time, a_color] );
	
	ForRenderBox( renderbox, function( cell ) {
		var buffer = cell.buffer_lines;
		buffer.Bind();
		hc_gl.vertexAttribPointer( a_position, 2, hc_gl.SHORT, false, 24, 0  );
		hc_gl.vertexAttribPointer( a_center,   2, hc_gl.FLOAT, false, 24, 4  );
		hc_gl.vertexAttribPointer( a_side,     1, hc_gl.FLOAT, false, 24, 12 );
		hc_gl.vertexAttribPointer( a_time,     1, hc_gl.FLOAT, false, 24, 16 );
		hc_gl.vertexAttribPointer( a_color,    4, hc_gl.UNSIGNED_BYTE, true, 24, 20 );
		hc_gl.drawArrays( hc_gl.TRIANGLES, 0, buffer.u_size );
	});
		
	HC_DisableVertexAttribArrays( 
		[a_position, a_center, a_side, a_time, a_color] );
	
	m_texture_font.Bind();
	
	//
	// word/box phase
	//
	my_shader.Use();
	UpdateWordShaderUniforms( current_time );
	var a_position = my_shader.GetAttribute( "a_position" );
	var a_texture  = my_shader.GetAttribute( "a_texture" );
	var a_center   = my_shader.GetAttribute( "a_center" );
	var a_time     = my_shader.GetAttribute( "a_time" );
	var a_color    = my_shader.GetAttribute( "a_color" );
	
	HC_EnableVertexAttribArrays( 
		[a_position, a_texture, a_center, a_time, a_color] );
	
	
	function RenderWordBuffer( buffer ) {
		buffer.Bind();
		hc_gl.vertexAttribPointer( a_position, 2, hc_gl.SHORT, false, 28, 0  );
		hc_gl.vertexAttribPointer( a_texture,  2, hc_gl.FLOAT, false, 28, 4  );
		hc_gl.vertexAttribPointer( a_center,   2, hc_gl.FLOAT, false, 28, 12 );
		hc_gl.vertexAttribPointer( a_time,     1, hc_gl.FLOAT, false, 28, 20 );
		hc_gl.vertexAttribPointer( a_color,    4, hc_gl.UNSIGNED_BYTE, true, 28, 24 ); 
		hc_gl.drawArrays( hc_gl.TRIANGLES, 0, buffer.u_size );
	}
	
	if( scale < 6.0 )  {
		ForRenderBox( renderbox, function( cell ) {
			RenderWordBuffer( cell.buffer_words );
		});
	} else {
		ForRenderBox( renderbox, function( cell ) {
			RenderWordBuffer( cell.buffer_boxes );
		});
	}
	 
	HC_DisableVertexAttribArrays(
		[a_position, a_texture, a_center, a_time, a_color] );
	
}

$(window).resize( function() {
	ResizeScreen();
	DrawScene();
});

$( function() {

	Start();
	$.get( "../site/tree.php", {} )
		.done( function( data ) {
			Source.Load( data, OnLoaded );
		})
		.fail( function() {
			$("#loading>div>div").text( "failed to retrieve data from server." );
			
		});
});

/** ---------------------------------------------------------------------------
 * Add a rect to a word vertex buffer
 *
 * @param array out Vertex buffer.
 * @param iny x,y Top left position of rect.
 * @param ubyte w,h Dimensions of rect.
 * @param int u,v Top left texture coordinate, in pixels.
 * @param int tw,th Dimensions of texture.
 * @param float cx,cy Center of element.
 * @param float r,g,b,a Color.
 */
function DrawRect( out, x, y, w, h, u, v, tw, th, cx, cy, r,g,b,a, time ) {
	
	if(!tw) tw = w;
	if(!th) th = h;
	
	x = Math.round( x-cx );
	y = Math.round( y-cy );
	
	u = u / 128.0;    // + 0.5/128.0;
	v = v / 64.0;     // + 0.5/64.0;
	tw = tw / 128.0;  // - 0.5/128.0;
	th = th / 64.0;   // - 0.5/64.0; 
	
	r = Math.round(r * 255.0);
	g = Math.round(g * 255.0);
	b = Math.round(b * 255.0);
	a = Math.round(a * 255.0);
	  
	out.Push( [
		
		x+w, y  , u+tw, v   , cx, cy, time, r,g,b,a,
		x  , y  , u   , v   , cx, cy, time, r,g,b,a,
		x  , y-h, u   , v+th, cx, cy, time, r,g,b,a,
		x  , y-h, u   , v+th, cx, cy, time, r,g,b,a,
		x+w, y-h, u+tw, v+th, cx, cy, time, r,g,b,a,
		x+w, y  , u+tw, v   , cx, cy, time, r,g,b,a
	]);
}

function DrawText( out, x, y, text, cx, cy, r, g, b, a, time ) {
	var a_code = "a".charCodeAt(0);
	//y -= 3;
	y += 1;
	var count = 0;
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
				  cx, cy, r, g, b, a, time );
		x += glyph_width[code] + 1;
		count++;
	}
	return count;
}

function DrawLine( out, x1,y1,x2,y2,thickness,r,g,b,a, time ) {
	var delta = [ x2-x1, y2-y1 ];
	var length = Math.sqrt( delta[0]*delta[0] + delta[1]*delta[1] );
	delta[0] /= length;
	delta[1] /= length;
	
	// rotate 90deg cc
	delta = [ -delta[1], delta[0] ];
	
	thickness = thickness * 256;
	delta[0] *= thickness;
	delta[1] *= thickness;
	
	delta[0] = Math.round( delta[0] );
	delta[1] = Math.round( delta[1] );
	
	r = Math.round(r * 255.0);
	g = Math.round(g * 255.0);
	b = Math.round(b * 255.0);
	a = Math.round(a * 255.0);
	
	out.Push( [
		 delta[0],  delta[1], x1, y1,  1.0, time, r,g,b,a,
		-delta[0], -delta[1], x1, y1, -1.0, time, r,g,b,a,
		-delta[0], -delta[1], x2, y2, -1.0, time, r,g,b,a,
		-delta[0], -delta[1], x2, y2, -1.0, time, r,g,b,a,
		 delta[0],  delta[1], x2, y2,  1.0, time, r,g,b,a,
		 delta[0],  delta[1], x1, y1,  1.0, time, r,g,b,a,
	]);
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

/** ---------------------------------------------------------------------------
 * Callback for when the database set has been loaded.
 */
function OnLoaded() {
	
	var elements = Source.GetElements();
	var fade_time = 1.0;
	//var vertices = new HC_Packer( "ssffffBBBB" );
	//var lines = new HC_Packer( "ssffBBBB" );
	fade_in_time = elements.length * fade_time + 1000;
	
	for( var i = 0; i < elements.length; i++ ) {
		if( elements[i].type == Source.E_WORD ) {
			
			var x = Math.round( elements[i].location.x );
			var y = Math.round( elements[i].location.y );
			var cell = GetCell( {x:x, y:y}, true );
			
			var phrase = Source.GetPhrase( elements[i].phrase );
			var text_width = MeasureText( phrase );
			  
			var box_width = text_width;
			var box_height = 12;
			var box_x = Math.floor( x - box_width /2 );
			var box_y = Math.floor( y + box_height/2 );
			
			DrawRect( 
				cell.buffer_words,
				box_x-2,
				box_y-2,
				box_width+4,box_height+4,40,56,1,1,
				x,y,
				1.0,1.0,1.0,elements[i].opacity, i*fade_time
			);
			
			DrawRect( 
				cell.buffer_boxes,
				box_x-2,
				box_y-2,
				box_width+4,box_height+4,40,56,1,1,
				x,y,
				1.0,1.0,1.0,elements[i].opacity, i*fade_time
			);
			
			DrawText(
				cell.buffer_words,
				box_x,
				y,
				phrase,
				x, y,
				0.0,0.0,0.0,elements[i].opacity, i*fade_time
			);
			// lol
		} else if( elements[i].type == Source.E_LINE ) {
		
			var x1 = Math.round( elements[i].from.x );
			var y1 = Math.round( elements[i].from.y );
			var x2 = Math.round( elements[i].to.x );
			var y2 = Math.round( elements[i].to.y );
			var cell = GetCell( {x:x2, y:y2}, true );
			
			DrawLine( cell.buffer_lines, x1, y1, x2, y2, 1.5, 
				elements[i].color.r, 
				elements[i].color.g, 
				elements[i].color.b, 
				elements[i].opacity, i*fade_time   );
			
		}
	}
	  
	// load vertex buffers.
	for( var cx in m_cells ) { 
		if( !m_cells.hasOwnProperty( cx ) ) continue;
		for( var cy in m_cells[cx] ) {
			if( !m_cells[cx].hasOwnProperty( cy ) ) continue;
			var cell = m_cells[cx][cy];
		  
			var buffer = new HC_Buffer();
			buffer.Load( cell.buffer_words.Buffer(), hc_gl.STATIC_DRAW ); 
			buffer.u_size = cell.buffer_words.total; 
			cell.buffer_words = buffer;
			
			buffer = new HC_Buffer();
			buffer.Load( cell.buffer_boxes.Buffer(), hc_gl.STATIC_DRAW );
			buffer.u_size = cell.buffer_boxes.total; 
			cell.buffer_boxes = buffer;
			
			buffer = new HC_Buffer();
			buffer.Load( cell.buffer_lines.Buffer(), hc_gl.STATIC_DRAW );
			buffer.u_size = cell.buffer_lines.total;
			cell.buffer_lines = buffer;
			
		}
	}
	 
	m_start_time = (new Date().getTime());
	// start frame loop
	m_next_tick = m_start_time;//
	OnFrame();
	
	
	$("#glcanvas").bind( "mousewheel", function( ev, delta ) {
		
		m_zooming -= delta * 0.05 * (2.0 + m_zoom_accel);
		m_zoom_accel += 0.1; 
	}); 

	$("#glcanvas").mousedown( function( ev ) {
		
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

	$("#glcanvas").mousemove( function( ev ) {
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

	$("#glcanvas").mouseup( function(ev ) { 
		if( ev.which == 1 ) {
			m_drag.active = false;
			
			m_flying.x = m_drag.vel.x / m_zoom;
			m_flying.y = -m_drag.vel.y / m_zoom;
		}
	}); 
	
	$("#loading").remove();
	/*
	$("#control_search").keypress( function(e) {
		if( e.which == 13 ) {
			
		}
	});*/
}



function DoFrameUpdate() {
	if( m_drag.active ) {
		m_zooming = 0.0;
		
		m_translate.x = m_drag.start.x + m_drag.x / m_zoom;
		m_translate.y = m_drag.start.y - m_drag.y / m_zoom; 
		
		m_drag.vel.x = m_drag.vel.x * 0.5;
		m_drag.vel.y = m_drag.vel.y * 0.5;
	} else {
		if( Math.abs(m_zooming) < 0.0001 
			&& Math.abs(m_flying.x) < 0.0001 
			&& Math.abs(m_flying.y) < 0.0001
			&& m_next_tick > m_start_time + fade_in_time
			&& !m_dirty ) {
			return;
		}
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
		
		m_zooming *= 0.95;
		
		m_translate.x += m_flying.x;
		m_translate.y += m_flying.y;
		m_flying.x *= 0.994;
		m_flying.y *= 0.994; 
	}
	m_zoom_accel *= 0.8;
	DrawScene();
	m_dirty = false;
}

function OnFrame() {
	
	DoFrameUpdate();
	
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