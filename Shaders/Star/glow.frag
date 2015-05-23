// Uniforms
uniform sampler2D unColorMap;
uniform float unNoiseZ;
uniform float unColorMapU;
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
    float spikeNoise = snoise(vec3(nDistVec, unNoiseZ) * spikeFrequency);
    float spikeVal = spikeNoise + spikeShift;
    
    float dist = length(fPosition);
    // Calculate brightness based on distance
    float brightness = (1.0 / (dist + 0.08)) * 0.17 - 0.18;
    brightness = max(brightness, 0.0);
    float spikeBrightness = brightness * spikeMult2 * clamp(spikeVal, 0.0, 1.0);
    
    float ovCol = (pow(1.0 - dist, 2.5) * (dist) * 3.0) * (unColorMapU + spikeNoise * spikeMult2);
    ovCol = max(ovCol, 0.0);
    float centerglow = 1.0 / pow(dist + 0.96, 40.0);
    
	// Calculate color
    vec3 temperatureColor = texture(unColorMap, vec2(unColorMapU, 1.0 - (brightness + ovCol) + 0.125)).rgb;

    vec3 color = temperatureColor * unColorMult;

    vec2 ap = abs(fPosition);

    float hRay = (1.0 - (1.0 / (1.0 + exp(-((ap.y * 30.0 + 0.2) * 4 * 3.1415926) + 2 * 3.1415926))) - max(ap.x - 0.1, 0.0));
    hRay = max(hRay * 0.2, 0.0);

    pColor = vec4(color * (brightness + centerglow + spikeBrightness + hRay + ovCol), 1.0);
    
    // Reverse the gamma
    pColor.rgb *= pColor.rgb;
}
