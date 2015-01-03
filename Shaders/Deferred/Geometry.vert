// Uniforms
uniform mat4 unWorld;
uniform mat3 unWorldIT;
uniform mat4 unVP;

// Input
in vec4 vPosition;
in vec3 vNormal;

// Output
out vec4 fWorldPos;
out vec3 fWorldNormal;

void main() {
  fWorldPos = unWorld * vPosition;
  fWorldNormal = unWorldIT * vNormal;
  gl_Position = unVP * fWorldPos;
}
