// Uniforms
uniform mat4 unWVP;
uniform vec3 unCenter;
uniform vec3 unCameraRight;
uniform vec3 unCameraUp;
uniform float unMaxSize;
uniform float unStarRadius;

// Input
in vec2 vPosition;

// Output
out vec3 fPosition;

void main() {
    fPosition = (unCameraRight * vPosition.x + unCameraUp * vPosition.y);
    vec3 vpw = fPosition * unMaxSize;
    vpw = unCenter + vpw * unStarRadius;
    gl_Position = unWVP * vec4(vpw, 1.0);
}
