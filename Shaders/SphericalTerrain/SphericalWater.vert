// Uniforms
uniform mat4 unWVP;
uniform mat3 unWV3x3;
uniform vec3 unEyeDirWorld;
uniform vec3 unLightDirWorld = vec3(0.0, 0.0, 1.0);

// Input
in vec4 vPosition; // Position in object space
in vec3 vTangent;
in vec4 vColor_Temp;
in vec2 vUV;
in vec2 vDepth;

// Output
out vec3 fColor;
out vec2 fUV;
out vec3 fEyeDirTangent;
out vec3 fLightDirTangent;
out float fTemp;
out float fDepth;

void main() {
  vec3 normal = normalize(vPosition.xyz);
  
  // Compute TBN for converting to tangent space
  vec3 n = unWV3x3 * normal;
  vec3 t = unWV3x3 * vTangent;
  vec3 b = normalize(unWV3x3 * normalize(cross( normal, vTangent)));

  // Convert eye dir and light dir to tangent space
 /// vec3 eyeDirCamera = unWV3x3 * unEyeDirWorld;
 // fEyeDirTangent.x = dot( eyeDirCamera, t );
 // fEyeDirTangent.y = dot( eyeDirCamera, b );
 // fEyeDirTangent.z = dot( eyeDirCamera, n );
 // fEyeDirTangent = normalize(fEyeDirTangent);
  vec3 lightDirCamera = unWV3x3 * unLightDirWorld; 
  fLightDirTangent.x = dot( lightDirCamera, t );
  fLightDirTangent.y = dot( lightDirCamera, n );
  fLightDirTangent.z = dot( lightDirCamera, b );
  fLightDirTangent = normalize(fLightDirTangent);
  
  gl_Position = unWVP * vPosition;
  fColor = vColor_Temp.rgb;
  fTemp = vColor_Temp.a;
  fUV = vUV;
  fDepth = vDepth;
}