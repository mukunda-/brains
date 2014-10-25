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


/*! [[HC]] 
 * Copyright 2014 mukunda
 */
 
/** ---------------------------------------------------------------------------
 * [class] Vertex Buffer
 *
 * Controls a single GL vertex buffer.
 */
function HC_Buffer() {
	this.buffer = hc_gl.createBuffer();
	this.Bind();
}

/** ---------------------------------------------------------------------------
 * Bind this buffer.
 */
HC_Buffer.prototype.Bind = function() {
	hc_gl.bindBuffer( hc_gl.ARRAY_BUFFER, this.buffer );
};


/** ---------------------------------------------------------------------------
 * Load vertex data.
 *
 * @param ArrayBuffer/x data Data to load.
 * @param GLenum usage Rendering hint.
 */
HC_Buffer.prototype.Load = function( data, usage ) {

	this.Bind();
	
	hc_gl.bufferData( hc_gl.ARRAY_BUFFER, data, usage );
};


/*! [[HC]] 
 * Copyright 2014 mukunda
 */
 
(function() {

function CC( str ) {
	return str.charCodeAt(0);
}
 
var	BYTE   = 0; var UBYTE  = 1;
var SHORT  = 2; var USHORT = 3;
var INT    = 4; var UINT   = 5;
var FLOAT  = 6; var DOUBLE = 7;

var TYPEMAP = {
	'b': BYTE,
	'B': UBYTE,
	's': SHORT,
	'S': USHORT,
	'i': INT,
	'I': UINT,
	'f': FLOAT,
	'd': DOUBLE
};

var SIZES = {};

SIZES[BYTE]  = 1; SIZES[UBYTE]  = 1;
SIZES[SHORT] = 2; SIZES[USHORT] = 2;
SIZES[INT]   = 4; SIZES[UINT]   = 4;
SIZES[FLOAT] = 4; SIZES[DOUBLE] = 8;

var ALLOC_SIZE = 64;

/****************************************************
 normal example of usage:
 
   // create buffer, float x2 and unsigned byte x4
   var buffer = HC_Packer( "ff BBBB" );
   
   // insert data
   buffer.Push( [ 1.0, 1.0, 255,255,255,255 ] );
   buffer.Push( [ 1.0, 1.0, 255,255,255,255 ] );
   buffer.Push( [ 1.0, 1.0, 255,255,255,255 ] );
   buffer.Push( [ 1.0, 1.0, 255,255,255,255 ] ); 
   
   // get resulting buffer with Buffer()
   gl_operation( a, b, buffer.Buffer(), c );
   
*****************************************************/

/** ---------------------------------------------------------------------------
 * [class] Data packer/serializer
 *
 * @param string format Format of data to be packed.
 *        each letter in the format is a data type that is in the packed
 *        format. Spaces can be used for 
 *        For example, "fff ff bbbb" would be a vertex struct like this:
 *                                   float x,y,z
 *                                   float u,v
 *                                   byte r,g,b,a;
 *        Data type list:
 *          b: signed 8-bit integer (byte)
 *          B: unsigned 8-bit integer
 *          s: signed 16-bit integer (short)
 *          S: unsigned 16-bit integer 
 *          i: signed 32-bit integer
 *          I: unsigned 32-bit integer
 *          f: 32-bit floating point (float)
 *          d: 64-bit floating point (double)
 */
HC_Packer = function( format ) {
	if( !format.match( /[bBsSiIfd ]+/ ) ) {
		throw new Error( "Invalid format string." );
	}
	
	var stripped_format = format.replace( / /g, "" );
	
	var p_format = [];
	
	for( var i = 0; i < stripped_format.length; i++ ) {
		p_format.push( TYPEMAP[stripped_format[i]] );
	}
	
	this.format = p_format;
	this.cell_size = ComputeSize( p_format );
	this.buffer = new ArrayBuffer(0);
	this.total = 0;
};

/** ---------------------------------------------------------------------------
 * Push data into the buffer.
 *
 * @param array values Values to push. Length must be divisible by
 *                     the format length.
 * @return int Total number of cells (formatted structs) in the buffer.
 */
HC_Packer.prototype.Push = function( values ) {
	var start = 0;
	
	while( start < values.length ) {
		if( this.write_buffer == null ) {
			this.CreateWriteBuffer();
		}
		
		var pos = this.write_index * this.cell_size;
		
		for( var i = 0; i < this.format.length; i++ ) {
			var value = values[start+i];
			var type = this.format[i];
			
			switch( type ) {
				case BYTE:
					this.buffer_view.setInt8( pos, value );
					break;
				case UBYTE:
					this.buffer_view.setUint8( pos, value );
					break;
				case SHORT:
					this.buffer_view.setInt16( pos, value, true );
					break;
				case USHORT:
					this.buffer_view.setUint16( pos, value, true );
					break;
				case INT:
					this.buffer_view.setInt32( pos, value, true );
					break;
				case UINT:
					this.buffer_view.setUint32( pos, value, true );
					break;
				case FLOAT:
					this.buffer_view.setFloat32( pos, value, true );
					break;
				case DOUBLE:
					this.buffer_view.setFloat64( pos, value, true );
					break;
			}
			pos += SIZES[type];
		}
		this.write_index++;
		if( this.write_index == ALLOC_SIZE ) {
			// our temp buffer has been maxed out, concatenate to the main buffer.
			this.Flush();
		}
		this.total++;
		start += this.format.length;
	}
	return this.total;
};

/** ---------------------------------------------------------------------------
 * Return the data buffer.
 */
HC_Packer.prototype.Buffer = function() {
	this.Flush();
	return this.buffer;
};

/** ---------------------------------------------------------------------------
 * Create a writing buffer.
 *
 * This is not called normally.
 */
HC_Packer.prototype.CreateWriteBuffer = function() {
	this.write_buffer = new ArrayBuffer( this.cell_size * ALLOC_SIZE );
	this.write_index = 0;
	this.buffer_view = new DataView( this.write_buffer );
};

/** ---------------------------------------------------------------------------
 * Push the write buffer into the main buffer, and delete the write buffer.
 *
 * This is called by Buffer, so you don't have to worry about it.
 */
HC_Packer.prototype.Flush = function() {
	if( this.write_buffer == null ) return;
	this.buffer_view = null;
	var bucket = new Uint8Array( this.buffer.byteLength + 
							     this.write_buffer.byteLength );
	bucket.set( new Uint8Array( this.buffer ), 0 );
	bucket.set( new Uint8Array( this.write_buffer ), this.buffer.byteLength );
	this.buffer = null;
	this.buffer = bucket.buffer;
	this.write_buffer = null;
	this.write_index = 0;
};

/** ---------------------------------------------------------------------------
 * Compute the size per format cell.
 *
 * @param string format A format string.
 * @return int Size in bytes.
 */
function ComputeSize( format ) {
	var size = 0;
	
	for( var i = 0; i < format.length; i++ ) {
		size += SIZES[format[i]];
	}
	return size;
}

})();

