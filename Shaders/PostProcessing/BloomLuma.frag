
// input
in vec2 fUV;
 
// output
out vec4 pColor;

// uniforms
uniform sampler2D unTexColor;
uniform float unLumaThresh;

// returns the average brightness of a pixel

float luma(vec3 color) {

	return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;

}

void main() {

	vec4 val = texture(unTexColor, fUV);
	pColor = val * clamp( luma(val.rgb) - unLumaThresh, 0.0, 1.0 ) * (1.0 / (1.0 - unLumaThresh));
	pColor = vec4(pColor.rgb, 1.0);
}
