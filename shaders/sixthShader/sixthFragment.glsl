varying vec2 vUv;
uniform float uTime;
uniform float uStarTileScale;
uniform float uStarDimensionScale;
uniform float uStarAlpha;
#define MAX_STEPS 50
#define MAX_DIST 100.0
#define SURFACE_DIST 0.001
vec3 colorA = vec3(1.0, 0.0, 0.0);
vec3 colorB = vec3(0.0, 0.0, 1.0);
vec3 colorC = vec3(1.0, 1.0, 1.0);

float sdStar(in vec2 p, in float r, in int n, in float m)
{
  // next 4 lines can be precomputed for a given shape
  float an = 3.141593 / float(n);
  float en = 3.141593 / m; // m is between 2 and n
  vec2 acs = vec2(cos(an), sin(an));
  vec2 ecs = vec2(cos(en), sin(en)); // ecs=vec2(0,1) for regular polygon

  // changing the interger of the mod changes the superimposed shape
  float bn = mod(atan(p.x, p.y), 1.0 * an) - an;
  p = length(p) * vec2(cos(bn), abs(sin(bn)));
  p -= r * acs;
  p += ecs * clamp(-dot(p, ecs), 0.0, r * acs.y / ecs.y);
  return length(p) * sign(p.x);
}

vec2 rotate(vec2 p, float a) {
  float s = sin(a);
  float c = cos(a);
  return vec2(p.x * c + p.y * s, -p.x * s + p.y * c);
}

float scene2D(vec2 p){
  return sdStar(rotate(p, uTime * 0.5), 0.15, 5, 2.5);
}

float shadow2D(vec2 p, vec2 light){
  vec2 rd = normalize(light + p);
  float maxT = length(light + p);
  float t = 0.005;
  float res = 1.0;
  for (int i = 0; i < 64; i++){
    float d = scene2D(p + rd *  t);
    if (d < 0.005) return 0.0;
    res = min(res, 10.0 * d/t);
    t += d;
    if (t > maxT) break;
  }
  return clamp(res, 0.0, 1.0);
}




void main() {
  vec2 p = vUv - 0.5;
  vec2 light = 0.35 * vec2(cos(uTime), sin(uTime));
  vec3 col = vec3(0.0);
  float sh = shadow2D(p, light);

  vec2 uvRotation = rotate(vUv, uTime);
  for (float i = 0.0; i < 1.0; i++) {
    float angle = uTime * 0.5 + i * (6.2 / 3.0);
    float xPos = cos(angle) * 0.2;
    float yPos = sin(angle) * 0.15;
    vec2 pos = vec2(xPos, yPos) + 0.5;

    float depthScale = smoothstep(-0.5, 0.5, yPos);
    vec2 sdStarUv = (vUv - pos) / depthScale;

    vec2 uvRotated = rotate(vUv - 0.5, uTime * 0.5);
    sdStarUv *= mod(sdStarUv, uvRotation) * uStarDimensionScale;
    float sigTime = sin(uTime * 0.01) * 0.02;
    //star drawn
    float sdf = sdStar(uvRotated, 0.3, 5, 0.5 + 1.0 * cos(sigTime) * 0.1) * 5.0;
    // float sdf = sdStar(sdStarUv, 0.3, 5, 0.5) * 10.0;
    
    vec2 tiled = fract(vUv * uStarTileScale);
    vec2 rotated = rotate(tiled, 0.01 * 0.02) * uvRotation;
    sdf *= 0.5 / max(abs(sdStar(rotated, 1.0, 1, uTime * 0.01)), 0.01);

    col += (sdf > 0.0) ? colorA + 2.0 : colorB - 0.3;
    col = col * exp(-2.0 * abs(sdf));
    col *= 0.9 + sdf * vec3(sin(uTime * 0.01), sin(uTime + 2.0), sin(uTime * 0.03));
    vec2 uv = vUv;
    uv.x += 0.1 * sin(vUv.y * 20.0 + uTime);
  }
  gl_FragColor = vec4(clamp(col * 0.9, 0.0, 1.0) * sh, uStarAlpha);
}
