#version 130

in vec2 UV;

out vec4 color;
uniform sampler2D sceneBuffer;
uniform sampler2D noiseTex; 
uniform float elapsedTime; // seconds
uniform float luminanceThreshold; // 0.15
uniform float colorAmplification; // 5.0

uniform sampler2D renderedTexture;

void main(){
  vec2 uv;
  uv.x = 0.4*sin(elapsedTime*50.0);
  uv.y = 0.4*cos(elapsedTime*50.0);
  float n = texture2D(noiseTex, (UV.xy * 3.5) + uv).r;
  vec3 c = texture2D(sceneBuffer, UV.xy + (n * 0.001)).rgb;

  float lum = dot(vec3(0.30, 0.59, 0.11), c);
  if (lum < luminanceThreshold)
    c *= colorAmplification;

  vec3 visionColor = vec3(0.1, 0.95, 0.2);
  color = vec4((c + (n*0.2)) * visionColor * 0.7, 1.0);
}