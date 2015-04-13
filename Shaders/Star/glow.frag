// Uniforms
uniform vec3 unColor;
uniform sampler2D unTexture;
uniform float unNoiseZ;

// Input
in vec2 fPosition;

// Output
out vec4 pColor;

#include "Shaders/Noise/snoise3.glsl"

void main() {   

    // ========== Change These =========
    const float textureYSmush = 6.0;
    const float spikeFrequency = 15.5;
    const float spikeShift = 0.2;
    const float spikeMult1 = 1.0;
    const float spikeMult2 = 0.02;
    const float glowMult = 0.65;
    const float textureMult = 0.6;
    // =================================

    vec2 nDistVec = normalize(fPosition);
    vec2 fTex = (vec2(fPosition.x, fPosition.y * textureYSmush) + 1.0) / 2.0;
    
    float spikeVal = snoise(vec3(nDistVec, unNoiseZ) * spikeFrequency) * spikeMult1 + spikeShift;
    
    float dist = length(fPosition) + 0.6;
    // Calculate brightness based on distance
    float brightness = ((1.0 / (dist * dist)) - 1.0);
    float spikeBrightness = brightness * spikeMult2 * clamp(spikeVal, 0.0, 1.0);
    float glowBrightness = brightness * glowMult;
    float texColor = texture(unTexture, fTex).r;
    
    float totalBrightness = spikeBrightness + glowBrightness + texColor * textureMult;
    
    pColor = vec4(unColor * totalBrightness, clamp(totalBrightness, 0.0, 0.9));
}
