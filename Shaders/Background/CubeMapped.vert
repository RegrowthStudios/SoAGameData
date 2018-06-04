// Uniforms
uniform mat4 unVP;
uniform vec3 unCameraPos;

// Input
in vec3 vPosition;

// Output
out vec3 fDirection;

void main() {
  vec3 worldPos = vPosition * 50.0;
  fDirection = vPosition;
  gl_Position = unVP * vec4(worldPos, 1);
}
