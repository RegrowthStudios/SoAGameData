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
in vec3 fPosition;
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
    vec3 normal = normalize(fPosition);
    // Diffuse lighting
    float diffuse = computeDiffuse(normal);
    float specular = computeSpecular(normal);
    pColor = vec4(fColor.rgb * diffuse + scatterColor + vec3(1.0) * specular, 1.0);
  } else {
    // Overlay same water normal map multiple times for illusion of complexity
    // Triplanar texture mapping
    vec3 blending = abs(normalize(fPosition));
    blending = normalize(max(blending, 0.00001)); // Force weights to sum to 1.0
    vec3 xPlane = normalize(texture(unNormalMap, fPosition.yz - unDt).rbg * 2.0 - 1.0);
    vec3 yPlane = normalize(texture(unNormalMap, fPosition.xz - unDt).rbg * 2.0 - 1.0);
    vec3 zPlane = normalize(texture(unNormalMap, fPosition.xy - unDt).rbg * 2.0 - 1.0);
    vec3 normal = normalize(fPosition) + 0.0000001 * fTbn * normalize(xPlane * blending.x + yPlane * blending.y + zPlane * blending.z);
    
    vec2 colorUV = vec2(fTemp, fDepth / unDepthScale);
    
    vec3 color = fColor.rgb * texture(unColorMap, colorUV).rgb;
    
    float diffuse = computeDiffuse(normal); 
    float specular = computeSpecular(normal);
    pColor = vec4(texture(unColorMap, colorUV).rgb + scatterColor * 1.5 + vec3(1.0) * specular * 0.00001, unAlpha);
  }
}
