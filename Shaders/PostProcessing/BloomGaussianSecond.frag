/// 
///  BloomGaussianSecond.frag
///  Seed of Andromeda
///
///  Created by Isaque Dutra on 2 June 2015
///  Copyright 2015 Regrowth Studios
///  All Rights Reserved
///  
///  This fragment shader implements second stage of two-pass gaussian blur.
///  It blurs on the x-axis the parts already blurred from the first pass,
///  then sums to original color image.
///  Taken from OpenGL 4.0 Shading Language Cookbook, First Edition, by David Wolff

// input
in vec2 fUV; 
// output
out vec4 pColor;

// uniforms
uniform int unWidth;            // Window width
uniform sampler2D unTexColor;   // Original color texture from pass before bloom pass
uniform sampler2D unTexBlur;    // Blur texture from first blur pass
uniform int unGaussianN;        // Radius for gaussian blur
uniform float unWeight[50];     // Gaussian weights
uniform float unFinalWeight;    // Ratio to apply for Bloom in order to quick change it

// Blurs image on x-axis and sums into the original image
void main() {
    float dx = 1.0 / float(unWidth);
    vec4 val = texture(unTexColor, fUV);
    vec4 sum = texture(unTexBlur, fUV) * unWeight[0];
    for(int i=0; i<unGaussianN; i++) {
        sum += texture( unTexBlur, fUV +
                        vec2(float(i), 0.0) * dx) * unWeight[i];
        sum += texture( unTexBlur, fUV -
                        vec2(float(i), 0.0) * dx) * unWeight[i];
    }

    pColor = val + sum * unFinalWeight;
    pColor = vec4(pColor.rgb, 1.0);
}
