// Input vertex data, different for all executions of this shader.
in vec3 vertexPosition_modelspace;
in vec4 vertexUv_texUnit_texIndex;
in vec4 vertexColor;
//texture unit wave effect and texture location in a vec3 to save glVertexAttribPointer calls
in vec4 light_sunlight;

// Output data ; will be interpolated for each fragment.
out vec2 UV;

out vec4 fragmentColor;
out float fogFactor;
out float textureUnitID;
out float fadeAlpha;

out vec3 EyeDirection_worldspace;
out float alphaMod;
out vec3 lampLight;
out float sunlight;

// Values that stay constant for the whole mesh.
uniform mat4 MVP;
uniform mat4 V;
uniform mat4 M;
uniform mat3 MV3x3;
uniform float dt;
uniform float FogEnd;
uniform float FogStart;
uniform float FadeDistance;

void main(){
    vec3 vpm;
	//wavy water!
	float cosdt = 0.24 - cos(dt*2 + vertexPosition_modelspace.x*.392699 + vertexPosition_modelspace.z*.392699)*0.16 - cos(-dt - vertexPosition_modelspace.x*.392699 + vertexPosition_modelspace.z*.392699)*0.08;
	
    float distFromBot = vertexPosition_modelspace.y - floor(vertexPosition_modelspace.y) - 0.001;
    if (cosdt*0.3 >= distFromBot){
        vpm = vec3(vertexPosition_modelspace.x, vertexPosition_modelspace.y - distFromBot, vertexPosition_modelspace.z);
    }else{
        vpm = vec3(vertexPosition_modelspace.x, vertexPosition_modelspace.y - cosdt*0.3, vertexPosition_modelspace.z);
	}
    vec3 distVec = normalize(vec3(M * vec4(vpm ,1)));
    
	gl_Position =  MVP * vec4( (vpm) ,1);
	
	EyeDirection_worldspace = -distVec;
    alphaMod = clamp( ((1.0 - abs(dot( vec3(0.0, -1.0, 0.0), distVec))) - 0.6)*0.5, 0,1 );
	float dist = length(EyeDirection_worldspace);
    fadeAlpha = 1.0 - clamp((dist - FadeDistance)*0.06, 0.0, 1.0);
    
	// UV of the vertex. No special space for this one.
	
	UV = vec2(vertexUv_texUnit_texIndex.x, vertexUv_texUnit_texIndex.y) * 255.0 / 224.0; //90588235 is 7 * 33 / 255
	
	dist = length(gl_Position);
	fogFactor = clamp(((FogEnd - dist + FogStart)/FogEnd), 0.0, 1.0);
	
	lampLight = light_sunlight.rgb * 1.6;
    sunlight = light_sunlight.a * 1.05263;
	
	textureUnitID = vertexUv_texUnit_texIndex.z;
	fragmentColor = vertexColor;
}

