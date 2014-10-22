/*! [[HC]] 
 * Copyright 2014 mukunda
 */
 
/** ---------------------------------------------------------------------------
 * [class] Vertex Buffer
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
}

/** ---------------------------------------------------------------------------
 * Load vertex data.
 *
 * @param ? data Data to load.
 * @param ? method Rendering hint.
 */
HC_Buffer.prototype.Load = function( data, method ) {
	this.Bind();
	
	hc_gl.bufferData( hc_gl.ARRAY_BUFFER, data, method );
}
