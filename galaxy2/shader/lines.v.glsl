
// position of vertex
attribute vec2 a_position;

// centerpoint of line end
attribute vec2 a_center;

// which side of line this is on, -1 or 1
attribute float a_side;

// color of line
attribute vec4 a_color;

uniform vec2 u_screen_scale;
uniform vec2 u_line_scale;
uniform vec2 u_translate;  

//uniform mat4 uMVMatrix;
//uniform mat4 uPMatrix;

varying lowp float f_side;
varying lowp vec4 f_color;

void main(void) {
	f_side = a_side;
	f_color = a_color;
	
	vec2 center = (a_center + u_translate);
	
	center = center * u_screen_scale;
	float a = sin(length(center)*3.14/4.0);
	center *= 1.0 + a*a;
	
	center += a_position/256.0 * u_line_scale;//;
	gl_Position = vec4( center , 0.0, 1.0 ); 

//	gl_Position = vec4( (a_center + u_translate) * u_screen_scale + (a_position/256.0* u_line_scale) , 0.0, 1.0 );
}

