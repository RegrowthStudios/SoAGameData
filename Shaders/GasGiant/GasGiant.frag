// Uniforms
uniform sampler2D unColorBandLookup;
uniform vec3 unLightDirWorld;
uniform float unDT;
// Scattering
uniform float unG;
uniform float unG2;

// Input
in vec3 fNormal;
in float fTexCoord;
// Scattering
in vec3 fPrimaryColor;
in vec3 fSecondaryColor;
in vec3 fEyeDir;

// Output
out vec4 pColor;

#include "Shaders/Noise/snoise3.glsl"

float computeDiffuse(vec3 normal) {
    return clamp( dot( normal, unLightDirWorld ), 0,1);
}

void main() {
    float xx = cos(fNormal.y * 50.0);
    vec3 position = fNormal + xx * 0.04;
    vec3 tOffset = vec3(unDT, 0.0, unDT);
    position.xz *= 0.5;
    position = position + tOffset;
    float n1 = noise(position, 6, 10.0, 0.8) * 0.01;
    float n2 = ridgedNoise(position, 5, 5.8, 0.75) * 0.015 - 0.01;

    float s = 0.6;
    float t1 = snoise(position * 2.0) - s;
    float t2 = snoise((position + 800.0) * 2.0) - s;
    float t3 = snoise((position + 1600.0) * 2.0) - s;
	float n3 = snoise(position * 0.1) * max(t1 * t2 * t3, 0.0);
	
	float final = (n1 + n2 + n3);
	
    float theta = dot(unLightDirWorld, fEyeDir);
    float miePhase = ((1.0 - unG2) / (2.0 + unG2)) * (1.0 + theta * theta) / pow(1.0 + unG2 - 2.0 * unG * theta, 1.5);
    vec3 scatterColor = fPrimaryColor + miePhase * fSecondaryColor;
    vec2 uv = vec2(0.5, fTexCoord + final);
    pColor = vec4((texture(unColorBandLookup, uv).rgb* computeDiffuse(fNormal) + scatterColor) , 1.0);
}
