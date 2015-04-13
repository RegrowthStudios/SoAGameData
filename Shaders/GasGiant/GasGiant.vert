// Uniforms
uniform mat4 unWVP;

// Input
in vec4 vPosition;
in float vTexCoord;

// Output
out vec3 fNormal;
out float fTexCoord;
// Scattering
out vec3 fPrimaryColor;
out vec3 fSecondaryColor;
out vec3 fEyeDir;

#include "Shaders/AtmosphereShading/scatter.glsl"

void main() {
    fTexCoord = vTexCoord;
    fNormal = vPosition.xyz;
    
    scatter(vPosition.xyz * unInnerRadius);
    fPrimaryColor = sPrimaryColor;
    fSecondaryColor = sSecondaryColor;
    fEyeDir = normalize(-sRay);
    
    gl_Position = unWVP * vPosition;
}
