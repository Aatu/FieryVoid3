const lineFragmentShader = `
    varying vec3 vColor;
    varying vec2 vUv;
    varying float vOpacity;

    void main() {
        vec4 finalColor = vec4(vColor, 1.0);

        if (finalColor.a > 0.0) {
            finalColor.a *= vOpacity;
        }
        
        gl_FragColor = finalColor;
    }
`;

export default lineFragmentShader;
