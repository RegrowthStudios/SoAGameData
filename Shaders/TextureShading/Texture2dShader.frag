#version 130

// Interpolated values from the vertex shaders
in vec2 UV;
in vec4 fragmentColor;

// Ouput data
out vec4 color;

// Values that stay constant for the whole mesh.
uniform sampler2D myTextureSampler;
uniform sampler2D roundMaskTexture;
uniform float isRound;
uniform vec2 startUV;

void main(){
	vec4 colr;
	if (isRound == 1.0){
		colr = texture( myTextureSampler, UV ).rgba * texture( roundMaskTexture, (UV-startUV)*16.0).rgba * fragmentColor;
	}else{
		colr = texture( myTextureSampler, UV ).rgba * fragmentColor;
	}
	color = colr;
}