//
// Atmospheric scattering vertex shader
//
// Author: Sean O'Neil
//
// Copyright (c) 2004 Sean O'Neil
//

// Uniforms
uniform mat4 unWVP;
uniform vec3 unCameraPos;
uniform vec3 unLightPos;
uniform vec3 unInvWavelength; // 1 / (wavelength ^ 4) for the red, green, and blue channels
uniform float unCameraHeight2; // Camera Height ^ 2
uniform float unOuterRadius; // Outer (atmosphere) radius
uniform float unOuterRadius2; // unOuterRadius^2
uniform float unInnerRadius; // Inner (planetary) radius
uniform float unInnerRadius2; // unInnerRadius^2
uniform float unKrESun; // Kr * ESun
uniform float unKmESun; // Km * ESun
uniform float unKr4PI; // Kr * 4 * PI
uniform float unKm4PI; // Km * 4 * PI
uniform float unScale; // 1 / (unOuterRadius - unInnerRadius)
uniform float unScaleDepth; // Altitude at which the atmosphere's average density is found
uniform float unScaleOverScaleDepth; // unScale / unScaleDepth
uniform int unNumSamples; // Number of integration samples
uniform float unNumSamplesF; // (float)unNumSamples
uniform mat4 unWorld;
uniform sampler2D unTexSunGradient;

// Input
in vec4 vPosition;
in vec2 vUV;
in vec3 vNormal;
in vec3 vColor;
in vec4 vColorSlope;
in vec4 vTexTempRainSpec;

// Output
out vec3 lightColor;
out vec2 UV;
out vec3 Normal_worldspace;
out vec3 fragmentColor;
out vec4 slopeColor;
flat out float textureUnitID;
out float temperature;
out float rainfall;
out float specular;
out vec3 EyeDirection_worldspace;
out vec3 Color;
out vec3 SecondaryColor;
out float height;
out float slope;

float scale(float theta) {
  float x = 1.0 - theta;
  return unScaleDepth * exp(-0.00287 + x * (0.459 + x * (3.83 + x * (-6.80 + x * 5.25))));
}

void main() {
  UV = vUV;
  textureUnitID = vTexTempRainSpec[0];
  temperature = vTexTempRainSpec[1]*0.00392157; //equivalent to dividing by 255
  rainfall = vTexTempRainSpec[2]*0.00392157;
  specular = vTexTempRainSpec[3]*0.00392157;
  fragmentColor = vColor;
  Normal_worldspace = vNormal;
    
  gl_Position =  unWVP * vPosition;

  // Calculate the farthest intersection of the ray with the outer atmosphere
  vec3 worldPos = (unWorld * vPosition).xyz;
  height = length(worldPos) - unInnerRadius;
  vec3 ray = worldPos - unCameraPos;
  float intersectFar = length(ray);
  ray /= intersectFar;
  EyeDirection_worldspace = -ray;

  float cosTheta = dot( normalize(worldPos), normalize(unLightPos));
  cosTheta = clamp(cosTheta + 0.06, 0.0, 1.0);
  lightColor = texture(unTexSunGradient, vec2(cosTheta, 0.5)).rgb + vec3(0.8, 0.6, 0.05);
  

  // Calculate the closest intersection of the ray with the outer atmosphere
  float intersectNear = 0.0;
  if(unCameraHeight2 > unOuterRadius2) {
    float b = 2.0 * dot(unCameraPos, ray);
    float c = 4.0 * (unCameraHeight2 - unOuterRadius2);
    float det = max(0.0, b * b - c);
    intersectNear = 0.5 * (-b - sqrt(det));
  }

  // Calculate the ray's starting position, then calculate its scattering offset
  vec3 start = unCameraPos + ray * intersectNear;
  float startAngle = dot(ray, start) / unOuterRadius;
  float startDepth = exp(-1.0 / unScaleDepth);
  float startOffset = startDepth * scale(startAngle);

  // Initialize the scattering loop variables
  float sampleLength = (intersectFar - intersectNear) / unNumSamplesF;
  float scaledLength = sampleLength * unScale;
  vec3 sampleRay = ray * sampleLength;
  vec3 samplePosition = start + sampleRay * 0.5;

  // Loop through the sample rays
  vec3 accumulationColor = vec3(0.0, 0.0, 0.0);
  for(int i = 0; i < unNumSamples; i++) {
    // Calculate view angle diffusion ratios
    float sHeight = length(samplePosition);
    float lightAngle = dot(unLightPos, samplePosition) / sHeight;
    float cameraAngle = dot(ray, samplePosition) / sHeight;

    // Calculate attenuation
    float depth = exp(unScaleOverScaleDepth * (unInnerRadius - sHeight));
    float scatter = (startOffset + depth*(scale(lightAngle) - scale(cameraAngle)));
    vec3 attenuation = exp(-scatter * (unInvWavelength * unKr4PI + unKm4PI));

    // Accumulate color
    accumulationColor += attenuation * depth;
    
    // Move sampling position
    samplePosition += sampleRay;
  }

  // Scale integration
  accumulationColor *= scaledLength;

  // Account for NaN errors
  accumulationColor = clamp(accumulationColor, vec3(0.0), vec3(1.0));

  // Scale the Mie and Rayleigh colors
  SecondaryColor = accumulationColor * unKmESun;
  Color = accumulationColor * (unInvWavelength * unKrESun);
}
