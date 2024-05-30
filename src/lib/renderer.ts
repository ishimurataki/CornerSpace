import { vec3, vec4, mat4 } from "@/lib/gl-matrix/index";
import { Mode } from "@/lib/polar-camera";
import Scene from "@/lib/renderables/scene";
import CanvasState, { EditToolModes, TracerMaterial } from "@/app/create/canvas-state";

export default class Renderer {
    private gl: WebGLRenderingContext;
    private canvasState: CanvasState;

    private plainShaderProgram: WebGLShader;
    private tracerShaderProgram: WebGLShader;
    private renderShaderProgram: WebGLShader;

    private plainProgramInfo: ({
        attribLocations: {
            vertexPosition: number;
            vertexColor: number;
            vertexNormal: number;
            vertexMaterial: number;
        },
        uniformLocations: {
            projectionMatrix: WebGLUniformLocation | null;
            modelViewMatrix: WebGLUniformLocation | null;
            modelMatrix: WebGLUniformLocation | null;
            color: WebGLUniformLocation | null;
            useUniformColor: WebGLUniformLocation | null;
            cameraPosition: WebGLUniformLocation | null;
            sunPosition: WebGLUniformLocation | null;
            sunColor: WebGLUniformLocation | null;
            sunStrength: WebGLUniformLocation | null;
            ambienceStrength: WebGLUniformLocation | null;
        }
    });
    private tracerProgramInfo: ({
        attribLocations: {
            vertexPosition: number;
        },
        uniformLocations: {
            ray00: WebGLUniformLocation | null;
            ray01: WebGLUniformLocation | null;
            ray10: WebGLUniformLocation | null;
            ray11: WebGLUniformLocation | null;
            eye: WebGLUniformLocation | null;
            renderTexture: WebGLUniformLocation | null;
            cubeColorSpaceTexture: WebGLUniformLocation | null;
            cubeMaterialSpaceTexture: WebGLUniformLocation | null;
            timeSinceStart: WebGLUniformLocation | null;
            textureWeight: WebGLUniformLocation | null;
            sunPosition: WebGLUniformLocation | null;
            width: WebGLUniformLocation | null;
            height: WebGLUniformLocation | null;
            backgroundColor: WebGLUniformLocation | null;
            tracerMaterial: WebGLUniformLocation | null;
            diffuseStrength: WebGLUniformLocation | null;
            ambienceStrength: WebGLUniformLocation | null;
        }
    });
    private renderProgramInfo: ({
        attribLocations: {
            vertexPosition: number;
        },
        uniformLocations: {
            renderTexture: WebGLUniformLocation | null;
        }
    });

    private tracerVertexBuffer: WebGLBuffer | null;
    private tracerFrameBuffer: WebGLFramebuffer | null;
    private tracerTextures: (WebGLTexture | null)[];
    private screen00: vec4 = vec4.fromValues(-1, -1, 0, 1);
    private screen01: vec4 = vec4.fromValues(-1, +1, 0, 1);
    private screen10: vec4 = vec4.fromValues(+1, -1, 0, 1);
    private screen11: vec4 = vec4.fromValues(+1, +1, 0, 1);

    private previousCanvasWidth: number = 0;
    private previousCanvasHeight: number = 0;

