#version 130

// Input vertex data, different for all executions of this shader.
in vec3 vertexPosition_modelspace;

uniform mat4 MVP;

void main(){
	gl_Position =  MVP * vec4( vertexPosition_modelspace ,1);
}