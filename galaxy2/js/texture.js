
/** ---------------------------------------------------------------------------
 * [class] Create a texture from a file.
 *
 * @param string path Path to texture file.
 * @param GLenum [format] Format of texture. Default = RGBA
 */
function HC_Texture( path, format ) {
	this.format = format || hc_gl.RGBA;
	this.texture = hc_gl.createTexture();
	
	var image = new Image();
	image.onload = function() { OnImageLoaded( image ) }; 
	image.src = path;
}

HC_Texture.prototype.OnImageLoaded( image ) {
	hc_gl.bindTexture( hc_gl.TEXTURE_2D, this.texture );
	hc_gl.texImage2D( hc_gl.TEXTURE_2D, 0, this.format, this.format, hc_gl.UNSIGNED_BYTE, image );
	hc_gl.texParameteri( hc_gl.TEXTURE_2D, hc_gl.TEXTURE_MAG_FILTER, hc_gl.LINEAR );
	hc_gl.texParameteri( hc_gl.TEXTURE_2D, hc_gl.TEXTURE_MIN_FILTER, hc_gl.LINEAR_MIPMAP_NEAREST );
	hc_gl.generateMipmap( hc_gl.TEXTURE_2D );
	hc_gl.bindTexture( hc_gl.TEXTURE_2D, null );
}
