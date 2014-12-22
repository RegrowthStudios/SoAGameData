// Uniforms
uniform sampler2D unNormalMap;
uniform vec3 unNormMult;

// Input
in vec3 fColor;
in vec2 fUV;
in vec3 fEyeDirTangent;
in vec3 fLightDirTangent;

// Output
out vec4 pColor;

void main() {
  
  vec3 normal = normalize(((texture(unNormalMap, fUV).rgb * 2.0) - 1.0) * unNormMult);
  
  float cosTheta = clamp( dot( normal, fLightDirTangent ), 0,1 );

  pColor = vec4(fColor.rgb * cosTheta, 1.0);
}
