#version 130

// Uniforms
uniform sampler2D unTexMain;
uniform sampler2D unTexMask;
uniform float unMaskModifier;
uniform vec2 unUVMaskStart;

// Input
in vec2 fUV;
in vec4 fTint;

// Output
out vec4 pColor;

void main() {
  vec4 mask = vec4(1, 1, 1, 1);
  // TODO: Investigate the necessity of this
  //if(unMaskModifier != 0) mask = pow(texture(unTexMask, (fUV - unUVMaskStart) * 16.0), vec4(unMaskModifier)); // Ben's special goomba sauce
  vec4 c = texture(unTexMain, fUV) * fTint; 
  pColor = c * mask;
}
