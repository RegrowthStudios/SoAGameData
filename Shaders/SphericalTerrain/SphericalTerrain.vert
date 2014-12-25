// Uniforms
uniform mat4 unWVP;
uniform mat3 unWV3x3;
uniform vec3 unEyeDirWorld;
uniform vec3 unLightDirWorld = vec3(0.0, 0.0, 1.0);

// Input
in vec4 vPosition; // Position in object space
in vec3 vTangent;
in vec3 vColor;
in vec2 vUV;
in vec2 vTemp_Hum;

// Output
out vec3 fColor;
out vec2 fUV;
out vec3 fEyeDirTangent;
out vec3 fLightDirTangent;
out vec2 fTemp_Hum;

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
  
  float mult = 1.0;
  float angle = dot(unLightDirWorld, -normal);
  mult = clamp( 1.0 - angle * 3.0, 0.0, 1.0);
  
  
  gl_Position = unWVP * vPosition;
  fColor = vColor * mult;
  fUV = vUV;
  fTemp_Hum = vTemp_Hum;
}
