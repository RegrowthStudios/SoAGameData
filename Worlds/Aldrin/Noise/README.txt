                       Terrain Guide
					  
	This is the most complicated section to modify.
	I will try to keep this as updated as possible. -Ben

Referenced Functions
	Function     | Description
	------------------------------------------------------------------------
	N()          | returns a number between -1.0 and 1.0 using the noise fields
	Ridged_N()   | returns 1.0 - abs(Noise())
	Abs_N()      | returns abs(Noise())
	Scaled_*_N() | returns the same thing as N, but scaled between the low and high fields
	$_*_N()      | returns the noise with the fields of the $ modifier function     
	(int)        | rounds down the number immediatly after it
	MAX(a,b)     | returns the greater of the numbers a and b
	
Noise Fields:
	
	Type - Determines the noise type. Some types can only be used once. See below.
	
	Persistance - Determines how much the influence of each octave changes.
		0.5 means each octave is half as effective. Having a low persistance with 
		high octaves is a waste, because later octaves will have no influence.
		
	Frequency - Determines the frequency of the noise, same as frequency of a wave.
		Keep it low! It is sensitive...
		
	Octaves - Determines the fractal detail of the function. 
		More octaves = more computation, but its so fast it really doesnt matter.
		
	Low - Used in Scaled_*_N(), determines what low bound returned by noise is scaled to.
	
	High - Used in Scaled_*_N(), determines what high bound returned by noise is scaled to.
	
	Scale - Used in some of the below functions, usually as a multiplier.
	
	$_  - This prefix means that it is the field of the modifier function.
			
Noise Types:
		
		curheight = terrain height before function is applied. Can be changed! (see volcanoes)
		height = terrain height returned by generator
		
		Each function has pseudo-C code showing what exactly happens

		1 Mountains:
			height = pow((Scaled_Ridged_N()-13.0) * scale, 1.25); 
			
		2 Mountains 2 and Lakes:
			h = Scaled_N();
			if (h > 7.5)
			{
				height = pow((h-7.5) * scale, 1.50);
			}
			else if (h < 4.0)
			{
				height = -abs(4.0-h)/4 * scale * 40;
			}
			
		3 Hills and plateaus:
			h = Scaled_N();
			if (h > 7.42)
			{ //plateaus
				height = (h-7.42) * 10 + 0.015 * 4000 + 0.505 * scale;
			}
			else if (h > 7.405)
			{
				height = (h-7.405) * 4000 + 0.505 * scale;
			}
			else if (h > 6.9)
			{
				height = (h-6.9) * scale;
			}
		
		4  Seaside Cliffs:
			if (curheight < 100 and curheight > -10)
			{
				h = Scaled_N();
				if (curheight > 0)
				{
					if (h > 2)
					{
						height = (h-2.0)*(100 - curheight);
					}else if (h < 1.5)
					{
						height = -(curheight*(125.0/128.0) - ((curheight)^5)/102400000.0)*(1.5-h)*1.5;
					}
				}
				else
				{
					if (h > 2)
					{
						height = -(h-2.0)*(11 + curheight);
					}
				}
			}
			
		35  Billowy Hills:
			md = ($_N()+1.0)*0.5;
			if (md > $_low)
			{
				md = (md - $_low)*$_high;
				if (md > 1.0) md = 1.0;
				height = md * Scaled_Abs_N();
			}
			
		38  Jagged Cliffs:
			md = ($_N()+1.0)*0.5;
			if (md > $_low)
			{
				md = (md - $_low)*$_high;
				h = (N()+1.0)*5.0;
				if ((h > 1.1) and ((int)h > (int)(h-0.1)))
				{
					h = ((int)h-1)+(h-(int)h)*10.0;
				}
				else
				{
					h = (int)h;
				}
				height = md * h * scale;
			}
		
		45  Volcanoes:
			h = N();
			if (h > 0.77)
			{
				curheight = curheight * MAX(0,(1.0 - (h-0.45)*2));
				height = scale*1.08 - (0.05)*scale*12.0 - (h-0.77)*scale*6.0;
			}
			else if (h > 0.72)
			{
				curheight = curheight * MAX(0,(1.0 - (h-0.45)*2));
				height = scale*1.08 - (h-0.72)*scale*12.0;
			}
			else if (h > 0.45)
			{
				curheight = curheight * MAX(0,(1.0 - (h-0.45)*2));
				height = (h-0.45)*scale*4;
			}

Files:				
	1. FloraNoise.SOANOISE
		This file determines the grouping and helps determine the general distribution
		of flora. 
	2. TerrainNoise.SOANOISE
		This file has all the optional terrain functions. Do whatever you want here.
	3. MandatoryNoise.SOANOISE
		This file contains noise functions that should not be removed.