/*! [[HC]] 
 * Copyright 2014 mukunda
 */

/** ---------------------------------------------------------------------------
 * [class] Shader component.
 *
 * @param string|object source 
 *        Source for shader. Can either be a DOM id, which is loaded with 
 *        HC_GetShaderScript, or an object with these fields:
 *           "type": "fragment" or "vertex"
 *           "code": Shader source code.
 */
function HC_ShaderSource( source ) {
	if( typeof source === "string" ) {
		source = HC_ReadShaderScript( source );
	}
	
	if( source.type == "fragment" ) {
		this.shader = hc_gl.createShader( hc_gl.FRAGMENT_SHADER );
	} else if( source.type == "vertex" ) {
		this.shader = hc_gl.createShader( hc_gl.VERTEX_SHADER );
	} else {
		throw new Error("Invalid shader type.");
	}

	hc_gl.shaderSource( this.shader, source.code );
	hc_gl.compileShader( this.shader );
	
	if( !hc_gl.getShaderParameter( this.shader, hc_gl.COMPILE_STATUS ) ) {  
		
		console.log( "Error compiling shader \"" + source.id + "\":\n" 
						+ hc_gl.getShaderInfoLog( this.shader ));  
		throw new Error("Shader compilation error");
	}
}

/** ---------------------------------------------------------------------------
 * [class] Shader program.
 */
