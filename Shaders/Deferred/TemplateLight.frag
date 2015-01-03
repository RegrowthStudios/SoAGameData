// Uniforms
uniform sampler2D unTexColor;
uniform sampler2D unTexNormal;
uniform sampler2D unTexDepth;
uniform mat4 unVPInv;
uniform vec3 unEyePosition;
uniform vec3 unLightIntensity;

// Input
in vec4 fPosition;

// Output
out vec3 pColor;

void main() {
  vec2 screenPos = fPosition.xy / fPosition.w;
  vec2 uv = ((screenPos + 1.0) * 0.5);
  vec4 valueColor = texture(unTexColor, uv); 
  vec4 valueNormal = texture(unTexNormal, uv); 
  vec2 valueDepth = texture(unTexDepth, uv).xy;
  
  vec3 normal = normalize((valueNormal.xyz * 2.0) - 1.0);
  vec4 lightWPos = unVPInv * fPosition;
  lightWPos /= lightWPos.w;
  vec4 geoWPos = unVPInv * vec4(screenPos, valueDepth.x, 1.0);
  geoWPos /= geoWPos.w;
  
  pColor = unLightIntensity;
}
