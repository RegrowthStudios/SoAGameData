// Uniforms
uniform mat4 unVP;
uniform vec3 unTranslation;
uniform vec3 unPosition;
uniform float unHeightOffset;
uniform float unTexelWidth;
uniform float unNormalmapWidth;
uniform float unRadius;

// Input
in vec4 vPosition; // Position in object space
in vec3 vTangent;
in vec3 vColor;
in vec2 vNormUV;
in vec2 vTemp_Hum;

// Output
out vec3 fColor;
out vec2 fNormUV;
out vec3 fPosition;
out vec2 fTemp_Hum;
out mat3 fTbn;
out vec3 fEyeDir;
out vec3 fNormal;
// Scattering
out vec3 fPrimaryColor;
out vec3 fSecondaryColor;

#include "Shaders/AtmosphereShading/scatter.glsl"
#include "Shaders/Utils/logz.glsl"

vec3 computeTangent(vec3 wPosition, vec3 nPosition) {
    vec3 tangent = wPosition;
    tangent.x += 10.0;
    tangent = normalize(tangent) * (unRadius + vPosition.y);
    return normalize(tangent - nPosition);
}

void main() {
  // Calculate spherical position
  vec3 relPos = vPosition.xyz + unTranslation;
  vec3 wPosition = relPos;
  wPosition.y = unRadius + vPosition.y + unHeightOffset;
  vec3 normal = normalize(wPosition);
  fNormal = normal;
  vec3 nPosition = normal * (unRadius + vPosition.y);
  
  scatter(nPosition);
  fPrimaryColor = sPrimaryColor;
  fSecondaryColor = sSecondaryColor;
  
  vec3 tangent = computeTangent(wPosition, nPosition);
  
  vec3 vpos = relPos + (nPosition - wPosition);
  
   // Compute direction to eye
  fEyeDir = normalize(-vpos);
  
  // Compute TBN for converting to world space
  fTbn = mat3(tangent, normal, cross( normal, tangent));
  
  gl_Position = unVP * vec4(vpos, 1.0);
  applyLogZ();
  
  fColor = vColor;
  fPosition = vPosition.xyz + unPosition;
  // Move normal map UV in by 1 texel in each direction
  fNormUV = vNormUV * unNormalmapWidth + 1.1 * unTexelWidth;
  
  fTemp_Hum = vTemp_Hum;
}
