/// 
///  BloomLuma.frag
///  Seed of Andromeda
///
///  Created by Isaque Dutra on 2 June 2015
///  Copyright 2015 Regrowth Studios
///  All Rights Reserved
///  
///  This fragment shader filters out the image's parts with luma (brightness)
///  stronger than uniform unLumaThresh and scales it proportionally passing it
///  to be blurred by next stages.
///  Taken from OpenGL 4.0 Shading Language Cookbook, First Edition, by David Wolff

// input
in vec2 fUV;
 
// output
out vec4 pColor;

// uniforms
uniform sampler2D unTexColor;   // Texture with rendering color from previous stage
uniform float unLumaThresh;     // Threshold for filtering image luma for bloom bluring

// returns the average brightness of a pixel
float luma(vec3 color) {
    return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
}

void main() {

    vec4 val = texture(unTexColor, fUV);
    pColor = val * clamp( luma(val.rgb) - unLumaThresh, 0.0, 1.0 ) * (1.0 / (1.0 - unLumaThresh));
    pColor = vec4(pColor.rgb, 1.0);
}
