uniform sampler2D unColorLookup;
uniform float unInnerRadius;
uniform float unOuterRadius;
uniform vec3 unLightPos;
uniform vec3 unPlanetPos;
uniform float unPlanetRadius;
uniform float unZCoef;

in vec3 fPosition;
in vec3 fWorldPosition;
in float fLogZ;

out vec4 pColor;

#include "Shaders/Utils/Intersection.glsl"

void main() {
  gl_FragDepth = log2(fLogZ) * unZCoef * 0.5;
  float len = length(fPosition);
  float u = (len - unInnerRadius) / (unOuterRadius - unInnerRadius);

  if (abs(u) > 1.0) {
    pColor = vec4(0.0);
  } else {
    vec4 ringColor = texture(unColorLookup, vec2(u, 0.0)).rgba;
    const float smoothingAmount = 100.0;
    float shadow = clamp(-sphereIntersectAmount(normalize(fWorldPosition - unLightPos), fWorldPosition, unPlanetPos, unPlanetRadius) / smoothingAmount, 0.0, 1.0);
    ringColor.rgb *= 1.0 - shadow;
    pColor = ringColor;
  }
}