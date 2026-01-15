varying vec2 vUv;
uniform float uTime;
#define M_PI 3.1415926535897932384626433832795;
void main() {
        float angle = atan(vUv.x - 0.5, vUv.y - 0.5) - uTime * 0.1;
        angle /= M_PI + 5.0;
        angle += 0.5;
        angle *= 10.0;
        angle = mod(angle, 2.0) - 0.6;
        angle = fract(abs(angle)) * sin(uTime) * 2.0;

        vec3 colorA = vec3(0.149, 0.141, 0.912);
        vec3 colorB = vec3(1.00, 0.833, 0.224);
        vec3 colorC = vec3(1.0, 0.0, 0.0);
        vec3 spiral_color = mix(colorA, colorB, angle);
        spiral_color = mix(spiral_color, colorC, 0.3);

        float coordinate = length(vUv - 0.5) * 2.0 * sin(uTime * 0.5);
        float glow = smoothstep(0.5, 0.9, coordinate) * 1.0;
        float wave = sign(vUv.y * 1.0 + uTime) * 0.5;

        vec3 color = smoothstep(abs(coordinate) * 0.5, 1.0, colorA) * 0.1;

        color += glow + wave;
        color = mix(spiral_color, color, 0.5);
        gl_FragColor = vec4(color, 1.0);
}
