// Uniforms
uniform sampler2D unTexSSAO;
uniform sampler2D unTexColor;
uniform float unBlurAmount;

// Input
in vec2 fUV;

// Output
out vec4 pColor;

void main() {
	float blurSSAO = 0.0f;
	vec2 texelSize = 1.0 / textureSize(unTexSSAO, 0);
	for (float x = fUV.x - texelSize.x * unBlurAmount; x <= fUV.x + texelSize.x * unBlurAmount; x += texelSize.x) {
		for (float y = fUV.y - texelSize.y * unBlurAmount; y <= fUV.y + texelSize.y * unBlurAmount; y += texelSize.y) {
			blurSSAO += texture(unTexSSAO, vec2(x, y)).r;
		}
	}
	blurSSAO /= (unBlurAmount * 2.0 + 1.0) * (unBlurAmount * 2.0 + 1.0);
	
    pColor = vec4(texture(unTexColor, fUV).rgb * blurSSAO, 0.0);
}