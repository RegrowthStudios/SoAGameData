#version 130

// Input vertex data, different for all executions of this shader.
in vec3 vertexPosition_modelspace;
in vec2 vertexUV;
in vec3 vertexNormal_modelspace;
in vec3 vertexColor;
in vec4 vertexSlopeColor;
//in vec4 vertexBeachColor;
in vec4 texTempRainSpec;

// Output data ; will be interpolated for each fragment.
out float lightMod;
out float ambientLight;
out vec3 lightColor;
out vec2 UV;
out vec3 Normal_worldspace;
out vec3 fragmentColor;
out vec4 slopeColor;
//out vec4 beachColor;
flat out float textureUnitID;
out float temperature;
out float rainfall;
out float specular;
out vec3 vertexPosWorld;
out vec3 EyeDirection_worldspace;
out vec3 Color;
out vec3 SecondaryColor;
out float fadeAlpha;
out float scatterFade;
out float height;
out float slope;

uniform mat4 MVP;

uniform vec3 worldOffset;
uniform vec3 cameraPos;		// The camera's current position
uniform vec3 lightPos;		// The direction vector to the light source
uniform vec3 invWavelength;	// 1 / pow(wavelength, 4) for the red, green, and blue channels
uniform float cameraHeight;	// The camera's current height
uniform float innerRadius;		// The inner (planetary) radius
uniform float krESun;			// Kr * ESun
uniform float kmESun;			// Km * ESun
uniform float kr4PI;			// Kr * 4 * PI
uniform float km4PI;			// Km * 4 * PI
uniform float fScale;			// 1 / (fOuterRadius - innerRadius)
uniform float scaleDepth;		// The scale depth (i.e. the altitude at which the atmosphere's average density is found)
uniform float fScaleOverScaleDepth;	// fScale / scaleDepth
uniform float FadeDistance;
uniform float secColorMult;

uniform sampler2D sunColorTexture;

uniform int nSamples;
uniform float fSamples;


float scale(float fCos)
{
	float x = 1.0 - fCos;
	return scaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));
}

void main(void)
{
    UV = vertexUV;
	textureUnitID = texTempRainSpec[0];
    temperature = texTempRainSpec[1]*0.00392157; //equivalent to dividing by 255
    rainfall = texTempRainSpec[2]*0.00392157;
    specular = texTempRainSpec[3]*0.00392157;
	fragmentColor = vertexColor;
    slopeColor = vertexSlopeColor;
    //beachColor = vertexBeachColor;
    Normal_worldspace = vertexNormal_modelspace;
    
    gl_Position =  MVP * vec4( vertexPosition_modelspace ,1);
    
	// Get the ray from the camera to the vertex, and its length (which is the far point of the ray passing through the atmosphere)
	vec3 worldPosition = vertexPosition_modelspace + worldOffset;
    vec3 worldDir = normalize(worldPosition);
    height = length(worldPosition) - innerRadius;
    //keeps mountains from appearing dark
    if (height >= cameraHeight - innerRadius){
        worldPosition = worldDir * cameraHeight;
    }
	vec3 ray = worldPosition - cameraPos;
	float fFar = length(ray);
	ray /= fFar;
    
    fadeAlpha = clamp((fFar - (FadeDistance - 16.6))*0.06, 0.0, 1.0);
    scatterFade = clamp((fFar - (FadeDistance + 500))*0.00015, 0.0, 1.0);
    
    EyeDirection_worldspace = -ray;
 
    slope = dot(worldDir, vertexNormal_modelspace);
    
    float cosTheta = dot( worldDir, lightPos );
    lightMod = clamp((cosTheta+0.13)*10, 0.0, 1.0);
    
    cosTheta = clamp( cosTheta + 0.06, 0.0, 1.0 );
    ambientLight = cosTheta*(0.76)+0.015;
    
    lightMod *= 1.0 - ambientLight; //want diffuse and ambient to add up to 1
    
    lightColor = texture2D( sunColorTexture, vec2(cosTheta, 0.0) ).rgb;
    
	// Calculate the ray's starting position, then calculate its scattering offset
	vec3 v3Start = cameraPos;
	float fDepth = exp((innerRadius - cameraHeight) / scaleDepth);
	float fCameraAngle = dot(-ray, worldPosition) / length(worldPosition);
	float fLightAngle = dot(lightPos, worldPosition) / length(worldPosition);
	float fCameraScale = scale(fCameraAngle);
	float fLightScale = scale(fLightAngle);
	float fCameraOffset = fDepth*fCameraScale;
	float fTemp = (fLightScale + fCameraScale);

	// Initialize the scattering loop variables
	float fSampleLength = fFar / fSamples;
	float fScaledLength = fSampleLength * fScale;
	vec3 v3SampleRay = ray * fSampleLength;
	vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;

	// Now loop through the sample rays
	vec3 v3FrontColor = vec3(0.0, 0.0, 0.0);
	vec3 v3Attenuate;
    
	for(int i=0; i<nSamples; i++)
	{
		float fHeight = length(v3SamplePoint);
		fDepth = exp(fScaleOverScaleDepth * (innerRadius - fHeight));
		float fScatter = fDepth*fTemp - fCameraOffset;
		v3Attenuate = exp(-fScatter * (invWavelength * kr4PI + km4PI));
		v3FrontColor += v3Attenuate * (fDepth * fScaledLength);
		v3SamplePoint += v3SampleRay;
	}

	Color = v3FrontColor * (invWavelength * krESun + kmESun);

	// Calculate the attenuation factor for the ground
	SecondaryColor = secColorMult * v3Attenuate;
    Color = clamp(Color, 0.0, 100.0);
}
