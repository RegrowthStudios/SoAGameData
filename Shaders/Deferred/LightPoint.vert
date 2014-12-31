// Uniforms
uniform unWorld;
uniform unVP;

// Input
in vec4 vPosition; // Position on the unit sphere

// Output
out vec4 fPosition;

void main() {
  fPosition = unVP * unWorld * vPosition;
  gl_Position = fPosition;
}
