// Uniforms
uniform float unTime;

uniform vec3 unColor;
uniform vec3 unNoiseScale;
uniform float unDensity;

uniform vec3 unLightDirWorld;
uniform vec3 unCameraPos;

uniform float unG;
uniform float unG2;

// Input
in vec3 fPosition;
in vec3 fPrimaryColor;
in vec3 fSecondaryColor;
in vec3 fEyeDir;

// Output
out vec4 pColor;

#include "Shaders/Noise/snoise4.glsl"

void main() {
	vec3 normal = normalize(fPosition);
	float light = dot(normal, unLightDirWorld);
	
	vec4 noisePosition = vec4(fPosition * unNoiseScale * 0.0004, unTime * 0.05);
	float noise = noise(noisePosition, 3, 8.0, 0.5);
	float rnoise = ridgedNoise(noisePosition, 3, 1.0, 0.5);
	rnoise = abs(rnoise) - (1.0 - unDensity * 1.2);
	
	float minViewDistance = clamp((length(fPosition - unCameraPos) - 10.0) / 50.0, 0.0, 1.0);
	
	float thickness = max(rnoise * 2.0 + noise, 0.0);
	thickness *= thickness * 2.0;

	float theta = dot(unLightDirWorld, fEyeDir);
    float miePhase = ((1.0 - unG2) / (2.0 + unG2)) * (1.0 + theta * theta) / pow(1.0 + unG2 - 2.0 * unG * theta, 1.5);
    vec3 scatterColor = fPrimaryColor + miePhase * fSecondaryColor;

	pColor = vec4(max(unColor * ((thickness + 0.5) * light), 0.0) * 2.0 + scatterColor * 1.5, clamp(thickness, 0.0, 1.0) * minViewDistance);
}