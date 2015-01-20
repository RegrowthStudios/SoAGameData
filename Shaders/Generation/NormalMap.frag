// Uniforms
uniform sampler2D unHeightMap;
uniform float unWidth;

// Inputs
in vec2 fUV;

// Outputs
out vec3 pNormal;

void main() {

    // Get neighbor height values
 
    float b = textureOffset(unHeightMap, fUV, ivec2(0, -1)).x;
    float r = textureOffset(unHeightMap, fUV, ivec2(1, 0)).x; 
    float f = textureOffset(unHeightMap, fUV, ivec2(0, 1)).x;
    float l = textureOffset(unHeightMap, fUV, ivec2(-1, 0)).x;

    float dX = r - l;
    float dY = f - b;
    
    vec3 right = normalize(vec3(unWidth, dX, 0.0));
    vec3 front = normalize(vec3(0.0, dY, unWidth));
    pNormal = (normalize(cross(front, right)) + 1.0) / 2.0;
}
