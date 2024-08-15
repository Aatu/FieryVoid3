const line2dVertexShader = `
    precision highp float;
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform vec3 color;
    uniform float opacity;
    attribute vec3 position;
    attribute vec2 uv;
    varying vec2 vUv;
    varying float vOpacity;
    varying vec3 vColor;

    void main() {
       
        vUv = uv;
        vOpacity = opacity;
        vColor = color;
        /*
        vPulse = pulse;
        vDashRatio = dashRatio;
        */
       
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    
    }
`;

export default line2dVertexShader;
