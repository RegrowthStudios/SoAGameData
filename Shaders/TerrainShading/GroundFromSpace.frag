// Uniforms
uniform vec3 unLightPos;
uniform float unG;
uniform float unG2;
uniform sampler2D unTextures[6];
uniform sampler2D unTexColor;
uniform float unSpecularExponent;
uniform float unSpecularIntensity;
uniform float unSecColorMult;

// Input
in vec3 lightColor;
in vec2 UV;
in vec3 Normal_worldspace;
in vec3 fragmentColor;
flat in float textureUnitID;
in float temperature;
in float rainfall;
in float specular;
in vec3 EyeDirection_worldspace;
in vec3 Color;
in vec3 SecondaryColor;
in float height;

// Output
out vec4 pColor;

void main() {
  vec3 normal = normalize(Normal_worldspace);
  vec3 lightDirection = normalize(unLightPos);
  
  // Find material color
  vec3 materialColor;
  if (textureUnitID == 0.0) {
    // Terrain
    materialColor = (texture(unTextures[0], UV).rgb + texture(unTextures[0], UV*4.0).rgb) * 0.6;
    materialColor *= texture(unTexColor, vec2(temperature, 1.0 - rainfall)).rgb * fragmentColor;
  } else {
    // Water and everything else
    materialColor = vec3(0.0);
  }

  // Diffuse
  float cosTheta = clamp(dot(normal, lightDirection), 0, 1);
  vec3 diffuseColor = materialColor * cosTheta;

  // Specular
  vec3 H = normalize(lightDirection + normalize(EyeDirection_worldspace));
  float NdotH = clamp(dot(normal, H), 0.0, 1.0);
  vec3 specularColor = vec3(unSpecularIntensity * specular);
  specularColor *= pow(NdotH, unSpecularExponent);
  
  // Find Mie phase
  float theta = dot(unLightPos, EyeDirection_worldspace) / length(EyeDirection_worldspace);
  float miePhase = 1.5 * ((1.0 - unG2) / (2.0 + unG2)) * (1.0 + theta * theta) / pow(1.0 + unG2 - 2.0 * unG * theta, 1.5);
  miePhase += unSecColorMult * 0.00001;
  
  // Add lighting
  pColor.rgb = lightColor * (diffuseColor + specularColor);
  pColor.rgb += (Color + miePhase * SecondaryColor);
  pColor.a = 1.0;
  
#ifdef DEBUG_TEMP_RAIN
  pColor = vec4(temperature, rainfall, 1.0 - temperature, 1.0);
#elseif DEBUG_BIOME
  if (height < 0.0 || textureUnitID == 1.0){
    pColor = vec4(0.0, 0.0, 0.0, 1.0); // Water has no biome
  } else {
    pColor = vec4(texture(unTextures[2], vec2(temperature, rainfall)).rgb, 1.0);
  }
#endif
}
