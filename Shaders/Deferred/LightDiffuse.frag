// Uniforms
uniform sampler2D unTexNormal;
uniform vec3 unLightDirection; // Light direction in world space
uniform vec3 unLightColor;

// Input
in vec2 fUV;

// Output
out vec4 pColor;

void main() {
  vec4 valueNormal = texture(unTexNormal, fUV); 
  
  vec3 normal = normalize((valueNormal.xyz * 2.0) - 1.0);
  float dotNL = dot(normal, -unLightDirection);
  dotNL = clamp(dotNL, 0.0, 1.0);
  pColor = vec4(unLightColor * dotNL, 1.0);
}
