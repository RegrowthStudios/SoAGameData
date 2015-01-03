// Uniforms
uniform sampler2D unTexColor;
uniform sampler2D unTexNormal;
uniform sampler2D unTexDepth;
uniform sampler2DArray unTexLightModels;
uniform mat4 unVPInv;
uniform vec3 unEyePosition;
uniform vec3 unLightIntensity;
uniform vec3 unLightCenter;
uniform vec3 unLightAttenuation;

// Input
in vec4 fPosition;

// Output
out vec3 pColor;

void main() {
  vec2 screenPos = fPosition.xy / fPosition.w;
  vec2 uv = ((screenPos * 2.0) - 1.0);
  vec4 valueColor = texture(unTexColor, uv); 
  vec4 valueNormal = texture(unTexNormal, uv);
  vec2 valueDepth = texture(unTexDepth, uv).xy;
  
  vec3 normal = normalize((valueNormal.xyz * 2.0) - 1.0);
  vec4 lightWPos = unVPInv * fPosition;
  lightWPos /= lightWPos.w;
  vec4 geoWPos = unVPInv * vec4(screenPos, valueDepth.x, 1.0);
  geoWPos /= geoWPos.w;
  
  vec3 lightDir = unLightCenterRadius.xyz - geoWPos;
  float lightDist = length(lightDir);
  lightDir /= lightDist;
  
  // Calculate attenuation
  float attenuation = unLightAttenuation.x + unLightAttenuation.y * lightDist + unLightAttenuation.z * lightDist * lightDist;

  // Calculate diffuse factor
  float dotNL = clamp(dot(normal, lightDir), 0.0, 1.0);

  // Calculate specular factor
  vec3 eyeDir = normalize(unEyePosition - geoWPos);
  vec3 halfVector = normalize(lightDir + eyeDir);
  float dotNH = clamp(dot(normal, halfVector), 0.0, 1.0);
  
  pColor = vec4(1.0, 1.0, 1.0, 1.0);
}
