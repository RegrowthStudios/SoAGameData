// Uniforms
uniform sampler2D unTexColor;
uniform sampler2D unTexDepth;
uniform sampler2D unTexLight;

// Input
in vec2 fUV;

// Output
out vec4 pColor;

void main() {
  vec3 lColor = texture(unTexLight, fUV).rgb;
  vec3 mColor = texture(unTexColor, fUV).rgb;
  pColor = vec4(lColor * mColor, 1.0);
  gl_FragDepth = texture(unTexDepth, fUV).x;
}
