import { TracerMaterial } from "@/app/create/canvas-state"

export const plainVertexShaderSource: string = `
    attribute vec3 aVertexPosition;
    attribute vec3 aVertexColor;
    attribute vec3 aVertexNormal;
    attribute float aVertexMaterial;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uModelMatrix;

    varying lowp vec3 vPos;
    varying lowp vec3 vNorm;
    varying lowp vec3 vColor;
    varying lowp float vMaterial;

    void main() {
        vec4 world_pos = uModelMatrix * vec4(aVertexPosition, 1.0);
        gl_Position = uProjectionMatrix * uModelViewMatrix * world_pos;
        vPos = world_pos.xyz;
        vNorm = aVertexNormal;
        vColor = aVertexColor;
        vMaterial = aVertexMaterial;
    }
`;

export const plainFragmentShaderSource: string = `
    precision mediump float;
    uniform vec3 uColor;
    uniform int uUseUniformColor;
    uniform vec3 uCameraPosition;
    uniform vec3 uSunPosition;
    uniform vec3 uSunColor;
    uniform int uSunOn;
    uniform float uSunStrength;
    uniform float uAmbienceStrength;

    varying lowp vec3 vPos;
    varying lowp vec3 vNorm;
    varying lowp vec3 vColor;
    varying lowp float vMaterial;

    void main() {
        if (uUseUniformColor == 1) { 
            gl_FragColor = vec4(uColor, 1.0);
        } else {
            float ambienceStrength = (pow(1.63, uAmbienceStrength - 5.3) - 0.122) / 3.0;
            vec3 ambient = ambienceStrength * uSunColor;

            vec3 norm = normalize(vNorm);
            vec3 lightDir = normalize(uSunPosition - vPos);

            float diffuseCoefficient = max(dot(norm, lightDir), 0.0);
            float sunStrength = pow(1.63, uSunStrength - 5.3) - 0.122;
            vec3 diffuse = sunStrength * diffuseCoefficient * uSunColor;

            if (vMaterial == ${TracerMaterial.Diffuse.toFixed(1)}) {
                vec3 result = (ambient + diffuse) * vColor;
                gl_FragColor = vec4(result, 1.0);
            } else if (vMaterial == ${TracerMaterial.Mirror.toFixed(1)}) {
                float specularStrength = 0.75;
                vec3 viewDir = normalize(uCameraPosition - vPos);
                vec3 reflectDir = reflect(-lightDir, norm);  

                float specularCoefficient = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
                vec3 specular = sunStrength * specularStrength * specularCoefficient * uSunColor;

                vec3 result = ((ambient + diffuse) * 1.1 + specular) * vColor;
                gl_FragColor = vec4(result, 1.0);
            }
        }
    }
`