    constructor(gl: WebGLRenderingContext, canvasState: CanvasState,
        tracerShaderProgram: WebGLShader, renderShaderProgram: WebGLShader, plainShaderProgram: WebGLShader) {
        this.gl = gl;
        this.canvasState = canvasState;
        this.tracerShaderProgram = tracerShaderProgram;
        this.renderShaderProgram = renderShaderProgram;
        this.plainShaderProgram = plainShaderProgram;
        this.plainProgramInfo = {
            attribLocations: {
                vertexPosition: gl.getAttribLocation(plainShaderProgram, 'aVertexPosition'),
                vertexColor: gl.getAttribLocation(plainShaderProgram, 'aVertexColor'),
                vertexNormal: gl.getAttribLocation(plainShaderProgram, 'aVertexNormal'),
                vertexMaterial: gl.getAttribLocation(plainShaderProgram, 'aVertexMaterial')
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(plainShaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(plainShaderProgram, 'uModelViewMatrix'),
                modelMatrix: gl.getUniformLocation(plainShaderProgram, 'uModelMatrix'),
                color: gl.getUniformLocation(plainShaderProgram, 'uColor'),
                useUniformColor: gl.getUniformLocation(plainShaderProgram, 'uUseUniformColor'),
                cameraPosition: gl.getUniformLocation(plainShaderProgram, 'uCameraPosition'),
                sunPosition: gl.getUniformLocation(plainShaderProgram, 'uSunPosition'),
                sunColor: gl.getUniformLocation(plainShaderProgram, 'uSunColor'),
                sunStrength: gl.getUniformLocation(plainShaderProgram, "uSunStrength"),
                ambienceStrength: gl.getUniformLocation(plainShaderProgram, "uAmbienceStrength")
            }
        };
        this.tracerProgramInfo = {
            attribLocations: {
                vertexPosition: gl.getAttribLocation(tracerShaderProgram, "aVertexPosition")
            },
            uniformLocations: {
                ray00: gl.getUniformLocation(tracerShaderProgram, "uRay00"),
                ray01: gl.getUniformLocation(tracerShaderProgram, "uRay01"),
                ray10: gl.getUniformLocation(tracerShaderProgram, "uRay10"),
                ray11: gl.getUniformLocation(tracerShaderProgram, "uRay11"),
                eye: gl.getUniformLocation(tracerShaderProgram, "uEye"),
                renderTexture: gl.getUniformLocation(tracerShaderProgram, "uRenderTexture"),
                cubeColorSpaceTexture: gl.getUniformLocation(tracerShaderProgram, "uCubeColorSpaceTexture"),
                cubeMaterialSpaceTexture: gl.getUniformLocation(tracerShaderProgram, "uCubeMaterialSpaceTexture"),
                timeSinceStart: gl.getUniformLocation(tracerShaderProgram, "uTimeSinceStart"),
                textureWeight: gl.getUniformLocation(tracerShaderProgram, "uTextureWeight"),
                sunPosition: gl.getUniformLocation(tracerShaderProgram, "uLightPos"),
                width: gl.getUniformLocation(tracerShaderProgram, "uWidth"),
                height: gl.getUniformLocation(tracerShaderProgram, "uHeight"),
                backgroundColor: gl.getUniformLocation(tracerShaderProgram, "uBackgroundColor"),
                tracerMaterial: gl.getUniformLocation(tracerShaderProgram, "uTracerMaterial"),
                diffuseStrength: gl.getUniformLocation(tracerShaderProgram, "uDiffuseStrength"),
                ambienceStrength: gl.getUniformLocation(tracerShaderProgram, "uAmbienceStrength")
            }
        };
        this.renderProgramInfo = {
            attribLocations: {
                vertexPosition: gl.getAttribLocation(renderShaderProgram, "aVertexPosition")
            },
            uniformLocations: {
                renderTexture: gl.getUniformLocation(renderShaderProgram, "uRenderTexture")
            }
        };
        let vertices: number[] = [
            -1, -1,
            -1, +1,
            +1, -1,
            +1, +1
        ];

        this.tracerVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tracerVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.tracerFrameBuffer = gl.createFramebuffer();
        this.tracerTextures = [];
        if (this.canvasState.canvas) {
            for (let i = 0; i < 2; i++) {
                this.tracerTextures.push(gl.createTexture());
                gl.bindTexture(gl.TEXTURE_2D, this.tracerTextures[i]);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.canvasState.canvas.clientWidth, this.canvasState.canvas.clientHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                gl.bindTexture(gl.TEXTURE_2D, null);
            }

            this.previousCanvasWidth = this.canvasState.canvas.clientWidth;
            this.previousCanvasHeight = this.canvasState.canvas.clientHeight;

            this.gl.viewport(0, 0, this.canvasState.canvas.clientWidth, this.canvasState.canvas.clientHeight);
        }
    }

    resizeTracerTextures() {
        if (!this.canvasState.canvas) {
            return;
        }
        this.tracerFrameBuffer = this.gl.createFramebuffer();
        this.tracerTextures = [];
        for (let i = 0; i < 2; i++) {
            this.tracerTextures.push(this.gl.createTexture());
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.tracerTextures[i]);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.canvasState.canvas.clientWidth, this.canvasState.canvas.clientHeight, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        }
        this.canvasState.sampleCount = 0;
    }