function HC_Shader() {
	this.program = hc_gl.createProgram();
}

/** ---------------------------------------------------------------------------
 * Attach a shader source.
 *
 * @param string|HC_ShaderSource source 
 *        Component to attach. If this is a string, then this will treat it as
 *        a script ID and try to load the shader from there
 */
HC_Shader.prototype.Attach = function( source ) {
	if( typeof source === "string" ) {
		source = new HC_ShaderSource( source );
	}
	hc_gl.attachShader( this.program, source.shader );
};

/** ---------------------------------------------------------------------------
 * Link the program.
 */
HC_Shader.prototype.Link = function() {
	hc_gl.linkProgram( this.program );
	if( !hc_gl.getProgramParameter( this.program, hc_gl.LINK_STATUS ) ) {
		console.log( "Unable to link shader." );  
		throw "Shader link error.";
	}
};

/** ---------------------------------------------------------------------------
 * Use the program.
 */
HC_Shader.prototype.Use = function() {
	hc_gl.useProgram( this.program );
};

/** ---------------------------------------------------------------------------
 * Wrapper for getAttribLocation
 *
 * @param string name Name of attribute
 * @return Attribute location. (see gl docs.)
 */
HC_Shader.prototype.GetAttribute = function( name ) {
	return hc_gl.getAttribLocation( this.program, name );
};

/** ---------------------------------------------------------------------------
 * Wrapper for getUniformLocation
 *
 * @param string name Name of uniform variable.
 * @return Uniform variable location. (see gl docs.)
 */
HC_Shader.prototype.GetUniform = function( name ) {
	return hc_gl.getUniformLocation( this.program, name );
};

/** ---------------------------------------------------------------------------
 * Read a shader script from the DOM.
 *
 * @param string id ID of element to read from.
 * @return object Shader script object for HC_ShaderSource constructor.
 */
function HC_ReadShaderScript( id ) {
	var out = {};
	
	var e = document.getElementById(id);
	if( e === null ) {
		console.log( "Missing script ID." );  
		throw "Shader script error.";
	}
	
	out.id = id;
	if( e.type == "x-shader/x-fragment" ) {
		out.type = "fragment";
	} else if( e.type == "x-shader/x-vertex" ) {
		out.type = "vertex";
	} else {
		console.log( "Unknown script type." );  
		throw "Shader script error.";
	}
	
	out.code = e.text;
	
	return out;
}


/*! [[HC]] 
 * Copyright 2014 mukunda
 */
 
/** ---------------------------------------------------------------------------
 * [class] Create a texture from a file.
 *
 * @param string path Path to texture file.
 * @param GLenum [format] Format of texture. Default = RGBA
 */
function HC_Texture( path, format, onload ) {
	this.format = format || hc_gl.RGBA;
	this.texture = hc_gl.createTexture();
	this.onload = onload;

	var image = new Image();
	var m_this = this;
	image.onload = function() { m_this.OnImageLoaded( image ) }; 
	image.src = path;
}

HC_Texture.prototype.OnImageLoaded = function( image ) {
	hc_gl.bindTexture( hc_gl.TEXTURE_2D, this.texture );
	hc_gl.texImage2D( hc_gl.TEXTURE_2D, 0, this.format, this.format, hc_gl.UNSIGNED_BYTE, image );
//	hc_gl.texParameteri( hc_gl.TEXTURE_2D, hc_gl.TEXTURE_MAG_FILTER, hc_gl.LINEAR );
//	hc_gl.texParameteri( hc_gl.TEXTURE_2D, hc_gl.TEXTURE_MIN_FILTER, hc_gl.LINEAR_MIPMAP_LINEAR );
	
	hc_gl.texParameteri( hc_gl.TEXTURE_2D, hc_gl.TEXTURE_WRAP_S, hc_gl.CLAMP_TO_EDGE ); 
	hc_gl.texParameteri( hc_gl.TEXTURE_2D, hc_gl.TEXTURE_WRAP_T, hc_gl.CLAMP_TO_EDGE ); 

	hc_gl.generateMipmap( hc_gl.TEXTURE_2D );
	this.onload();
	hc_gl.bindTexture( hc_gl.TEXTURE_2D, null );
};

