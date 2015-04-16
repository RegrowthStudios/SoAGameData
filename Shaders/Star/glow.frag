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
    const float spikeFrequency = 15.5;
    const float spikeShift = 0.2;
    const float spikeMult2 = 0.01;
    // =================================

    vec2 nDistVec = normalize(fPosition);
    vec2 fTex = (vec2(fPosition.x, fPosition.y * textureYSmush) + 1.0) / 2.0;
    
    float spikeVal = snoise(vec3(nDistVec, unNoiseZ) * spikeFrequency) + spikeShift;
    
    float dist = length(fPosition);
    // Calculate brightness based on distance
    float brightness = ((1.0 / pow(dist + 0.15, 0.5)) - 1.0);
    float spikeBrightness = brightness * spikeMult2 * clamp(spikeVal, 0.0, 1.0);
    vec4 texColor = texture(unTexture, fTex).rgba;

	
    pColor = vec4((texColor.rgb + spikeBrightness) * unColor, texColor.a);
}
