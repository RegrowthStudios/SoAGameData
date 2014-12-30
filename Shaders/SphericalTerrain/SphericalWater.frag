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
in mat3 fTbn;

// Output
out vec4 pColor;

void main() {
  
  vec3 normal = fTbn * vec3(0.0, 1.0, 0.0) + 0.0001 * normalize((texture(unNormalMap, fUV + unDt).rbg * 2.0) - 1.0) * ((texture(unNormalMap, (fUV - unDt) * 0.5).rbg * 2.0) - 1.0)  * unNormMult;
 
  float cosTheta = clamp( dot( normal, unLightDirWorld ), 0,1 );

  vec2 colorUV = vec2(fTemp, fDepth / unDepthScale);
  vec3 color = fColor.rgb * texture(unColorMap, colorUV).rgb;
  
  pColor = vec4(color * cosTheta, 1.0);
}
