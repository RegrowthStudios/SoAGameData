// Uniforms
uniform sampler2D unTexNormal;
uniform sampler2D unTexDepth;
uniform unVPInv;

// Input
in vec4 fPosition;

// Output
out vec4 pColor;

void main() {
  vec2 screenPos = fPosition.xy / fPosition.w;
  vec2 uv = ((screenPos * 2.0) - 1.0);
  vec4 valueNormal = texture(unTexNormal, uv); 
  vec2 valueDepth = texture(unTexDepth, uv);
  
  vec3 normal = normalize((valueNormal.xyz * 2.0) - 1.0);
  vec4 lightWPos = unVPInv * fPosition;
  lightWPos /= lightWPos.w;
  vec4 geoWPos = unVPInv * vec4(screenPos, valueDepth.x, 1.0);
  geoWPos /= geoWPos.w;
  
  pColor = vec4(1.0, 1.0, 1.0, 1.0);
}
