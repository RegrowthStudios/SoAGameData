// Uniforms
uniform sampler2D unNormalMap;
uniform sampler2D unTexture;
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
in vec2 fUV;
in vec2 fTemp_Hum;
in mat3 fTbn;
in vec3 fEyeDir;
in vec3 fNormal;
// Scattering
in vec3 fPrimaryColor;
in vec3 fSecondaryColor;

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
  
  vec3 normal = fTbn * normalize((texture(unNormalMap, fNormUV).rgb * 2.0) - 1.0);
  float steepness = min((1.0 - dot(normal, fNormal)) * 4.0, 1.0);
  
  float diffuse = computeDiffuse(normal);
  float specular = computeSpecular(normal);

  float theta = dot(unLightDirWorld, fEyeDir);
  float miePhase = 1.5 * ((1.0 - unG2) / (2.0 + unG2)) * (1.0 + theta * theta) / pow(1.0 + unG2 - 2.0 * unG * theta, 1.5);
  
  vec3 scatterColor = fPrimaryColor + miePhase * fSecondaryColor;
  //vec3 color = mix(fColor.rgb, rockColor, steepness);
  vec3 color = fColor.rgb * texture(unColorMap, fTemp_Hum).rgb * ((texture(unTexture, fUV).rgb + texture(unTexture, -0.007 * fUV).rgb) * 0.5);
  pColor = vec4(color * diffuse + scatterColor + vec3(1.0) * specular, unAlpha);
}
