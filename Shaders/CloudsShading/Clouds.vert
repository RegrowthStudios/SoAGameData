// Uniforms
uniform mat4 unWVP;
uniform float unCloudsRadius;

// Input
in vec4 vPosition; // Position on unit icosphere

// Output
out vec3 fPosition;
out vec3 fPrimaryColor;
out vec3 fSecondaryColor;
out vec3 fEyeDir;

#include "Shaders/AtmosphereShading/scatter.glsl"

void main() {
    gl_Position = unWVP * vPosition;
    fPosition = vPosition.xyz * unCloudsRadius;
    scatter(fPosition);
    fPrimaryColor = sPrimaryColor;
    fSecondaryColor = sSecondaryColor;
    fEyeDir = normalize(-sRay);
}
