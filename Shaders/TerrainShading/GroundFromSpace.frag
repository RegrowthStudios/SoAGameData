#version 130

// Interpolated values from the vertex shaders
in float lightMod;
in float ambientLight;
in vec3 lightColor;
in vec2 UV;
in vec3 Normal_worldspace;
in vec3 fragmentColor;
in vec4 slopeColor;
//in vec4 beachColor;
flat in float textureUnitID;
in float temperature;
in float rainfall;
in float specular;
in vec3 vertexPosWorld;
in vec3 EyeDirection_worldspace;
in vec3 Color;
in vec3 SecondaryColor;
in float height;
in float slope;

// Ouput data
out vec4 color;

// Values that stay constant for the whole mesh.

uniform vec3 lightPos;
uniform sampler2D textures[6];
uniform sampler2D colorTexture;
uniform sampler2D waterColorTexture;
uniform float specularExponent;
uniform float specularIntensity;
uniform float dt;
uniform float drawMode;
uniform float secColorMult;
uniform float freezeTemp;

void main() {
  vec3 MaterialDiffuseColor;
  vec3 fragColor;
  vec3 normal;
  float modifier;
  
  vec3 specmd = vec3(0.0);
  
  normal = Normal_worldspace;
  if (textureUnitID == 0.0) {
    //TERRAIN
    fragColor = texture( colorTexture, vec2(temperature, 1.0 - rainfall) ).rgb * fragmentColor;
    MaterialDiffuseColor = (texture( textures[0], UV ).rgb + texture( textures[0], UV*4.0 ).rgb) * 0.6;

    modifier = slope*1.27323954; //slope/(pi/4)
    modifier = 1.0 - modifier;
    if (modifier > 0.65){
        modifier = (modifier - 0.65) * 7.0;
        if (modifier > 1.0) modifier = 1.0;
        // the modifier does nothing. This is temporary...
        fragColor = fragColor + 0.000001* modifier; // * (1.0 - modifier) + slopeColor.rgb * modifier;
    }
  } else if (textureUnitID == 1.0) {
    //WATER
    MaterialDiffuseColor = vec3(1.0);
    if (temperature < freezeTemp) { //water freezes
      fragColor = vec3(0.875,1.0,0.992); //dont hardcode this later?
    } else {
      fragColor = texture( waterColorTexture, vec2(temperature, 1.0 - rainfall) ).rgb * fragmentColor; //we store depth in rainfall for water
      specmd += (texture( textures[4], UV*0.1+dt*0.00625 ).rgb*2.0 - 1) * (texture( textures[4], UV*-2*0.05+dt*0.0125 ).rgb*2.0 - 1.0)*10;
    }
  }else if (textureUnitID == 2.0){
    //BIOME MAP
    MaterialDiffuseColor = texture(textures[2], UV).rgb;
  }

  float cosTheta = clamp( dot( normal, lightPos ), 0,1 );
  
  //specular
  vec3 H = normalize(lightPos + EyeDirection_worldspace + specmd);
  float NdotH = dot(normal, H);
  NdotH = clamp(NdotH, 0.0, 1.0);
  vec3 sColor = Color + secColorMult * SecondaryColor;
  vec3 MaterialSpecularColor = vec3(specularIntensity * specular);
  vec3 MaterialAmbiantColor = ambientLight * MaterialDiffuseColor * fragColor;
  
  color.rgb = MaterialAmbiantColor 
      + sColor * 2.0
      + lightMod * lightColor * (MaterialDiffuseColor * fragColor * cosTheta + MaterialSpecularColor * pow(NdotH, specularExponent) );
  
  
  if (drawMode == 1.0){
      color.rgb = vec3(temperature, rainfall, 1.0 - temperature);
  }else if (drawMode == 2.0){
      if (height < 0.0 || textureUnitID == 1.0){
          color.rgb = vec3(0.0);
      }else{
          color.rgb = texture( textures[2], vec2(temperature, rainfall) ).rgb;
      }
  }
      
  color.a = 1.0;
}
