//
// Atmospheric scattering fragment shader
//
// Author: Sean O'Neil
//
// Copyright (c) 2004 Sean O'Neil
//

// Uniforms
uniform float unG;
uniform float unG2;
uniform vec3 unCameraPos;
uniform vec3 unLightDirWorld;
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

uniform float unZCoef;

float scale(float theta) {
  float x = 1.0 - theta;
  return unScaleDepth * exp(-0.00287 + x * (0.459 + x * (3.83 + x * (-6.80 + x * 5.25))));
}

vec3 fRayDirection;
vec3 fPrimaryColor;
vec3 fSecondaryColor;

// Input
in vec3 fPosition;
in float fLogZ;

// Output
out vec4 pColor;

void scatter() {
  gl_FragDepth = log2(fLogZ) * unZCoef * 0.5;
  // Calculate the farthest intersection of the ray with the outer atmosphere
  vec3 worldPos = fPosition.xyz * unOuterRadius;
  vec3 ray = worldPos - unCameraPos;
  fRayDirection = -ray; // TODO: Normalize here instead of in frag?
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
    float lightAngle = dot(unLightDirWorld, samplePosition) / height;
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

  // Hack to darken over horizon
  float camHeight = length(unCameraPos);
  vec3 camNormal = unCameraPos / camHeight;
  camHeight = max(camHeight, unInnerRadius);
  float horizonAngle = acos(unInnerRadius / camHeight);
  float lodAngle = acos(dot(camNormal, normalize(worldPos)));
  float mult = clamp(((horizonAngle + 0.3) - lodAngle) * 3.0, 0.0, 1.0); 
  
  // Account for NaN errors
  accumulationColor = clamp(accumulationColor, vec3(0.0), vec3(3000000.0)) * mult;
  
  // Scale the Mie and Rayleigh colors
  fSecondaryColor = accumulationColor * unKmESun;
  fPrimaryColor = accumulationColor * (unInvWavelength * unKrESun);
}

void main() {

  scatter();

  // Find Mie phase
  float theta = dot(unLightDirWorld, fRayDirection) / length(fRayDirection);
  float miePhase = ((1.0 - unG2) / (2.0 + unG2)) * (1.0 + theta * theta) / pow(1.0 + unG2 - 2.0 * unG * theta, 1.5);
  
  // Calculate effect intensity
  float maxIntensity = max(max( fPrimaryColor.r, fPrimaryColor.b), fPrimaryColor.g);
  maxIntensity = min(maxIntensity, 1.0);

  vec3 color = fPrimaryColor + miePhase * fSecondaryColor;
  // Accumulate both lighting values
  pColor = vec4(color, maxIntensity);
}
