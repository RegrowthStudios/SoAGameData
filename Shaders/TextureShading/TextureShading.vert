#version 130

// Uniforms
uniform mat4 unWVP;

// Input
in vec4 vPosition; // Position in object space
in vec2 vUV;

// Output
out vec2 fUV;

void main() {
  fUV = vUV;
  gl_Position = unWVP * vPosition;
}
