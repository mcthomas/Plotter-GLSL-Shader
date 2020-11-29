precision highp float;
//value unchanging for scene unless by host program, accessible by both v/s and f/s
uniform float time;
//position vector accessible between v/s and f/s
varying vec3 fPosition;
//normalized vector accessible between v/s and f/s
varying vec3 fNormal;

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
  
  vec3 redCol = redDiffuse * vec3(1,0,0);
  vec3 greenCol = greenDiffuse * vec3(0,1,0);
  vec3 blueCol = blueDiffuse * vec3(0,0,1);
  
  if(sin(300.0*fRawX.x)>0.0) discard;
  if(cos(300.0*fRawX.y)>0.0) discard;

  
    //specifies fragment color applied to vertices' triangles
  gl_FragColor = vec4(ambient_color+specular_color+redCol + greenCol + blueCol, 0.5);
}
