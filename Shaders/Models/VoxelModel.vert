// Uniforms
uniform mat4 unWVP;
uniform mat4 unW;

// Inputs
in vec4 vPosition;
in vec3 vColor;
in vec3 vNormal;

// Outputs
out vec3 fColor;
out vec3 fNormal;

void main() {
    gl_Position = unWVP * vPosition;
    fColor = vColor;
    // Move normal to worldspace
    fNormal = (unW * vec4(fNormal, 1.0)).xyz;
}