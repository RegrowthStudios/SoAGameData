// Uniforms
uniform sampler2D unTex;
uniform float unExposure;
uniform float unGamma;
#ifdef MOTION_BLUR
uniform sampler2D unTexDepth;
uniform int unNumSamples;
uniform mat4 unVPInv;
uniform mat4 unVPPrev;
uniform float unBlurIntensity;
#endif

// Input
in vec2 fUV;

// Output
out vec4 pColor;

void main() {
  vec3 color = texture(unTex, fUV).rgb;

#ifdef MOTION_BLUR
  // Reconstruct position in world space
  float depth = texture(unTexDepth, fUV).x;  
  vec4 screenPos = vec4(fUV * 2 - 1, depth, 1);
  vec4 worldPos = unVPInv * screenPos;
  worldPos /= worldPos.w;

  // Construct pixel position of last frame
  vec4 previousPos = unVPPrev * worldPos;
  previousPos /= previousPos.w;
  
  // Compute pixel velocity
  vec2 velocity = (screenPos.xy - previousPos.xy) * 0.5 * unBlurIntensity;
  vec2 sampleDisplacement = velocity / unNumSamples;
  
  // Accumulate blur samples
  float accum = 1;
  vec2 uv = fUV;
  for(int i = 0; i < unNumSamples; i++) {
    float ratio = exp(-(i / unNumSamples) * unBlurIntensity);
    accum += ratio;
    uv -= sampleDisplacement;
    color += texture(unTex, uv).rgb * ratio;
  }
  color /= accum;
#endif

  color = 1.0 - exp(color * -unExposure); // Add exposure
  color = pow(color, vec3(unGamma)); // Gamma correction
  pColor = vec4(color, 1.0);
}
