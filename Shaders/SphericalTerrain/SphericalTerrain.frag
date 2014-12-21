// Uniforms
uniform vec3 unLightDir = vec3(1.0, 0.0, 0.0);

// Input
in vec3 fColor;
in vec3 fNormal;

// Output
out vec4 pColor;

void main() {
  
  float cosTheta = clamp( dot( fNormal, unLightDir ), 0,1 );

  pColor = vec4(fColor.rgb * cosTheta, 1.0);
}
