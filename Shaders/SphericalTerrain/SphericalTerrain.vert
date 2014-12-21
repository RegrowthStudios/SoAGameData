// Uniforms
uniform mat4 unWVP;

// Input
in vec4 vPosition; // Position in object space
in vec3 vColor;

// Output
out vec3 fColor;
out vec3 fNormal;

void main() {
  fNormal = normalize(vPosition.xyz);
  gl_Position = unWVP * vPosition;
  fColor = vColor;
}
