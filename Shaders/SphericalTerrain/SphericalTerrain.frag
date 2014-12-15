// Input
in vec3 fColor;

// Output
out vec4 pColor;

void main() {
  pColor = vec4(fColor.rgb, 1.0);
}
