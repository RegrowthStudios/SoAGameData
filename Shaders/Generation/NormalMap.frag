// Uniforms
uniform sampler2D unHeightMap;

// Inputs
in vec2 fUV;

// Outputs
out vec3 pNormal;

void main() {

    float h = texture(unHeightMap, fUV);
    // Get neighbor height values
    float tl = textureOffset(unHeightMap, fUV, ivec2(-1, -1)).x;
    float t = textureOffset(unHeightMap, fUV, ivec2(0, -1)).x;
    float tr = textureOffset(unHeightMap, fUV, ivec2(1, -1)).x;
    float r = textureOffset(unHeightMap, fUV, ivec2(1, 0)).x;
    float br = textureOffset(unHeightMap, fUV, ivec2(1, 1)).x;
    float b = textureOffset(unHeightMap, fUV, ivec2(0, 1)).x;
    float bl = textureOffset(unHeightMap, fUV, ivec2(-1, 1)).x;
    float l = textureOffset(unHeightMap, fUV, ivec2(-1, 0)).x;
    
    // Compute dX using Sobel:
    //           -1 0 1 
    //           -2 0 2
    //           -1 0 1
    float dX = tr + 2 * r + br - tl - 2 * l - bl;

    // Compute dY using Sobel:
    //           -1 -2 -1 
    //            0  0  0
    //            1  2  1
    float dY = bl + 2 * b + br - tl - 2 * t - tr;
    
    const float intensity = 1.0f;
    pNormal = normalize(vec3(dX, intensity, dY));
}
