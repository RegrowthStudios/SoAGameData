// Uniforms
uniform mat4 unWVP;

// Input
in vec4 vPosition;

// Output
out vec3 fPosition;

#include "Shaders/Utils/logz.glsl"

void main() {
    fPosition = vPosition.xyz; 
    gl_Position = unWVP * vPosition;
    applyLogZ();
}
