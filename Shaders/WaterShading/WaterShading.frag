// Interpolated values from the vertex shaders
in vec2 UV;
in vec4 fragmentColor;
in float textureUnitID;
in float fogFactor;
in float fadeAlpha;
in float alphaMod;
in vec3 EyeDirection_worldspace;

in vec3 lampLight;
in float sunlight;

// Ouput data
out vec4 color;

// Values that stay constant for the whole mesh.

uniform sampler2D normalMap;
uniform vec3 LightPosition_worldspace;
uniform vec3 AmbientLight;
uniform vec3 LightColor;
uniform float dt;
uniform vec3 FogColor;
uniform float sunVal;

void main(){

	vec3 fColor = fragmentColor.rgb;
	vec3 n = normalize((texture2D( normalMap, UV+dt*0.05 ).rgb*2.0 - 1) * (texture2D( normalMap, UV*-2+dt*0.1 ).rgb*2.0 - 1.0)).rbg;
   
    float alpha = fragmentColor.a * fadeAlpha;
	
	vec3 MaterialAmbiantColor = AmbientLight * fColor;
	vec3 MaterialSpecularColor = vec3(0.3,0.3,0.3) * LightColor;
    
	float cosThetaSun = clamp( dot( n, LightPosition_worldspace ), 0,1 );
    float cosThetaVoxel = clamp( dot( n, vec3(0.0, 1.0, 0.0)), 0,1 );
    
    vec3 H = normalize(LightPosition_worldspace + EyeDirection_worldspace);
    float NdotH = dot(n, H);
	NdotH = clamp(NdotH, 0.0, 1.0);
    
	vec3 colr;
	
	colr =	
		// Ambiant : simulates indirect lighting
		MaterialAmbiantColor*0.5 +
		// Diffuse : "color" of the object
		fColor * sunlight * sunVal * cosThetaSun +
        fColor * lampLight * cosThetaVoxel +
		MaterialSpecularColor * pow(NdotH, 8.0);
	colr = mix(FogColor, colr, fogFactor); //apply fog
	color = vec4(colr, clamp(alpha + alphaMod, 0.0, 1.0)); 
}