/// Calculate the fresnel term for BRDFs
/// @param reflectance: Reflectance value [0, 1]
/// @param dotVH: Dot product of view and half-angle vectors
/// @return Fresnel factor
float fresnel(in float reflectance, in float dotVH) {
  return reflectance + (1.0 - reflectance) * pow(1.0 - dotVH, 5.0);
}

/// Calculate the microfacet approximation
/// @param dotNHSquared: Squared value of dot product of normal and half-angle vectors
/// @param roughnessSquared: Squared value of roughness (0,1]
/// @return Microfacet factor
float microfacet(in float dotNHSquared, in float roughnessSquared) {
  float gauss = 1.0 / (roughnessSquared * dotNHSquared * dotNHSquared);
  return gauss * exp((dotNHSquared - 1) / (roughnessSquared * dotNHSquared));
}

/// Calculate the attenuation from viewing and light angles
/// @param dotNH: Dot product of normal and half-angle vectors
/// @param dotVH: Dot product of view and half-angle vectors
/// @param dotNV: Dot product of normal and view vectors
/// @param dotNL: Dot product of normal and light vectors
/// @return Geometric attenuation factor
float geometricAttenuation(in float dotNH, in float dotVH, in float dotNV, in float dotNL) {
  return min(1, 2 * dotNH * min(dotNV, dotNL) / dotVH);
}

/// Compute a Cook-Torrance BRDF
/// @param N: Normalized geometry normal
/// @param V: Normalized geometry-to-eye direction
/// @param L: Normalized geometry-to-light direction
/// @param reflectance: Material reflectance [0,1]
/// @param roughnessSquared: Material roughness squared [0,1]
/// @return Cook-Torrance BRDF multiplicative factor
float cookTorrance(in vec3 N, in vec3 V, in vec3 L, in float reflectance, in float roughnessSquared) {
  vec3 H = normalize(V + L);
  
  float dotNV = dot(N, V);
  float dotNH = dot(N, H);
  float dotNL = dot(N, L);
  float dotVH = dot(V, H);
  
  float F = fresnel(reflectance, dotVH);
  float D = microfacet(dotNH * dotNH, max(0.001, roughnessSquared));
  float G = geometricAttenuation(dotNH, dotVH, max(0.001, dotNV), dotNL);
  
  return (F * D * G) / (3.14159 * dotNV);
}
