#version 130

// Interpolated values from the vertex shaders
in vec4 UV;
in vec2 overlayUV;
flat in vec2 OUV;
flat in vec2 overlayOUV;
in vec3 fragmentColor;
flat in vec2 textureAtlas;
flat in vec4 texDimensions;
flat in float multiplicativeBlendFactor;
flat in float additiveBlendFactor;
flat in float alphaBlendFactor;
in vec3 distVec;
flat in float fadeAlpha;

// Ouput data
out vec4 color;

// Values that stay constant for the whole mesh.

uniform sampler2DArray textures;
uniform float sonarDistance;
uniform float waveWidth;
uniform float dt;

void main(){

    float dist = length(distVec);

	// Material properties
	vec4 colr;
	vec4 materialDiffuseColor;
	vec3 baseUV, overlayUV;
	vec4 tUV;
    
	vec4 frac = fract(UV);
    frac.yw = vec2(1.0) - frac.yw;
	tUV = frac * texDimensions / 16.0;
	
    baseUV = vec3(tUV.xy + OUV.xy, textureAtlas.x);
    overlayUV = vec3(tUV.zw + overlayOUV.xy, textureAtlas.y);
    
    vec4 dUV = UV * texDimensions;
	
    materialDiffuseColor = textureGrad(textures, baseUV, dFdx(dUV.xy/16.0), dFdy(dUV.xy/16.0));
    
	vec4 overlayColor = textureGrad(textures, overlayUV, dFdx(dUV.zw/16.0), dFdy(dUV.zw/16.0));
    vec3 multColor = max(vec3(multiplicativeBlendFactor), overlayColor.rgb);
    
    materialDiffuseColor.rgb *= multColor;
    materialDiffuseColor.rgb = mix(materialDiffuseColor.rgb, overlayColor.rgb, min(alphaBlendFactor, overlayColor.a));
    materialDiffuseColor.rgb += additiveBlendFactor * overlayColor.rgb;
    
    vec3 nearColor = vec3(1.0, 0.0, 0.0);
    vec3 farColor = vec3(0.0, 0.0, 1.0);
    vec3 newColor = nearColor * (1.0 - dt) + farColor * dt;
    
	vec3 MaterialColor = materialDiffuseColor.rgb * fragmentColor * 0.2 + newColor*0.8;
	
	if (dist > dt*sonarDistance - waveWidth && dist < dt*sonarDistance){
		colr = vec4(MaterialColor, 1.0)*(1.0-(dt*sonarDistance - dist)/waveWidth);
	}else{
		discard;
	}

	color = vec4(colr.rgb, min(colr.a*fadeAlpha, (1.0 - dt)));
}