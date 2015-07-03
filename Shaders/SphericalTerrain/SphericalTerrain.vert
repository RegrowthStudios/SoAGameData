// Uniforms
uniform mat4 unWVP;
uniform float unTexelWidth;
uniform float unNormalmapWidth;

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

  scatter(vPosition.xyz);
  fPrimaryColor = sPrimaryColor;
  fSecondaryColor = sSecondaryColor;
  fEyeDir = normalize(-sRay);
  
  
  /// Code for darkening terrain over horizon
  //float mult = 1.0;
  //float angle = dot(unLightDirWorld, -normal);
  //mult = clamp( 1.0 - angle * 3.0, 0.0, 1.0);
  
  gl_Position = unWVP * vPosition;
  applyLogZ();
  
  fColor = vColor;
  fPosition = vPosition.xyz;
  fWorldNormal = normalize(vPosition.xyz);
  fNormal = vNormal;
  fTemp_Hum = vTemp_Hum;
}
