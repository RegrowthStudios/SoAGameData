// Uniforms
uniform mat4 unWVP;
uniform vec2 unGridOffset;
uniform float unRadius;

// Input
in vec4 vPosition; // Position in object space
in vec3 vColor;

// Output
out vec3 fColor;

void main() {
  vec4 position = vPosition;
  float theta = (unGridOffset.x + vPosition.x) / unRadius;
  
  vec2 normal = vec2(0.0, 1.0);
  //rotate vector
  position.x = normal.x * cos(theta) - normal.y * sin(theta) * unRadius;
  position.y = normal.x * sin(theta) + normal.y * cos(theta) * unRadius;
  
  theta =(unGridOffset.y + vPosition.z) / unRadius;
  position.z = normal.y * cos(theta) - normal.y * sin(theta) * unRadius;
  position.y = min(position.y, normal.x * sin(theta) + normal.y * cos(theta) * unRadius);
  position.xyz = normalize(position.xyz) * unRadius;
  gl_Position = unWVP * position;
  fColor = vColor;
}
