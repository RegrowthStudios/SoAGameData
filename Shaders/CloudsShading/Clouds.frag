// Uniforms
uniform float unTime;

uniform vec3 unColor;
uniform vec3 unNoiseScale;
uniform float unDensity;

uniform float unG;
uniform float unG2;

// Input
in vec3 fPosition;

// Output
out vec4 pColor;

#include "Shaders/Noise/snoise4.glsl"
#include "Shaders/AtmosphereShading/scatter.glsl"

void main() {
	scatter(fPosition);
	float theta = dot(unLightDirWorld, sRay);
    float miePhase = ((1.0 - unG2) / (2.0 + unG2)) * (1.0 + theta * theta) / pow(1.0 + unG2 - 2.0 * unG * theta, 1.5);
    vec3 scatterColor = sPrimaryColor + miePhase * sSecondaryColor;
    
	vec3 normal = normalize(fPosition);
	float light = dot(normal, unLightDirWorld);
	
	vec4 noisePosition = vec4(fPosition * unNoiseScale * 0.0004, unTime * 0.5);
	float noise = noise(noisePosition, 3, 8.0, 0.5);
	float rnoise = ridgedNoise(noisePosition, 3, 1.0, 0.5);
	rnoise = abs(rnoise) - (1.0 - unDensity);
	
	float thickness = max(rnoise * 2.0 + noise * 0.75, 0.0);
	thickness *= thickness * 2.0;
	pColor = vec4(max(unColor * ((thickness + 0.5) * light) + scatterColor, 0.0) * 2.0, clamp(thickness, 0.0, 1.0));
}