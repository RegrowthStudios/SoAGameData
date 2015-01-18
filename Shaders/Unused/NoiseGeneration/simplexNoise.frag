#version 130

in vec3 pos;

uniform sampler1D perm;
uniform sampler1D grad;

out vec3 color;

float snoise(vec3 v)
  { 
   float n0, n1, n2, n3; // Noise contributions from the four corners

    // Skew the input space to determine which simplex cell we're in
    float s = (v.x+v.y+v.z)*0.3333333334; // * 1.0/3.0 Very nice and simple skew factor for 3D
    vec3 p0 = floor(v + s);

    float G3 = 0.1666666667; // 1.0/6.0 Very nice and simple unskew factor, too
    float t = (p0.x+p0.y+p0.z)*G3;
    vec3 co = p0 - vec3(t); // Unskew the cell origin back to (x,y,z) space
    
    vec3 d = v - co; // The x,y,z distances from the cell origin

    // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
    // Determine which simplex we are in.
    vec3 p1; // Offsets for second corner of simplex in (i,j,k) coords
    vec3 p2; // Offsets for third corner of simplex in (i,j,k) coords

    if(d.x>=d.y) {
        if(d.y>=d.z) { p1.x=1.0; p1.y=0.0; p1.z=0.0; p2.x=1.0; p2.y=1.0; p2.z=0.0; } // X Y Z order
        else if(d.x>=d.z) { p1.x=1.0; p1.y=0.0; p1.z=0.0; p2.x=1.0; p2.y=0.0; p2.z=1.0; } // X Z Y order
        else { p1.x=0; p1.y=0; p1.z=1.0; p2.x=1.0; p2.y=0.0; p2.z=1.0; } // Z X Y order
    }
    else { // x0<y0
        if(d.y<d.z) { p1.x=0.0; p1.y=0.0; p1.z=1.0; p2.x=0.0; p2.y=1.0; p2.z=1.0; } // Z Y X order
        else if(d.x<d.z) { p1.x=0.0; p1.y=1.0; p1.z=0.0; p2.x=0.0; p2.y=1.0; p2.z=1.0; } // Y Z X order
        else { p1.x=0.0; p1.y=1.0; p1.z=0.0; p2.x=1.0; p2.y=1.0; p2.z=0.0; } // Y X Z order
    }

    // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
    // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
    // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
    // c = 1/6.
    
    vec3 d1 = d - p1 + G3; // Offsets for second corner in (x,y,z) coords
    vec3 d2 = d - p2 + 2.0*G3; // Offsets for third corner in (x,y,z) coords
    vec3 d3 = d - 1.0 + 3.0*G3;// Offsets for last corner in (x,y,z) coords

    // Work out the hashed gradient indices of the four simplex corners
    float SF = 1.0/255.0;
    vec3 hg = p0 * SF; // 
    
    //this is pretty intensive
    float gi0 = texture(perm, hg.x+texture(perm, hg.y+texture(perm, hg.z).r).r).r;
    float gi1 = texture(perm, hg.x+p1.x * SF+texture(perm, hg.y+p1.y * SF+texture(perm, hg.z+p1.z * SF).r).r).r;
    float gi2 = texture(perm, hg.x+p2.x * SF+texture(perm, hg.y+p2.y * SF+texture(perm, hg.z+p2.z * SF).r).r).r;
    float gi3 = texture(perm, hg.x+SF+texture(perm, hg.y+SF+texture(perm, hg.z+SF).r).r).r;

    // Calculate the contribution from the four corners
    float t0 = 0.6 - d.x*d.x - d.y*d.y - d.z*d.z;
    if(t0<0){
        n0 = 0.0;
    }else {
        t0 *= t0;
        n0 = t0 * t0 * dot((texture(grad, gi0).rgb - SF)*255.0, d);
   }

    float t1 = 0.6 - d1.x*d1.x - d1.y*d1.y - d1.z*d1.z;
    if(t1<0){
         n1 = 0.0;
    }else {
        t1 *= t1;
        n1 = t1 * t1 * dot((texture(grad, gi1).rgb - SF)*255.0, d1);
    }

    float t2 = 0.6 - d2.x*d2.x - d2.y*d2.y - d2.z*d2.z;
    if(t2<0){
         n2 = 0.0;
    }else {
        t2 *= t2;
        n2 = t2 * t2 * dot((texture(grad, gi2).rgb - SF)*255.0, d2);
    }

    float t3 = 0.6 - d3.x*d3.x - d3.y*d3.y - d3.z*d3.z;
    if(t3<0){
        n3 = 0.0;
    }else {
        t3 *= t3;
        n3 = t3 * t3 * dot((texture(grad, gi3).rgb - SF)*255.0, d3);
    }

    // Add contributions from each corner to get the final noise value.
    // The result is scaled to stay just inside [-1,1]
    return 32.0*(n0 + n1 + n2 + n3);
}

