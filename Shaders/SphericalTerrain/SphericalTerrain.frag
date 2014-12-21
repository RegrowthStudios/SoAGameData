// Uniforms
uniform vec3 unLightDir = vec3(1.0, 0.0, 0.0);
uniform sampler2D unNormalMap;

// Input
in vec3 fColor;
in vec2 fUV;

// Output
out vec4 pColor;

void main() {
  vec3 normal = texture(unNormalMap, fUV).rgb;
  float cosTheta = clamp( dot( normal, unLightDir ), 0,1 );

  pColor = vec4(fColor.rgb * cosTheta, 1.0);
}
