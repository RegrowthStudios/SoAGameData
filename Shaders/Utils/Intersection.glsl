float vecSum(vec3 v) {
  return v.x + v.y + v.z;
}

vec3 sphereIntersectHitpoint;
vec3 sphereIntersectNormal;
float sphereIntersectDistance;

float sphereIntersect(vec3 raydir, vec3 rayorig, vec3 pos, float rad) {
    float a = vecSum(raydir*raydir);
    float b = vecSum(raydir * (2.0 * (rayorig - pos)));
    float c = vecSum(pos*pos) + vecSum(rayorig*rayorig) - 2.0 * vecSum(rayorig*pos) - rad * rad;
    float D = b*b + (-4.0)*a*c;

    // If ray can not intersect then stop
    if (D < 0) {
        return 0.0;
    }
    D = sqrt(D);

    // Ray can intersect the sphere, solve the closer hitpoint
    float t = (-0.5)*(b + D) / a;
    if (t > 0.0) {
        sphereIntersectDistance = sqrt(a)*t;
        sphereIntersectHitpoint = rayorig + t*raydir;
        sphereIntersectNormal = (sphereIntersectHitpoint - pos) / rad;
    } else {
        return 1.9;
    }
    return 4.0;
}

float sphereIntersectAmount(vec3 raydir, vec3 rayorig, vec3 pos, float rad) {
    float sphereDistance = dot(raydir, pos) - dot(raydir, rayorig);
	if (sphereDistance > 0.0) return 0.0;
	vec3 closestPoint = sphereDistance * raydir + rayorig;
	float distanceToSphere = length(closestPoint - pos);
	return distanceToSphere - rad;
}