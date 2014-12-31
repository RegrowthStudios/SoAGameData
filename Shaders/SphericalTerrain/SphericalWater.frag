// Uniforms
uniform sampler2D unNormalMap;
uniform sampler2D unColorMap;
uniform float unDepthScale;
uniform vec3 unNormMult;
uniform float unDt;
uniform vec3 unEyeDirWorld;
uniform vec3 unLightDirWorld = vec3(0.0, 0.0, 1.0);

// Input
in vec3 fColor;
in vec2 fUV;
in float fTemp;
in float fDepth;
in float frozen;
in mat3 fTbn;

// Output
out vec4 pColor;

void main() {
  
  if (frozen > 0.5) {
    vec3 normal = fTbn * vec3(0.0, 1.0, 0.0);
    // Diffuse lighting
    float cosTheta = clamp( dot( normal, unLightDirWorld ), 0,1 );
    pColor = vec4(fColor.rgb * cosTheta, 1.0);
  } else {
    vec3 normal = fTbn * normalize(((texture(unNormalMap, fUV + unDt).rbg * 2.0) - 1.0) + (texture(unNormalMap, 0.5*(fUV - unDt)).rbg * 2.0) - 1.0) + 0.0001 * unNormMult;
     
    float cosTheta = clamp( dot( normal, unLightDirWorld ), 0,1 );
    vec2 colorUV = vec2(fTemp, fDepth / unDepthScale);
    vec3 color = fColor.rgb * texture(unColorMap, colorUV).rgb;
      
    pColor = vec4(color * cosTheta, 1.0);
  }
}
