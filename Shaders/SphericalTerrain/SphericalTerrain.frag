// Uniforms
uniform sampler2D unNormalMap;
uniform sampler2D unTexture;
uniform sampler2D unColorMap;
uniform vec3 unNormMult;

// Input
in vec3 fColor;
in vec2 fUV;
in vec3 fEyeDirTangent;
in vec3 fLightDirTangent;
in vec2 fTemp_Hum;

// Output
out vec4 pColor;

void main() {
  
  vec3 normal = normalize(((texture(unNormalMap, fUV).rgb * 2.0) - 1.0) * unNormMult);
  
  float cosTheta = clamp( dot( normal, fLightDirTangent ), 0,1 );

  vec3 color = fColor.rgb * texture(unColorMap, fTemp_Hum).rgb * texture(unTexture, fUV).rgb;
  
  pColor = vec4(color * cosTheta, 1.0);
}
