// Input
in vec2 vPosition; // Position in screen space

// Output
out vec2 fUV;

void main() {
  fUV = (vPosition + 1.0) / 2.0;
  gl_Position =  vec4(vPosition, 0, 1);
}
