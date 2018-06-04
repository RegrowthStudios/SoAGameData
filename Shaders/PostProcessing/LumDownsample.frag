// Uniforms
uniform sampler2D unTex;

// Input
in vec2 fUV;

// Output
out vec4 pColor;

void main() {
    vec3 m = texture(unTex, fUV).rgb;
    vec3 a = textureOffset(unTex, fUV, ivec2(-1, -1)).rgb;
    vec3 b = textureOffset(unTex, fUV, ivec2(-1, 0)).rgb; 
    vec3 c = textureOffset(unTex, fUV, ivec2(0, -1)).rgb;

    float maxLum = max(m.b, max(a.b, max(b.b, c.b)));
    vec2 final = (m.rg + a.rg + b.rg + c.rg) / 4.0;
    pColor = vec4(final, maxLum, 1.0);
}
