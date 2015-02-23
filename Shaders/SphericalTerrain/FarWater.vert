// Uniforms
uniform mat4 unWVP;
uniform mat4 unW;
uniform float unFreezeTemp;
uniform float unRadius;

// Input
in vec4 vPosition; // Position in object space
in vec3 vTangent;
in vec4 vColor_Temp;
in vec2 vUV;
in float vDepth;

// Output
out vec3 fColor;
out vec2 fUV;
out float fTemp;
out float fDepth;
out float frozen; // Needed to prevent shader precision issues
out mat3 fTbn;
out vec3 fEyeDir;

vec3 computeTangent(vec3 wPosition) {
    vec3 tangent = wPosition;
    tangent.x += 10.0;
    tangent = normalize(tangent) * (unRadius + vPosition.y);
    return normalize(tangent - wPosition);
}

void main() {
  
  // Calculate spherical position
  vec3 wPosition = vec3(unW * vPosition);
  wPosition.y = unRadius + vPosition.y;
  vec3 normal = normalize(wPosition);
  vec3 nPosition = normal * (unRadius + vPosition.y);
  
  vec3 tangent = computeTangent(wPosition);
  
  vec3 vpos = vPosition.xyz + (nPosition - wPosition);

  // Compute direction to eye
  fEyeDir = normalize(-(unW * vec4(vpos, 1.0)).xyz);
  
  // Compute TBN for converting to world space
  vec3 n = normalize((unW * vec4(normal, 0.0)).xyz);
  vec3 t = normalize((unW * vec4(tangent, 0.0)).xyz);
  vec3 b = normalize((unW * vec4(cross( normal, tangent), 0.0)).xyz);
  fTbn = mat3(t, n, b);
  
  // Check if the liquid is frozen
  if (vColor_Temp.a <= unFreezeTemp) {
    frozen = 1.0;
  } else {
    frozen = 0.0;
  }
 
  gl_Position = unWVP * vec4(vpos, 1.0);
  
  fColor = vColor_Temp.rgb;
  fTemp = vColor_Temp.a;
  fUV = vUV;
  fDepth = vDepth;
}
