// Uniforms
uniform sampler2D unTex;
uniform float unExposure;
uniform float unGamma;

// Input
in vec2 fUV;

// Output
out vec4 pColor;

void main() {
  vec3 color = texture(unTex, fUV).rgb;
  color = 1.0 - exp(color * -unExposure); // Add exposure
  color = pow(color, vec3(unGamma)); // Gamma correction
  pColor = vec4(color, 1.0);
}
