const lineFragmentShader = `

    uniform float time;
    varying vec3 vColor;
    varying vec2 vUv;
    varying float vOpacity;
    varying float vDashRatio;
    varying vec2 vPulse;

    vec4 getPulse(vec4 color) {
        float pulseAmount = vPulse.x;
        float pulseSpeed = vPulse.y;

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
    
        color += diff * 0.1;

        return color;
    }

    vec4 blendSides(vec4 color) {
        float treshold = 0.4;
        if (vUv.x < treshold) {
            color.a *= vUv.x * 1.0 / treshold;
        } else if (vUv.x > 1.0 - treshold) {
            color.a *= (1.0 - vUv.x) * 1.0 / treshold;;
        }

        return color;
    }

    vec4 getDashedColor(vec4 color) {

        if (vDashRatio == 0.0) {
            return color;
        }

        float y = vUv.y;

        if ( mod(floor(y * 10.0 / (vDashRatio * 10.0)), 2.0) == 0.0 ) {
            discard;
        }

        float modulus = mod(y, vDashRatio) / vDashRatio;
        if (modulus < 0.2) {
            color.a *= modulus * 5.0;
        } else if (modulus > 0.8) {
            color.a *= (1.0 - modulus) * 5.0;
        }

        return color;
    }

    void main() {
        vec4 finalColor = vec4(vColor, 1.0);

        if (finalColor.a > 0.0) {
            finalColor.a *= vOpacity;
        }

        finalColor = getDashedColor(finalColor);
        finalColor = blendSides(finalColor);
        finalColor = getPulse(finalColor);
       
        gl_FragColor = finalColor; 
    }
`;

export default lineFragmentShader;
