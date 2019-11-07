const boltFragmentShader = `
    precision highp float;
    uniform sampler2D map;
    uniform float gameTime;
    varying vec2 vUv;
    varying float vOpacity;
    varying vec3 vColor;
    varying float vActivationGameTime;
    varying float vDeactivationGameTime;

    void main() {
        if (vOpacity == 0.0) {
            discard;
        }

        if (vActivationGameTime > gameTime) {
            discard;
        }

        if (vDeactivationGameTime < gameTime) {
            discard;
        }

        vec4 finalColor = vec4(vColor.rgb, texture2D(map, vUv).a * vOpacity);
        gl_FragColor = finalColor;
    }
`;

export default boltFragmentShader;
