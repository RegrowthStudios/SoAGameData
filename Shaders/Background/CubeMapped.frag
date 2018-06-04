// Uniforms
uniform samplerCube unTexture;

// Input
in vec3 fDirection;

// Output
out vec4 pColor;

void main() {
  pColor = textureCube(unTexture, fDirection);
}
