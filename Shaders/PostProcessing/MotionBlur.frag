// Uniforms
uniform sampler2D unTex;
uniform float unExposure;
uniform float unGamma;

#ifdef MOTION_BLUR
uniform sampler2D unTexDepth;
uniform int unNumSamples;
uniform mat4 unVPInv;
uniform mat4 unVPPrev;
uniform float unBlurIntensity;
#endif

#ifdef DEPTH_OF_FIELD
uniform float unFocalLen;
uniform float unZfocus;

float sceneRange = 10.0f;
float a = 2.4f;
float Dlens = unFocalLen / a;
float blurScale  = 5.0;
float maxCoC = 20.0f;
int Width = 1600;
int Height = 900;
#endif

// Input
in vec2 fUV;

// Output
out vec4 pColor;

void main() {

    vec3 color = texture(unTex, fUV).rgb;

#if defined(MOTION_BLUR) || defined(DEPTH_OF_FIELD)
    float depth = texture(unTexDepth, fUV).x;
#endif

#ifdef MOTION_BLUR
    // Reconstruct position in world space
    vec4 screenPos = vec4(fUV * 2 - 1, depth, 1);
    vec4 worldPos = unVPInv * screenPos;
    worldPos /= worldPos.w;

    // Construct pixel position of last frame
    vec4 previousPos = unVPPrev * worldPos;
    previousPos /= previousPos.w;

    // Compute pixel velocity
    vec2 velocity = (screenPos.xy - previousPos.xy) * 0.5 * unBlurIntensity;
    vec2 sampleDisplacement = velocity / unNumSamples;

    // Accumulate blur samples
    float accum = 1;
    vec2 uv = fUV;
    for(int i = 0; i < unNumSamples; i++) {
        float ratio = exp(-(i / unNumSamples) * unBlurIntensity);
        accum += ratio;
        uv -= sampleDisplacement;
        color += texture(unTex, uv).rgb * ratio;
    }
    color /= accum;
#endif

#ifdef DEPTH_OF_FIELD
    vec3 colorSum, tapColor;
    vec2 centerDepthBlur, tapCoord, tapDepthBlur;
    float totalContribution, tapContribution;

    // Poissonian disc distribution
    float dx = 1.0/float(Width);
    float dy = 1.0/float(Height);
    vec2 filterTaps[12];
    filterTaps[0] = vec2(-0.326212 * dx, -0.40581 * dy);
    filterTaps[1] = vec2(-0.840144 * dx, -0.07358 * dy);
    filterTaps[2] = vec2(-0.695914 * dx, 0.457137 * dy);
    filterTaps[3] = vec2(-0.203345 * dx, 0.620716 * dy);
    filterTaps[4] = vec2(0.96234 * dx, -0.194983 * dy);
    filterTaps[5] = vec2(0.473434 * dx, -0.480026 * dy);
    filterTaps[6] = vec2(0.519456 * dx, 0.767022 * dy);
    filterTaps[7] = vec2(0.185461 * dx, -0.893124 * dy);
    filterTaps[8] = vec2(0.507431 * dx, 0.064425 * dy);
    filterTaps[9] = vec2(0.89642 * dx, 0.412458 * dy);
    filterTaps[10] = vec2(-0.32194 * dx, -0.932615 * dy);
    filterTaps[11] = vec2(-0.791559 * dx, -0.59771 * dy);

    colorSum = color.rgb;
    totalContribution = 1.0;

    float pixCoC = abs(Dlens * unFocalLen * (unZfocus - depth) / (unZfocus * (depth - unFocalLen)));
    float blur = clamp(pixCoC * blurScale / maxCoC, 0.0, 1.0);

    vec4 dofDepth = vec4(depth / sceneRange, blur, 0, 0);
    centerDepthBlur = dofDepth.xy;

    float sizeCoC = centerDepthBlur.y * maxCoC;

    // accumulates blur samples
    for(int i = 0; i < 12; i++) {
        tapCoord = fUV + filterTaps[i] * sizeCoC;
        tapColor = texture(unTex, tapCoord).rgb;
        float tapDepth = texture(unTexDepth, tapCoord).x;
        float tapPixCoC = abs(Dlens * unFocalLen * (unZfocus - tapDepth) / (unZfocus * (tapDepth - unFocalLen)));
        float tapBlur = clamp(tapPixCoC * blurScale / maxCoC, 0.0, 1.0);

        vec4 tapDofDepth = vec4(tapDepth / sceneRange, tapBlur, 0, 0);
        tapDepthBlur = tapDofDepth.xy;
        tapContribution = (tapDepthBlur.x > centerDepthBlur.x) ? 1.0 : tapDepthBlur.y;
        colorSum += tapColor * tapContribution;
        totalContribution += tapContribution;
    }

    color = colorSum / totalContribution;
#endif

    color = 1.0 - exp(color * -unExposure); // Add exposure
    color = pow(color, vec3(unGamma)); // Gamma correction
    pColor = vec4(color, 1.0);
}
