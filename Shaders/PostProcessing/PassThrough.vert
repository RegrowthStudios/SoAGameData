#version 130

// Input vertex data, different for all executions of this shader.
in vec2 vertexPosition_screenspace;

// Output data ; will be interpolated for each fragment.
out vec2 UV;

void main(){
	gl_Position =  vec4(vertexPosition_screenspace.xy, 0, 1);
	UV = (vertexPosition_screenspace + 1.0) / 2.0;
}

