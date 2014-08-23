#version 130

in vec2 UV;

out vec4 color;

uniform sampler2D renderedTexture;
uniform sampler2D depthTexture;
uniform float fExposure;
uniform float gamma;

uniform int numSamples;
uniform mat4 inverseVP;
uniform mat4 prevVP;

void main(){
    vec3 Color = texture(renderedTexture, UV).xyz;
       
    // Get the depth buffer value at this pixel.  
    float zOverW = texture(depthTexture, UV).r;  
    // H is the viewport position at this pixel in the range -1 to 1.  
    vec4 H = vec4(UV.x * 2 - 1, (1.0 - UV.y) * 2 - 1, zOverW, 1);  
    // Transform by the view-projection inverse.  
    vec4 D = inverseVP * H;  
    // Divide by w to get the world position.  
    vec4 worldPos = D / D.w;  
    
   // Current viewport position  
   vec4 currentPos = H;  
   // Use the world position, and transform by the previous view-  
   // projection matrix.  
   vec4 previousPos = prevVP * worldPos;  
   // Convert to nonhomogeneous points [-1,1] by dividing by w.  
   previousPos /= previousPos.w;  
   // Use this frame's position and last frame's to compute the pixel  
   // velocity.  
   vec2 velocity = (currentPos.xy - previousPos.xy);  
    
    // Get the initial color at this pixel.  
  
    for(int i = 1; i < numSamples; ++i)  
    {  
      vec2 offset = velocity * (float(i+1) * 0.02);
      // Sample the color buffer along the velocity vector.  
      Color += texture(renderedTexture, UV - offset).xyz;  
    }  

    
    // Average all of the samples to get the final blur color.  
    Color = Color / (numSamples);

    //gamma
    float luminance = (0.2126*Color.r) + (0.7152*Color.g) + (0.0722*Color.b);
	Color = 1.0 - exp(Color * -fExposure);
    color = vec4(pow(Color, vec3(gamma)), 1.0);// + vec4(abs(velocity.x*1.0), abs(velocity.y*10.0), color.g*0.00001, 1.0); //some gamma correction
}