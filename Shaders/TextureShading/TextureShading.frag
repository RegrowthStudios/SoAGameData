// Uniforms
uniform sampler2D unTex;

// Input
in vec2 fUV;

// Output
out vec4 pColor;

void main() {
  pColor = texture(unTex, fUV);
  pColor.rgb *= 2.5; // Why...
}