float octave_noise_3d( float octaves, float persistence, float frequency, vec3 pos ) {
    float total = 0;
    float amplitude = 1;

    // We have to keep track of the largest possible amplitude,
    // because each octave adds more, and we need a value in [-1, 1].
    float maxAmplitude = 0;

    for( int i=0; i < octaves; i++ ) {
        total += snoise( pos * frequency ) * amplitude;

        frequency *= 2;
        maxAmplitude += amplitude;
        amplitude *= persistence;
    }

    return total / maxAmplitude;
}

float scaled_octave_noise_3d( float octaves, float persistence, float freq, float loBound, float hiBound, vec3 pos ) {
    return octave_noise_3d(octaves, persistence, freq, pos) * (hiBound - loBound) * 0.5 + (hiBound + loBound) * 0.5;
}

float ridged_octave_noise_3d(float octaves, float persistence, float frequency, vec3 pos ) {
    float total = 0;
    float amplitude = 1;
	float d;

    // We have to keep track of the largest possible amplitude,
    // because each octave adds more, and we need a value in [-1, 1].
    float maxAmplitude = 0;

    for( int i=0; i < octaves; i++ ) {
		d = snoise(pos * frequency);
		if (i > 12){
			if (d < 0) d = -d;
		}else if (i > 0){ //first octave sets the base
			if (d < 0) d = -d;
			d = 1.0 - d;
		}
        total += d * amplitude;

        frequency *= 2.0;
        maxAmplitude += amplitude;
        amplitude *= persistence;
    }

    return total / maxAmplitude;
}

float reverse_ridged_octave_noise_3d( float octaves, float persistence, float frequency, vec3 pos) {
    float total = 0;
    float amplitude = 1;
	float d;

    // We have to keep track of the largest possible amplitude,
    // because each octave adds more, and we need a value in [-1, 1].
    float maxAmplitude = 0;

    for( int i=0; i < octaves; i++ ) {
		d = snoise( pos * frequency );
		if (i > 0){ //first octave sets the base
			if (d < 0){
				d = -d;
			}
			d = d;
		}
        total += d * amplitude;

        frequency *= 2.0;
        maxAmplitude += amplitude;
        amplitude *= persistence;
    }

    return total / maxAmplitude;
}

float scaled_ridged_octave_noise_3d(float octaves, float persistence, float freq, float loBound, float hiBound, vec3 pos ) {
    return ridged_octave_noise_3d(octaves, persistence, freq, pos) * (hiBound - loBound) / 2 + (hiBound + loBound) / 2;
}

float scaled_reverse_ridged_octave_noise_3d(float octaves, float persistence, float freq, const float loBound, float hiBound, vec3 pos ) {
    return reverse_ridged_octave_noise_3d(octaves, persistence, freq, pos) * (hiBound - loBound) / 2 + (hiBound + loBound) / 2;
}


uniform float heightModifier;
uniform float baseTemperature;
uniform float baseRainfall;

uniform int types[32];
uniform float persistences[32];
uniform float frequencies[32];
uniform int octaves[32];
uniform float lows[32];
uniform float highs[32];
uniform float scales[32];

uniform float tempP;
uniform float tempF;
uniform int tempO;
uniform float tempL;
uniform float tempH;

uniform float rainP;
uniform float rainF;
uniform int rainO;
uniform float rainL;
uniform float rainH;

uniform int numFunctions;

