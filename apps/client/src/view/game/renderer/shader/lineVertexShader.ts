const lineVertexShader = `

    attribute vec3 color;
    attribute float opacity;
    attribute float dashRatio;
    attribute vec2 pulse;
    varying float vOpacity;
    varying vec3 vColor;
    varying vec2 vUv;
    varying float vDashRatio;
    varying vec2 vPulse;

    void main() {
        vUv = uv;
        vColor = color;
        vPulse = pulse;
        vOpacity = opacity;
        vDashRatio = dashRatio;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
`;

export default lineVertexShader;
