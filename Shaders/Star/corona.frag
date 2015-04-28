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

    float t = unDT * 10.0 - length(fPosition);

    // Offset normal with noise
    float frequency = 1.5;
    float ox = snoise(vec4(fPosition, t) * frequency);
    float oy = snoise(vec4((fPosition + 2000.0), t) * frequency);
    float oz = snoise(vec4((fPosition + 4000.0), t) * frequency);
    vec3 offsetVec = vec3(ox, oy, oz) * 0.1;
    
    // Get the distance vector from the center
    vec3 nDistVec = normalize(fPosition + offsetVec);
    
    // Get noise with normalized position to offset the original position
    vec3 position = fPosition + noise(vec4(nDistVec, t), 5, 2.0, 0.7) * 0.1;

    // Calculate brightness based on distance
    float dist = length(position + offsetVec) * 3.5;
    float brightness = (1.0 / (dist * dist) - 0.1) * 0.7;
    
    // Calculate color
    vec3 color = unColor * brightness;
    pColor = vec4(color, clamp(brightness, 0.0, 1.0));
}
