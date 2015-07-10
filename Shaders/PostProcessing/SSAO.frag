// Uniforms
uniform sampler2D unTexDepth;
uniform sampler2D unTexNormal;
uniform sampler2D unTexNoise;
const int SAMPLE_KERNEL_SIZE = 32;
uniform vec3 unSampleKernel[SAMPLE_KERNEL_SIZE];
uniform vec2 unNoiseScale;
uniform float unRadius = 1.0;

uniform mat4 unViewMatrix;
uniform mat4 unProjectionMatrix;
uniform mat4 unInvProjectionMatrix;

// Input
in vec2 fUV;

// Output
out float pColor;

vec3 viewSpaceCoordinate(float depth)
{
    vec4 screenSpaceCoordinate = vec4(fUV.x * 2.0 - 1.0, fUV.y * 2.0 - 1.0, depth, 1.0);
    screenSpaceCoordinate = unInvProjectionMatrix * screenSpaceCoordinate;
    return screenSpaceCoordinate.xyz / screenSpaceCoordinate.w;
}

// From this http://john-chapman-graphics.blogspot.de/2013/01/ssao-tutorial.html

void main() {
    float depth = texture(unTexDepth, fUV).r;
    vec3 origin = viewSpaceCoordinate(depth);

    vec3 normal = (unViewMatrix * vec4(normalize(texture(unTexNormal, fUV).xyz), 1.0)).xyz;
    
	// Random sample kernel rotation
    vec3 rotationVector = normalize(vec3(texture(unTexNoise, fUV * unNoiseScale).xy, 0.0));
    vec3 tangent = normalize(rotationVector - normal * dot(rotationVector, normal));
    vec3 bitangent = cross(normal, tangent);
    mat3 tbn = mat3(tangent, bitangent, normal);
    
    float totalOcclusion = 0.0;
    for (int i = 0; i < SAMPLE_KERNEL_SIZE; ++i) {
        // Get sample position
        vec3 sample = (tbn * unSampleKernel[i]) * unRadius + origin;
        
        // Project sample position
        vec4 screenSpaceSample = unProjectionMatrix * vec4(sample, 1.0);
        screenSpaceSample.xy /= screenSpaceSample.w;
        screenSpaceSample.xy = screenSpaceSample.xy * 0.5 + 0.5;
        // Get sample depth
        float sampleDepth = texture(unTexDepth, screenSpaceSample.xy).r;
        // Range check and accumulate
        // TODO(Ben): No branching?
        float rangeCheck = abs(depth - sampleDepth) < unRadius ? 1.0 : 0.0;
        totalOcclusion += (sampleDepth < depth ? 1.0 : 0.0) * rangeCheck;
    }
    
    pColor = (1.0 - totalOcclusion / float(SAMPLE_KERNEL_SIZE));
}

