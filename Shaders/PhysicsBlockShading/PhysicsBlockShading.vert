#version 130

// Input vertex data, different for all executions of this shader.
in vec4 vertexPosition_blendMode;
in vec2 vertexUV;
in vec4 textureAtlas_textureIndex;
in vec4 textureDimensions;
in vec3 normal;

// Per instance attributes
in vec3 centerPosition;
in vec3 vertexColor;
in vec3 overlayColor;
in vec2 vertexLight;

// Output data ; will be interpolated for each fragment.
out vec4 UV;
out vec2 overlayUV;
flat out vec2 OUV; //origin UV for tiling calculations
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
uniform float fogEnd;
uniform float fogStart;
uniform float fadeDistance;
uniform vec3 lightPosition_worldspace;

void main(){
	// Output position of the vertex, in clip space : MVP * (position)
	vec3 vertexPosition_worldspace = centerPosition + (vertexPosition_blendMode.xyz / 7.0);
	gl_Position =  MVP * vec4( vertexPosition_worldspace ,1);
	
	distVec = vec3(M * vec4(vertexPosition_worldspace ,1));
	
	specMod = dot(lightPosition_worldspace, vec3(0.0, 1.0, 0.0))*6;
    specMod = clamp(specMod, 0.0, 1.0);
	
	eyeDirection_worldspace = -distVec;
	float dist = length(distVec);
	
	fadeAlpha = 1.0 - clamp((dist - fadeDistance)*0.06, 0.0, 1.0);
	fogFactor = clamp(((fogEnd - dist + fogStart)/fogEnd), 0.0, 1.0);
	
	    //base OUV
	OUV[0] = mod((textureAtlas_textureIndex[2]), 16.0)/16.0;
	OUV[1] = 1.0 - (floor((textureAtlas_textureIndex[2])/16.0))/16.0 - 0.0625 * (textureDimensions[1]);
    
    //overlay OUV
    overlayOUV[0] = mod((textureAtlas_textureIndex[3]), 16.0)/16.0;
	overlayOUV[1] = 1.0 - (floor((textureAtlas_textureIndex[3])/16.0))/16.0 - 0.0625 * (textureDimensions[3]);
    
	UV = vec4(vec4(vertexUV, vertexUV) - 128.0) / textureDimensions;
    
    texDimensions = textureDimensions;
    
    normal_worldspace = normalize(normal);
    
    textureAtlas = textureAtlas_textureIndex.xy;
	
    //add 0.1 in case we lose precision
   // int blendMode = int(vertexPosition_blendMode[3] * 255.0 + 0.1);
  //  alphaBlendFactor = float((blendMode & 0x3) - 1);
  //  additiveBlendFactor = float(((blendMode & 0xc) >> 2) - 1);
  //  multiplicativeBlendFactor = float((blendMode >> 4) - 1);
  
    alphaBlendFactor = 0;
    additiveBlendFactor = 0;
    multiplicativeBlendFactor = 1;
        
	fragmentColor = vertexColor;
    overlayFragmentColor = overlayColor;
    
    lampLight = vec3(vertexLight.x);
	sunlight = vertexLight.y;
    
    //diffuse
    diffuseMult = clamp( dot( normal_worldspace, lightPosition_worldspace ), 0,1 );
}

