// Input
in vec4 vPosition;

// Output
out vec4 fPosition;
out vec2 fUV;

void main() {
  fUV = (vPosition.xy + 1.0) * 0.5;
  fPosition = vPosition;
  fPosition.w = 1.0;
  gl_Position = fPosition;
}
