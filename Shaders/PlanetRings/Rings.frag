uniform sampler2D unColorLookup;
uniform float unInnerRadius;
uniform float unOuterRadius;

in vec3 fPosition;

out vec4 pColor;

void main() {
  float len = length(fPosition);
  float u = (len - unInnerRadius) / (unOuterRadius - unInnerRadius);
  vec4 ringColor = texture(unColorLookup, vec2(u, 0.0)).rgba;
  pColor = ringColor;
}