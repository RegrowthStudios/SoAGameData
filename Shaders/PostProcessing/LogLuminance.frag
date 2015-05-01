// Uniforms
uniform sampler2D unTex;

// Input
in vec2 fUV;

// Output
out vec4 pColor;

const vec3 LUM_CONVERT = vec3(0.2126, 0.7152, 0.0722);

void main() {
    vec3 color = texture(unTex, fUV).rgb;
    float luminance = 0.0001 + dot(color, LUM_CONVERT);
    pColor = vec4(log(luminance), log(pow(luminance, 0.2)), 0.0, 1.0);
}
