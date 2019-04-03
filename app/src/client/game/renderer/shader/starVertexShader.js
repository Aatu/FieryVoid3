const starVertexShader = `
    attribute vec3 color;
    attribute float opacity;
    attribute float size;
    attribute float sizeChange;
    attribute float angle;
    attribute float angleChange;
    attribute float activationGameTime;
    attribute float textureNumber;
    attribute float parallaxFactor;
    attribute float sineFrequency;
    attribute float sineAmplitude;
    uniform float gameTime;
    varying vec4  vColor;
    varying float vAngle;
    varying float textureN;
    void main()
    {
    
        float elapsedTime = gameTime - activationGameTime;

        if (elapsedTime < 0.0) {
            gl_PointSize = 0.0;
            gl_Position = vec4( 0.0, 0.0, 0.0, 1.0 );
            vColor = vec4(0.0, 0.0, 0.0, 0.0);
            textureN = textureNumber;
            return;
        }
        

        float currentOpacity = opacity;
        if (sineFrequency > 0.0) {
            currentOpacity = opacity + (sineAmplitude * 0.5 * sin(gameTime/sineFrequency) + sineAmplitude);
        }

        if ( currentOpacity > 0.0 && elapsedTime >= 0.0)
        {
            vColor = vec4( color, currentOpacity );
        } else {
            vColor = vec4(0.0, 0.0, 0.0, 0.0);
        }

        vAngle = angle + angleChange * elapsedTime;
        textureN = textureNumber;

        vec3 modPos = vec3( position.x - (cameraPosition.x * parallaxFactor), position.y - (cameraPosition.y * parallaxFactor), position.z );


        gl_PointSize = clamp(size + (sizeChange * elapsedTime), 0.0, 1024.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4( modPos, 1.0 );
        
    }
`;

export default starVertexShader;
