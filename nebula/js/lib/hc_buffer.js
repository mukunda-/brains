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
