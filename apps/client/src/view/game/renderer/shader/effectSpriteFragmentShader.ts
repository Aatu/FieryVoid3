const effectSpriteFragmentShader = `
    uniform sampler2D texture;
    uniform vec3 overlayColor;
    uniform float opacity;
    uniform float textureNumber;

    varying vec2 vUv;

    vec4 sampleTexture() {
        float textureAmount = 8.0;
        vec2 tPos = vec2((mod(textureNumber, textureAmount) * (1.0 / textureAmount)), (floor(textureNumber / textureAmount) * (1.0 / textureAmount)));

        vec2 finalPos = vec2(
            (vUv.x / textureAmount + tPos.x),
            1.0 - (vUv.y / textureAmount + tPos.y)
        );

        return texture2D(texture, finalPos);
    }

    void main() {
        vec4 textureColor = sampleTexture();
        vec4 finalColor = textureColor;

        if (textureColor.a > 0.0){
            //finalColor = vec4(overlayColor, textureColor.a);
            //finalColor = mix(textureColor, overlayColor, overlayAlpha);
            //finalColor = (1.0 - t1.a) * t0 + t1.a * t1;

            finalColor =  textureColor * vec4(overlayColor, 1.0);
            finalColor.a = textureColor.a;
        }

        if (finalColor.a > 0.0) {
            finalColor.a *= opacity;
        }

        gl_FragColor = finalColor;
    }
`;

export default effectSpriteFragmentShader;
