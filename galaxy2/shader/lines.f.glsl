varying lowp float f_side;
varying lowp vec4 f_color;
 
// todo: HQ version.
//           
void main(void) {
	
	lowp float a = abs(f_side);
	
// todo: HQ version.
//  
	lowp float w = 0.1;
	
	a = a - (0.5-w);
	a = a - 0.5;
	a = a * 1.0/w;
	a = a + 0.5;
	a = mix( f_color.a, 0.0, clamp( a, 0.0, 1.0 ) );
	gl_FragColor = vec4( f_color.rgb, a );
}
