// Uniforms
uniform sampler2D unNormalMap;
uniform sampler2D unTexture;
uniform sampler2D unColorMap;
uniform vec3 unNormMult;
uniform vec3 unEyeDirWorld;
uniform vec3 unLightDirWorld = vec3(0.0, 0.0, 1.0);

// Input
in vec3 fColor;
in vec2 fNormUV;
in vec2 fUV;
in vec2 fTemp_Hum;
in mat3 fTbn;
in vec3 fEyeDir;

// Output
out vec4 pColor;

float computeDiffuse(vec3 normal) {
    return clamp( dot( normal, unLightDirWorld ), 0,1 );
}

float computeSpecular(vec3 normal) {
    //specular
    vec3 H = normalize(unLightDirWorld + fEyeDir);
    float nDotH = clamp(dot(normal, H), 0.0, 1.0);
    return pow(nDotH, 16.0) * 0.1;
}

void main() {
  
  vec3 normal = fTbn * normalize(((texture(unNormalMap, fNormUV).rgb * 2.0) - 1.0) * unNormMult);
  
  float diffuse = computeDiffuse(normal);
  float specular = computeSpecular(normal);

  vec3 color = fColor.rgb * texture(unColorMap, fTemp_Hum).rgb * ((texture(unTexture, fUV).rgb + texture(unTexture, -0.007 * fUV).rgb) * 0.5);
  
  pColor = vec4(color * diffuse + vec3(1.0) * specular, 1.0);
}
