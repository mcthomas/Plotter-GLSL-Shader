#ifdef VS
 
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

 
#else
 
precision highp float;
//value unchanging for scene unless by host program, accessible by both v/s and f/s
uniform float time;
//position vector accessible between v/s and f/s
varying vec3 fPosition;
//normalized vector accessible between v/s and f/s
varying vec3 fNormal;
//model-view coordinates accesible between v/s and f/s
varying vec3 fRawX;

//determines shader ambient light ratio (light from all directions)
const float ambient_coeff   = 0.20;
//determines shader specular light ratio (reflection point light)
const float specular_coeff  =0.10;
//determines shader specular light exponent multiplier
const float specular_exp    =2.0;
//determines light direction in world coords
const vec3  light_direction = vec3(-1.0,1.0,1.0); // stationary light
//rgb vector specifying light's normalized values for color proportions
const vec3  light_color     = vec3(0.5,0.5,0.5); // grey
//rgb vector specifying objects' normalized values for color proportions
const vec3  object_color    = vec3(0.5,0.5,0.5); // grey

//entry point
void main()
{
  //indicates change in time as a product of time and a float 50.0 multiplier
  float delta = time*25.0;
  //direction towards light
  vec3 l = normalize(light_direction);
  //normized vector perpendicular to surface
  vec3 n = normalize(fNormal);
  //vector pointing towards camera
  vec3 e = normalize(-fPosition);
  //halfway vector used to calculate light intensity into camera
  vec3 h = normalize (e+l);

  //fractioned rgb values derived from object color vertex
  vec3 ambient_color  = ambient_coeff  * object_color;
  //calculates specular color based upon coeff var and power of dot product of surface's normal vector and halfway vector, with lower bound of 0.0, as a product of the light's color vector
  vec3 specular_color = specular_coeff * pow(max(0.0,dot(n,h)),specular_exp) * light_color;

  //R3 vectors defining separate coordinate trigonomic evalutations for time variance; creates a continuous rotating color distribution (best seen on "Cube" from isomatric angle)
  vec3 xy = vec3(cos(delta),0,sin(delta));
  vec3 yx = vec3(sin(delta),0,cos(delta));
  vec3 ydivx = vec3(cos(delta),0,tan(delta));
  
  //diffuse (light varying towards source) specification vars for three trigonomic subdividions to range 2
  float redDiffuse = pow(dot(fNormal,xy),0.666);
  float greenDiffuse = pow(dot(fNormal,yx),1.333);
  float blueDiffuse = pow(dot(fNormal,ydivx),2.0);
  
  //rgb diffuse cols for gl_FragColor vec4, with their respective multipliers
  vec3 redCol = redDiffuse * vec3(1,0,0);
  vec3 greenCol = greenDiffuse * vec3(0,1,0);
  vec3 blueCol = blueDiffuse * vec3(0,0,1);
  
  if(sin(300.0*fRawX.x)>0.0) discard;
  if(cos(300.0*fRawX.y)>0.0) discard;

  
    //specifies fragment color applied to vertices' triangles
  gl_FragColor = vec4(ambient_color+specular_color+redCol + greenCol + blueCol, 0.5);
}

 
#endif
