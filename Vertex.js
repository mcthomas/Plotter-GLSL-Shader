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
//constant float to define pi var
const float pi=3.14159;
//R3 vector to hold object space position coords
varying vec3 modelObj;
//R3 vector to hold normalized space position coords
varying vec3 modelNorm;
//func to operate raveling transformation on the coordinate pair based on the angle passed
vec2 twist(vec2 vecIn, float angle)
{
  vec2 vecOut;
  vecOut.x=cos(angle)*vecIn.x-sin(angle)*vecIn.y;
  vecOut.y=sin(angle)*vecIn.x+cos(angle)*vecIn.y;
  return vecOut;
}

//entry point
void main()
{
  //sets model vector in object space equal to the position vector
  modelObj=position;
  //sets model vector in normalized space equal to the normal vector
  modelNorm=normal;
  
  //sets the modelObj x & y vecter coordinates to the twist() transformation of a tangent angle eval
  modelObj.xy = twist(modelObj.xy,0.5*pi*modelObj.x*sqrt(abs((.5*tan(3.0*time)))));
  //sets the modelNorm x & y vecter coordinates to the twist() transformation of a tangent angle eval
  modelNorm.xy = twist(modelNorm.xy,0.5*pi*modelObj.x*sqrt(abs((.5*tan(3.0*time))))); // //sets the modelObj x & z vecter coordinates to the twist() transformation of a tangent angle eval
  modelObj.xz = twist(modelObj.xz,0.5*pi*modelObj.x*sqrt(abs((.5*tan(3.0*time)))));
  //sets the modelNorm x & z vecter coordinates to the twist() transformation of a tangent angle eval
  modelNorm.xz = twist(modelNorm.xz,0.5*pi*modelObj.x*sqrt(abs((.5*tan(3.0*time)))));
  //calculates normalized varying of the product of the uniform normalized matrix and the normalized vector attribute
  fNormal = normalize(normalMatrix * modelNorm);
  //position vector as a product of the uniform model view matrix and a vector comprising the position attribute and a float
  vec4 pos = modelViewMatrix * vec4(modelObj, 1.4);
  //position vector varying including the three coordinates of the pos vector
  fPosition = pos.xyz;
  //sets the normalized device coordinates to be a product of the uniform projection matrix and the position vector
  gl_Position = projectionMatrix * pos;
  //sets fRawX vertex extries to modelViewMatrix coords
  fRawX=fPosition;

}
