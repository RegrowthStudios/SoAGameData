// Uniforms
uniform mat4 unWVP;

// Inputs
in vec4 vPosition;
in vec3 vNormal;
in vec3 vColor;

// Outputs
out vec3 fColor;
out vec3 fNormal;

void main() {
    gl_Position = unWVP * vPosition;
    fColor = vColor;
    // Move normal to worldspace
    fNormal = vNormal;
}