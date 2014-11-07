#version 130

in vec2 UV;

out vec4 color;

uniform sampler2D renderedTexture;

void main(){
    float g = texture(renderedTexture, UV).y;
    color = vec4(0.0, g, 0.0, 1.0); 
}