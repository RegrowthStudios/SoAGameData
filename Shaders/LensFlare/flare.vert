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
    // Fixed size billboard
    // Get the screen-space position of the center
    gl_Position = unVP * vec4(unCenter, 1.0);
    gl_Position /= gl_Position.w;
	vec2 centerPos = gl_Position.xy;
	vec2 offsetVec = vec2(0.0) - centerPos;
	float distance = length(offsetVec);
	// Decrease intensity with distance
	fIntensity = max(0.0, 1.0 - distance / 1.0) * unIntensity;
	// Decrease intensity when it gets too close
	fIntensity *= min(1.0, distance * 2.0);
	
	// Rotate the vertices
	vec2 offsetDir = offsetVec / distance;
	float angle = acos(dot(vec2(1.0f, 0.0f), offsetDir));
	if (offsetDir.y < 0.0f) angle = -angle;
	fPosition.x = vPosition.x * cos(angle) - vPosition.y * sin(angle);
	fPosition.y = vPosition.x * sin(angle) + vPosition.y * cos(angle);
	
    // Move the vertex in screen space.
    gl_Position.xy += fPosition * unDims + offsetVec * vOffset * vOffset * 0.5;
}