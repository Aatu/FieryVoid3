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
    attribute vec3 velocity;
    attribute vec3 acceleration;
    attribute float activationGameTime;
    attribute float textureNumber;
    attribute float sine;
    attribute float repeat;
    uniform float zoomLevel;
    uniform float gameTime;
    varying vec4  vColor;
    varying float vAngle;
    varying float textureN;


    //500432
    vec2 getAngleAndChange() {
        float finalChange = floor(angle / 10000.0) / 1000.0;
        float finalAngle = (angle - floor(angle / 10000.0) * 10000.0) / 1000.0;

        return vec2(finalAngle, finalChange);
    }

    void main()
    {
        float modGameTime = gameTime;
        if (repeat > 0.0) {
            modGameTime = gameTime - (repeat * floor(gameTime/repeat));
        }

        float elapsedTime = modGameTime - activationGameTime;

        if (elapsedTime < 0.0 || (fadeOutTime > 0.0 && modGameTime - (fadeOutTime + fadeOutSpeed) > 0.0)) {
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


        if (fadeInSpeed > 0.0 && modGameTime > fadeInTime)
        {
            float fadeIn = (modGameTime - fadeInTime) / fadeInSpeed;
        if (fadeIn > 1.0) fadeIn = 1.0;
            currentOpacity =  opacity * fadeIn;
        }

        if (fadeOutSpeed > 0.0 && modGameTime > fadeOutTime)
        {
            float fadeOut = (modGameTime - fadeOutTime) / fadeOutSpeed;
        if (fadeOut > 1.0) fadeOut = 1.0;
            currentOpacity =  currentOpacity * (1.0 - fadeOut);
        }

        if ( currentOpacity > 0.0 && elapsedTime >= 0.0)
        {
            float sineAmplitude = sine - floor(sine);
            float sineFrequency = floor(sine);

            if (sineFrequency > 0.0) {
                currentOpacity *= (sineAmplitude * 0.5 * sin(elapsedTime/sineFrequency) + sineAmplitude);
            }
            
            vColor = vec4( color, currentOpacity );
        } else {
            vColor = vec4(0.0, 0.0, 0.0, 0.0);
        }

        vec2 angleData = getAngleAndChange();
        vAngle = angleData.x + angleData.y * elapsedTime;
        textureN = textureNumber;

        vec3 displacement = velocity * elapsedTime;
        vec3 accelerationDisplacement  = elapsedTime * elapsedTime * 0.5 * acceleration;

        vec3 modPos = position + displacement + accelerationDisplacement;


        gl_PointSize = clamp(size + (sizeChange * elapsedTime), 0.0, 1024.0) * zoomLevel;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( modPos, 1.0 );
    }
`;

export default effectVertexShader;
