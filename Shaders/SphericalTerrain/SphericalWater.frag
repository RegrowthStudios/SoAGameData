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
  
  vec3 normal = normalize(((texture(unNormalMap, fUV + unDt).rbg * 2.0) - 1.0) * unNormMult);
 // vec3 normal = normalize(texture( textures[4], UV*0.1+dt*0.00625 ).rgb*2.0 - 1) * (texture( textures[4], UV*-2*0.05+dt*0.0125 ).rgb*2.0 - 1.0)*10;
  float cosTheta = clamp( dot( normal, fLightDirTangent ), 0,1 );

  pColor = vec4(fColor.rgb * cosTheta, 1.0);
}
