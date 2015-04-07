// Uniforms
uniform mat4 unWVP;
uniform float unTexelWidth;
uniform float unNormalmapWidth;

// Input
in vec4 vPosition; // Position in object space
in vec3 vTangent;
in vec2 vUV;
in vec3 vColor;
in vec2 vNormUV;
in vec2 vTemp_Hum;

// Output
out vec3 fColor;
out vec2 fNormUV;
out vec2 fUV;
out vec2 fTemp_Hum;
out mat3 fTbn;
out vec3 fEyeDir;
out vec3 fNormal;
// Scattering
out vec3 fPrimaryColor;
out vec3 fSecondaryColor;

#include "Shaders/AtmosphereShading/scatter.glsl"

void main() {
  vec3 normal = normalize(vPosition.xyz);
  
  scatter(vPosition.xyz);
  fPrimaryColor = sPrimaryColor;
  fSecondaryColor = sSecondaryColor;
  fEyeDir = normalize(-sRay);
  
  // Compute TBN for converting to world space
  vec3 b = cross(normal, vTangent);
  fTbn = mat3(vTangent, normal, b);
  
  /// Code for darkening terrain over horizon
  //float mult = 1.0;
  //float angle = dot(unLightDirWorld, -normal);
  //mult = clamp( 1.0 - angle * 3.0, 0.0, 1.0);
  
  gl_Position = unWVP * vPosition;
  fColor = vColor;
  fUV = vUV;
  // Move normal map UV in by 1 texel in each direction
  fNormUV = vNormUV * unNormalmapWidth + 1.1 * unTexelWidth;
  fNormal = normal;
  fTemp_Hum = vTemp_Hum;
}
