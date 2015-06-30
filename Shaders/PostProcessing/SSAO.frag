// Uniforms
uniform sampler2D unTexDepth;
uniform sampler2D unTexNormal;
uniform sampler2D unTexNoise;
const int SAMPLE_KERNEL_SIZE = 16;
uniform vec3 unSampleKernel[SAMPLE_KERNEL_SIZE];
uniform vec2 unSSAOTextureSize;

uniform mat4 unProjectionMatrix;
uniform mat4 unInvProjectionMatrix;

// Input
in vec2 fUV;

// Output
out float pColor;

vec3 viewSpaceCoordinate(vec2 uv)
{
    vec4 screenSpaceCoordinate = vec4(uv.x, uv.y, texture(unTexDepth, uv).r, 1.0);
    screenSpaceCoordinate.z = 2.0 * screenSpaceCoordinate.z - 1.0;
    screenSpaceCoordinate = unInvProjectionMatrix * screenSpaceCoordinate;
    return screenSpaceCoordinate.xyz / screenSpaceCoordinate.w;
}

void main() {
    vec3 origin = viewSpaceCoordinate(fUV);

    // Random sample kernel rotation
    vec3 rotationVector = vec3(texture(unTexNoise, unSSAOTextureSize / textureSize(unTexNoise, 0) * fUV).xy, 0.0);
    vec3 normal = normalize(texture(unTexNormal, fUV).xyz);
    vec3 tangent = normalize(rotationVector - normal * dot(rotationVector, normal));
    vec3 bitangent = cross(normal, tangent);
    mat3 tbn = mat3(tangent, bitangent, normal);

    float totalOcclusion = 0.0;
    for (int i = 0; i < SAMPLE_KERNEL_SIZE; i++) {
        vec3 sample = tbn * unSampleKernel[i] * 1.0 + origin;
        vec4 screenSpaceSample = unProjectionMatrix * vec4(sample, 1.0);
        screenSpaceSample.xy /= screenSpaceSample.w;
        screenSpaceSample.xy = screenSpaceSample.xy * 0.5 + 0.5;
        float sampleDepth = texture(unTexDepth, screenSpaceSample.xy).r;

        totalOcclusion += sample.z > sampleDepth - 0.2 ? 0.0 : 1.0;
    }
    vec3 sample = tbn * unSampleKernel[0] * 1.0 + origin;

    pColor = 1.0 - totalOcclusion / float(SAMPLE_KERNEL_SIZE);
}
