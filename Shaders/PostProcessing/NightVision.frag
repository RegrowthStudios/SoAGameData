// Uniforms
uniform sampler2D unTexColor;
uniform sampler2D unTexNoise; 
uniform float unTime;
uniform float unLuminanceExponent;
uniform float unLuminanceTare;
uniform float unColorAmplification;
uniform float unNoisePower;
uniform float unNoiseColor;
uniform vec3 unVisionColor;

// Input
in vec2 fUV;

// Output
out vec4 pColor;

float lumMultiplier(float x) {
  x += abs(unLuminanceTare - x);
  float x2 = x * x;
  return 17.29 * x2 * x - 14.88 * x2 + 5.58 * x;
}

void main() {
  vec2 uv;
  uv.x = 0.4 * sin(unTime * 50.0);
  uv.y = 0.4 * cos(unTime * 50.0);
  
  float n = texture(unTexNoise, (fUV * 3.5) + uv).r;
  vec3 c = texture(unTexColor, fUV + (n * unNoisePower)).rgb;

  float lum = dot(vec3(0.30, 0.59, 0.11), c);
  c *= unColorAmplification * pow(lumMultiplier(lum), unLuminanceExponent);

  pColor = vec4((c + (n * unNoiseColor)) * unVisionColor, 1.0);
}
