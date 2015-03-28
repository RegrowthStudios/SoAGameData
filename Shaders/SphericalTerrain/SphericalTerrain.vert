// Uniforms
uniform mat4 unWVP;
uniform vec3 unLightDirWorld;
uniform float unTexelWidth;
uniform float unNormalmapWidth;
// Scattering
uniform vec3 unCameraPos;
uniform vec3 unInvWavelength;	// 1 / pow(wavelength, 4) for the red, green, and blue channels
uniform float unCameraHeight2;	// unCameraHeight^2
uniform float unInnerRadius;		// The inner (planetary) radius
uniform float unOuterRadius;		// The outer (atmosphere) radius
uniform float unOuterRadius2;	// unOuterRadius^2
uniform float unKrESun;			// Kr * ESun
uniform float unKmESun;			// Km * ESun
uniform float unKr4PI;			// Kr * 4 * PI
uniform float unKm4PI;			// Km * 4 * PI
uniform float unScale;			// 1 / (fOuterRadius - innerRadius)
uniform float unScaleDepth;		// The scale depth (i.e. the altitude at which the atmosphere's average density is found)
uniform float unScaleOverScaleDepth;	// fScale / scaleDepth
uniform int unNumSamples;
uniform float unNumSamplesF;

// Input
in vec4 vPosition; // Position in object space
in vec3 vTangent;
in vec2 vUV;
in vec3 vColor;
in vec2 vNormUV;
in vec2 vTemp_Hum;

// Output
out vec3 fColor;
out vec2 fNormUV;
out vec2 fUV;
out vec2 fTemp_Hum;
out mat3 fTbn;
out vec3 fEyeDir;
out vec3 fNormal;
// Scattering
out vec3 fPrimaryColor;
out vec3 fSecondaryColor;

float scale(float theta) {
  float x = 1.0 - theta;
  return unScaleDepth * exp(-0.00287 + x * (0.459 + x * (3.83 + x * (-6.80 + x * 5.25))));
}

void computeScattering(vec3 worldPos) {
	// Get the ray from the camera to the vertex and its length
	vec3 ray = worldPos - unCameraPos;
	worldPos = normalize(worldPos);
	float intersectFar = length(ray);
	ray /= intersectFar;
    
    fEyeDir = -ray;
	
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
	float startDepth = exp((unInnerRadius - unOuterRadius) / unScaleDepth);
	float cameraAngle = dot(-ray, worldPos);
	float lightAngle = dot(unLightDirWorld, worldPos);
	float cameraScale = scale(cameraAngle);
	float lightScale = scale(lightAngle);
	float cameraOffset = startDepth * cameraScale;
	float fTemp = lightScale + cameraScale;
	
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
		float depth = exp(unScaleOverScaleDepth * (unInnerRadius - height));
		float scatter = depth*fTemp - cameraOffset;
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

void main() {
  vec3 normal = normalize(vPosition.xyz);
  
  computeScattering(vPosition.xyz);
  
  // Compute TBN for converting to world space
  vec3 b = cross(normal, vTangent);
  fTbn = mat3(vTangent, normal, b);
  
  /// Code for darkening terrain over horizon
  //float mult = 1.0;
  //float angle = dot(unLightDirWorld, -normal);
  //mult = clamp( 1.0 - angle * 3.0, 0.0, 1.0);
  
  gl_Position = unWVP * vPosition;
  fColor = vColor;
  fUV = vUV;
  // Move normal map UV in by 1 texel in each direction
  fNormUV = vNormUV * unNormalmapWidth + 1.1 * unTexelWidth;
  fNormal = normal;
  fTemp_Hum = vTemp_Hum;
}
