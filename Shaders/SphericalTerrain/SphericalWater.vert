// Uniforms
uniform mat4 unWVP;
uniform float unFreezeTemp;

// Input
in vec4 vPosition; // Position in object space
in vec3 vTangent;
in vec4 vColor_Temp;
in float vDepth;

// Output
out vec3 fColor;
out vec3 fPosition;
out float fTemp;
out float fDepth;
out float frozen; // Needed to prevent shader precision issues
out mat3 fTbn;
out vec3 fEyeDir;
// Scattering
out vec3 fPrimaryColor;
out vec3 fSecondaryColor;

#include "Shaders/AtmosphereShading/scatter.glsl"
#include "Shaders/Utils/logz.glsl"

void main() {
  vec3 normal = normalize(vPosition.xyz);
  
  scatter(vPosition.xyz);
  fPrimaryColor = sPrimaryColor;
  fSecondaryColor = sSecondaryColor;
  
  // Compute TBN for converting to world space
  vec3 b = cross(normal, vTangent);
  fTbn = mat3(vTangent, normal, b);
  
  // Check if the liquid is frozen
  if (vColor_Temp.a <= unFreezeTemp) {
    frozen = 1.0;
  } else {
    frozen = 0.0;
  }
  
  gl_Position = unWVP * vPosition;
  applyLogZ();
  fColor = vColor_Temp.rgb;
  fPosition = vPosition.xyz;
  fTemp = vColor_Temp.a;
  fDepth = vDepth;
}
