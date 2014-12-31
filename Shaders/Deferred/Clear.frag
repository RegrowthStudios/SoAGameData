// Output
out vec4 pDiffuse;
out vec4 pNormal;
out vec2 pDepth;

void main() {
  pDiffuse = vec4(0.0, 0.0, 0.0, 0.0);
  pNormal = vec4(0.5, 0.5, 0.5, 0.0);
  pDepth = vec2(1.0, 0.0);
  gl_FragDepth = 1.0;
}