float getNoiseHeight(float noiseHeight, int func, vec3 pos)
{
	float h;
	float md = 1.0, off;
	
	//NoiseInfo *nf2 = noisef->modifier;
	//if (nf2){
	//	md = (octave_noise_3d(nf2->octaves, nf2->persistence, nf2->frequency, pos)+1.0)*0.5;
	//	if (md <= nf2->lowBound) return;
	//	md = (md-nf2->lowBound)*nf2->upBound;
	//	if (md > 1.0) md = 1.0;
	//}

	switch (types[func]){
		case 1: //small mountains
			h = scaled_ridged_octave_noise_3d(octaves[func], persistences[func], frequencies[func], lows[func], highs[func], pos);
			if (h > 16.0){
				noiseHeight += md * pow((h-16.0) * scales[func], 1.25); 
			}
			break;
		case 2: // Large Mountains and lakes	
			h = scaled_octave_noise_3d(octaves[func], persistences[func], frequencies[func], lows[func], highs[func], pos);
			if (h > 7.5){
				noiseHeight += md * pow((h-7.5) * scales[func], 1.50);
			}else if (h < 4.0){
				noiseHeight -= md * abs(4.0-h)/4 * scales[func]*40;
			}
			break;
		case 3: //hills and plateaus
			h = scaled_octave_noise_3d(octaves[func], persistences[func], frequencies[func], lows[func], highs[func], pos);
			if (h > 7.42){ //plateaus
                noiseHeight += md * ((h-7.42) * 10 + 0.015*4000 + 0.505*scales[func]);
			}else if (h > 7.405){
				noiseHeight += md * ((h-7.405) * 4000 + 0.505*scales[func]);
			}else if (h > 6.9){
				noiseHeight += md * (h-6.9) * scales[func];
			}
			break;
		case 4: //Seaside Cliffs
			if (noiseHeight < 100 && noiseHeight > -10){
				h = scaled_octave_noise_3d(octaves[func], persistences[func], frequencies[func], lows[func], highs[func], pos);
				if (noiseHeight > 0){
					if (h > 2){
						noiseHeight += md * (h-2.0)*(100 - noiseHeight);
					}else if (h < 1.5){
						noiseHeight -= md * ((noiseHeight*(125.0/128.0) - (noiseHeight)*(noiseHeight)*(noiseHeight)*(noiseHeight)*(noiseHeight)/102400000.0)*(1.5-h)*1.5);
					}
				}else{
					if (h > 2){
						noiseHeight -= md * (h-2.0)*(11 + noiseHeight);
					}
				}
			}
			break;
		case 5: //plain old ridged
			noiseHeight += md * scaled_ridged_octave_noise_3d(octaves[func], persistences[func], frequencies[func], lows[func], highs[func], pos);
			break;
		case 6: //billowy hills
			noiseHeight += md * scaled_reverse_ridged_octave_noise_3d(octaves[func], persistences[func], frequencies[func], lows[func], highs[func], pos);
			break;
		case 7: //jagged cliffs
			h = (octave_noise_3d(octaves[func], persistences[func], frequencies[func], pos)+1.0)*5.0; //number between 0 and 10
			//if h is 0.1 or less greater than the lowest integer value, it is a steep slope and we multiply by 10,
			//otherwise its a flat top
			if ((h > 1.1) && (floor(h) > floor(h-0.1))){ //steep part
				h = (floor(h)-1)+(h-floor(h))*10.0;
			}else{ //flat part
				h = floor(h); 
			}
			noiseHeight += md * (h)*scales[func];
			break;
		case 8: //Rare Huge Mountains
			noiseHeight += md * scaled_ridged_octave_noise_3d(octaves[func], persistences[func], frequencies[func], lows[func], highs[func], pos)*scales[func];
			break;
		case 9: //Volcano
			h = octave_noise_3d(octaves[func], persistences[func], frequencies[func], pos);
			if (h > 0.77){
				noiseHeight *= md * max(0,(1.0 - (h-0.45)*2));
				noiseHeight += scales[func]*1.08 - (0.05)*scales[func]*12.0 - (h-0.77)*scales[func]*6.0;
			}else if (h > 0.72){
				noiseHeight *= md * max(0,(1.0 - (h-0.45)*2));
				noiseHeight += scales[func]*1.08 - (h-0.72)*scales[func]*12.0;
			}else if (h > 0.45){
				noiseHeight *= md * max(0,(1.0 - (h-0.45)*2));
				noiseHeight += md * (h-0.45)*scales[func]*4;
			}
			break;
		case 10: //canyons
			h = (octave_noise_3d(octaves[func], persistences[func], frequencies[func], pos)+1.0)*50.0; //0-100
			off = 5.0;
            float floorh = floor(h);
			if (h < 40.0+off){ //gradual slope up
				//noiseHeight += (h-(20.0+off))*0.05*scales[func];
				noiseHeight += md * scales[func];
			}else if (h < 50.0+off){ //steep down
				if (floorh > floor(h-0.2)){ //steep part
					h = (floorh)+(h-floorh)*2.5-(40.0+off);
				}else{ //flat part
					h = floorh+0.5-(40.0+off)+(h-floorh-0.2)*0.625;
				}
				noiseHeight += md * (scales[func] - (h)*scales[func]*0.1);
			}else if (h < 55.0+off){ //gradual down
				noiseHeight += md * (-(h-(50.0+off))*0.025*scales[func]);
			}else if (h < 60.0+off){ //gradual up
				noiseHeight += md * (-(5.0-(h-(55.0+off)))*0.025*scales[func]);
			}else if (h < 70.0+off){ //steep up
				if (floorh > floor(h-0.2)){ //steep part
					h = floorh+(h-floorh)*2.5-(60.0+off);
				}else{ //flat part
					h = floorh+0.5-(60.0+off)+(h-floorh-0.2)*0.625;
				}
				noiseHeight += md * (h)*scales[func]*0.1;
			}else if (h > 70.0+off){ //top
				noiseHeight += md * scales[func];
			}
			
			break;
		case 11: //oceans
			h = md * scaled_ridged_octave_noise_3d(octaves[func], persistences[func], frequencies[func], lows[func], highs[func], pos);
			if (h < 0) {
				noiseHeight += h * scales[func];
			}else{
				noiseHeight += h * scales[func] * 0.5;
			}
			break;
		default: //base noise
			noiseHeight += md * scaled_octave_noise_3d(octaves[func], persistences[func], frequencies[func], lows[func], highs[func], pos);
			break;
	}
    return noiseHeight;
}

