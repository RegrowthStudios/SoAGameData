// Uniforms
uniform mat4 unVP;

// Input
in vec4 fWorldPos;
in vec3 fWorldNormal;

// Output
out vec4 pDiffuse;
out vec4 pNormal;
out vec2 pDepth;

void main() {
  pDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
  
  pNormal.rgb = (normalize(fWorldNormal) + 1.0) * 0.5;
  pNormal.w = 1.0;
  
  vec4 pos = unVP * fWorldPos;
  pDepth.x = pos.z / pos.w;
  pDepth.y = 1.0;
}
