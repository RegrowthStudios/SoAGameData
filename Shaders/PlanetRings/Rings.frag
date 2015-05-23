uniform sampler2D unColorLookup;
uniform float unInnerRadius;
uniform float unOuterRadius;
uniform vec3 unLightPos;
uniform vec3 unPlanetPos;
uniform float unPlanetRadius;

in vec3 fPosition;
in vec3 fWorldPosition;

out vec4 pColor;

#include "Shaders/Utils/Intersection.glsl"

void main() {
  float len = length(fPosition);
  float u = (len - unInnerRadius) / (unOuterRadius - unInnerRadius);
  vec4 ringColor = texture(unColorLookup, vec2(u, 0.0)).rgba;
  
  if (sphereIntersect(normalize(unLightPos - fWorldPosition), fWorldPosition, unPlanetPos, unPlanetRadius) > 3.0) {
    ringColor.rgb *= 0.01;
  }

  pColor = ringColor;
}