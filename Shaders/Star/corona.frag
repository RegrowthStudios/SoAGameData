// Improved by ADGDeveloping on June 4 2015

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
    /* Edit these */
	const float brightnessMultiplier = 0.9;   // The higher the number, the brighter the corona will be.
	const float smootheningMultiplier = 0.15; // How smooth the irregular effect is, the higher the smoother.
	const float ringIntesityMultiplier = 1.5; // The higher the number, the smaller the ring.
	const float coronaSizeMultiplier = 2.55;  // The higher the number, the smaller the corona.
	const float frequency = 1.5;              // The frequency of the irregularities.
	const float fDetail = 0.7;                // The higher the number, the more detail the corona will have. (Might be more GPU intensive when higher, 0.7 seems fine for the normal PC)
	const int iDetail = 10;                   // The higher the number, the more detail the corona will have.
	const float irregularityMultiplier = 4;   // The higher the number, the more irregularities and bigger ones. (Might be more GPU intensive when higher, 4 seems fine for the normal PC)
	
	/* Don't edit these */	
    float t = unDT * 10.0 - length(fPosition);

    // Offset normal with noise
    float ox = snoise(vec4(fPosition, t) * frequency);
    float oy = snoise(vec4((fPosition + (1000.0 * irregularityMultiplier)), t) * frequency);
    float oz = snoise(vec4((fPosition + (2000.0 * irregularityMultiplier)), t) * frequency);
	float om = snoise(vec4((fPosition + (4000.0 * irregularityMultiplier)), t) * frequency) * snoise(vec4((fPosition + (250.0 * irregularityMultiplier)), t) * frequency);
    vec3 offsetVec = vec3(ox * om, oy * om, oz * om) * smootheningMultiplier;
    
    // Get the distance vector from the center
    vec3 nDistVec = normalize(fPosition + offsetVec);
    
    // Get noise with normalized position to offset the original position
    vec3 position = fPosition + noise(vec4(nDistVec, t), iDetail, 1.5, fDetail) * smootheningMultiplier;

    // Calculate brightness based on distance
    float dist = length(position + offsetVec) * coronaSizeMultiplier;
    float brightness = (1.0 / (dist * dist) - 0.1) * (brightnessMultiplier - 0.4);
	float brightness2 = (1.0 / (dist * dist)) * brightnessMultiplier;
    
    // Calculate color
    vec3 color = unColor * brightness;
    pColor = vec4(color, clamp(brightness, 0.0, 1.0) * (cos(clamp(brightness, 0.0, 0.5)) / (cos(clamp(brightness2 / ringIntesityMultiplier, 0.0, 1.5)) * 2)));
}
