// Uniforms
uniform sampler2D unTex;

// Input
in vec2 fUV;

// Output
out vec4 pColor;

void main() {
    vec4 color = texture(unTex, fUV);
    float luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
    pColor = vec4(log(luminance), 0.0, 0.0, 1.0);
}