/** ---------------------------------------------------------------------------
 * Bind this texture to the active texture unit.
 */
HC_Texture.prototype.Bind = function() {
	hc_gl.bindTexture( hc_gl.TEXTURE_2D, this.texture );
};


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
	$.get( "../tree.php", {} )
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

/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.12
 *
 * Requires: jQuery 1.2.2+
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});

// process the data set

window.Source = new function() {
	
var m_source;

var m_stack = [];
var m_found = {};

//var m_cells = {};
var m_phrases = {};

var m_elements = [];

var MAX_SHADE_DIST = 500;

var E_WORD = 1;
this.E_WORD = 1;
var E_LINE = 2;
this.E_LINE = 2;

var m_postload;

function Load( source, onload ) {
	// todo: double up links, remove that from tree.php
	m_source = source;
	
	// add reversed links
	var backlinks = {};

	for( var from in m_source.links ) {
		if( !m_source.links.hasOwnProperty( from ) ) continue;
		
		for( var i = 0; i < m_source.links[from].length; i++ ) {
			var to = m_source.links[from][i].to;
			
			if( !backlinks.hasOwnProperty( to ) ) {
				backlinks[to] = [];
			}
			backlinks[to].push({
				"to": from,
				"score": m_source.links[from][i].score
			});
		}
		
	}
	
	for( var i in backlinks ) {
		if( !backlinks.hasOwnProperty( i ) ) continue;
		
		if( !m_source.links.hasOwnProperty( i ) ) {
			m_source.links[i] = [];
		}
		
		m_source.links[i] = m_source.links[i].concat( backlinks[i] );
	}
	// i hope that worked
	
	backlinks = null;
	
	m_stack.push( {
		from: 0,
		id: m_source.start, 
		progress: 0, 
		x:0, y:0, 
		level:0, 
		power: 100, 
		angle: 0.0,
		color: {
			r: 1.0,
			g: 1.0,
			b: 1.0
		}
	});
	setTimeout( DoProcess, 5 );
	
	m_postload = onload;
}

function GetElements() {
	return m_elements;
}

function GetPhrase( id ) {
	return m_source.phrases[id];
}

function GetCell( point, create ) {
	x = point.x >> 8;
	y = point.y >> 8;
	x = x < 0 ? -x*2+1 : x*2;
	y = y < 0 ? -y*2+1 : y*2;
	
	if( m_cells.hasOwnProperty( x ) && m_cells[x].hasOwnProperty(y) ) {
		return m_cells[x][y];
	} 
	if( !create ) return null;
	
	if( !m_cells.hasOwnProperty( x ) ) {
		m_cells[x] = {};
	}
	
	m_cells[x][y] = { lines: [], words: [] };
	return m_cells[x][y];
}
	
/** ---------------------------------------------------------------------------
 * Add an word to the element list.
 *
 * @param int phrase ID of phrase to use. 0 for a line-only element.
 * @param point point Destination point.
 * @param float opacity Opacity to render the element.
 */
function AddWord( phrase, point, opacity, level ) {
	var index = m_elements.push( {
		type: E_WORD,
		phrase: phrase,
		location: {
			x: point.x,
			y: point.y,
		},
		opacity: opacity,
		level: level
	}) - 1;
	
	//var cell = GetCell( point );
	//cell.push( index );
}

/** ---------------------------------------------------------------------------
 * Add a connection/line.
 *
 * @param point from,to Line coordinates.
 * @param float opacity Opacity to render the element.
 */
function AddLine( from, to, color, opacity, level ) {
	var index = m_elements.push( {
		type: E_LINE,
		from: {
			x: from.x,
			y: from.y
		}, 
		to: {
			x: to.x,
			y: to.y
		},
		color: color,
		opacity: opacity,
		level: level
	}) - 1;
	
	//var cell = GetCell( to );
	//cell.push( index );
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function Shuffle( o ) { //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function RndRange( min, max ) {
	return Math.random() * (max-min) + min;
}

function Distance2( a, b ) {
	return (b.x-a.x)*(b.x-a.x)+(b.y-a.y)*(b.y-a.y);
}

function ProcessItem() { 
	if( Math.random() < 0.1 ) {
		var item = m_stack.shift();
	} else {
		var item = m_stack.pop();
	}
		
	var found = m_found.hasOwnProperty(item.id);
	
	if( found ) {
		if( Distance2( 
				m_found[item.from], m_found[item.id].x ) 
				    < MAX_SHADE_DIST * MAX_SHADE_DIST ) {
					  
			AddLine( m_found[item.from], m_found[item.id], item.color, 0.5, item.level );
			 
			return 1;
		}
	}
	
	if( item.from != 0 ) {
		// draw line
		AddLine( m_found[item.from], item, m_found[item.from].color, found ? 0.5 : 1.0, item.level );
	}
	
	if( item.progress == 0 ) {
		AddWord( item.id, item, found ? 0.5 : 1.0, item.level  );
		item.progress = 1;
	}
	
	if( m_found.hasOwnProperty(item.id)  ) return 0;
	m_found[item.id] = { x: item.x, y: item.y,
		color: {
			r: item.color.r,
			g: item.color.g,
			b: item.color.b
		}
	};
	
	//item.color.r = ;
	//item.color.g = Math.clamp( item.color.g+RndRange( -0.2, 0.2 ), 0.5, 1.0 );
	//item.color.b = Math.clamp( item.color.b+RndRange( -0.2, 0.2 ), 0.5, 1.0 );
	
	
	Shuffle( m_source.links[item.id] );
	
	var length = m_source.links[item.id].length;
	//var dbase = -140.0;
	
	for( var i = 0; i < length; i++ ) {
		if( m_source.links[item.id][i].to == item.from ) continue;
		var distance_range = 1.0 + Math.max(1.0-(item.level / 10.0),0.0) * 2.0  + 1.0;// Math.max( Math.min( 1.0, length / 5.0 * 1.0 ), 0.2 ) * 3.0;+
		
		var angle_range = 0.1+Math.min( 1.0, length / 10.0 ) * 2.0 +  Math.max(1.0-(item.level / 3.0),0.0) * 6.0; 
		var angle = item.angle + RndRange(-angle_range,angle_range) - 0.02;
		  
		var distance = RndRange( 70.0 , 100.0 )* distance_range;// + dbase;
	 
		var x2 = Math.round(item.x + Math.cos( angle ) * distance);
		var y2 = Math.round(item.y + Math.sin( angle ) * distance);
	
		m_stack.push( {
			from: item.id,
			id: m_source.links[item.id][i].to,
			power: m_source.links[item.id][i].score,
			progress: 0,
			level: item.level+1,
			x: x2,
			y: y2,
			angle: angle,
			color: {
				r: Math.clamp( item.color.r + RndRange( -0.1, 0.1 ), 0.4, 1.0 ),
				g: Math.clamp( item.color.g + RndRange( -0.1, 0.1 ), 0.4, 1.0 ),
				b: Math.clamp( item.color.b + RndRange( -0.1, 0.1 ), 0.4, 1.0 )
			}} ); 
	}
	return 1;
}


function DoProcess() {
	
	var time = 0;
	while( time < 50 ) {// 4000 ) {
		if( m_stack.length == 0 ) {
			m_postload();
			return; // finished!
		}
		time += ProcessItem();
	}
	
	setTimeout( DoProcess, 5 );
}

this.GetCell = GetCell;
this.Load = Load;

this.GetElements = GetElements;
this.GetPhrase = GetPhrase;
	
};

