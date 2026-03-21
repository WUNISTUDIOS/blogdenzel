uniform float uTime;
varying vec2 vUv;
vec3 colorA = vec3(1.0, 0.0, 0.0);
vec3 colorB = vec3(0.0, 1.0, 0.0);
vec3 colorC = vec3(1.0, 1.0, 1.0);

#define MAX_STEPS 120
#define MAX_DIST 100.0
#define SURFACE_DIST 0.001

// Perlin 2D Noide Code
vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec2 fade(vec2 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec2 P)
{
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

// Cosine color palette function from Inigo Quilez
vec3 getColor(float amount) {
  vec3 color = 0.5 + 0.5 * cos(6.2831 * (vec3(0.0, 0.1, 0.2) + amount * vec3(1.0, 1.0, 1.0)));
  return color * amount;
}

float sdSphere(vec3 p, float r){
  return length(p) - r;
}

float smin(float a, float b, float k){
  float h = clamp(0.5 +  0.5 * (b-a)/k, 0.0, 1.0);
  return mix(b,a,h) - k * h * (1.0 - h);
}

float scene(vec3 p){
  float displacement = cnoise(p.yy + uTime * 0.5) / 4.0;
  float plane = p.y + 1.0;
  float sphere1 = sdSphere(p - vec3(1.0 + cos(uTime), 0.7, 0.0), 1.0);
  float sphere2 = sdSphere(p - vec3(1.0, 0.5 + sin(uTime) / 2.0, 0.0), 1.0);
  float distance1 = min(sphere1, sphere2);
  float distance2 = min(plane, distance1);
  return distance2;
}



float raymarch(vec3 ro, vec3 rd){
  float dO = 0.0;

for(int i = 0; i < MAX_STEPS; i++){
  vec3 p = ro + rd * dO;
  float ds = scene(p);

  dO += ds;

  if(dO > MAX_DIST || ds < SURFACE_DIST){
    break;
  }
}
  return dO;
}

vec3 getNormal(vec3 p){
  vec2 e = vec2(0.01, 0);

  vec3 n = vec3(
    scene(p+e.xyy) - scene(p-e.xyy),
    scene(p+e.yxy) - scene(p-e.yxy),
    scene(p+e.yyx) - scene(p-e.yyx));

  return normalize(n);
}

void main() {

  // float sdfbox = sdBoxFrame(vec3(vUv - 0.5, 0.0), vec3(0.3),0.2);

  // vec3 col = (sdfbox > 0.0) ? colorA + 0.2 : colorC + 0.2;
  // col = col * exp(sdfbox);
  // col *= 1.0 - exp(-6.0 * abs(sdfbox));

  //rgb shift
  vec3 rgbshift = vec3(sin(uTime), sin(uTime + 2.0),sin(uTime + 4.0));
  // col *= 0.9 + 0.2 * cos(20.0 * sdfbox) * rgbshift;
  
  //light position
  vec3 lightPosition = vec3(-10.0 * cos(uTime), 10.0, 10.0 * sin(uTime));

  //ray origin - camera
  vec3 ro = vec3(0.0, 0.0, 3.0);
  //ray direction
  vec3 rd = normalize(vec3(vUv - 0.5, -1.0 ));
  //ray marching 
  float d = raymarch(ro, rd);
  vec3 p = ro + rd * d;

  vec3 color = vec3(0.0);

  if(d<MAX_DIST){
    vec3 normal = getNormal(p);
    vec3 lightDirection = normalize(lightPosition - p);

    float diffuse = max(dot(normal, lightDirection), 0.0);
    color = vec3(1.0) * diffuse;
  }
  gl_FragColor = vec4(color, 1.0);
}
