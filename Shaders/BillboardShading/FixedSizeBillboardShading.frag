#version 130

// Uniforms
uniform float unTextureUnitID; // DAFUQ
uniform sampler2D unTextures[8]; // DAFUQ
uniform vec4 unParticleColor;

// Input
in vec2 fUV;

// Output
out vec4 pColor;

void main(){

  // Material properties
  vec4 MaterialDiffuseColor;

  if (unTextureUnitID == 0.0){
    MaterialDiffuseColor = texture( unTextures[0], fUV ).rgba;
  }else if (unTextureUnitID == 1.0){
    MaterialDiffuseColor = texture( unTextures[1], fUV ).rgba;
  }else if (unTextureUnitID == 2.0){
    MaterialDiffuseColor = texture( unTextures[2], fUV ).rgba;
  }else if (unTextureUnitID == 3.0){
    MaterialDiffuseColor = texture( unTextures[3], fUV ).rgba;
  }else if (unTextureUnitID == 4.0){
    MaterialDiffuseColor = texture( unTextures[4], fUV ).rgba;
  }else if (unTextureUnitID == 5.0){
    MaterialDiffuseColor = texture( unTextures[5], fUV ).rgba;
  }else if (unTextureUnitID == 6.0){
    MaterialDiffuseColor = texture( unTextures[6], fUV ).rgba;
  }else if (unTextureUnitID == 7.0){
    MaterialDiffuseColor = texture( unTextures[7], fUV ).rgba;
  }else{
    MaterialDiffuseColor = texture( unTextures[7], fUV ).rgba;
  }

  if (MaterialDiffuseColor.a < 0.6) discard;

  pColor = vec4(MaterialDiffuseColor.rgb * unParticleColor.rgb, unParticleColor.a);
}