float getTemperature(vec3 pos)
{
	return baseTemperature + scaled_octave_noise_3d(tempO, tempP, 
		tempF, tempL, tempH, pos);
}

float getRainfall(vec3 pos)
{
	return baseRainfall + scaled_octave_noise_3d(rainO, rainP,
		rainF, rainL, rainH, pos) - 20.0;
}

void main()
{
    float lattitude = normalize(pos).y;
    if (lattitude < 0.0) lattitude = -lattitude;
    
    float tempMod = 110.0 - (lattitude*200.0);

    //BASE NOISE
    float noiseHeight = heightModifier;
    //probheight = 0;
    for (int n = 0; n < numFunctions/2; n++){
        noiseHeight = getNoiseHeight(noiseHeight, n, pos);
    }

    float temperature = getTemperature(pos) - max(floor(noiseHeight) - 500.0, 0)*0.01 + scaled_octave_noise_3d(3, 0.45, 0.013, 0.0, 2.0, pos) + tempMod;
    float rainfall = getRainfall(pos) - max(floor(noiseHeight) - 500,0)*0.006667 + scaled_octave_noise_3d(3, 0.5, 0.01, 0.0, 2.0, pos);

    //if (biomeOffsetNoiseFunction) GetNoiseHeight(probheight, biomeOffsetNoiseFunction, pos.x, pos.y, pos.z, flags);

    //if (temperature < 0.0) temperature = 0.0;
    //if (temperature > 255.0) temperature = 255.0;
    //if (rainfall < 0.0) rainfall = 0;
    //if (rainfall > 255.0) rainfall = 255.0;
    //biomeColor = BiomeMap[(int)rainfall][(int)temperature];
    //biomeit = currPlanet->baseBiomesLookupMap.find(biomeColor);
   
   //if (biomeit == currPlanet->baseBiomesLookupMap.end()){
    //    lodMap[i*size + j].biome = &blankBiome;
    //}
   // else{
    //    lodMap[i*size + j].biome = biomeit->second;
    //}

    //double sandDepth = 0.0;
    //for (unsigned int n = 0; n < currPlanet->mainBiomesVector.size(); n++){
     //   mainBiome = currPlanet->mainBiomesVector[n];
     //   if (rainfall >= mainBiome->lowRain && rainfall <= mainBiome->highRain && 
     //       temperature >= mainBiome->lowTemp && temperature <= mainBiome->highTemp){

     //       rh = (octave_noise_3d(mainBiome->distributionNoise.octaves, mainBiome->distributionNoise.persistence, mainBiome->distributionNoise.frequency, pos) + 1.0)*0.5;
     //       if (rh >= mainBiome->distributionNoise.lowBound){
     //           rh = (rh - mainBiome->distributionNoise.lowBound)/mainBiome->distributionNoise.upBound;
     //           rh2 = ((mainBiome->maxHeight - noiseHeight))/mainBiome->maxHeightSlopeLength;
     //           if (rh2 >= 0.0){
     //               if (rh2 < rh) rh = rh2;
     //               InfluenceTerrainWithBiome(mainBiome, &(lodMap[i*size+j]), pos.x, pos.y, pos.z, temperature, rainfall, noiseHeight, sandDepth, flags, rh);
      //          }
     //       }
    //    }
  //  }

    //rivers
   // if (riverNoiseFunction){
    //    rh = GetRiverNoiseHeight(noiseHeight, riverNoiseFunction, pos.x, pos.y, pos.z, flags);
    //    if (rh > 0.4 && rh < 0.605){
    //        GetTributaryNoiseHeight(noiseHeight, tributaryNoiseFunction, pos.x, pos.y, pos.z, flags, rh);
    //    }
    //}
    //if (preturbNoiseFunction) GetNoiseHeight(noiseHeight, preturbNoiseFunction, pos.x, pos.y, pos.z, flags);

    temperature = clamp(temperature/2550000.0, 0.0, 1.0);
    rainfall = clamp(rainfall/2550000.0, 0.0, 1.0);
    color.g = temperature + sin(pos.z / 50000.0)*0.5;
    color.b = clamp(noiseHeight*0.0001, 0.0, 1.0);
    color.r = rainfall + (cos(pos.x/10000.0)+1.0)/2.0;
    
}