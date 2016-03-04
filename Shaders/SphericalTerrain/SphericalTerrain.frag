// Uniforms
uniform sampler2D unGrassTexture;
uniform sampler2D unRockTexture;
uniform sampler2D unColorMap;
uniform vec3 unEyeDirWorld;
uniform vec3 unLightDirWorld;
uniform float unAlpha;
// Scattering
uniform float unG;
uniform float unG2;
uniform vec3 rockColor = vec3(0.1, 0.1, 0.1);

// Input
in vec3 fColor;
in vec3 fPosition;
in vec3 fWorldNormal;
in vec2 fTemp_Hum;
in vec3 fEyeDir;
in vec3 fNormal;
// Scattering
in vec3 fPrimaryColor;
in vec3 fSecondaryColor;
uniform float unRadius;

// Output
out vec4 pColor;

float computeDiffuse(vec3 normal) {
    return clamp( dot( normal, unLightDirWorld ), 0,1 );
}

float computeSpecular(vec3 normal) {
    //specular
    vec3 H = normalize(unLightDirWorld + fEyeDir);
    float nDotH = clamp(dot(normal, H), 0.0, 1.0);
    return pow(nDotH, 16.0) * 0.03;
}

void main() {

  float angle = min(dot(fNormal, fWorldNormal), 1.0);
  
  float diffuse = computeDiffuse(fNormal);
  float specular = computeSpecular(fNormal);

  float theta = dot(unLightDirWorld, fEyeDir);
  float miePhase = ((1.0 - unG2) / (2.0 + unG2)) * (1.0 + theta * theta) / pow(1.0 + unG2 - 2.0 * unG * theta, 1.5);
  
  vec3 scatterColor = fPrimaryColor + miePhase * fSecondaryColor;
  
  // Triplanar texture mapping
  vec3 blending = abs(fNormal);
  blending = normalize(max(blending, 0.00001)); // Force weights to sum to 1.0
  vec3 texPosition = fPosition * 64.0;
  // Grass texture
  vec3 grassColor = texture(unGrassTexture, texPosition.yz).rgb * blending.x +
    texture(unGrassTexture, texPosition.xz).rgb * blending.y +
    texture(unGrassTexture, texPosition.xy).rgb * blending.z;
  // Rock texture
  vec3 rockColor = texture(unRockTexture, texPosition.yz).rgb * blending.x +
    texture(unRockTexture, texPosition.xz).rgb * blending.y +
    texture(unRockTexture, texPosition.xy).rgb * blending.z;
  rockColor = rockColor * vec3(51.0 / 255.0, 47.0 / 255.0, 49.0 / 255.0);
  
  vec3 textureColor = grassColor * texture(unColorMap, fTemp_Hum).rgb * angle + rockColor * (1.0 - angle);
  
  vec3 color = fColor.rgb * textureColor;
  pColor = vec4(color * diffuse + scatterColor * 1.5 + vec3(1.0) * specular, unAlpha);
}
