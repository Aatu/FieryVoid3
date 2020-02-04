const boltVertexShader = `
    precision highp float;
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform float gameTime;
    uniform float zoomLevel;
    attribute vec3 position;
    attribute vec3 offset;
    attribute float opacity;
    attribute vec2 uv;
    attribute float textureNumber;
    attribute vec3 scale;
    attribute vec4 quaternion;
    attribute vec3 color;
    attribute vec3 velocity;
    attribute float activationGameTime;
    attribute float deactivationGameTime;
    attribute float deactivationFade;
    varying float vActivationGameTime;
    varying float vDeactivationGameTime;
    varying vec3 vColor;
    varying vec2 vUv;
    varying float vOpacity;

    float getScale() {
        return 1.0;
    }

    vec2 resolveUv() {
        float textureAmount = 8.0;
        vec2 tPos = vec2(
            (mod(textureNumber, textureAmount) * (1.0 / textureAmount)),
            (floor(textureNumber / textureAmount) * (1.0 / textureAmount))
        );
        
        vec2 finalPos = vec2((uv.x / textureAmount + tPos.x), 1.0 - (uv.y / textureAmount + tPos.y));

        return finalPos;
    }

    // http://www.geeks3d.com/20141201/how-to-rotate-a-vertex-by-a-quaternion-in-glsl/
    vec3 applyQuaternionToVector(vec3 v ){
        return v + 2.0 * cross( quaternion.xyz, cross( quaternion.xyz, v ) + quaternion.w * v );
    }

    float getTimeToEnd() {
        float speed = length(velocity);

        if (speed > 0.0) {  
            float length = scale.x;
            float timeToEnd = length / speed;
            return timeToEnd ;
        } else {  
            return 0.0;
        }
    }

    float getFadeOpacity() {

        if (deactivationFade == 0.0) {
            return 1.0;
        }

        if (gameTime < (deactivationGameTime - deactivationFade)) {
            return 1.0;
        }

        float fade = gameTime - (deactivationGameTime - deactivationFade);

        if (fade > deactivationFade) {
            fade = deactivationFade;
        }

        float ratio = fade / deactivationFade;

        return 1.0 - ratio;
        
    }

    int active(float vertexDeltaTime) {
        if (opacity == 0.0) {
            return 0;
        }

        if (activationGameTime > gameTime) {
            return 0;
        }

        if (deactivationGameTime + vertexDeltaTime < gameTime) {
            return 0;
        }
        
        return 1;
    }

    void main() {

        float timeToEnd = getTimeToEnd();

        if (active(timeToEnd) == 0) {
            gl_Position = vec4(0.0);
            vOpacity = 0.0;
            return;
        }

        float currentOpacity = opacity;

        if (zoomLevel < 1.0) {
            currentOpacity += (1.0 - zoomLevel) * 0.5;
        }

        float elapsedTime = gameTime - activationGameTime;

        vOpacity = currentOpacity * getFadeOpacity();
        vUv = resolveUv();
        vColor = color;
        vActivationGameTime = activationGameTime + timeToEnd * uv.y;
        vDeactivationGameTime = deactivationGameTime + timeToEnd * uv.y;
        

        
        gl_Position = projectionMatrix * modelViewMatrix * vec4((offset + velocity * elapsedTime) + applyQuaternionToVector(position * scale), 1.0 );      
     
        //gl_Position = projectionMatrix * modelViewMatrix * vec4( offset + applyQuaternionToVector(position) * scale, 1.0 );      
      }

`;

export default boltVertexShader;
