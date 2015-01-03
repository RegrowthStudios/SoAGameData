// Uniforms
uniform mat4 unWVP;
uniform mat4 unWorld;
uniform vec3 unCameraRight; // Camera's right vector in world space
uniform vec3 unCameraUp; // Camera's up vector in world space

// Input
in vec4 vPosition;
in vec2 vUV;
in vec2 vUVMult;
in vec4 vTexUtexIDlight; //texUnit, texID, light[2]
in vec4 vColor;
in vec2 vSizeXMod;

// Output
out vec2 fUV;
out vec2 fLight;
out vec3 fDistVec;
out vec4 fColor;
flat out int fTextureUnitID;
out vec2 fMaskUV;

void main() {
  // Pass values
  fMaskUV = vUV;
  fColor = vColor;
  fTextureUnitID = clamp(int(vTexUtexIDlight.x * 255.0), 0, 7);
  fLight = vTexUtexIDlight.zw;
  fDistVec = vec3(unWorld * (vPosition));

  // Calculate position
  vec3 worldPos = vPosition.xyz
      + unCameraRight * (vUV.x - 0.5) * vSizeXMod.x * 0.0875
      + unCameraUp * (vUV.y - 0.5) * vSizeXMod.x * 0.0875;
  gl_Position = unWVP * vec4(worldPos, 1.0);

  // Calculate texture coordinates
  vec2 uvStart;
  int xmod = int(vSizeXMod.y);
  uvStart.x = (int(vTexUtexIDlight.y * 255.0) % xmod);
  uvStart.y = 1.0 - (int(vTexUtexIDlight.y * 255.0) / xmod + 2);
  fUV = (uvStart + vUV) * vUVMult;
}
