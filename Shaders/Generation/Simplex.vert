// Inputs
in vec2 vPosition;

// Outputs
out vec3 fPos;

void main() {
    fPos = vec3((vPosition.xy + 1.0) / 2.0, 0.0);
    gl_Position = vec4(vPosition, 0, 1);
}