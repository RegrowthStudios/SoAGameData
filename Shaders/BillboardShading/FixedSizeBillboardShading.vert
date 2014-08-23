#version 130
// Input vertex data, different for all executions of this shader.
in vec3 position;
in vec2 uv;

// Values that stay constant for the whole mesh.
out vec2 UV;

uniform mat4 MVP;
uniform vec2 UVstart;
uniform vec2 UVmod;
uniform vec2 UVwidth;
uniform float width;
uniform float height;

void main(){
    gl_Position = MVP * vec4(position, 1.0f);
	gl_Position /= gl_Position.w;
    
    gl_Position.xy += (uv + UVmod) * vec2(width, height);
    
	UV = UVstart + (uv * UVwidth);
}

