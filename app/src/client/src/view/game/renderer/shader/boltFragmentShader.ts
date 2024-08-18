const boltFragmentShader = `
    precision highp float;
    uniform sampler2D map;
    uniform float gameTime;
    varying vec2 vUv;
    varying float vOpacity;
    varying vec3 vColor;
    varying float vActivationGameTime;
    varying float vDeactivationGameTime;
    varying float vRepeat;

    float getGameTime() {
        float modGameTime = gameTime;
        if (vRepeat > 0.0) {
            modGameTime = gameTime - (vRepeat * floor(gameTime/vRepeat));
        }

        return modGameTime;
    }

    void main() {

        float modGameTime = getGameTime();

        if (vOpacity == 0.0) {
            discard;
        }

        if (vActivationGameTime > modGameTime) {
            discard;
        }

        if (vDeactivationGameTime < modGameTime) {
            discard;
        }

        vec4 finalColor = vec4(vColor.rgb, texture2D(map, vUv).a * vOpacity);
        gl_FragColor = finalColor;
    }
`;

export default boltFragmentShader;
