#version 130

//
// Atmospheric scattering vertex shader
//
// Author: Sean O'Neil
//
// Copyright (c) 2004 Sean O'Neil
//

in vec3 vertexPosition_modelspace;

uniform mat4 MVP;

uniform vec3 v3CameraPos;		// The camera's current position
uniform vec3 v3LightPos;		// The direction vector to the light source
uniform vec3 v3InvWavelength;	// 1 / pow(wavelength, 4) for the red, green, and blue channels
uniform float fCameraHeight;	// The camera's current height
//uniform float fCameraHeight2;	// fCameraHeight^2
uniform float fOuterRadius;		// The outer (atmosphere) radius
//uniform float fOuterRadius2;	// fOuterRadius^2
uniform float fInnerRadius;		// The inner (planetary) radius
//uniform float fInnerRadius2;	// fInnerRadius^2
uniform float fKrESun;			// Kr * ESun
uniform float fKmESun;			// Km * ESun
uniform float fKr4PI;			// Kr * 4 * PI
uniform float fKm4PI;			// Km * 4 * PI
uniform float fScale;			// 1 / (fOuterRadius - fInnerRadius)
uniform float fScaleDepth;		// The scale depth (i.e. the altitude at which the atmosphere's average density is found)
uniform float fScaleOverScaleDepth;	// fScale / fScaleDepth

uniform int nSamples;
uniform float fSamples;

out vec3 v3Direction;
out vec4 Color;
out vec4 SecondaryColor;

float scale(float fCos)
{
	float x = 1.0 - fCos;
	return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));
}

void main()
{
    gl_Position =  MVP * vec4(vertexPosition_modelspace,1);
    	// Get the ray from the camera to the vertex, and its length (which is the far point of the ray passing through the atmosphere)
        
	vec3 v3Pos = vertexPosition_modelspace.xyz * fOuterRadius;
	vec3 v3Ray = v3Pos - v3CameraPos;
	
	vec3 centerPoint = (v3Pos + normalize(v3CameraPos)*fOuterRadius)/2.0; //get the center point so we can do some horizon culling
	
	if (length(centerPoint) >= fInnerRadius){ //only do the math if its above the horizon
		
		float fFar = length(v3Ray);
		v3Ray /= fFar;

		// Calculate the ray's starting position, then calculate its scattering offset
		vec3 v3Start = v3CameraPos;
		float fHeight = length(v3Start);
		float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fCameraHeight));
		float fStartAngle = dot(v3Ray, v3Start) / fHeight;
		float fStartOffset = fDepth*scale(fStartAngle);

		// Initialize the scattering loop variables
		//gl_FrontColor = vec4(0.0, 0.0, 0.0, 0.0);
		float fSampleLength = fFar / fSamples;
		float fScaledLength = fSampleLength * fScale;
		vec3 v3SampleRay = v3Ray * fSampleLength;
		vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;

		// Now loop through the sample rays
		vec3 v3FrontColor = vec3(0.0, 0.0, 0.0);
        vec3 v3Attenuate;
		for(int i=0; i<nSamples; i++)
		{
			float fHeight = length(v3SamplePoint);
			float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fHeight));
			float fLightAngle = dot(v3LightPos, v3SamplePoint) / fHeight;
			float fCameraAngle = dot(v3Ray, v3SamplePoint) / fHeight;
			float fScatter = (fStartOffset + fDepth*(scale(fLightAngle) - scale(fCameraAngle)));
			v3Attenuate = exp(-fScatter * (v3InvWavelength * fKr4PI + fKm4PI));
			v3FrontColor += v3Attenuate * (fDepth * fScaledLength);
			v3SamplePoint += v3SampleRay;
		}

		// Finally, scale the Mie and Rayleigh colors and set up the varying variables for the pixel shader
		SecondaryColor.rgb = v3FrontColor * fKmESun;
		v3Direction = v3CameraPos - v3Pos;
		Color.rgb = v3FrontColor * (v3InvWavelength * fKrESun);
        //to make sure that the 16f framebuffer doesnt get an overflow
		SecondaryColor.a = 0.0;
	}else{ //else its black
		SecondaryColor.rgb = vec3(0.0);
		Color.rgb = vec3(0.0);
		v3Direction = vec3(1.0);
		SecondaryColor.a = 0.0;
	}
}