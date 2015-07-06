// Uniforms
uniform mat4 unWVP;
uniform mat4 unW;

// Inputs
in vec4 vPosition_Face;
in vec4 vTex_Animation_BlendMode;
in vec4 vTextureAtlas_TextureIndex;
in vec4 vNDTextureAtlas;
in vec4 vNDTextureIndex;
in vec4 vTexDims;
in vec3 vColor;
in vec3 vOverlayColor;

// Outputs
out vec4 fTex;
flat out vec4 fUVStart;
flat out vec4 fNormUVStart;
flat out vec4 fDispUVStart;
out vec3 fColor;
out vec3 fOverlayColor;
flat out vec2 fTextureAtlas;
flat out vec2 fNormTextureAtlas;
flat out vec2 fDispTextureAtlas;
out vec3 fDist;
out mat3 fTBN;
flat out vec4 fTexDims;
flat out float fMultBlendFactor;
flat out float fAddBlendFactor;
flat out float fAlphaBlendFactor;

mat3 TBN_LOOKUP[6] = mat3[6](
    mat3(vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 0.0), vec3(-1.0, 0.0, 0.0)),
    mat3(vec3(0.0, 0.0, -1.0), vec3(0.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0)),
    mat3(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), vec3(0.0, -1.0, 0.0)),
    mat3(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, -1.0), vec3(0.0, 1.0, 0.0)),
    mat3(vec3(-1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), vec3(0.0, 0.0, -1.0)),
    mat3(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), vec3(0.0, 0.0, 1.0))
);

void main(){

    vec3 vertexPosition = vPosition_Face.xyz / 7.0;

    fDist = -vec3(unW * vec4(vertexPosition, 1));

	gl_Position =  unWVP * vec4(vertexPosition, 1.0);

    //base OUV
	fUVStart.x = mod((vTextureAtlas_TextureIndex[2]), 16.0)/16.0;
	fUVStart.y = ((floor((vTextureAtlas_TextureIndex[2])/16.0))/16.0);
    fNormUVStart.x = mod((vNDTextureIndex[0]), 16.0)/16.0;
	fNormUVStart.y = ((floor((vNDTextureIndex[0])/16.0))/16.0);
    fDispUVStart.x = mod((vNDTextureIndex[2]), 16.0)/16.0;
	fDispUVStart.y = ((floor((vNDTextureIndex[2])/16.0))/16.0);
    //overlay
    fUVStart.z = mod((vTextureAtlas_TextureIndex[3]), 16.0)/16.0;
	fUVStart.w = ((floor((vTextureAtlas_TextureIndex[3])/16.0))/16.0);
    fNormUVStart.z = mod((vNDTextureIndex[1]), 16.0)/16.0;
	fNormUVStart.w = ((floor((vNDTextureIndex[1])/16.0))/16.0);
    fDispUVStart.z = mod((vNDTextureIndex[3]), 16.0)/16.0;
	fDispUVStart.w = ((floor((vNDTextureIndex[3])/16.0))/16.0);
    
	fTex = (vTex_Animation_BlendMode.xyxy) / vTexDims;

    fTexDims = vTexDims;

    fTBN = TBN_LOOKUP[int(vPosition_Face.w)];

	fTextureAtlas = vTextureAtlas_TextureIndex.xy;
    fNormTextureAtlas = vNDTextureAtlas.xy;
    fDispTextureAtlas = vNDTextureAtlas.zw;

    //add 0.1 in case we lose precision
    int blendMode = int(vTex_Animation_BlendMode[3] + 0.1);
    fAlphaBlendFactor = float(blendMode & 0x3);
    fAddBlendFactor = float(((blendMode & 0xc) >> 2) - 1);
    fMultBlendFactor = float(blendMode >> 4);

	fColor = vColor;
    fOverlayColor = vOverlayColor;
}
