// Uniforms
uniform mat4 unWVP;

// Input
in vec4 vPosition; // Position in object space
in vec3 vColor;
in vec2 vUV;

// Output
out vec3 fColor;
out vec2 fUV;

void main() {
  gl_Position = unWVP * vPosition;
  fColor = vColor;
  fUV = vUV;
}
