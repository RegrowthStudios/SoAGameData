// Uniforms
uniform sampler2D unHeightMap;
uniform float unWidth;

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
    
    vec3 middle = vec3(0.0, h, 0.0);
    vec3 right = vec3(unWidth, dX, 0.0) - middle;
    vec3 front = vec3(0.0, dY, unWidth) - middle;
    pNormal = normalize(cross(right, front));
}
