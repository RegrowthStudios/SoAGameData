#version 130

// Input vertex data, different for all executions of this shader.
in vec4 position_TextureType;
in vec2 uvs;
in vec4 textureAtlas_textureIndex;
in vec4 textureDimensions;
in vec4 color;
in vec3 overlayColor;
in vec4 light_sunLight_animation_blendMode;
in vec3 normal;

// Output data ; will be interpolated for each fragment.
out vec4 UV;
out vec2 overlayUV;
flat out vec2 OUV; //origin UV for tiling calculations
flat out vec2 overlayOUV;
out vec3 fragmentColor;
flat out vec2 textureAtlas;
flat out vec4 texDimensions;
flat out float multiplicativeBlendFactor;
flat out float additiveBlendFactor;
flat out float alphaBlendFactor;
out float dist;
out float fadeAlpha;

// Values that stay constant for the whole mesh.
uniform mat4 MVP;
uniform mat4 M;
uniform vec3 PlayerPosition_worldspace;
uniform float FadeDistance;
uniform float dt;

void main(){
    
    vec3 vertexPosition = position_TextureType.xyz / 7.0;

	float cosdt;
	vec3 distVec = vec3(M * vec4(vertexPosition ,1));
	if (color[3] != 0.0){
		cosdt = cos(dt*1.5 + distVec.x*0.2 + distVec.z*0.2 + distVec.y) - cos(-dt*2.0 - distVec.x*0.2 + distVec.z*0.2 - distVec.y);	
	}else{
		cosdt = 0;
	}
	
	vec3 vpm = vec3(vertexPosition.x + cosdt*0.035, vertexPosition.y, vertexPosition.z + cosdt*0.025);
	
	dist = length(vec3(M * vec4( vpm ,1)));
	gl_Position =  MVP * vec4( vpm ,1);
	
	fadeAlpha = 1.0 - clamp((dist - FadeDistance)*0.08, 0.0, 1.0);
	//base OUV
	OUV[0] = mod((textureAtlas_textureIndex[2]), 16.0)/16.0;
	OUV[1] = 1.0 - (floor((textureAtlas_textureIndex[2])/16.0))/16.0 - 0.0625 * (textureDimensions[1]);
    
    //overlay OUV
    overlayOUV[0] = mod((textureAtlas_textureIndex[3]), 16.0)/16.0;
	overlayOUV[1] = 1.0 - (floor((textureAtlas_textureIndex[3])/16.0))/16.0 - 0.0625 * (textureDimensions[3]);
    
	UV = vec4(vec4(uvs, uvs) - 128.0) / textureDimensions;
    
    texDimensions = textureDimensions;
    
    textureAtlas = textureAtlas_textureIndex.xy;
    
     //add 0.1 in case we lose precision
    int blendMode = int(light_sunLight_animation_blendMode[3] * 255.0 + 0.1);
    alphaBlendFactor = float((blendMode & 0x3) - 1);
    additiveBlendFactor = float(((blendMode & 0xc) >> 2) - 1);
    multiplicativeBlendFactor = float((blendMode >> 4) - 1);
    
	fragmentColor = color.rgb;
}

