// Uniforms
uniform mat4 unWVP;

// Input
in vec4 vPosition;
in vec2 vUV;

// Output
out vec3 fPosition;
out vec3 fNormal;
out vec2 fUV;
// Scattering
out vec3 fPrimaryColor;
out vec3 fSecondaryColor;
out vec3 fEyeDir;

#include "Shaders/AtmosphereShading/scatter.glsl"

void main() {
    fNormal = normalize(vPosition.xyz);
    fUV = vUV;
    fPosition = vPosition.xyz;
    
    scatter(vPosition.xyz * unInnerRadius);
    fPrimaryColor = sPrimaryColor;
    fSecondaryColor = sSecondaryColor;
    fEyeDir = normalize(-sRay);
    
    gl_Position = unWVP * vPosition;
}
