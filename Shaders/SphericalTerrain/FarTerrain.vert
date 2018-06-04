// Uniforms
uniform mat4 unVP;
uniform vec3 unTranslation;
uniform vec3 unPosition;
uniform float unHeightOffset;
uniform float unTexelWidth;
uniform float unNormalmapWidth;
uniform float unRadius;

// Input
in vec4 vPosition;
in vec3 vNormal;
in vec3 vColor;
in vec2 vTemp_Hum;

// Output
out vec3 fColor;
out vec3 fPosition;
out vec3 fWorldNormal;
out vec2 fTemp_Hum;
out vec3 fEyeDir;
out vec3 fNormal;
// Scattering
out vec3 fPrimaryColor;
out vec3 fSecondaryColor;

#include "Shaders/AtmosphereShading/scatter.glsl"
#include "Shaders/Utils/logz.glsl"

void main() {
  // Calculate spherical position
  vec3 relPos = vPosition.xyz + unTranslation;
  vec3 wPosition = relPos;
  wPosition.y = unRadius + vPosition.y + unHeightOffset;
  vec3 normal = normalize(wPosition);
  vec3 nPosition = normal * (unRadius + vPosition.y);
  
  scatter(nPosition);
  fPrimaryColor = sPrimaryColor;
  fSecondaryColor = sSecondaryColor;

  vec3 vpos = relPos + (nPosition - wPosition);
  
   // Compute direction to eye
  fEyeDir = normalize(-vpos);
  
  gl_Position = unVP * vec4(vpos, 1.0);
  applyLogZ();
  
  fColor = vColor;
  fPosition = vPosition.xyz + unPosition;
  fWorldNormal = vec3(0.0, 1.0, 0.0); // TODO(Ben): Not exactly right
  fNormal = vNormal; // TODO(Ben): Not exactly right
  fTemp_Hum = vTemp_Hum;
}
