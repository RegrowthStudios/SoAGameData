// Uniforms
uniform mat4 unVP;
uniform vec3 unCenter;
uniform vec2 unDims;

// Input
in vec2 vPosition;

// Output
out vec2 fPosition;

void main() {
    fPosition = vPosition;
    // Fixed size billboard
    // Get the screen-space position of the center
    gl_Position = unVP * vec4(unCenter, 1.0);
    gl_Position /= gl_Position.w;
    // Move the vertex in screen space.
    gl_Position.xy += vPosition * unDims;
}