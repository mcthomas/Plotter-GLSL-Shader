precision highp float;
//position vector in object space
attribute vec3 position;
//normalized vector in object space
attribute vec3 normal;
//normalized matrix accessible between v/s and f/s
uniform mat3 normalMatrix;
//model view matrix accessible between v/s and f/s
uniform mat4 modelViewMatrix;
//projection matrix accessible between v/s and f/s
uniform mat4 projectionMatrix;
//normalized vector accessible between v/s and f/s
varying vec3 fNormal;
//position vector accessible between v/s and f/s
varying vec3 fPosition;
//value unchanging for scene unless by host program, accessible by both v/s and f/s
uniform float time;

//model-view coordinates accesible between v/s and f/s
varying vec3 fRawX;

const float pi=3.14159;
varying vec3 modelX;
varying vec3 modelN;

vec2 Rotate2D(vec2 vec_in, float angle)
{
  vec2 vec_out;
  vec_out.x=cos(angle)*vec_in.x-sin(angle)*vec_in.y;
  vec_out.y=sin(angle)*vec_in.x+cos(angle)*vec_in.y;
  //vec_out.z=sin(angle)*vec_in.x+cos(angle)*vec_in.y;
  return vec_out;
}

//entry point
void main()
{
  
  modelX=position;
  modelN=normal;
  
  // Comment these lines out to stop twisting
  modelX.xy = Rotate2D(modelX.xy,0.5*pi*modelX.x*sqrt(abs((.5*tan(3.0*time))))); // Try commenting out *just* this linex
  modelN.xy = Rotate2D(modelN.xy,0.5*pi*modelX.x*sqrt(abs((.5*tan(3.0*time))))); // This is simple as that only since the transform is rotation
  modelX.xz = Rotate2D(modelX.xz,0.5*pi*modelX.x*sqrt(abs((.5*tan(3.0*time))))); // Try commenting out *just* this linex
  modelN.xz = Rotate2D(modelN.xz,0.5*pi*modelX.x*sqrt(abs((.5*tan(3.0*time)))));
  
  //calculates normalized varying of the product of the uniform normalized matrix and the normalized vector attribute
  fNormal = normalize(normalMatrix * modelN);
  //position vector as a product of the uniform model view matrix and a vector comprising the position attribute and a float
  vec4 pos = modelViewMatrix * vec4(modelX, 0.5);
  //position vector varying including the three coordinates of the pos vector
  fPosition = pos.xyz;
  //sets the normalized device coordinates to be a product of the uniform projection matrix and the position vector
  gl_Position = projectionMatrix * pos;
  //sets fRawX vertex extries to modelViewMatrix coords
  fRawX=fPosition;

}
