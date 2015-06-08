// Uniforms
uniform sampler2D unTex;

// Input
in vec2 fUV;

// Output
out vec4 pColor;

void main() {
    vec2 m = texture(unTex, fUV).rg;
    vec2 a = textureOffset(unTex, fUV, ivec2(-1, -1)).rg;
    vec2 b = textureOffset(unTex, fUV, ivec2(-1, 0)).rg; 
    vec2 c = textureOffset(unTex, fUV, ivec2(0, -1)).rg;
 
    vec2 final = (m + a + b + c) / 4.0;
    pColor = vec4(final, 0.0, 1.0);
}
