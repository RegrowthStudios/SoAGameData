// second blur pass and add to original

in vec2 fUV; 
out vec4 pColor;

uniform int unWidth;

uniform sampler2D unTexColor;
uniform sampler2D unTexBlur;

uniform float unWeight[20];

	
void main() {
	float dx = 1.0 / float(unWidth);
	vec4 val = texture(unTexColor, fUV);
	vec4 sum = texture(unTexBlur, fUV) * unWeight[0];
	for(int i=0; i<20; i++) {
		sum += texture( unTexBlur, fUV +
						vec2(float(i), 0.0) * dx) * unWeight[i];
		sum += texture( unTexBlur, fUV -
						vec2(float(i), 0.0) * dx) * unWeight[i];
	}

	pColor = val + sum;
	pColor = vec4(pColor.rgb, 1.0);
}
