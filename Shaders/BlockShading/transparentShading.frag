#version 130

// Interpolated values from the vertex shaders
in vec4 UV;
in vec2 overlayUV;
flat in vec2 OUV;
flat in vec2 overlayOUV;
in vec3 fragmentColor;
in vec3 overlayFragmentColor;
flat in vec2 textureAtlas;
in float fogFactor;
flat in float fadeAlpha;
in vec3 lampLight;
in float sunlight;
in vec3 distVec;
in vec3 normal_worldspace;
in vec3 eyeDirection_worldspace;
in float specMod;
flat in float diffuseMult;
flat in vec4 texDimensions;
flat in float multiplicativeBlendFactor;
flat in float additiveBlendFactor;
flat in float alphaBlendFactor;

// Ouput data
out vec4 color;

// Values that stay constant for the whole mesh.

uniform sampler2DArray textures;
uniform vec3 ambientLight;
uniform vec3 lightColor;
uniform vec3 fogColor;
uniform float sunVal;
uniform float lightType;
uniform vec3 eyeNormalWorldspace;
uniform vec3 lightPosition_worldspace;
uniform float specularExponent;
uniform float specularIntensity;
uniform float alphaMult;

void main(){

	// Material properties
	vec3 colr;
	vec4 materialDiffuseColor;
	vec3 baseUV;
    vec3 overlayUV;
	vec4 tUV;
    
    vec3 flashLight = vec3(0.0);

	float dist = length(distVec);
		
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
    overlayColor.rgb *= overlayFragmentColor;
    
    vec3 multColor = max(vec3(multiplicativeBlendFactor), overlayColor.rgb);
    
    materialDiffuseColor.rgb *= multColor;
    materialDiffuseColor.rgb = mix(materialDiffuseColor.rgb, overlayColor.rgb, min(alphaBlendFactor, overlayColor.a));
    materialDiffuseColor.rgb += additiveBlendFactor * overlayColor.rgb;
    
    materialDiffuseColor.a = max(materialDiffuseColor.a, overlayColor.a);
    
    if (materialDiffuseColor.a < 0.05){
       discard;
    }  
    
    vec3 fragColor = materialDiffuseColor.rgb * fragmentColor.rgb;
    
	vec3 materialAmbiantColor = ambientLight * fragColor;

	if (lightType == 1.0){
		float cosTheta = clamp( dot( eyeNormalWorldspace, normalize(distVec) ), 0,1 );
		cosTheta = 1.0 - (1.0-cosTheta)*(1.0/(0.2)) - dist*0.007;
		if (cosTheta < 0.1) cosTheta = 0.1-cosTheta/4;
		if (cosTheta < 0) cosTheta = 0;
		cosTheta *= 0.5;
		flashLight += cosTheta;
	}else if (lightType == 2.0){
		float lightv = 0.5 - dist*0.03 + lightType;
		if (lightv < 0) lightv = 0;
		flashLight += lightv;
	}
    
       //specular
    vec3 H = normalize(lightPosition_worldspace + eyeDirection_worldspace);
    float NdotH = dot(normal_worldspace, H);
	NdotH = clamp(NdotH, 0.0, 1.0);
	
    vec3 materialSpecularColor = vec3(specularIntensity * specMod);
	colr =	
		// Ambiant : simulates indirect lighting
		materialAmbiantColor +
		// Diffuse : "color" of the object
		fragColor * (flashLight + sunlight * sunVal) +
        fragColor * lampLight +
        lightColor * sunlight * (fragColor * diffuseMult + 
        materialSpecularColor * pow(NdotH, specularExponent));
    
    color = vec4(mix(fogColor, colr, fogFactor), fadeAlpha * alphaMult * materialDiffuseColor.a); //apply fog and transparency
}