// Uniforms
uniform sampler2D unTexNormal;
uniform sampler2D unTexDepth;
uniform samplerCube unTexEnvironment;
uniform mat4 unVPInv;
uniform vec3 unEyePosition;
// TODO: Temporary
uniform float unReflectance;
uniform float unRoughness;
uniform float unMetalness;

// Input
in vec4 fPosition;
in vec2 fUV;

// Output
out vec3 pColor;

#include "Shaders/Deferred/LightModels.glsl"

void main() {
  vec2 screenPos = fPosition.xy / fPosition.w;
  vec2 uv = ((screenPos + 1.0) * 0.5);
  vec4 valueNormal = texture(unTexNormal, uv); 
  vec2 valueDepth = texture(unTexDepth, uv).xy;
  
  vec3 normal = normalize((valueNormal.xyz * 2.0) - 1.0);
  vec4 geoWPos = unVPInv * vec4(screenPos, valueDepth.x, 1.0);
  geoWPos /= geoWPos.w;

  vec3 viewDir = normalize(unEyePosition - geoWPos.xyz);
  vec3 lightDir = normal;
  float ct = cookTorrance(normal, viewDir, lightDir, unReflectance, unRoughness * unRoughness);
  
  vec3 diffuseLightIntensity = textureCube(unTexEnvironment, normal, unRoughness * 9 + 2).rgb;
  vec3 reflect = normalize(reflect(-viewDir, normal));
  vec3 specLightIntensity = textureCube(unTexEnvironment, reflect, unRoughness * 9).rgb;

  vec3 specular = specLightIntensity * ct;
  vec3 diffuse = mix(vec3(intensity(diffuseLightIntensity)), specLightIntensity, unMetalness);
  diffuse *= dot(normal, lightDir);
  
  pColor = mix(specular + diffuse, specular, unMetalness);
}
