/// 
///  BloomGaussianFirst.frag
///  Seed of Andromeda
///
///  Created by Isaque Dutra on 2 June 2015
///  Copyright 2015 Regrowth Studios
///  All Rights Reserved
///  
///  This fragment shader implements first stage of two-pass gaussian blur.
///  It blurs only the brighest parts filtered out by the Luma stage.
///  Taken from OpenGL 4.0 Shading Language Cookbook, First Edition, by David Wolff

// input
in vec2 fUV; 

//output
out vec4 pColor;

// uniforms
uniform int unHeight;           // Window height
uniform sampler2D unTexLuma;    // Texture with brighest parts of image
uniform int unGaussianN;        // Radius for gaussian blur
uniform float unWeight[50];     // Gaussian weights

// first pass of gaussian blur, in the y direction
void main() {
    float dy = 1.0 / float(unHeight);
    
    vec4 sum = texture(unTexLuma, fUV) * unWeight[0];
    for(int i=0; i<unGaussianN; i++) {
        sum += texture( unTexLuma, fUV  +
                        vec2(0.0, float(i)) * dy) * unWeight[i];
        sum += texture( unTexLuma, fUV  -
                        vec2(0.0, float(i)) * dy) * unWeight[i];
    }
    pColor = sum;
    pColor = vec4(pColor.rgb, 1.0);
}
