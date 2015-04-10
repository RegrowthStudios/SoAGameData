// Uniforms
uniform vec3 unCenter;
uniform float unSize;

// Input
in vec3 fPosition;

// Output
out vec4 pColor;

void main() {
    float val = 1.0 - length(fPosition - unCenter) / unSize;
    pColor = vec4(val * 1.25, 0.0, 0.0, 1.0);
}