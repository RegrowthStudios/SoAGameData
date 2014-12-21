// Inputs
in vec2 vPosition;

// Outputs
out vec2 fUV;

void main() {
    fUV = (vPosition.xy + 1.0) / 2.0;
    gl_Position = vec4(vPosition, 0, 1);
}