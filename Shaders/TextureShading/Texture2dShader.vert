// Uniforms
uniform vec2 unScreenSize;
uniform vec2 unScreenDisplacement;

// Input
in vec2 vPosition; // Position in screen space
in vec2 vUV;
in vec4 vTint;

// Output
out vec2 fUV;
out vec4 fTint;

void main() {
  // Pass Data
  fTint = vTint;
  fUV = vUV;
  
  // Screen To Normalized Position 
  vec2 scaledPosition = (vPosition + unScreenDisplacement) / unScreenSize;
  gl_Position = vec4(scaledPosition * 2.0 - 1.0, 0.0, 1.0);
}
