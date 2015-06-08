// http://callumhay.blogspot.com/2010/09/gaussian-blur-shader-glsl.html
// Uniforms
uniform sampler2D unTex;
uniform float unBlurSize;
uniform float unSigma;     // The sigma value for the gaussian function: higher value means more blur
                         // A good value for 9x9 is around 3 to 5
                         // A good value for 7x7 is around 2.5 to 4
                         // A good value for 5x5 is around 2 to 3.5
                         // ... play around with this based on what you need :)

// Input
in vec2 fUV;

// Output
out vec4 pColor;

const float pi = 3.14159265f;

// The following are all mutually exclusive macros for various 
// seperable blurs of varying kernel size
#if defined(VERTICAL_BLUR_9)
const float numBlurPixelsPerSide = 4.0;
const vec2  blurMultiplyVec      = vec2(0.0, 1.0);
#elif defined(HORIZONTAL_BLUR_9)
const float numBlurPixelsPerSide = 4.0;
const vec2  blurMultiplyVec      = vec2(1.0, 0.0);
#elif defined(VERTICAL_BLUR_7)
const float numBlurPixelsPerSide = 3.0;
const vec2  blurMultiplyVec      = vec2(0.0, 1.0);
#elif defined(HORIZONTAL_BLUR_7)
const float numBlurPixelsPerSide = 3.0;
const vec2  blurMultiplyVec      = vec2(1.0, 0.0);
#elif defined(VERTICAL_BLUR_5)
const float numBlurPixelsPerSide = 2.0;
const vec2  blurMultiplyVec      = vec2(0.0, 1.0);
#elif defined(HORIZONTAL_BLUR_5)
const float numBlurPixelsPerSide = 2.0;
const vec2  blurMultiplyVec      = vec2(1.0, 0.0);
#else
// This only exists to get this shader to compile when no macros are defined
const float numBlurPixelsPerSide = 4.0;
const vec2  blurMultiplyVec      = vec2(0.0, 1.0);
#endif

void main() {

  // Incremental Gaussian Coefficent Calculation (See GPU Gems 3 pp. 877 - 889)
  vec3 incrementalGaussian;
  incrementalGaussian.x = 1.0 / (sqrt(2.0 * pi) * unSigma);
  incrementalGaussian.y = exp(-0.5f / (unSigma * unSigma));
  incrementalGaussian.z = incrementalGaussian.y * incrementalGaussian.y;

  vec4 avgValue = vec4(0.0, 0.0, 0.0, 0.0);
  float coefficientSum = 0.0;

  // Take the central sample first...
  avgValue += texture2D(unTex, fUV.xy) * incrementalGaussian.x;
  coefficientSum += incrementalGaussian.x;
  incrementalGaussian.xy *= incrementalGaussian.yz;

  // Go through the remaining 8 vertical samples (4 on each side of the center)
  for (float i = 1.0; i <= numBlurPixelsPerSide; i++) { 
    avgValue += texture2D(unTex, fUV.xy - i * unBlurSize * 
                          blurMultiplyVec) * incrementalGaussian.x;         
    avgValue += texture2D(unTex, fUV.xy + i * unBlurSize * 
                          blurMultiplyVec) * incrementalGaussian.x;         
    coefficientSum += 2.0 * incrementalGaussian.x;
    incrementalGaussian.xy *= incrementalGaussian.yz;
  }

  pColor = avgValue / coefficientSum;
}