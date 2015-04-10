// Uniforms
uniform mat4 unWVP;
uniform vec3 unCenter;
uniform vec3 unCameraRight;
uniform vec3 unCameraUp;
uniform float unSize;

// Input
in vec2 vPosition;

// Output
out vec3 fPosition;

void main() {
    vec3 vpw = unCenter +
        unCameraRight * vPosition.x * unSize +
        unCameraUp * vPosition.y * unSize;
    fPosition = vpw;
    gl_Position = unWVP * vec4(vpw, 1.0);
}