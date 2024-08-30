const effectFragmentShader = `
    uniform sampler2D uTexture;
    varying vec4 vColor;
    varying float vAngle;
    varying float textureN;
    void main()
    {
        gl_FragColor = vColor;
        if (gl_FragColor.a == 0.0) {
            return;
        }

        float c = cos(vAngle);
        float s = sin(vAngle);
        float textureAmount = 8.0;
        vec2 tPos = vec2((mod(textureN, textureAmount) * (1.0 / textureAmount)), (floor(textureN / textureAmount) * (1.0 / textureAmount)));

        vec2 pos = vec2(gl_PointCoord.x, gl_PointCoord.y);
        vec2 tCen = vec2(0.5, 0.5);

        vec2 rPos = vec2(
            tCen.x + c * (pos.x - tCen.x) - s * (pos.y - tCen.y),
            tCen.y + s * (pos.x - tCen.x) + c * (pos.y - tCen.y)
        );

        rPos = clamp(rPos, 0.0, 1.0);

        vec2 finalPos = vec2(
            (rPos.x / textureAmount + tPos.x),
            1.0 - (rPos.y / textureAmount + tPos.y)
        );

        vec4 rotatedTexture = texture2D(uTexture, finalPos);
        gl_FragColor = gl_FragColor * rotatedTexture;
    }
`;

export default effectFragmentShader;
