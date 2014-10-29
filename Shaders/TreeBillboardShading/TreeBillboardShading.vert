#version 130

// Input vertex data, different for all executions of this shader.
in vec3 position;
in vec3 particleCenter_worldspace; //center position and sizez
in vec4 leafColor_Size;
in vec4 trunkColor_ltex;

out vec2 UV;
out vec3 leafColor;
flat out float ltexture;
out float fadeAlpha;

uniform mat4 MVP;
uniform mat4 M;
uniform vec3 worldUp;
uniform float FadeDistance;

void main(){	    
    float particleSize = leafColor_Size[3]*255.0;
  
    ltexture = trunkColor_ltex[3]*255;
    vec3 distVec = vec3(M * (vec4(particleCenter_worldspace, 1.0)));
    vec3 ray = normalize(distVec);
    vec3 right = normalize(cross(ray, worldUp));
    
    fadeAlpha = clamp((length(distVec) - (FadeDistance - 16.6))*0.06, 0.0, 1.0);
	
	vec3 vertexPosition_worldspace = 
		particleCenter_worldspace
		+ right * position.x * particleSize;
    
    vertexPosition_worldspace += worldUp * position.y * particleSize;
        
    gl_Position = MVP * vec4(vertexPosition_worldspace, 1.0f);
    
	leafColor = leafColor_Size.rgb;
    UV = position.xy + vec2(0.5, 0.0);
}

