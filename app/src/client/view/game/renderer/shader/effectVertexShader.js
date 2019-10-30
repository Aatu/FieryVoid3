const effectVertexShader = `
    attribute vec3 color;
    attribute float opacity;
    attribute float fadeInTime;
    attribute float fadeInSpeed;
    attribute float fadeOutTime;
    attribute float fadeOutSpeed;
    attribute float size;
    attribute float sizeChange;
    attribute float angle;
    attribute float angleChange;
    attribute vec3 velocity;
    attribute vec3 acceleration;
    attribute float activationGameTime;
    attribute float textureNumber;
    uniform float zoomLevel;
    uniform float gameTime;
    varying vec4  vColor;
    varying float vAngle;
    varying float textureN;
    void main()
    {
        float elapsedTime = gameTime - activationGameTime;

        if (elapsedTime < 0.0 || (fadeOutTime > 0.0 && gameTime - (fadeOutTime + fadeOutSpeed) > 0.0)) {
            gl_PointSize = 0.0;
            gl_Position = vec4( 0.0, 0.0, 0.0, 1.0 );
            vColor = vec4(0.0, 0.0, 0.0, 0.0);
            textureN = textureNumber;
            return;
        }

        float currentOpacity = 0.0;
        if (fadeInSpeed == 0.0) {
            currentOpacity = opacity;
        }


        if (fadeInSpeed > 0.0 && gameTime > fadeInTime)
        {
            float fadeIn = (gameTime - fadeInTime) / fadeInSpeed;
        if (fadeIn > 1.0) fadeIn = 1.0;
            currentOpacity =  opacity * fadeIn;
        }

        if (fadeOutSpeed > 0.0 && gameTime > fadeOutTime)
        {
            float fadeOut = (gameTime - fadeOutTime) / fadeOutSpeed;
        if (fadeOut > 1.0) fadeOut = 1.0;
            currentOpacity =  currentOpacity * (1.0 - fadeOut);
        }

        if ( currentOpacity > 0.0 && elapsedTime >= 0.0)
        {
            
            if (zoomLevel < 1.0) {
                currentOpacity += (1.0 - zoomLevel);
            }
            
            vColor = vec4( color, currentOpacity );
        } else {
            vColor = vec4(0.0, 0.0, 0.0, 0.0);
        }

        vAngle = angle + angleChange * elapsedTime;
        textureN = textureNumber;

        vec3 displacement = velocity * elapsedTime;
        vec3 accelerationDisplacement  = elapsedTime * elapsedTime * 0.5 * acceleration;

        vec3 modPos = position + displacement + accelerationDisplacement;


        gl_PointSize = clamp(size + (sizeChange * elapsedTime), 0.0, 1024.0) * zoomLevel;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( modPos, 1.0 );
    }
`;

export default effectVertexShader;
