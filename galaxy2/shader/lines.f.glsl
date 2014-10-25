varying lowp float f_side;
varying lowp vec4 f_color;

//uniform lowp float u_pixwidth;

//       width of pixel
//         |-----|
// ---------._               -
//            `              |
//             \             | alpha
//              |            |
//              `----------- -
// |-----------------------|
//           |side|
//           
void main(void) {
	lowp float a = abs(f_side);
	
	lowp float w = 0.1;
	
	a = a - (0.5-w);
	a = a - 0.5;
	a = a * 1.0/w;
	a = a + 0.5;
	a = mix( f_color.a, 0.0, clamp( a, 0.0, 1.0 ) );
	gl_FragColor = vec4( f_color.rgb, a );
}
