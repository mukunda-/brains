attribute vec2 aVertexPosition;

//uniform mat4 uMVMatrix;
//uniform mat4 uPMatrix;

void main(void) {
	gl_Position = vec4(aVertexPosition, 1.0, 1.0);
}