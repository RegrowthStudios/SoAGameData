uniform vec3 unLightDirWorld; // TODO(Ben): Temporary

// Inputs
in vec3 fColor;
in vec3 fNormal;

// Outputs
out vec4 pColor;

float computeDiffuse(vec3 normal) {
    return clamp( dot( normal, unLightDirWorld ), 0,1 );
}

float computeSpecular(vec3 normal) {
    //specular
    vec3 H = normalize(unLightDirWorld + fEyeDir);
    float nDotH = clamp(dot(normal, H), 0.0, 1.0);
    return pow(nDotH, 16.0) * 0.03;
}

void main() {
    float theta = computeDiffuse(fNormal);
    pColor = vec4(fColor * theta, 1.0);
}