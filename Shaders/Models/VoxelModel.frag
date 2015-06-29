uniform vec3 unLightDirWorld; // TODO(Ben): Temporary

// Inputs
in vec3 fColor;
in vec3 fNormal;

// Outputs
out vec4 pColor;

float computeDiffuse(vec3 normal) {
    return clamp( dot( normal, unLightDirWorld ), 0,1 );
}

void main() {
    float theta = computeDiffuse(fNormal);
    float ambient = 0.4;
    // View normals
    //pColor = vec4((fNormal + 1.0) * 0.5, 1.0) + 0.0001 * vec4(fColor * min(ambient + theta * 0.7, 1.0), 1.0);
    // Regular view
    pColor = vec4(fColor * min(ambient + theta, 1.0), 1.0);
}