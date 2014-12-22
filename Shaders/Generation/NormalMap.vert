// Uniforms
uniform float unTexelWidth;

// Inputs
in vec2 vPosition;

// Outputs
out vec2 fUV;

void main() {
    fUV = ((vPosition.xy + 1.0) / 2.0);
    // shrink UV by 1 texel in each direction
    fUV = fUV * ((unTexelWidth - 2.0001) / unTexelWidth);
    fUV = fUV + 1.0 / unTexelWidth + 0.0001;
  
    gl_Position = vec4(vPosition, 0, 1);
}