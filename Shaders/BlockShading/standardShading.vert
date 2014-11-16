#version 130

in vec4 position_TextureType;
in vec4 uvs_animation_blendMode;
in vec4 textureAtlas_textureIndex;
in vec4 textureDimensions;
in vec4 color_waveEffect;
in vec3 overlayColor;
in vec4 light_sunlight;
in vec3 normal;

// Output data ; will be interpolated for each fragment.
out vec4 UV;
out vec2 overlayUV;
flat out vec2 OUV;
flat out vec2 overlayOUV;
out vec3 fragmentColor;
out vec3 overlayFragmentColor;
flat out vec2 textureAtlas;
out float fogFactor;
flat out float fadeAlpha;
out vec3 lampLight;
out float sunlight;
out vec3 distVec;
out vec3 normal_worldspace;
out vec3 eyeDirection_worldspace;
out float specMod;
flat out float diffuseMult;
flat out vec4 texDimensions;
flat out float multiplicativeBlendFactor;
flat out float additiveBlendFactor;
flat out float alphaBlendFactor;

// Values that stay constant for the whole mesh.
uniform mat4 MVP;
uniform mat4 M;
uniform float fadeDistance;
uniform float fogEnd;
uniform float fogStart;
uniform float dt;
uniform vec3 lightPosition_worldspace;

void main(){
    
    vec3 vertexPosition = position_TextureType.xyz / 7.0;
	float cosdt;
	if (color_waveEffect[3] != 0.0){
		cosdt = cos(dt*1.5 + vertexPosition.x*.392699 + vertexPosition.z*.392699 + vertexPosition.y*.392699) - cos(-dt*2.0 - vertexPosition.x*.392699 + vertexPosition.z*.392699 - vertexPosition.y*.392699);	
	}else{
		cosdt = 0;
	}
    
    specMod = dot(lightPosition_worldspace, vec3(0.0, 1.0, 0.0))*6;
    specMod = clamp(specMod, 0.0, 1.0);
    
	vec3 vpm = vec3(vertexPosition.x + cosdt*0.035, vertexPosition.y, vertexPosition.z + cosdt*0.025);
	distVec = vec3(M * vec4(vpm, 1));
        
    eyeDirection_worldspace = -distVec;
    
	// Output position of the vertex, in clip space : MVP * (position)
	gl_Position =  MVP * vec4( vpm ,1);
	
	float dist = length(M * vec4( vpm ,1));
	fadeAlpha = 1.0 - clamp((dist - fadeDistance)*0.06, 0.0, 1.0);
    
	fogFactor = clamp(((fogEnd - dist + fogStart)/fogEnd), 0.0, 1.0);
	
    //base OUV
	OUV[0] = mod((textureAtlas_textureIndex[2]), 16.0)/16.0;
	OUV[1] = ((floor((textureAtlas_textureIndex[2])/16.0))/16.0);
    
    //overlay OUV
    overlayOUV[0] = mod((textureAtlas_textureIndex[3]), 16.0)/16.0;
	overlayOUV[1] = ((floor((textureAtlas_textureIndex[3])/16.0))/16.0);
    
	UV = uvs_animation_blendMode.xyxy / textureDimensions;
    
    texDimensions = textureDimensions;
    
    normal_worldspace = normalize(normal);
    
	textureAtlas = textureAtlas_textureIndex.xy;
	
    //add 0.1 in case we lose precision
    int blendMode = int(uvs_animation_blendMode[3] + 0.1);
    alphaBlendFactor = float(blendMode & 0x3);
    additiveBlendFactor = float(((blendMode & 0xc) >> 2) - 1);
    multiplicativeBlendFactor = float(blendMode >> 4);
    
	lampLight = light_sunlight.xyz * 1.6;
    
    sunlight = light_sunlight.w * 1.05263;
	
    //diffuse
    diffuseMult = clamp( dot( normal_worldspace, lightPosition_worldspace ), 0,1 );
    
	fragmentColor = color_waveEffect.rgb;
    overlayFragmentColor = overlayColor;
}