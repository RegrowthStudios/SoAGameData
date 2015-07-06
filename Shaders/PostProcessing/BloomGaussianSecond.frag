// second blur pass and add to original

in vec2 fUV; 
out vec4 pColor;

uniform int Width;

uniform sampler2D unTexColor;
uniform sampler2D unTexBlur;

//uniform float PixOffset[10] =
//	float[](0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0);
uniform float Weight[20];
// 9.0	float[](0.1332, 0.126, 0.1066, 0.0808, 0.0548, 0.0332, 0.01802, 0.0088, 0.0038, 0.00148);
//	float[](0.075, 0.0739, 0.071, 0.06615, 0.06, 0.053, 0.0455, 0.038, 0.031, 0.0243, );

float LumThresh = 0.7;

float luma(vec3 color) {

	return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;

}

	
void main() {
	float dx = 1.0 / float(Width);
	vec4 val = texture(unTexColor, fUV);
	vec4 sum = texture(unTexBlur, fUV) * Weight[0];
	for(int i=0; i<20; i++) {
		sum += texture( unTexBlur, fUV +
						vec2(float(i), 0.0) * dx) * Weight[i];
		sum += texture( unTexBlur, fUV -
						vec2(float(i), 0.0) * dx) * Weight[i];
	}
	if((luma(val.rgb) - LumThresh) > 0.0) {
		pColor = val;
	} else {
		pColor = min(val + sum, 1.0);
	
	}
	//pColor = vec4(pColor.rgb, 1.0);
	pColor = vec4(0.0, 0.0, 1.0, 1.0);
}
