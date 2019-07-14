const lineVertexShader = `

    attribute vec3 color;
    attribute float opacity;
    varying float vOpacity;
    varying vec3 vColor;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vColor = color;
        vOpacity = opacity;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
`;

export default lineVertexShader;
