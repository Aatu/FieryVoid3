const boltVertexShader = `
    precision highp float;
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform float gameTime;
    attribute vec3 position;
    attribute vec3 offset;
    attribute float opacity;
    attribute vec2 uv;
    attribute float textureNumber;
    attribute vec3 scale;
    attribute vec4 quaternion;
    varying vec2 vUv;
    varying float vOpacity;

    float getScale() {
        return 1.0;
    }

    // http://www.geeks3d.com/20141201/how-to-rotate-a-vertex-by-a-quaternion-in-glsl/
    vec3 applyQuaternionToVector(vec3 v ){

        //vec4 q = vec4(0.24999999999999997, -0.06698729810778066, -0.24999999999999997, 0.9330127018922194);
        return v + 2.0 * cross( quaternion.xyz, cross( quaternion.xyz, v ) + quaternion.w * v );
    }

    void main() {
        vUv = uv;
        vOpacity = opacity;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4( offset + applyQuaternionToVector(position * scale), 1.0 );      
     
        //gl_Position = projectionMatrix * modelViewMatrix * vec4( offset + applyQuaternionToVector(position) * scale, 1.0 );      
      }

`;

export default boltVertexShader;
