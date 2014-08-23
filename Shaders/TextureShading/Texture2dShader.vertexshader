#version 130

// Input vertex data, different for all executions of this shader.
in vec2 vertexPosition_screenspace;
in vec2 vertexUV;
in vec4 vertexColor;

// Output data ; will be interpolated for each fragment.
out vec2 UV;
out vec4 fragmentColor;
uniform float xdim;
uniform float ydim;
uniform float xmod;
uniform float ymod;

void main(){

	// Output position of the vertex, in clip space
	// map [0..800][0..600] to [-1..1][-1..1]
	gl_Position =  vec4( ((vertexPosition_screenspace.x+xmod)/xdim)*2.0 - 1.0, ((vertexPosition_screenspace.y+ymod)/ydim)*2.0 - 1.0, 0, 1);
	
	fragmentColor = vertexColor;
	
	// UV of the vertex. No special space for this one.
	UV = vertexUV;
}

