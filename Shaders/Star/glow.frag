// Uniforms
uniform sampler2D unTextureOverlay;
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
    const float spikeMult2 = 0.04;
    // =================================

    vec2 fTex = (vec2(fPosition.x, fPosition.y) + 1.0) / 2.0;
    
    vec2 nDistVec = normalize(fPosition);
    float spikeVal = snoise(vec3(nDistVec, unNoiseZ) * spikeFrequency) + spikeShift;
    
    float dist = length(fPosition);
    // Calculate brightness based on distance
    float brightness = (1.0 / (dist + 0.08)) * 0.17 - 0.18;
    brightness = max(brightness, 0.0);
    float spikeBrightness = brightness * spikeMult2 * clamp(spikeVal, 0.0, 1.0);

    vec3 ovCol = texture(unTextureOverlay, fTex).rgb * unColorMapU;

	// Calculate color
    vec3 temperatureColor = texture(unColorMap, vec2(unColorMapU, 1.0 - (brightness + ovCol.r) + 0.125)).rgb;

    vec3 color = temperatureColor * unColorMult;

    vec2 ap = abs(fPosition);
    float hRay = (0.0002 - ap.y * ap.y) * 400.0 - max(ap.x * 0.2 - 0.1, 0.0);
    hRay = max(hRay, 0.0);
    pColor = vec4(color * (brightness + spikeBrightness + hRay + ovCol.r), 1.0);
    
    // Reverse the gamma
    pColor *= pColor;
}
