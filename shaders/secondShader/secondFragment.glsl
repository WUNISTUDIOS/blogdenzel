varying vec2 vUv;
uniform float uTime;
vec3 colorA = vec3(1.0, 0.0, 0.0);
vec3 colorB = vec3(0.0, 1.0, 0.0);
vec3 colorC = vec3(1.0, 1.0, 1.0);

// circle sdf
float sdCricle(in vec2 p, in float r) {
        return length(p) - r;
}

void main() {
        // distorting uv space into star
        float sigTime = sin(uTime * 1.0) * 0.1;
        float distance = fract(sdCricle(vUv - vec2(0.5), 0.5)) * sigTime;
        distance *= 0.1 / sdCricle(vUv.x - 0.5 * vec2(0.5), 0.1);
        distance *= 0.1 / sdCricle(vUv.y - 0.5 * vec2(0.5), 0.5);

        // coloring
        vec3 col = (distance > 0.0) ? colorA + 0.2 : colorC + 0.2;
        col = col * exp(distance);
        col *= 1.0 - exp(-6.0 * abs(distance));
        col *= 0.9 + 0.2 * cos(20.0 * distance) * sin(uTime);
        gl_FragColor = vec4(col, 1.0);
}
