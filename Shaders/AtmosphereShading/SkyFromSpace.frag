#version 130
//
// Atmospheric scattering fragment shader
//
// Author: Sean O'Neil
//
// Copyright (c) 2004 Sean O'Neil
//

uniform vec3 v3LightPos;
uniform float g;
uniform float g2;

out vec4 color;

in vec3 v3Direction;
in vec4 Color;
in vec4 SecondaryColor;


void main (void)
{
	float fCos = dot(v3LightPos, v3Direction) / length(v3Direction);
	float fMiePhase = 1.5 * ((1.0 - g2) / (2.0 + g2)) * (1.0 + fCos*fCos) / pow(1.0 + g2 - 2.0*g*fCos, 1.5);
	color = Color + fMiePhase * SecondaryColor;
	color.a = max(max(color.r, color.b), color.g) * 8;
    if (color.a > 1.0) color.a = 1.0;
	//if (color.a < SecondaryColor.a) color.a = SecondaryColor.a;

}
