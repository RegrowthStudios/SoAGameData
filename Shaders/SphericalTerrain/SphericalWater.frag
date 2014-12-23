// Uniforms
uniform sampler2D unNormalMap;
uniform vec3 unNormMult;
uniform float unDt;

// Input
in vec3 fColor;
in vec2 fUV;
in vec3 fEyeDirTangent;
in vec3 fLightDirTangent;

// Output
out vec4 pColor;

void main() {
  
  vec3 normal = ((texture(unNormalMap, fUV + unDt).rbg * 2.0) - 1.0) * ((texture(unNormalMap, (fUV - unDt) * 0.5).rbg * 2.0) - 1.0)  * unNormMult;
 
  float cosTheta = clamp( dot( normal, fLightDirTangent ), 0,1 );

  pColor = vec4(fColor.rgb * cosTheta, 1.0);
}
