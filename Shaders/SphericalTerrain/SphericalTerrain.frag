// Uniforms
uniform sampler2D unNormalMap;
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
in vec2 fNormUV;
in vec3 fPosition;
in vec2 fTemp_Hum;
in mat3 fTbn;
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
  
  vec3 normal = fTbn * normalize(((texture(unNormalMap, fNormUV).rgb * 2.0) - 1.0));
  float angle = min(dot(normal, fNormal), 1.0);
  
  float diffuse = computeDiffuse(normal);
  float specular = computeSpecular(normal);

  float theta = dot(unLightDirWorld, fEyeDir);
  float miePhase = ((1.0 - unG2) / (2.0 + unG2)) * (1.0 + theta * theta) / pow(1.0 + unG2 - 2.0 * unG * theta, 1.5);
  
  vec3 scatterColor = fPrimaryColor + miePhase * fSecondaryColor;
  
  // Triplanar texture mapping
  vec3 blending = abs(normal);
  blending = normalize(max(blending, 0.00001)); // Force weights to sum to 1.0
  // Grass texture
  vec3 grassColor = texture(unGrassTexture, fPosition.yz).rgb * blending.x +
    texture(unGrassTexture, fPosition.xz).rgb * blending.y +
    texture(unGrassTexture, fPosition.xy).rgb * blending.z;
  // Rock texture
  vec3 rockColor = texture(unRockTexture, fPosition.yz).rgb * blending.x +
    texture(unRockTexture, fPosition.xz).rgb * blending.y +
    texture(unRockTexture, fPosition.xy).rgb * blending.z;
  rockColor = rockColor * vec3(51.0 / 255.0, 47.0 / 255.0, 49.0 / 255.0);
  
  vec3 textureColor = grassColor * texture(unColorMap, fTemp_Hum).rgb * angle + rockColor * (1.0 - angle);
  
  vec3 color = fColor.rgb * textureColor;
  pColor = vec4(color * diffuse + scatterColor * 1.5 + vec3(1.0) * specular, unAlpha);
}