    tick(currentTime: number) {
        let deltaTime = currentTime - this.canvasState.previousTime;
        if (this.canvasState.transitioning) {
            let a = this.canvasState.transitionTime / 1000;
            if (a > 1) {
                this.canvasState.transitioning = false;
                this.canvasState.transitionTime = 0;
            }
            this.canvasState.camera.transition(a);
            this.canvasState.transitionTime += deltaTime;
            this.canvasState.sampleCount = 0;
        }
    }

    render(currentTime: number) {
        if (!this.canvasState.canvas || !this.canvasState.scene) {
            return;
        }

        this.gl.enable(this.gl.DEPTH_TEST);

        this.canvasState.canvas.width = this.canvasState.canvas.clientWidth;
        this.canvasState.canvas.height = this.canvasState.canvas.clientHeight;

        if (this.canvasState.canvas.clientWidth != this.previousCanvasWidth ||
            this.canvasState.canvas.clientHeight != this.previousCanvasHeight) {
            this.canvasState.camera.changeWidthHeight(this.canvasState.canvas.clientWidth, this.canvasState.canvas.clientHeight);
            this.gl.viewport(0, 0, this.canvasState.canvas.clientWidth, this.canvasState.canvas.clientHeight);

            this.previousCanvasWidth = this.canvasState.canvas.clientWidth;
            this.previousCanvasHeight = this.canvasState.canvas.clientHeight;

            this.resizeTracerTextures();
        }

        this.gl.clearColor(this.canvasState.backgroundColor[0],
            this.canvasState.backgroundColor[1],
            this.canvasState.backgroundColor[2], 1.0);
        this.gl.clearDepth(1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        let projectionMatrix = this.canvasState.camera.getProjMatrix();
        let modelViewMatrix = this.canvasState.camera.getViewMatrix();
        let viewProjectionMatrix = mat4.multiply(mat4.create(), projectionMatrix, modelViewMatrix);
        mat4.invert(this.canvasState.viewProjectionInverse, viewProjectionMatrix);

        if (this.canvasState.camera.getMode() == Mode.Editor) {
            this.gl.useProgram(this.plainShaderProgram);
            this.gl.uniformMatrix4fv(this.plainProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
            this.gl.uniformMatrix4fv(this.plainProgramInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
            this.gl.uniform3fv(this.plainProgramInfo.uniformLocations.cameraPosition, this.canvasState.camera.getPosition());
            this.gl.uniform1i(this.plainProgramInfo.uniformLocations.useUniformColor, 1);
            // Draw tiles
            for (let tile of this.canvasState.scene.editorTiles) {
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, tile.mesh.positionBuffer);
                this.gl.vertexAttribPointer(this.plainProgramInfo.attribLocations.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
                this.gl.enableVertexAttribArray(this.plainProgramInfo.attribLocations.vertexPosition);
                this.gl.uniform3fv(this.plainProgramInfo.uniformLocations.color, tile.color);
                this.gl.uniformMatrix4fv(this.plainProgramInfo.uniformLocations.modelMatrix, false, tile.modelMatrix);
                this.gl.drawArrays(tile.mesh.drawingMode, 0, tile.mesh.vertices.length / 3);
            }
            // Draw cubes
            let firstCube = true
            for (let cube of this.canvasState.scene.cubeLayer.values()) {
                if (firstCube) {
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cube.mesh.positionBuffer);
                    this.gl.vertexAttribPointer(this.plainProgramInfo.attribLocations.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
                    this.gl.enableVertexAttribArray(this.plainProgramInfo.attribLocations.vertexPosition);
                    firstCube = false;
                }
                this.gl.uniform3fv(this.plainProgramInfo.uniformLocations.color, cube.color);
                this.gl.uniformMatrix4fv(this.plainProgramInfo.uniformLocations.modelMatrix, false, cube.modelMatrix);
                this.gl.drawArrays(cube.mesh.drawingMode, 0, cube.mesh.vertices.length / 3);
            }

            // Draw hover cube
            if (this.canvasState.renderHoverCube) {
                if (firstCube) {
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.canvasState.scene.hoverCube.mesh.positionBuffer);
                    this.gl.vertexAttribPointer(this.plainProgramInfo.attribLocations.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
                    this.gl.enableVertexAttribArray(this.plainProgramInfo.attribLocations.vertexPosition);
                }
                this.gl.uniform3fv(this.plainProgramInfo.uniformLocations.color, this.canvasState.hoverCubeColor);
                this.gl.uniformMatrix4fv(this.plainProgramInfo.uniformLocations.modelMatrix, false, this.canvasState.scene.hoverCube.modelMatrix);
                this.gl.drawArrays(this.canvasState.scene.hoverCube.mesh.drawingMode, 0, this.canvasState.scene.hoverCube.mesh.vertices.length / 3);
            }

            // Draw mirror cube markers
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.canvasState.scene.mirrorMarkerMesh.positionBuffer);
            this.gl.vertexAttribPointer(this.plainProgramInfo.attribLocations.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(this.plainProgramInfo.attribLocations.vertexPosition);
            for (let cube of this.canvasState.scene.cubeLayer.values()) {
                if (cube.material == TracerMaterial.Mirror) {
                    let lerpWith = (cube.color[0] + cube.color[1] + cube.color[2]) / 3.0 > 0.5 ?
                        vec3.fromValues(0.0, 0.0, 0.0) :
                        vec3.fromValues(1.0, 1.0, 1.0);
                    let markerColor = vec3.lerp(vec3.create(), cube.color, lerpWith, 0.2);
                    this.gl.uniform3fv(this.plainProgramInfo.uniformLocations.color, markerColor);
                    this.gl.uniformMatrix4fv(this.plainProgramInfo.uniformLocations.modelMatrix, false, cube.modelMatrix);
                    this.gl.drawArrays(this.canvasState.scene.mirrorMarkerMesh.drawingMode, 0,
                        this.canvasState.scene.mirrorMarkerMesh.vertices.length / 3);
                }
            }

            // Draw grid
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.canvasState.scene.grid.mesh.positionBuffer);
            this.gl.vertexAttribPointer(this.plainProgramInfo.attribLocations.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(this.plainProgramInfo.attribLocations.vertexPosition);
            this.gl.uniform3fv(this.plainProgramInfo.uniformLocations.color, this.canvasState.scene.grid.color);
            this.gl.uniformMatrix4fv(this.plainProgramInfo.uniformLocations.modelMatrix, false, this.canvasState.scene.grid.modelMatrix);
            this.gl.drawArrays(this.canvasState.scene.grid.mesh.drawingMode, 0, this.canvasState.scene.grid.mesh.vertices.length / 3);

            // Draw selector
            if (this.canvasState.editToolMode == EditToolModes.Selector && this.canvasState.scene.selectorDragStart) {
                this.gl.disable(this.gl.DEPTH_TEST);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.canvasState.scene.selector.mesh.positionBuffer);
                this.gl.vertexAttribPointer(this.plainProgramInfo.attribLocations.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
                this.gl.enableVertexAttribArray(this.plainProgramInfo.attribLocations.vertexPosition);
                this.gl.uniform3fv(this.plainProgramInfo.uniformLocations.color, this.canvasState.scene.selector.color);
                this.gl.uniformMatrix4fv(this.plainProgramInfo.uniformLocations.modelMatrix, false, this.canvasState.scene.selector.modelMatrix);
                this.gl.drawArrays(this.canvasState.scene.selector.mesh.drawingMode, 0, this.canvasState.scene.selector.mesh.vertices.length / 3);
            }
        }
        else if (this.canvasState.camera.getMode() == Mode.Viewer) {
            if (this.canvasState.rayTrace) {
                this.renderViewerRayTraced(viewProjectionMatrix, currentTime);
            } else {
                this.renderViewerPlain(projectionMatrix, modelViewMatrix);
            }
        }
    }

    renderViewerPlain(projectionMatrix: mat4, modelViewMatrix: mat4) {
        if (!this.canvasState.canvas || !this.canvasState.scene) {
            return;
        }

        this.gl.useProgram(this.plainShaderProgram);

        this.gl.uniformMatrix4fv(this.plainProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
        this.gl.uniformMatrix4fv(this.plainProgramInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
        this.gl.uniform3fv(this.plainProgramInfo.uniformLocations.cameraPosition, this.canvasState.camera.getPosition());
        this.gl.uniform3fv(this.plainProgramInfo.uniformLocations.sunColor, this.canvasState.scene.sun.color);
        this.gl.uniform3fv(this.plainProgramInfo.uniformLocations.sunPosition, this.canvasState.scene.sunCenter);
        this.gl.uniform1f(this.plainProgramInfo.uniformLocations.sunStrength, this.canvasState.sunStrength);
        this.gl.uniform1f(this.plainProgramInfo.uniformLocations.ambienceStrength, this.canvasState.ambienceStrength);
        this.gl.uniform1i(this.plainProgramInfo.uniformLocations.useUniformColor, 0);

        // Draw cube space
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.canvasState.scene.cubeSpace.cubeSpacePositionBuffer);
        this.gl.vertexAttribPointer(this.plainProgramInfo.attribLocations.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.plainProgramInfo.attribLocations.vertexPosition);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.canvasState.scene.cubeSpace.cubeSpaceNormalBuffer);
        this.gl.vertexAttribPointer(this.plainProgramInfo.attribLocations.vertexNormal, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.plainProgramInfo.attribLocations.vertexNormal);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.canvasState.scene.cubeSpace.cubeSpaceColorBuffer);
        this.gl.vertexAttribPointer(this.plainProgramInfo.attribLocations.vertexColor, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.plainProgramInfo.attribLocations.vertexColor);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.canvasState.scene.cubeSpace.cubeSpaceMaterialBuffer);
        this.gl.vertexAttribPointer(this.plainProgramInfo.attribLocations.vertexMaterial, 1, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.plainProgramInfo.attribLocations.vertexMaterial);
        this.gl.uniformMatrix4fv(this.plainProgramInfo.uniformLocations.modelMatrix, false, mat4.create());
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.canvasState.scene.cubeSpace.cubeSpaceNumberOfVertices);
        this.gl.disableVertexAttribArray(this.plainProgramInfo.attribLocations.vertexNormal);
        this.gl.disableVertexAttribArray(this.plainProgramInfo.attribLocations.vertexColor);
        this.gl.disableVertexAttribArray(this.plainProgramInfo.attribLocations.vertexMaterial);

        // Draw sun
        this.gl.uniform1i(this.plainProgramInfo.uniformLocations.useUniformColor, 1);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.canvasState.scene.sun.mesh.positionBuffer);
        this.gl.vertexAttribPointer(this.plainProgramInfo.attribLocations.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.plainProgramInfo.attribLocations.vertexPosition);
        this.gl.uniform3fv(this.plainProgramInfo.uniformLocations.color, this.canvasState.scene.sun.color);
        this.gl.uniformMatrix4fv(this.plainProgramInfo.uniformLocations.modelMatrix, false, this.canvasState.scene.sun.modelMatrix);
        this.gl.drawArrays(this.canvasState.scene.sun.mesh.drawingMode, 0, this.canvasState.scene.sun.mesh.vertices.length / 3);

