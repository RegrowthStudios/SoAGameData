// Uniforms
uniform sampler2D unColorBandLookup;
uniform vec3 unLightDirWorld = vec3(0.0, 0.0, 1.0);

// Input
vec3 fNormal;
out vec3 fPosition;
out vec2 fUV;

// Output
out vec4 pColor;

float computeDiffuse(vec3 normal) {
    return clamp( dot( normal, unLightDirWorld ), 0,1 );
}

void main() {
    pColor = texture(unColorBandLookup, fUV);
    
}
