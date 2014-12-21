// Uniforms
uniform mat4 unWVP;
uniform mat3 unWV3x3;
uniform vec3 unTangent;
uniform vec3 unEyeDirWorld;
uniform vec3 unLightDirWorld;

// Input
in vec4 vPosition; // Position in object space
in vec3 vColor;
in vec2 vUV;

// Output
out vec3 fColor;
out vec2 fUV;
out vec3 fEyeDirTangent;
out vec3 fLightDirTangent;

void main() {
  vec3 normal = normalize(vPosition.xyz);
  
  // Compute TBN for converting to tangent space
  vec3 n = unWV3x3 * normal;
  vec3 t = unWV3x3 * unTangent;
  vec3 b = unWV3x3 * normalize(cross( normal, unTangent ));
  mat3 tbn = transpose( mat3( t, b, n ) );
  
  // Convert eye dir and light dir to tangent space
  vec3 eyeDirCamera = unWV3x3 * unEyeDirWorld;
  fEyeDirTangent.x = dot( eyeDirCamera, t );
  fEyeDirTangent.y = dot( eyeDirCamera, b );
  fEyeDirTangent.z = dot( eyeDirCamera, n );
  fEyeDirTangent = normalize(fEyeDirTangent);
  vec3 lightDirCamera = unWV3x3 * unLightDirWorld; 
  fLightDirTangent.x = dot( lightDirCamera, t );
  fLightDirTangent.y = dot( lightDirCamera, b );
  fLightDirTangent.z = dot( lightDirCamera, n );
  fLightDirTangent = normalize(fLightDirTangent);
  
  gl_Position = unWVP * vPosition;
  fColor = vColor;
  fUV = vUV;
}
