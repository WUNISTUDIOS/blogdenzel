uniform float uTime;
varying vec2 vUv;

#define MAX_STEPS 50
#define MAX_DIST 100.0
#define SURFACE_DIST 0.001

mat4 rotation3d(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;

  return mat4(
    oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0,
    oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0,
    oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0,
    0.0, 0.0, 0.0, 1.0
  );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotation3d(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

// Cosine color palette function from Inigo Quilez
vec3 getColor(float amount) {
  vec3 color = 0.5 + 0.5 * cos(6.2831 * (vec3(0.0, 0.1, 0.2) + amount * vec3(1.0, 1.0, 1.0)));
  return color * amount;
}

vec3 domainWrap(vec3 p) {
  for (float d = 1.0; d < 5.0; d++) {
    p += sin(p * d - uTime * 0.5).xyz / d;
  }
  return p;
}

float sdSphere(vec3 p, float radius) {
  vec3 wraped = domainWrap(p);
  return length(wraped) - radius;
}

float sdSine(vec3 p) {
  return 1.0 - (sin(p.x) + (p.y) + sin(p.z)) / 3.0;
}

float scene(vec3 p) {
  vec3 p1 = rotate(p, vec3(1.0), uTime * 0.4);
  float sphere = sdSphere(p1, 1.5);

  float scale = 8.0 + 6.0 * sin(uTime * 0.5);
  float sine = (0.8 - sdSine(p1 * scale)) / (scale * 2.0);

  float distance = max(sphere, sine);

  return distance;
}

float raymarch(vec3 ro, vec3 rd) {
  float dO = 0.0;

  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float ds = scene(p);

    dO += ds;

    if (dO > MAX_DIST || ds < SURFACE_DIST) {
      break;
    }
  }
  return dO;
}

vec3 getNormal(vec3 p) {
  vec2 e = vec2(0.01, 0);

  vec3 n = vec3(
      scene(p + e.xyy) - scene(p - e.xyy),
      scene(p + e.yxy) - scene(p - e.yxy),
      scene(p + e.yyx) - scene(p - e.yyx));

  return normalize(n);
}

void main() {

  //rgb shift
  vec3 rgbshift = 0.5 + 0.5 * vec3(sin(uTime), sin(uTime + 5.0), sin(uTime + 4.0));
  // col *= 0.9 + 0.2 * cos(20.0 * sdfbox) * rgbshift;

  //light position
  // vec3 lightPosition = vec3(-10.0 * cos(uTime), 10.0 * sin(uTime), 10.0 * abs(sin(-uTime * 0.5)));

  //ray origin - camera
  vec3 ro = vec3(0.0, 0.0, 3.0);
  //ray direction
  vec3 rd = normalize(vec3(vUv - 0.5, -1.0));

  vec4 color = vec4(0.0);

  float z = 0.0;

  for (int i = 0; i < 70; i++) {
    vec3 p = ro + rd * z;
    float ds = scene(p);
    // Accumulate color: bright near surface (small d), faint far away (large d)
    color += vec4(getColor(z * 0.15) * rgbshift, 1.0) / max(abs(ds), 0.01);

    // Conservative stepping: domainWrap breaks true SDF, full steps can overshoot
    z += max(abs(ds), 0.5) * 0.5;

    if (z > MAX_DIST) break;
  }
  gl_FragColor = vec4(tanh(color.rgb / 50.0), 1.0);
}
