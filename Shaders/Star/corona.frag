// Uniforms
uniform vec3 unColor;
uniform float unDT;
uniform float unMaxSize;

// Input
in vec3 fPosition;

// Output
out vec4 pColor;

#include "Shaders/Noise/snoise4.glsl"

void main() {

    // Offset position with low octave noise
    float ox = noise(vec4(fPosition + 1000.0, unDT), 1, 0.4, 1.0, 0.7);
    float oy = noise(vec4(fPosition + 2000.0, unDT), 1, 0.4, 1.0, 0.7);
    float oz = noise(vec4(fPosition, unDT), 1, 0.4, 1.0, 0.7);

    vec3 nDistVec = normalize(fPosition + vec3(ox, oy, oz) * 0.5);
    
    // Get noise with normalized position to offset position again
    vec3 pos = fPosition + noise(vec4(nDistVec, unDT), 5, 1.6, 1.0, 0.7) * 0.6;

    // Calculate brightness based on distance
    float dist = length(pos);
    float brightness = 1.0 / (dist * dist) - 1.0 / (unMaxSize * unMaxSize);
    
    // Calculate color
    vec3 color = unColor * brightness;
    pColor = vec4(color, clamp(brightness, 0.0, 1.0));
}
