// Uniforms
uniform sampler2D unTexture;
uniform sampler2D unTextureOverlay;
uniform sampler2D unColorMap;
uniform float unNoiseZ;
uniform float unColorMapU;
uniform vec3 unColorShift;
uniform vec3 unColorMult;

// Input
in vec2 fPosition;

// Output
out vec4 pColor;

#include "Shaders/Noise/snoise3.glsl"

void main() {   

    // ========== Change These =========
    const float spikeFrequency = 15.5;
    const float spikeShift = 0.2;
    const float spikeMult2 = 0.02;
    // =================================

    vec2 fTex = (vec2(fPosition.x, fPosition.y) + 1.0) / 2.0;
    
    vec2 nDistVec = normalize(fPosition);
    float spikeVal = snoise(vec3(nDistVec, unNoiseZ) * spikeFrequency) + spikeShift;
    
    float dist = length(fPosition);
    // Calculate brightness based on distance
    float spikeBrightness = ((1.0 / pow(dist + 0.15, 0.5)) - 1.0);
    spikeBrightness = spikeBrightness * spikeMult2 * clamp(spikeVal, 0.0, 1.0);
	vec2 ovTex = vec2(unColorMapU, 0.0);
    vec3 texColor = texture(unTexture, fTex).rgb + texture(unTextureOverlay, ovTex).rgb;

	// Calculate color
	vec3 temperatureColor = texture(unColorMap, vec2(unColorMapU, 1.0 - texColor.r + 0.125)).rgb;
	
    float s = 40.0;
	vec3 shiftColor = unColorShift * max((1.0 - dist) * s - (s - 1.0), 0.0);
    pColor = vec4(((texColor.rgb + spikeBrightness) * temperatureColor + shiftColor * 0.025) * unColorMult, 1.0);
}
