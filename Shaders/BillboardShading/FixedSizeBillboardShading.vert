#version 130

// Uniforms
uniform mat4 unWVP;
uniform vec2 unSpriteDisplacement;
uniform vec2 unSpriteScale;
uniform vec2 unUVStart;
uniform vec2 unUVSize;

// Input
in vec4 vPosition;
in vec2 vUV;

// Output
out vec2 fUV;

void main(){
  fUV = unUVStart + (vUV * unUVSize);
  
  gl_Position = unWVP * vPosition;
  gl_Position /= gl_Position.w;
  gl_Position.xy += (vUV + unSpriteDisplacement) * unSpriteScale;
}

