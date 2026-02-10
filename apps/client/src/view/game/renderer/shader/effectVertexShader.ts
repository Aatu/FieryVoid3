const effectVertexShader = `
    attribute vec3 color;
    attribute float fadeInTime;
    attribute float fadeOutTime;
    attribute uint opacityAndFadeSpeeds;
    attribute float size;
    attribute float sizeChange;
    attribute uint angle;
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


    float getOpacity() {
        return float(opacityAndFadeSpeeds & uint(255)) / 255.0;
    }

    float getFadeInSpeed() {
        return float((opacityAndFadeSpeeds & uint(1048320)) >> 8);
    }

    float getFadeOutSpeed() {
        return float((opacityAndFadeSpeeds & uint(4293918720)) >> 20);
    }


    //500432
    vec2 getAngleAndChange() {
        float finalChange = float((int(angle) & int(32767)) - int(16383)) / 1000.0;
        float finalAngle = float(((int(angle) & int(1073709056)) >> 15) - int(16383)) / 100.0;

        return vec2(finalAngle, finalChange);
    }

    void main()
    {
        float modGameTime = gameTime;
        if (repeat > 0.0) {
            modGameTime = gameTime - (repeat * floor(gameTime/repeat));
        }

        float elapsedTime = modGameTime - activationGameTime;
        float opacity = getOpacity();
        float fadeInSpeed = getFadeInSpeed();
        float fadeOutSpeed = getFadeOutSpeed();

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
