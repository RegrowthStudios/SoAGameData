// Uniforms
uniform mat4 unWVP;

// Input
in vec3 vPosition;
in vec2 vUV;

// Output
out vec3 fPosition;
out vec3 fNormal;
out vec2 fUV;

void main() {
    fNormal = normalize(vPosition);
    fUV = vUV;
    fPosition = vPosition;
    gl_Position = unWVP * vec4(vPosition, 1.0);
}
