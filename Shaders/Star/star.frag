uniform float unDT;
uniform vec3 unColor;

in vec3 fPosition;

out vec4 pColor;

#include "Shaders/Noise/snoise3.glsl"

void main() {
    float n1 = noise(fPosition - vec3(unDT, unDT, unDT), 6, 0.8, 1.0, 0.7);
    float n2 = ridgedNoise(fPosition + vec3(unDT, unDT, unDT), 3, 40.8, 1.0, 0.8);
	float n3 = ridgedNoise(vec3(fPosition.x, fPosition.y, fPosition.z), 7, 4.3, 1.0, 0.85);
	
	float final = (n1 + n2 * 0.5 + n3 * 0.5) + 0.75;
	
    pColor = vec4(unColor * final, 1.0);
}