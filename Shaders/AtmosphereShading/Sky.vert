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
uniform float unKrESun; // Kr * ESun
uniform float unKmESun; // Km * ESun
uniform float unKr4PI; // Kr * 4 * PI
uniform float unKm4PI; // Km * 4 * PI
uniform float unScale; // 1 / (unOuterRadius - unInnerRadius)
uniform float unScaleDepth; // Altitude at which the atmosphere's average density is found
uniform float unScaleOverScaleDepth; // unScale / unScaleDepth
// TODO(Ben): #these should not be uniforms
uniform int unNumSamples; // Number of integration samples
uniform float unNumSamplesF; // (float)unNumSamples

// Input
in vec4 vPosition; // Position on unit icosphere

// Output
out vec3 fRayDirection;
out vec3 fPrimaryColor;
out vec3 fSecondaryColor;

float scale(float theta) {
  float x = 1.0 - theta;
  return unScaleDepth * exp(-0.00287 + x * (0.459 + x * (3.83 + x * (-6.80 + x * 5.25))));
}

void main() {
  gl_Position =  unWVP * vPosition;

  // Calculate the farthest intersection of the ray with the outer atmosphere
  vec3 worldPos = vPosition.xyz * unOuterRadius;
  vec3 ray = worldPos - unCameraPos;
  fRayDirection = -ray;
  float intersectFar = length(ray);
  ray /= intersectFar;
  
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
    float height = length(samplePosition);
    float lightAngle = dot(unLightPos, samplePosition) / height;
    float cameraAngle = dot(ray, samplePosition) / height;

    // Calculate attenuation
    float depth = exp(unScaleOverScaleDepth * (unInnerRadius - height));
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
  accumulationColor = clamp(accumulationColor, vec3(0.0), vec3(3000000000000.0));

  // Scale the Mie and Rayleigh colors
  fSecondaryColor = accumulationColor * unKmESun;
  fPrimaryColor = accumulationColor * (unInvWavelength * unKrESun);
}
