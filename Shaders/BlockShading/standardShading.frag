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
flat in vec2 fOUV;
flat in vec2 fOverlayOUV;
in vec3 fColor;
in vec3 fOverlayColor;
flat in vec2 fTextureAtlas;
in vec3 fDist;
in vec3 fNormal;
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

void main(){

	// Material properties
	vec4 materialDiffuseColor;
	vec3 baseUV;
    vec3 overlayUV;
	vec4 tUV;

	float dist = length(fDist);
    
    vec4 frac = fract(fTex);
    frac.yw = vec2(1.0) - frac.yw;
	tUV = frac * fTexDims / 16.0;
	
    baseUV = vec3(tUV.xy + fOUV.xy, fTextureAtlas.x);
    overlayUV = vec3(tUV.zw + fOverlayOUV.xy, fTextureAtlas.y);

    vec4 dUV = fTex * fTexDims;
	
    vec4 color = textureGrad(unTextures, baseUV, dFdx(dUV.xy/16.0), dFdy(dUV.xy/16.0));
    color.rgb *= fColor;
    
	vec4 overlayColor = textureGrad(unTextures, overlayUV, dFdx(dUV.zw/16.0), dFdy(dUV.zw/16.0));
    overlayColor.rgb *= fOverlayColor;
    
    vec3 multColor = max(vec3(fMultBlendFactor), overlayColor.rgb);
    
    color.rgb *= multColor;
    color.rgb = mix(color.rgb, overlayColor.rgb, min(fAlphaBlendFactor, overlayColor.a));
    color.rgb += fAddBlendFactor * overlayColor.rgb;
    
    //specular
    float spec = computeSpecular(fNormal, fDist / dist);
    float diff = computeDiffuse(fNormal);
    
	color.rgb =	color.rgb * (unAmbientLight + diff) + // Ambiant and diffuse
                unSunColor * (vec3(unSpecularIntensity) * spec); // Specular
        
    // Calculate fade
	float fadeAlpha = clamp(1.0 - (dist - unFadeDist) * 0.03, 0.0, 1.0);
    
    pColor = vec4(color.rgb, 1.0 + 0.00001 * fadeAlpha * color.a); //apply fog and transparency
}