// Uniforms
uniform mat4 unWVP;
uniform mat4 unW;
uniform vec3 unLightDirWorld;
uniform float unTexelWidth;
uniform float unRadius;

// Input
in vec4 vPosition; // Position in object space
in vec3 vTangent;
in vec2 vUV;
in vec3 vColor;
in vec2 vNormUV;
in vec2 vTemp_Hum;

// Output
out vec3 fColor;
out vec2 fNormUV;
out vec2 fUV;
out vec2 fTemp_Hum;
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
  
  float mult = 1.0;
  float angle = dot(unLightDirWorld, -n);
  mult = clamp( 1.0 - angle * 3.0, 0.0, 1.0);
  
  gl_Position = unWVP * vec4(vpos, 1.0);
  
  fColor = vColor;
  fUV = vUV;
  // Move normal map UV in by 1 texel in each direction
  fNormUV = vNormUV * ((unTexelWidth - 2.0001) / unTexelWidth);
  fNormUV = vNormUV + 1.0 / unTexelWidth + 0.0001;
  
  fTemp_Hum = vTemp_Hum;
}
