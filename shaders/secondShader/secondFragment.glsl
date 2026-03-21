varying vec2 vUv;
uniform float uTime;
vec3 colorA = vec3(1.0, 0.0, 0.0);
vec3 colorB = vec3(0.0, 0.0, 1.0);
vec3 colorC = vec3(1.0, 1.0, 1.0);


float sdStar( in vec2 p, in float r, in int n, in float m)
{
    // next 4 lines can be precomputed for a given shape
    float an = 3.141593/float(n);
    float en = 3.141593/m;  // m is between 2 and n
    vec2  acs = vec2(cos(an),sin(an));
    vec2  ecs = vec2(cos(en),sin(en)); // ecs=vec2(0,1) for regular polygon

    float bn = mod(atan(p.x,p.y),2.0*an) - an;
    p = length(p)*vec2(cos(bn),abs(sin(bn)));
    p -= r*acs;
    p += ecs*clamp( -dot(p,ecs), 0.0, r*acs.y/ecs.y);
    return length(p)*sign(p.x);
}

  vec2 rotate(vec2 p, float a) {
    float s = sin(a);
    float c = cos(a);
    return vec2(p.x * c + p.y * s, -p.x * s + p.y * c);
  }

void main() {

  float sigTime = sin(uTime * 0.5) * 0.02;
  //star drawn
  float sdf = sdStar(vUv - 0.5, 0.3, 5, sigTime) * 2.0;


  vec2 tiled = fract(vUv * 10.0) - 0.5;
  vec2 rotated = rotate(tiled, 3.0 * 0.03);
  sdf *= 0.2 / sdStar(rotated, 0.3, 5, uTime * 0.03);

  vec3 col = (sdf  > 0.0) ? colorA + 0.2 : colorB + 0.3;
  col = col * exp(1.0 * abs(sdf));
  col *= 0.9 + cos(20.0 * sdf) * vec3(sin(uTime), sin(uTime + 2.0),sin(uTime + 4.0));
  gl_FragColor = vec4(col, 1.0);
}
