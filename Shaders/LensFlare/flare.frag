// Uniforms
uniform sampler2D unTexture;
uniform vec3 unColor;

// Input
in vec2 fPosition;
in vec2 fUV;
in float fIntensity;

// Output
out vec4 pColor;

void main() {   
	vec4 texColor = texture(unTexture, fUV).rgba * fIntensity;
	pColor = texColor.rgba * 2.0 + 0.0001 * vec4(texColor.rgb * unColor, texColor.a);
}
