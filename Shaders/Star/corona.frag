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

    // Offset normal with noise
    float freqency = 0.8;
    float ox = snoise(vec4(fPosition * freqency, unDT));
    float oy = snoise(vec4((fPosition + 2000.0) * freqency, unDT));
    float oz = snoise(vec4((fPosition + 4000.0) * freqency, unDT));
    
    // Get the distance vector from the center
    vec3 nDistVec = normalize(fPosition + vec3(ox, oy, oz) * 0.25);
    
    // Get noise with normalized position to offset the original position
    vec3 position = fPosition + noise(vec4(nDistVec, unDT), 3, 3.0, 0.7) * 0.5;

    // Calculate brightness based on distance
    float dist = length(position) * 4.0;
    float brightness = (1.0 / (dist * dist) - 0.1) * 0.7;
    
    // Calculate color
    vec3 color = unColor * brightness;
    pColor = vec4(color, clamp(brightness, 0.0, 1.0));
}
