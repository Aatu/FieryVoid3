const boltFragmentShader = `
    precision highp float;
    uniform sampler2D map;
    uniform float gameTime;
    varying vec2 vUv;
    varying float vOpacity;

    void main() {
        if (vOpacity < 1.0) {
            discard;
        }

        gl_FragColor = vec4(1, 0, 0, 1);
    }
`;

export default boltFragmentShader;
