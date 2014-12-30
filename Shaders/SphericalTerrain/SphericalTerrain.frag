// Uniforms
uniform sampler2D unNormalMap;
uniform sampler2D unTexture ;
uniform sampler2D unColorMap;
uniform vec3 unNormMult;
uniform vec3 unEyeDirWorld;
uniform vec3 unLightDirWorld = vec3(0.0, 0.0, 1.0);

// Input
in vec3 fColor;
in vec2 fUV;
in vec2 fTemp_Hum;
in mat3 fTbn;

// Output
out vec4 pColor;

void main() {
  
  vec3 normal = fTbn * normalize(((texture(unNormalMap, fUV).rgb * 2.0) - 1.0) * unNormMult);
  
  float cosTheta = clamp( dot( normal, unLightDirWorld ), 0,1 );

  vec3 color = fColor.rgb * texture(unColorMap, fTemp_Hum).rgb * texture(unTexture, fUV).rgb;
  
  pColor = vec4(color * cosTheta, 1.0);
}
