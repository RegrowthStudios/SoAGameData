#version 130

// Interpolated values from the vertex shaders
in vec2 UV;

// Ouput data
out vec4 color;

// Values that stay constant for the whole mesh.

uniform sampler2D textures[8];
uniform vec4 particleColor;
uniform float textureUnitID;

void main(){

	// Material properties
	vec4 MaterialDiffuseColor;
	
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
		MaterialDiffuseColor = texture( textures[7], UV ).rgba;
	}
	
	if (MaterialDiffuseColor.a < 0.6) discard;
	
	color = vec4(MaterialDiffuseColor.rgb * particleColor.rgb, particleColor.a);
}