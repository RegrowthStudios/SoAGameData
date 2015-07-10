// Uniforms
uniform sampler2D unTexDepth;
uniform sampler2D unTexNormal;
uniform sampler2D unTexNoise; 

// Input
in vec2 fUV;

// Output
out float pColor;

void main() {
    pColor = 1.0;
}