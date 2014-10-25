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
