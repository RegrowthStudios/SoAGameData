// Uniforms
uniform mat4 unWVP;
uniform mat4 unW;
uniform vec3 unLightDirWorld;
uniform float unTexelWidth;

// Input
in vec4 vPosition; // Position in object space
in vec3 vTangent;
in vec3 vColor;
in vec2 vUV;
in vec2 vTemp_Hum;

// Output
out vec3 fColor;
out vec2 fnUV;
out vec2 fUV;
out vec2 fTemp_Hum;
out mat3 fTbn;

void main() {
  vec3 normal = normalize(vPosition.xyz);
  
  // Compute TBN for converting to tangent space
  vec3 n = normalize((unW * vec4(normal, 0.0)).xyz);
  vec3 t = normalize((unW * vec4(vTangent, 0.0)).xyz);
  vec3 b = normalize((unW * vec4(cross( normal, vTangent), 0.0)).xyz);
  fTbn = mat3(t, n, b);
  
  float mult = 1.0;
  float angle = dot(unLightDirWorld, -n);
  mult = clamp( 1.0 - angle * 3.0, 0.0, 1.0);
  
  gl_Position = unWVP * vPosition;
  fColor = vColor;
  fUV = vUV;
  // Move normal map UV in by 1 texel in each direction
  fnUV = vUV * ((unTexelWidth - 2.0001) / unTexelWidth);
  fnUV = fUV + 1.0 / unTexelWidth + 0.0001;
  
  fTemp_Hum = vTemp_Hum;
}
