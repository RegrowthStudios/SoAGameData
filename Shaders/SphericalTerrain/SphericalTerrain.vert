// Uniforms
uniform mat4 unWVP;
uniform vec2 unGridOffset;
uniform float unRadius;
uniform vec3 unCameraNormal;
uniform vec3 unCameraLeft;

// Input
in vec4 vPosition; // Position in object space
in vec3 vColor;

// Output
out vec3 fColor;

void main() {
  vec4 position = vPosition;
  float theta1 = (unGridOffset.x + vPosition.x) / unRadius;
  
  vec2 normal = vec2(0.0, 1.0);
  //rotate vector
  position.x = normal.x * cos(theta1) - normal.y * sin(theta1) * unRadius;
  position.y = normal.x * sin(theta1) + normal.y * cos(theta1) * unRadius;
  
  float theta2 =(unGridOffset.y + vPosition.z) / unRadius;
  position.z = normal.y * cos(theta2) - normal.y * sin(theta2) * unRadius;
  position.y = min(position.y, normal.x * sin(theta2) + normal.y * cos(theta2) * unRadius);
  position.xyz = normalize(position.xyz) * unRadius;
  gl_Position = unWVP * position;
  
  if (abs(theta1) + abs(theta2) < 0.3) {
    fColor = vec3(1.0, 0.0, 0.0);
  } else {
    fColor = vColor;
  }
}
