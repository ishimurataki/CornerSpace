import CanvasState, { TracerMaterial, EditToolModes } from "@/app/create/canvas-state";
import { vec3 } from "@/lib/gl-matrix/index";
import { Mode } from "@/lib/polar-camera"

export default class Controls {

    canvasState: CanvasState;

    private mouseDown: boolean = false;
    private moveSun: boolean = false;
    private cubePlacedInCurrentPos: boolean = false;
    private xIndex: number = -1;
    private zIndex: number = -1;
    private layer: number = 0;
    private movementSpeed: number = 0.01;
    private zoomSpeed: number = -0.008;
    private layerScrollSpeed: number = 0.005;

    constructor(canvasState: CanvasState) {
        this.canvasState = canvasState;
    }

    registerControls() {
        if (this.canvasState.canvas) {
            this.canvasState.canvas.addEventListener('mousemove', this.moveHandler, false);
            this.canvasState.canvas.addEventListener('mousedown', this.mouseDownHandler, false);
            this.canvasState.canvas.addEventListener('mouseup', this.mouseUpHandler, false);
            this.canvasState.canvas.addEventListener('wheel', this.mousewheelHandler, false);
        }
    }

    private moveHandler = (e: MouseEvent) => {
        if (!this.canvasState.canvas || !this.canvasState.scene) {
            return;
        }
        const rect = this.canvasState.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const clipX = x / rect.width * 2 - 1;
        const clipY = y / rect.height * -2 + 1;

        const start: vec3 = vec3.transformMat4(vec3.create(), vec3.fromValues(clipX, clipY, -1), this.canvasState.viewProjectionInverse);
        const end: vec3 = vec3.transformMat4(vec3.create(), vec3.fromValues(clipX, clipY, 1), this.canvasState.viewProjectionInverse);

        const v: vec3 = vec3.sub(vec3.create(), end, start);
        if (this.canvasState.camera.getMode() == Mode.Editor) {

            let currentLayerY = Math.round(this.layer) / this.canvasState.divisionFactor;
            let t = (currentLayerY - start[1]) / v[1];

            let cursorXWorld = start[0] + t * v[0];
            let cursorZWorld = start[2] + t * v[2];

            let xIndexNow = Math.floor((cursorXWorld - this.canvasState.upperLeft[0]) / this.canvasState.sideLength);
            let zIndexNow = Math.floor((cursorZWorld - this.canvasState.upperLeft[1]) / this.canvasState.sideLength);

            if (xIndexNow != this.xIndex || zIndexNow != this.zIndex) {
                this.canvasState.renderHoverCube = this.canvasState.scene.setHoverCubePosition(xIndexNow, zIndexNow);
                this.cubePlacedInCurrentPos = false;
                this.xIndex = xIndexNow;
                this.zIndex = zIndexNow;
            }
            if (this.mouseDown && !this.cubePlacedInCurrentPos) {
                switch (this.canvasState.editToolMode) {
                    case EditToolModes.Pencil:
                        this.canvasState.scene.addCube(this.xIndex, this.zIndex);
                        break;
                    case EditToolModes.Eraser:
                        this.canvasState.renderHoverCube = false;
                        this.canvasState.scene.deleteCube(this.xIndex, this.zIndex);
                        break;
                    case EditToolModes.EyeDropper:
                        this.canvasState.renderHoverCube = false;
                        let newCubeColor = this.canvasState.scene.getCubeColor(this.xIndex, this.zIndex);
                        let newCubeMaterial = this.canvasState.scene.getCubeMaterial(this.xIndex, this.zIndex);
                        if (newCubeColor != null) this.canvasState.scene.setHoverCubeColor(newCubeColor);
                        if (newCubeMaterial != null) this.canvasState.tracerMaterial = newCubeMaterial;
                        break;
                }
                this.cubePlacedInCurrentPos = true;
            }
        } else if (this.canvasState.camera.getMode() == Mode.Viewer) {
            // Detect if curser is over sun box
            let sunHit = false;
            for (let i = 0; i < 3; i++) {
                let t = (this.canvasState.scene.sunCorner[i] - start[i]) / v[i];
                let dim1 = (i + 1) % 3;
                let dim2 = (i + 2) % 3;
                let dim1Value = start[dim1] + t * v[dim1];
                let dim2Value = start[dim2] + t * v[dim2];
                let dim1FromSun = dim1Value - this.canvasState.scene.sunCorner[dim1];
                let dim2FromSun = dim2Value - this.canvasState.scene.sunCorner[dim2];
                if (dim1FromSun >= 0 && dim1FromSun <= this.canvasState.sideLength
                    && dim2FromSun >= 0 && dim2FromSun <= this.canvasState.sideLength) {
                    sunHit = true;
                    break;
                }
                t = (this.canvasState.scene.sunCorner[i] + this.canvasState.sideLength - start[i]) / v[i];
                dim1Value = start[dim1] + t * v[dim1];
                dim2Value = start[dim2] + t * v[dim2];
                dim1FromSun = dim1Value - this.canvasState.scene.sunCorner[dim1];
                dim2FromSun = dim2Value - this.canvasState.scene.sunCorner[dim2];
                if (dim1FromSun >= 0 && dim1FromSun <= this.canvasState.sideLength
                    && dim2FromSun >= 0 && dim2FromSun <= this.canvasState.sideLength) {
                    sunHit = true;
                    break;
                }
            }
            this.canvasState.renderSunSelection = sunHit;

            if (this.mouseDown) {
                let xMove = e.movementX * this.movementSpeed;
                let yMove = e.movementY * this.movementSpeed;
                if (sunHit) {
                    this.moveSun = true;
                }
                if (this.moveSun) {
                    let a = vec3.sub(vec3.create(), this.canvasState.scene.sunCenter, this.canvasState.camera.getPosition());
                    let b = vec3.sub(vec3.create(), this.canvasState.camera.ref, this.canvasState.camera.getPosition());
                    let projection = vec3.dot(a, b) / Math.pow(vec3.length(b), 2);
                    let passThroughPoint = vec3.add(vec3.create(), this.canvasState.camera.getPosition(), vec3.scale(vec3.create(), b, projection));

                    let tNumerator = (b[0] * (start[0] - passThroughPoint[0])) +
                        (b[1] * (start[1] - passThroughPoint[1])) +
                        (b[2] * (start[2] - passThroughPoint[2]));
                    let tDenominator = (-b[0] * v[0]) - (b[1] * v[1]) - (b[2] * v[2]);
                    let tNew = tNumerator / tDenominator;
                    let sunPosition = vec3.add(vec3.create(), start, vec3.scale(vec3.create(), v, tNew));
                    this.canvasState.scene.setSunCenter(sunPosition);
                } else {
                    this.canvasState.camera.rotateTheta(xMove);
                    this.canvasState.camera.rotatePhi(yMove);
                }
                this.canvasState.sampleCount = 0;
            }
        }
    }

