// Uniforms
uniform sampler2DArray unTextures;
uniform vec3 unAmbientLight;
uniform vec3 unSunColor;
uniform float unSunVal;
uniform vec3 unLightDirWorld;
uniform float unSpecularExponent;
uniform float unSpecularIntensity;
uniform float unFadeDist;

// Inputs
in vec4 fTex;
flat in vec4 fUVStart;
flat in vec4 fNormUVStart;
flat in vec4 fDispUVStart;
in vec3 fColor;
in vec3 fOverlayColor;
flat in vec2 fTextureAtlas;
flat in vec2 fNormTextureAtlas;
flat in vec2 fDispTextureAtlas;
in vec3 fDist;
in mat3 fTBN;
flat in vec4 fTexDims;
flat in float fMultBlendFactor;
flat in float fAddBlendFactor;
flat in float fAlphaBlendFactor;

// Ouputs
out vec4 pColor;

float computeDiffuse(vec3 normal) {
    return clamp( dot( normal, unLightDirWorld ), 0,1 );
}

float computeSpecular(vec3 normal, vec3 eyeDir) {
    //specular
    vec3 H = normalize(unLightDirWorld + eyeDir);
    float nDotH = clamp(dot(normal, H), 0.0, 1.0);
    return pow(nDotH, unSpecularExponent) * 0.03;
}

vec2 calculateOffset(float disp, vec3 eyeDir, float scale, float bias)
{
    return -(eyeDir * fTBN).xy * (disp * scale + bias);
}

void main(){

	// Material properties
	vec4 materialDiffuseColor;

	float dist = length(fDist);
    vec3 eyeDir = fDist / dist;
    
    // UV with tiling
    vec4 frac = fract(fTex);
    frac.yw = 1.0 - frac.yw;
	vec4 tileUV = frac * fTexDims / 16.0;
	
    // Derivatives for mipmapping
    vec4 dUV = fTex * fTexDims;
    vec4 baseDf = vec4(dFdx(dUV.xy/16.0), dFdy(dUV.xy/16.0));
    vec4 overlayDf = vec4(dFdx(dUV.zw/16.0), dFdy(dUV.zw/16.0));
    
    // Base Disp
    vec3 baseDispUV = vec3(tileUV.xy + fDispUVStart.xy, fDispTextureAtlas.x);
    float baseDisp = textureGrad(unTextures, baseDispUV, baseDf.xy, baseDf.zw).r;
    
    float unDispScale = 0.04;
    float bias = -unDispScale * 0.75;
    //frac.xy = fract(fTex.xy + calculateOffset(baseDisp, eyeDir, unDispScale, bias));

	tileUV = frac * fTexDims / 16.0;
    
    // Overlay Disp
    vec3 overlayDispUV = vec3(tileUV.zw + fDispUVStart.zw, fDispTextureAtlas.y);
    float overlayDisp = textureGrad(unTextures, overlayDispUV, overlayDf.xy, overlayDf.zw).r;
	
    // Base Texture color
    vec3 baseUV = vec3(tileUV.xy + fUVStart.xy, fTextureAtlas.x);
    vec4 color = textureGrad(unTextures, baseUV, baseDf.xy, baseDf.zw);
    color.rgb *= fColor;
    
    // Base Normal
    vec3 baseNormUV = vec3(tileUV.xy + fNormUVStart.xy, fNormTextureAtlas.x);
    vec3 baseNorm = vec3(0.5, 0.5, 1.0) + 0.00001 * textureGrad(unTextures, baseNormUV, baseDf.xy, baseDf.zw).rgb;
    
    // Overlay texture color
    vec3 overlayUV = vec3(tileUV.zw + fUVStart.zw, fTextureAtlas.y);
	vec4 overlayColor = textureGrad(unTextures, overlayUV, overlayDf.xy, overlayDf.zw);
    overlayColor.rgb *= fOverlayColor;
    
    // Overlay Normal
    vec3 overlayNormUV = vec3(tileUV.zw + fNormUVStart.zw, fNormTextureAtlas.y);
    vec3 overlayNorm = textureGrad(unTextures, baseNormUV, overlayDf.xy, overlayDf.zw).rgb;
    
    vec3 multColor = max(vec3(fMultBlendFactor), overlayColor.rgb);
    
    color.rgb *= multColor;
    color.rgb = mix(color.rgb, overlayColor.rgb, min(fAlphaBlendFactor, overlayColor.a));
    color.rgb += fAddBlendFactor * overlayColor.rgb;
  
    vec3 normal = normalize(fTBN * baseNorm);
    
    //specular
    float spec = computeSpecular(normal, eyeDir);
    float diff = computeDiffuse(normal);
    
	color.rgb =	color.rgb * (unAmbientLight + diff) + // Ambiant and diffuse
                unSunColor * (vec3(unSpecularIntensity) * spec); // Specular
    // Calculate fade
	float fadeAlpha = clamp(1.0 - (dist - unFadeDist) * 0.03, 0.0, 1.0);

    float ambientOcclusion = (baseDisp + 1.0) * 0.5 * 0.000001 + 1.0;
    
    pColor = vec4(color.rgb * ambientOcclusion * 2.0, 1.0 + 0.00001 * fadeAlpha * color.a); //apply fog and transparency
}