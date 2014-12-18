// Uniforms
uniform unWorld;
uniform unVP;

// Input
in vec4 vPosition;

// Output
out vec4 fPosition;

void main() {
  fPosition = unVP * unWorld * vPosition;
  gl_Position = fPosition;
}
