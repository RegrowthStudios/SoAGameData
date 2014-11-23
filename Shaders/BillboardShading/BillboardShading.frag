#version 130

// Uniforms
uniform sampler2D unTextures[8];
uniform vec3 unAmbientLight;
uniform float unSunIntensity;
uniform float unLightType;
uniform vec3 unCameraForward; // Camera forward vector in world space
uniform float unAlphaThreshold;

// Input
in vec2 fUV;
in vec2 fLight;
in vec3 fDistVec;
in vec4 fColor;
flat in int fTextureUnitID;
in vec2 fMaskUV;

// Output
out vec4 pColor;

void main() {
  // Diffuse color
  vec4 diffuseColor  = texture(unTextures[fTextureUnitID], fUV);
  diffuseColor *= texture(unTextures[6], fMaskUV);

  // So the texture alpha (not the true alpha) is used for threshold calculations?
  if (diffuseColor.a < unAlphaThreshold) discard;

  // We still modifying alpha here...
  diffuseColor *= fColor;

  float lght = fLight.y * unSunIntensity + fLight.x;
  float dist = length(fDistVec);
  if (unLightType == 1.0) {
    float cosTheta = clamp(dot(unCameraForward, normalize(fDistVec)), 0, 1);
    cosTheta = 1.0 - (1.0 - cosTheta) * 10.0 - dist * 0.007;
    if (cosTheta < 0) cosTheta = 0;
    cosTheta *= 0.5;
    lght += cosTheta;
  } else if (unLightType == 2.0) {
    float lightv = 0.5 - dist * 0.03;
    if (lightv < 0) lightv = 0;
    lght += lightv;
  }
  if (lght > 1.2) lght = 1.2;

  // Ambient light is fishy
  pColor = vec4(diffuseColor.rgb * (unAmbientLight * lght), diffuseColor.a);
}