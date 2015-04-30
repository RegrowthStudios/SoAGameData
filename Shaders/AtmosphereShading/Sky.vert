//
// Atmospheric scattering vertex shader
//
// Author: Sean O'Neil
//
// Copyright (c) 2004 Sean O'Neil
//

// Uniforms
uniform mat4 unWVP;


// Input
in vec4 vPosition; // Position on unit icosphere

// Output
out vec3 fPosition;

void main() {
  gl_Position =  unWVP * vPosition;
  fPosition = vPosition.xyz;
}
