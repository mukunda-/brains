attribute vec2 a_position;
attribute vec2 a_texture;
attribute vec2 a_center;
attribute float a_time;
attribute vec4 a_color;

uniform vec2  u_screen_scale;
uniform vec2  u_word_scale;
uniform vec2  u_translate;
uniform float u_zoom;
uniform vec2  u_screen_dimensions;
uniform float u_time;
 
varying lowp vec2 f_uv;
varying lowp vec4 f_color;

void main(void) {
	f_uv = a_texture;
	
	float t = u_time - a_time;
	t = t / 1000.0;
	t = clamp(t, 0.0,1.0);
	f_color = vec4( a_color.rgb, a_color.a * t );
	
	vec2 center = (a_center + u_translate);
	
	center = center * u_screen_scale;
	float a = 1.0-cos(length(center)*3.14/3.0);
	center *= 1.0 + a*a; 
	
	if( u_zoom >= 0.9 ) {
		center = floor(center * (u_screen_dimensions/2.0)+0.5);
		center = center/ (u_screen_dimensions/2.0);
	}
	center += a_position * u_word_scale;
	gl_Position = vec4( center , 0.0, 1.0 );
	
}

