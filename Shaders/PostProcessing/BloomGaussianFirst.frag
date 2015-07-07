// first blur pass

in vec2 fUV; 
out vec4 pColor;

uniform int unHeight;

uniform sampler2D unTexLuma;

uniform float unWeight[20]; 

void main() {
	float dy = 1.0 / float(unHeight);
	
	vec4 sum = texture(unTexLuma, fUV) * unWeight[0];
	for(int i=0; i<20; i++) {
		sum += texture( unTexLuma, fUV  +
						vec2(0.0, float(i)) * dy) * unWeight[i];
		sum += texture( unTexLuma, fUV  -
						vec2(0.0, float(i)) * dy) * unWeight[i];
	}
	pColor = sum;
	pColor = vec4(pColor.rgb, 1.0);

}
