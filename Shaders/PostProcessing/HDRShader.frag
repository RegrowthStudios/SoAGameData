#version 130

in vec2 UV;

out vec4 color;

uniform sampler2D renderedTexture;
uniform float fExposure;
uniform float gamma;

void main(){
    vec3 Color = texture(renderedTexture, UV).xyz;
    float luminance = (0.2126*Color.r) + (0.7152*Color.g) + (0.0722*Color.b);
	Color = 1.0 - exp(Color * -fExposure);
    color = vec4(pow(Color, vec3(gamma)), 1.0); //some gamma correction
}