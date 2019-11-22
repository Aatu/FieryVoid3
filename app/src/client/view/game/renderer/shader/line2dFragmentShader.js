const line2dFragmentShader = `
    precision highp float;
    uniform sampler2D map;
    uniform float textureRepeat;
    uniform vec2 pulse;
    uniform float time;
    varying vec2 vUv;
    varying float vOpacity;
    varying vec3 vColor;

    vec4 getPulse(vec4 color) {
        float pulseAmount = pulse.x;
        float pulseSpeed = pulse.y;

        if (pulseAmount == 0.0 || pulseSpeed == 0.0) {
            return color;
        }

        float pulseTime = mod(time * pulseSpeed, 1.0);
        float y = mod(vUv.y * pulseAmount, 1.0);
   
        float diff = y - pulseTime;
        if (diff < 0.0) {
            diff = 1.0 + diff;
        }

        if (diff > 0.9) {
            diff = 1.0 - ((diff - 0.9) * 10.0);
        }
    
        color.a *= 1.0 + (diff);

        return color;
    }

    vec4 repeatTexture() {
        vec2 textureUv = vec2(
            vUv.x,
            vUv.y * textureRepeat
        );

        return texture2D(map, textureUv);
    }

    void main() {
       
      
        float finalOpacity = repeatTexture().a * vOpacity;
        vec4 finalColor = vec4(vColor, finalOpacity);
        gl_FragColor = getPulse(finalColor);
        
    }
`;

export default line2dFragmentShader;
