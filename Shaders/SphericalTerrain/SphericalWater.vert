// Uniforms
uniform mat4 unWVP;
uniform mat4 unW;

// Input
in vec4 vPosition; // Position in object space
in vec3 vTangent;
in vec4 vColor_Temp;
in vec2 vUV;
in vec2 vDepth;

// Output
out vec3 fColor;
out vec2 fUV;
out float fTemp;
out float fDepth;
out mat3 fTbn;

void main() {
  vec3 normal = normalize(vPosition.xyz);
  
  // Compute TBN for converting to tangent space
  vec3 n = normalize((unW * vec4(normal, 0.0)).xyz);
  vec3 t = normalize((unW * vec4(vTangent, 0.0)).xyz);
  vec3 b = normalize((unW * vec4(cross( normal, vTangent), 0.0)).xyz);
  fTbn = mat3(t, n, b);
  
  gl_Position = unWVP * vPosition;
  fColor = vColor_Temp.rgb;
  fTemp = vColor_Temp.a;
  fUV = vUV;
  fDepth = vDepth;
}
