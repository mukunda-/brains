attribute vec2 a_position;
attribute vec2 a_texture;
attribute vec2 a_center;
attribute vec4 a_color;

uniform vec2 u_screen_scale;
uniform vec2 u_translate;

//uniform mat4 uMVMatrix;
//uniform mat4 uPMatrix;

varying lowp vec2 f_uv;
varying lowp vec2 f_center;
varying lowp vec4 f_color;


void main(void) {
	f_uv = a_texture;
	f_color = a_color;
	f_center = a_center;
	gl_Position = vec4( (a_position+u_translate) * u_screen_scale , 1.0, 1.0 );
	
}
