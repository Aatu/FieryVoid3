const spriteFragmentShader = `
    uniform sampler2D texture;
    uniform float overlayAlpha;
    uniform vec3 overlayColor;
    uniform float opacity;

    varying vec2 vUv;

    void main() {
        vec4 textureColor = texture2D(texture, vUv);
        vec4 finalColor = textureColor;

        if (overlayAlpha > 0.0 && textureColor.a > 0.0){
            //finalColor = vec4(overlayColor, textureColor.a);
            //finalColor = mix(textureColor, overlayColor, overlayAlpha);
            //finalColor = (1.0 - t1.a) * t0 + t1.a * t1;
            finalColor = (1.0 - overlayAlpha) * textureColor + overlayAlpha * vec4(overlayColor, 1.0);
            finalColor.a = textureColor.a;
        }

        if (finalColor.a > 0.0) {
            finalColor.a *= opacity;
        }

        gl_FragColor = finalColor;
    }
`;

export default spriteFragmentShader;
