// Uniforms
uniform mat4 unVP;
uniform vec3 unCenter;
uniform vec2 unDims;
uniform float unIntensity;

// Input
in vec2 vPosition;
in vec2 vUV;
in float vOffset;

// Output
out vec2 fPosition;
out vec2 fUV;
out float fIntensity;

void main() {
    fUV = vUV;
    fPosition = vPosition;
    // Fixed size billboard
    // Get the screen-space position of the center
    gl_Position = unVP * vec4(unCenter, 1.0);
    gl_Position /= gl_Position.w;
	vec2 centerPos = gl_Position.xy;
	vec2 offsetVec = vec2(0.0) - centerPos;
	fIntensity = max(0.0, 1.0 - length(offsetVec) / 1.0) * unIntensity;
    // Move the vertex in screen space.
    gl_Position.xy += vPosition * unDims + offsetVec * pow(vOffset, 2.0) * 0.5;
}