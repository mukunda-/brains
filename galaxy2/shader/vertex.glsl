attribute vec2 a_position;

uniform vec2 u_screen_scale;
uniform vec2 u_translate;

//uniform mat4 uMVMatrix;
//uniform mat4 uPMatrix;

void main(void) {
	gl_Position = vec4( (a_position+u_translate) * u_screen_scale , 1.0, 1.0 );
	
}