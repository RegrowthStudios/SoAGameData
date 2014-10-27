#version 130
// Input vertex data, different for all executions of this shader.
in vec3 position;
in vec2 uv;
in vec2 uvMult;
in vec4 texUtexIDlight; //texUnit, texID, light[2]
in vec4 color;
in vec2 sizeXmod;

// Values that stay constant for the whole mesh.
out vec2 UV;
out vec2 light;
out vec3 distVec;
out vec4 Color;
flat out float textureUnitID;
out vec2 maskUV;
uniform mat4 MVP;
uniform mat4 M;

uniform vec3 cameraRight_worldspace;
uniform vec3 cameraUp_worldspace;

void main(){	
    maskUV = uv;
    Color = color;
	distVec = vec3(M * (vec4(position, 1.0)));
	
	vec3 ray = normalize(distVec);
    vec3 right = normalize(cross(ray, vec3(0.0,1.0,0.0)));
	
	vec3 vertexPosition_worldspace = position
			+ cameraRight_worldspace * (uv[0] - 0.5) * sizeXmod.x * 0.0875
			+ cameraUp_worldspace * (uv[1] - 0.5) * sizeXmod.x * 0.0875;
        
    gl_Position = MVP * vec4(vertexPosition_worldspace, 1.0);
	
    textureUnitID = texUtexIDlight[0]*255.0;
    
    vec2 UVstart;
    int xmod = int(sizeXmod.y);
    UVstart.x = (int(texUtexIDlight[1] * 255.0) % xmod);
    UVstart.y = 1.0 - (int(texUtexIDlight[1] * 255.0) / xmod + 2);
    
	UV = (UVstart + uv) * uvMult;
	
	light[0] = texUtexIDlight[2];
	light[1] = texUtexIDlight[3];
}

