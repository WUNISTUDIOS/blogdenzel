varying vec2 vUv;
uniform float uTime;
uniform float uTileScale;
uniform float uDimensionScale;
uniform float uAlpha;
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

  float bn = mod(atan(p.x, p.y), 2.0 * an) - an;
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

void main() {
  vec3 col = vec3(0.0);

  vec2 uvRotation = rotate(vUv - 0.5, uTime * 0.05);
  for (float i = 0.0; i < 10.0; i++) {
    float angle = uTime * 0.5 + i * (6.2 / 3.0);
    float xPos = cos(angle) * 0.2;
    float yPos = sin(angle) * 0.15;
    vec2 pos = vec2(xPos, yPos) + 0.5;

    float depthScale = smoothstep(-0.5, 0.5, yPos);
    vec2 sdStarUv = (vUv - pos) / depthScale;

    vec2 uvRotated = rotate(vUv - 0.5, uTime * 0.5);
    sdStarUv *= mod(sdStarUv, uvRotation) * uDimensionScale;
    float sigTime = sin(uTime * 0.01) * 0.02;
    //star drawn
    // float sdf = sdStar(uvRotated, 0.3, 5, 0.5 + 1.0 * cos(uTime) * 0.1) * 5.0;
    float sdf = sdStar(sdStarUv, 0.3, 5, 0.5) * 10.0;

    vec2 tiled = fract(vUv * uTileScale) - 0.5;
    vec2 rotated = rotate(tiled, 0.01 * 0.05) * uvRotation;
    sdf *= 0.5 / max(abs(sdStar(rotated, 1.0, 1, uTime * 0.01)), 0.01);

    col += (sdf > 0.0) ? colorA + 2.0 : colorB - 0.3;
    col = col * exp(-2.0 * abs(sdf));
    col *= 0.9 + sdf * vec3(sin(uTime * 0.01), sin(uTime + 2.0), sin(uTime * 0.03));
  }
  gl_FragColor = vec4(clamp(col * 0.9, 0.0, 1.0), uAlpha);
}
