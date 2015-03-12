// Uniforms
uniform mat4 unWVP;
uniform mat4 unW;
uniform vec3 unLightDirWorld;
uniform float unTexelWidth;
uniform float unRadius;
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

vec3 computeTangent(vec3 wPosition, vec3 nPosition) {
    vec3 tangent = wPosition;
    tangent.x += 10.0;
    tangent = normalize(tangent) * (unRadius + vPosition.y);
    return normalize(tangent - nPosition);
}

void main() {
  // Calculate spherical position
  vec3 wPosition = vec3(unW * vPosition);
  wPosition.y = unRadius + vPosition.y;
  vec3 normal = normalize(wPosition);
  vec3 nPosition = normal * (unRadius + vPosition.y);
  
  computeScattering(nPosition);
  
  vec3 tangent = computeTangent(wPosition, nPosition);
  
  vec3 vpos = vPosition.xyz + (nPosition - wPosition);
  
   // Compute direction to eye
  fEyeDir = normalize(-(unW * vec4(vpos, 1.0)).xyz);
  
  // Compute TBN for converting to world space
  vec3 n = normalize((unW * vec4(normal, 0.0)).xyz);
  vec3 t = normalize((unW * vec4(tangent, 0.0)).xyz);
  vec3 b = normalize((unW * vec4(cross( normal, tangent), 0.0)).xyz);
  fTbn = mat3(t, n, b);
  
  float mult = 1.0;
  float angle = dot(unLightDirWorld, -n);
  mult = clamp( 1.0 - angle * 3.0, 0.0, 1.0);
  
  gl_Position = unWVP * vec4(vpos, 1.0);
  
  fColor = vColor;
  fUV = vUV;
  // Move normal map UV in by 1 texel in each direction
  fNormUV = vNormUV * ((unTexelWidth - 2.0001) / unTexelWidth);
  fNormUV = vNormUV + 1.0 / unTexelWidth + 0.0001;
  
  fTemp_Hum = vTemp_Hum;
}
