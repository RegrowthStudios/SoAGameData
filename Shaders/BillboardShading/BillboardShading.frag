#version 130

// Interpolated values from the vertex shaders
in vec2 UV;
in vec2 light;
in vec3 distVec;
flat in float textureUnitID;
in vec2 maskUV;
in vec4 Color;

// Ouput data
out vec4 color;

// Values that stay constant for the whole mesh.

uniform sampler2D textures[8];
uniform vec3 LightPosition_worldspace;
uniform vec3 AmbientLight;
uniform vec3 LightColor;
uniform vec3 FogColor;
uniform float sunVal;
uniform float lightType;
uniform vec3 eyeNormalWorldspace;
uniform float alphaThreshold;

void main(){

	// Material properties
	vec3 colr;
	vec4 MaterialDiffuseColor;
	float lght = light[1] * sunVal + light[0];
	
	if (textureUnitID == 0.0){
		MaterialDiffuseColor = texture( textures[0], UV ).rgba;
	}else if (textureUnitID == 1.0){
		MaterialDiffuseColor = texture( textures[1], UV ).rgba;
	}else if (textureUnitID == 2.0){
		MaterialDiffuseColor = texture( textures[2], UV ).rgba;
	}else if (textureUnitID == 3.0){
		MaterialDiffuseColor = texture( textures[3], UV ).rgba;
	}else if (textureUnitID == 4.0){
		MaterialDiffuseColor = texture( textures[4], UV ).rgba;
	}else if (textureUnitID == 5.0){
		MaterialDiffuseColor = texture( textures[5], UV ).rgba;
	}else if (textureUnitID == 6.0){
		MaterialDiffuseColor = texture( textures[6], UV ).rgba;
	}else if (textureUnitID == 7.0){
		MaterialDiffuseColor = texture( textures[7], UV ).rgba;
	}else{
		MaterialDiffuseColor = vec4(0.0, 1.0, 0.0, 1.0);
	}

	MaterialDiffuseColor *= texture( textures[6], maskUV ).rgba;
	if (MaterialDiffuseColor.a < alphaThreshold) discard;
	
	if (lightType == 1.0){
		float dist = length(distVec);
		float cosTheta = clamp( dot( eyeNormalWorldspace, normalize(distVec) ), 0,1 );
		cosTheta = 1.0 - (1.0-cosTheta)*(1.0/(1.0-0.9)) - dist*0.007;
		if (cosTheta < 0) cosTheta = 0;
		cosTheta *= 0.5;
		lght += cosTheta;
	}else if (lightType == 2.0){
		float dist = length(distVec);
		float lightv = 0.5 - dist*0.03;
		if (lightv < 0) lightv = 0;
		lght += lightv;
	}
	if (lght > 1.2) lght = 1.2;

	vec3 MaterialAmbiantColor = AmbientLight * MaterialDiffuseColor.rgb * Color.rgb * lght;
	
	color = vec4(MaterialAmbiantColor, Color.a*MaterialDiffuseColor.a);
}