        // Draw sun selection
        if (this.canvasState.renderSunSelection) {
            this.gl.disable(this.gl.DEPTH_TEST);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.canvasState.scene.sunSelection.mesh.positionBuffer);
            this.gl.vertexAttribPointer(this.plainProgramInfo.attribLocations.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(this.plainProgramInfo.attribLocations.vertexPosition);
            this.gl.uniform3fv(this.plainProgramInfo.uniformLocations.color, this.canvasState.scene.sunSelection.color);
            this.gl.uniformMatrix4fv(this.plainProgramInfo.uniformLocations.modelMatrix, false, this.canvasState.scene.sunSelection.modelMatrix);
            this.gl.drawArrays(this.canvasState.scene.sunSelection.mesh.drawingMode, 0, this.canvasState.scene.sunSelection.mesh.vertices.length / 3);
        }
    }

    renderViewerRayTraced(viewProjectionMatrix: mat4, currentTime: number) {
        if (!this.canvasState.canvas || !this.canvasState.scene || !this.canvasState.rayTrace) {
            return;
        }

        this.gl.useProgram(this.tracerShaderProgram);

        this.gl.uniform1f(this.tracerProgramInfo.uniformLocations.width, this.canvasState.canvas.clientWidth);
        this.gl.uniform1f(this.tracerProgramInfo.uniformLocations.height, this.canvasState.canvas.clientHeight);

        this.gl.uniform3fv(this.tracerProgramInfo.uniformLocations.backgroundColor, this.canvasState.backgroundColor);
        this.gl.uniform1i(this.tracerProgramInfo.uniformLocations.tracerMaterial, this.canvasState.tracerMaterial);

        this.gl.uniform1f(this.tracerProgramInfo.uniformLocations.diffuseStrength, this.canvasState.sunStrength);
        this.gl.uniform1f(this.tracerProgramInfo.uniformLocations.ambienceStrength, this.canvasState.ambienceStrength);

        this.gl.uniform3fv(this.tracerProgramInfo.uniformLocations.eye, this.canvasState.camera.eye);
        let jitter: vec3 = vec3.scale(vec3.create(),
            vec3.fromValues(Math.random() * 2 - 1, Math.random() * 2 - 1, 0),
            1 / (5000 + 5 * Math.max(this.canvasState.sampleCount, 0.0)));
        let inverse: mat4 = mat4.invert(
            mat4.create(),
            mat4.translate(mat4.create(), viewProjectionMatrix, jitter)
        );

        let ray00_i1: vec4 = vec4.transformMat4(vec4.create(), this.screen00, inverse);
        let ray01_i1: vec4 = vec4.transformMat4(vec4.create(), this.screen01, inverse);
        let ray10_i1: vec4 = vec4.transformMat4(vec4.create(), this.screen10, inverse);
        let ray11_i1: vec4 = vec4.transformMat4(vec4.create(), this.screen11, inverse);

        let ray00_i2: vec4 = vec4.scale(vec4.create(), ray00_i1, 1 / ray00_i1[3]);
        let ray01_i2: vec4 = vec4.scale(vec4.create(), ray01_i1, 1 / ray01_i1[3]);
        let ray10_i2: vec4 = vec4.scale(vec4.create(), ray10_i1, 1 / ray10_i1[3]);
        let ray11_i2: vec4 = vec4.scale(vec4.create(), ray11_i1, 1 / ray11_i1[3]);

        let ray00: vec3 = vec3.subtract(vec3.create(), vec3.fromValues(ray00_i2[0], ray00_i2[1], ray00_i2[2]), this.canvasState.camera.eye);
        let ray01: vec3 = vec3.subtract(vec3.create(), vec3.fromValues(ray01_i2[0], ray01_i2[1], ray01_i2[2]), this.canvasState.camera.eye);
        let ray10: vec3 = vec3.subtract(vec3.create(), vec3.fromValues(ray10_i2[0], ray10_i2[1], ray10_i2[2]), this.canvasState.camera.eye);
        let ray11: vec3 = vec3.subtract(vec3.create(), vec3.fromValues(ray11_i2[0], ray11_i2[1], ray11_i2[2]), this.canvasState.camera.eye);

        this.gl.uniform3fv(this.tracerProgramInfo.uniformLocations.ray00, ray00);
        this.gl.uniform3fv(this.tracerProgramInfo.uniformLocations.ray01, ray01);
        this.gl.uniform3fv(this.tracerProgramInfo.uniformLocations.ray10, ray10);
        this.gl.uniform3fv(this.tracerProgramInfo.uniformLocations.ray11, ray11);

        this.gl.uniform3fv(this.tracerProgramInfo.uniformLocations.sunPosition, this.canvasState.scene.sunCenter);
        this.gl.uniform1f(this.tracerProgramInfo.uniformLocations.timeSinceStart, currentTime);

        let textureWeight: number = Math.max(this.canvasState.sampleCount - 3, 0) / (this.canvasState.sampleCount + 1);
        this.gl.uniform1f(this.tracerProgramInfo.uniformLocations.textureWeight, textureWeight);

        this.gl.uniform1i(this.tracerProgramInfo.uniformLocations.cubeColorSpaceTexture, 1);
        this.gl.uniform1i(this.tracerProgramInfo.uniformLocations.cubeMaterialSpaceTexture, 2);
        this.gl.uniform1i(this.tracerProgramInfo.uniformLocations.renderTexture, 0);

        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.canvasState.scene.cubeSpace.cubeColorSpaceTexture);
        this.gl.activeTexture(this.gl.TEXTURE2);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.canvasState.scene.cubeSpace.cubeMaterialSpaceTexture);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.tracerTextures[0]);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.tracerVertexBuffer);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.tracerFrameBuffer);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.tracerTextures[1], 0);
        this.gl.vertexAttribPointer(this.tracerProgramInfo.attribLocations.vertexPosition, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.tracerProgramInfo.attribLocations.vertexPosition);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        this.tracerTextures.reverse();

        this.gl.useProgram(this.renderShaderProgram);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.tracerTextures[0]);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.tracerVertexBuffer);
        this.gl.vertexAttribPointer(this.renderProgramInfo.attribLocations.vertexPosition, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.renderProgramInfo.attribLocations.vertexPosition);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        this.canvasState.sampleCount++;
    }
}