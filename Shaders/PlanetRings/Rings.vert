uniform mat4 unMVP;
uniform float unOuterRadius;

// Attributes
in vec2 vPosition;

out vec3 fPosition;

void main() {
    fPosition = vec3(vPosition.x, 0.0, vPosition.y) * unOuterRadius;
    gl_Position = unMVP * vec4(vPosition.x, 0.0, vPosition.y, 1.0);
}
