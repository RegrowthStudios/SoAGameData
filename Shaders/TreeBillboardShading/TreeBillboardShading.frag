#version 130

// Interpolated values from the vertex shaders
in vec2 UV;
in vec3 leafColor;
flat in float ltexture;
in float fadeAlpha;

// Ouput data
out vec4 color;

// Values that stay constant for the whole mesh.

uniform sampler2D textures[8];
uniform float sunVal;


void main(){

	// Material properties
	vec3 colr;
	vec4 MaterialDiffuseColor;
	
    if (ltexture == 1){
        MaterialDiffuseColor = texture( textures[1], UV ).rgba; //standard leaves
    }else if (ltexture == 2){
        MaterialDiffuseColor = texture( textures[2], UV ).rgba; //pine leaves
    }else if (ltexture == 3){
        MaterialDiffuseColor = texture( textures[3], UV ).rgba; //mushroom cap
    }else{
        MaterialDiffuseColor = vec4(0.0);
    }
    MaterialDiffuseColor.rgb *= MaterialDiffuseColor.a * leafColor;
	MaterialDiffuseColor += texture( textures[0], UV ).rgba * (1.0-MaterialDiffuseColor.a); //trunk 
    
    MaterialDiffuseColor.a *= fadeAlpha;
	
	 if (MaterialDiffuseColor.a < 0.5) discard;

	color = vec4(MaterialDiffuseColor.rgb*sunVal, MaterialDiffuseColor.a); //apply fog and transparency
}