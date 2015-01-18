#version 130

in vec2 vertexPosition;

out vec3 pos;
uniform float dt;

//85

void main()
{
    pos = vec3(vertexPosition, dt*0.775)*100000.0;
    gl_Position = vec4(vertexPosition, 0, 1); //should be [-1,1][-1,1]
}