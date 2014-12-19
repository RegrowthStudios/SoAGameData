// Input
in vec4 vPosition;

// Output
out vec2 fUV;

void main() {
  fUV = (vPosition.xy + 1.0) * 0.5;
  gl_Position = vPosition;
}
