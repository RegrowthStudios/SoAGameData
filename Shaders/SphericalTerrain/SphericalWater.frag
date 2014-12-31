// Uniforms
uniform sampler2D unNormalMap;
uniform sampler2D unColorMap;
uniform float unDepthScale;
uniform vec3 unNormMult;
uniform float unDt;
uniform vec3 unLightDirWorld = vec3(0.0, 0.0, 1.0);

// Input
in vec3 fColor;
in vec2 fUV;
in float fTemp;
in float fDepth;
in float frozen;
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
    return pow(nDotH, 16.0) * 0.5;
}

void main() {
  
  if (frozen > 0.5) {
    vec3 normal = fTbn * vec3(0.0, 1.0, 0.0);
    // Diffuse lighting
    float diffuse = computeDiffuse(normal);
    float specular = computeSpecular(normal);
    pColor = vec4(fColor.rgb * diffuse + vec3(1.0) * specular, 1.0);
  } else {
    vec3 normal = fTbn * normalize(((texture(unNormalMap, fUV + unDt).rbg * 2.0) - 1.0) + (texture(unNormalMap, 0.5*(fUV - unDt)).rbg * 2.0) - 1.0) + 0.0001 * unNormMult;
     
    
    vec2 colorUV = vec2(fTemp, fDepth / unDepthScale);
    
    vec3 color = fColor.rgb * texture(unColorMap, colorUV).rgb;
    
    float diffuse = computeDiffuse(normal); 
    float specular = computeSpecular(normal);
    pColor = vec4(color * diffuse + vec3(1.0) * specular, 1.0);
  }
}
