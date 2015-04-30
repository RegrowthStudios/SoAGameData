// Uniforms
uniform sampler2D unNormalMap;
uniform sampler2D unColorMap;
uniform float unDepthScale;
uniform float unDt;
uniform vec3 unLightDirWorld;
uniform float unAlpha;
// Scattering
uniform float unG;
uniform float unG2;

// Input
in vec3 fColor;
in vec2 fUV;
in float fTemp;
in float fDepth;
in float frozen;
in mat3 fTbn;
in vec3 fEyeDir;
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
    return pow(nDotH, 16.0) * 0.5;
}

void main() {
  
  float theta = dot(unLightDirWorld, fEyeDir);
  float miePhase = ((1.0 - unG2) / (2.0 + unG2)) * (1.0 + theta * theta) / pow(1.0 + unG2 - 2.0 * unG * theta, 1.5);
  
  vec3 scatterColor = fPrimaryColor + miePhase * fSecondaryColor;
  
  if (frozen > 0.5) {
    vec3 normal = fTbn * vec3(0.0, 1.0, 0.0);
    // Diffuse lighting
    float diffuse = computeDiffuse(normal);
    float specular = computeSpecular(normal);
    pColor = vec4(fColor.rgb * diffuse + scatterColor + vec3(1.0) * specular, 1.0);
  } else {
    // Overlay same water normal map multiple times for illusion of complexity
    vec3 normal = fTbn * normalize(((texture(unNormalMap, 4.0 * (fUV + unDt)).rbg * 2.0) - 1.0) * 0.6 +
        ((texture(unNormalMap, 2.0 * (fUV - unDt)).rbg * 2.0) - 1.0) * 0.2 + 
        ((texture(unNormalMap, (fUV - unDt)).rbg * 2.0) - 1.0) * 0.2);
    
    vec2 colorUV = vec2(fTemp, fDepth / unDepthScale);
    
    vec3 color = fColor.rgb * texture(unColorMap, colorUV).rgb;
    
    float diffuse = computeDiffuse(normal); 
    float specular = computeSpecular(normal);
    pColor = vec4(color * diffuse + scatterColor * 1.5 + vec3(1.0) * specular, unAlpha);
  }
}
