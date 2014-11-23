#version 130

// Uniforms
uniform mat4 unWVP;

// Input
in vec4 vPosition; // Position in object space

void main() {
  gl_Position =  unWVP * vPosition;
}
