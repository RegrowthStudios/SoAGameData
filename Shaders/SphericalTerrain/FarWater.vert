// Uniforms
uniform mat4 unVP;
uniform vec3 unTranslation;
uniform vec3 unLightDirWorld;
uniform float unHeightOffset;
uniform float unFreezeTemp;
uniform float unRadius;

// Input
in vec4 vPosition; // Position in object space
in vec3 vTangent;
in vec4 vColor_Temp;
in vec2 vUV;
in float vDepth;

// Output
out vec3 fColor;
out vec2 fUV;
out float fTemp;
out float fDepth;
out float frozen; // Needed to prevent shader precision issues
out mat3 fTbn;
out vec3 fEyeDir;
// Scattering
out vec3 fPrimaryColor;
out vec3 fSecondaryColor;

#include "Shaders/AtmosphereShading/scatter.glsl"

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
  
  // Check if the liquid is frozen
  if (vColor_Temp.a <= unFreezeTemp) {
    frozen = 1.0;
  } else {
    frozen = 0.0;
  }
 
  gl_Position = unVP * vec4(vpos, 1.0);
  
  fColor = vColor_Temp.rgb;
  fTemp = vColor_Temp.a;
  fUV = vUV;
  fDepth = vDepth;
}
