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
in float dist;
in float fadeAlpha;

// Ouput data
out vec4 color;

// Values that stay constant for the whole mesh.

uniform sampler2DArray textures;
uniform float sonarDistance;
uniform float waveWidth;
uniform float dt;

void main(){

	// Material properties
	vec4 colr;
	vec4 materialDiffuseColor;
	vec3 baseUV, overlayUV;
	vec4 tUV;
	tUV = fract(UV) * texDimensions;
	
	baseUV[0] = tUV[0]/16.0 + OUV[0];
	baseUV[1] = tUV[1]/16.0 + OUV[1];
    baseUV[2] = textureAtlas.x;
    
    overlayUV[0] = tUV[2]/16.0 + overlayOUV[0];
	overlayUV[1] = tUV[3]/16.0 + overlayOUV[1];
    overlayUV[2] = textureAtlas.y;
    
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