    private mouseDownHandler = (e: MouseEvent) => {
        switch (e.button) {
            case 0:
                this.mouseDown = true;
                break;
        }
        if (!this.canvasState.scene) {
            return;
        }
        if (this.canvasState.camera.getMode() == Mode.Editor) {
            switch (this.canvasState.editToolMode) {
                case EditToolModes.Pencil:
                    this.canvasState.scene.addCube(this.xIndex, this.zIndex);
                    break;
                case EditToolModes.Eraser:
                    this.canvasState.renderHoverCube = false;
                    this.canvasState.scene.deleteCube(this.xIndex, this.zIndex);
                    break;
                case EditToolModes.EyeDropper:
                    this.canvasState.renderHoverCube = false;
                    let newCubeColor = this.canvasState.scene.getCubeColor(this.xIndex, this.zIndex);
                    let newCubeMaterial = this.canvasState.scene.getCubeMaterial(this.xIndex, this.zIndex);
                    if (newCubeColor != null) this.canvasState.scene.setHoverCubeColor(newCubeColor);
                    if (newCubeMaterial != null) this.canvasState.tracerMaterial = newCubeMaterial;
                    break;
            }
        }
    }

    private mouseUpHandler = (e: MouseEvent) => {
        switch (e.button) {
            case 0:
                this.mouseDown = false;
                this.moveSun = false;
                break;
        }
    }

    private mousewheelHandler = (e: WheelEvent) => {
        if (!this.canvasState.scene) {
            return;
        }
        e.preventDefault();
        if (this.canvasState.camera.getMode() == Mode.Viewer) {
            let zoom = this.zoomSpeed * e.deltaY;
            this.canvasState.camera.zoom(zoom);
            this.canvasState.sampleCount = 0;
        } else if (this.canvasState.camera.getMode() == Mode.Editor) {
            let prevLayer = Math.round(this.layer);
            let layerScroll = this.layerScrollSpeed * e.deltaY;
            this.layer = Math.min(this.canvasState.divisionFactor - 1, Math.max(0, this.layer - layerScroll));
            let currentLayer = Math.round(this.layer);
            if (prevLayer != currentLayer) {
                this.canvasState.setLayerLabel(currentLayer + 1);
                this.canvasState.renderHoverCube = false;
                console.log("Setting layer to: " + currentLayer);
                this.canvasState.camera.setEditorRef(vec3.fromValues(0.0, currentLayer / this.canvasState.divisionFactor, 0.0));
                this.canvasState.transitioning = true;
                this.canvasState.transitionTime = 0;
                this.canvasState.scene.setCubeLayer(currentLayer);
            }
        }
    }

    public toggleToEditor = () => {
        if (!this.canvasState.scene) {
            return;
        }
        this.canvasState.scene.setCubeLayer(Math.round(this.layer));
        this.canvasState.renderHoverCube = false;
        this.canvasState.transitioning = true;
        this.canvasState.transitionTime = 0;
        this.canvasState.camera.changeToEditor();
        this.canvasState.setLayerVisible(true);
    }

    public toggleToViewer = () => {
        if (!this.canvasState.scene) {
            return;
        }
        this.canvasState.renderHoverCube = false;
        this.canvasState.transitioning = true;
        this.canvasState.transitionTime = 0;
        let yRange: vec2 = this.canvasState.scene.cubeSpace.populateBuffers();
        let viewerRefY = (yRange[0] + yRange[1]) / (2 * this.canvasState.divisionFactor);
        this.canvasState.camera.setViewerRef(vec3.fromValues(0, viewerRefY, 0));
        this.canvasState.camera.changeToViewer();
        this.canvasState.scene.cubeSpace.populateTexture();
        this.canvasState.setLayerVisible(false);
    }
}