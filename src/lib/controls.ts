import CanvasState, { TracerMaterial, EditToolModes } from "@/app/create/canvas-state";
import { vec2, vec3 } from "@/lib/gl-matrix/index";
import { Axis, Mode } from "@/lib/polar-camera"

export default class Controls {

    canvasState: CanvasState;

    private mouseDown: boolean = false;
    private moveSun: boolean = false;
    private cubePlacedInCurrentPos: boolean = false;
    private xIndex: number = -1;
    private zIndex: number = -1;
    private yIndex: number = -1;
    private xLayer: number = 0;
    private zLayer: number = 0;
    private yLayer: number = 0;
    private movementSpeed: number = 0.01;
    private zoomSpeed: number = -0.008;
    private layerScrollSpeed: number = 0.005;

    private singleTouchDown: boolean = false;
    private previousTouchCoords: vec2 | null = null;
    private previousPinchDistance: number | null = null;

    constructor(canvasState: CanvasState) {
        this.canvasState = canvasState;
    }

    registerControls() {
        if (this.canvasState.canvas) {
            this.canvasState.canvas.addEventListener('mousemove', this.moveHandler, false);
            this.canvasState.canvas.addEventListener('mousedown', this.mouseDownHandler, false);
            this.canvasState.canvas.addEventListener('mouseup', this.mouseUpHandler, false);
            this.canvasState.canvas.addEventListener('wheel', this.mousewheelHandler, false);
            this.canvasState.canvas.addEventListener('touchmove', this.touchMoveHandler, false);
            this.canvasState.canvas.addEventListener('touchend', this.touchEndHandler, false);
        }
    }

    private touchEndHandler = () => {
        this.previousTouchCoords = null;
        this.previousPinchDistance = null;
        this.singleTouchDown = false;
        this.moveSun = false;
    }

    private touchMoveHandler = (e: TouchEvent) => {
        if (!this.canvasState.canvas || !this.canvasState.scene) {
            return;
        }

        if (e.touches.length == 1) {
            this.singleTouchDown = true;
            const touch = e.touches[0];

            const x = touch.clientX;
            const y = touch.clientY;

            let xMove = this.previousTouchCoords ? x - this.previousTouchCoords[0] : 0;
            let yMove = this.previousTouchCoords ? y - this.previousTouchCoords[1] : 0;
            xMove *= this.movementSpeed;
            yMove *= this.movementSpeed;

            this.previousTouchCoords = vec2.fromValues(x, y);

            this.insideCanvasMoveHandler(x, y, xMove, yMove);
        } else if (e.touches.length == 2) {
            e.preventDefault();

            const touch1 = e.touches[0];
            const touch2 = e.touches[1];

            const xDiff = touch1.clientX - touch2.clientX;
            const yDiff = touch1.clientY - touch2.clientY;

            const pinchDistance = xDiff * xDiff + yDiff * yDiff;

            let zoom = this.previousPinchDistance ? pinchDistance - this.previousPinchDistance : 0;

            this.previousPinchDistance = pinchDistance;

            if (this.canvasState.camera.getMode() == Mode.Viewer) {
                zoom *= this.zoomSpeed;
                this.canvasState.camera.zoom(zoom);
                this.canvasState.sampleCount = 0;
            }
        }
    }

    private moveHandler = (e: MouseEvent) => {
        if (!this.canvasState.canvas || !this.canvasState.scene) {
            return;
        }
        const x = e.clientX;
        const y = e.clientY;

        const xMove = e.movementX * this.movementSpeed;
        const yMove = e.movementY * this.movementSpeed;

        this.insideCanvasMoveHandler(x, y, xMove, yMove);
    }

    private insideCanvasMoveHandler(x: number, y: number, xMove: number, yMove: number) {
        if (!this.canvasState.canvas || !this.canvasState.scene) {
            return;
        }

        const rect = this.canvasState.canvas.getBoundingClientRect();

        const clipX = (x - rect.left) / rect.width * 2 - 1;
        const clipY = (y - rect.top) / rect.height * -2 + 1;

        const start: vec3 = vec3.transformMat4(vec3.create(), vec3.fromValues(clipX, clipY, -1), this.canvasState.viewProjectionInverse);
        const end: vec3 = vec3.transformMat4(vec3.create(), vec3.fromValues(clipX, clipY, 1), this.canvasState.viewProjectionInverse);

        const v: vec3 = vec3.sub(vec3.create(), end, start);
        if (this.canvasState.camera.getMode() == Mode.EditorY ||
            this.canvasState.camera.getMode() == Mode.EditorX ||
            this.canvasState.camera.getMode() == Mode.EditorZ) {

            let currentLayer = 0;
            let t = 0;
            switch (this.canvasState.editorAxis) {
                case Axis.X:
                    currentLayer = (Math.round(this.xLayer) / this.canvasState.divisionFactor) + this.canvasState.upperBackLeft[0];
                    t = (currentLayer - start[0]) / v[0];
                    break;
                case Axis.Y:
                    currentLayer = (Math.round(this.yLayer) / this.canvasState.divisionFactor) + this.canvasState.upperBackLeft[1];
                    t = (currentLayer - start[1]) / v[1];
                    break;
                case Axis.Z:
                    currentLayer = (Math.round(this.zLayer) / this.canvasState.divisionFactor) + this.canvasState.upperBackLeft[2];
                    t = (currentLayer - start[2]) / v[2];
                    break;
            }
            let cursorXWorld = start[0] + t * v[0];
            let cursorYWorld = start[1] + t * v[1];
            let cursorZWorld = start[2] + t * v[2];

            let xIndexNow = Math.floor((cursorXWorld - this.canvasState.upperBackLeft[0]) / this.canvasState.sideLength);
            let yIndexNow = Math.floor((cursorYWorld - this.canvasState.upperBackLeft[1]) / this.canvasState.sideLength);
            let zIndexNow = Math.floor((cursorZWorld - this.canvasState.upperBackLeft[2]) / this.canvasState.sideLength);

            if (xIndexNow != this.xIndex || yIndexNow != this.yIndex || zIndexNow != this.zIndex) {
                if (this.canvasState.editToolMode === EditToolModes.Pencil ||
                    this.canvasState.editToolMode === EditToolModes.EyeDropper) {
                    switch (this.canvasState.editorAxis) {
                        case Axis.X:
                            this.canvasState.renderHoverCube = this.canvasState.scene.setHoverCubePosition(yIndexNow, zIndexNow);
                            break;
                        case Axis.Y:
                            this.canvasState.renderHoverCube = this.canvasState.scene.setHoverCubePosition(xIndexNow, zIndexNow);
                            break;
                        case Axis.Z:
                            this.canvasState.renderHoverCube = this.canvasState.scene.setHoverCubePosition(xIndexNow, yIndexNow);
                            break;
                    }
                }
                this.cubePlacedInCurrentPos = false;
                this.xIndex = xIndexNow;
                this.yIndex = yIndexNow;
                this.zIndex = zIndexNow;
            }

            if ((this.mouseDown || this.singleTouchDown) && !this.cubePlacedInCurrentPos) {
                switch (this.canvasState.editToolMode) {
                    case EditToolModes.Pencil:
                        this.canvasState.scene.addCube(this.xIndex, this.yIndex, this.zIndex);
                        break;
                    case EditToolModes.Eraser:
                        this.canvasState.renderHoverCube = false;
                        this.canvasState.scene.deleteCube(this.xIndex, this.yIndex, this.zIndex);
                        break;
                    case EditToolModes.EyeDropper:
                        this.canvasState.renderHoverCube = false;
                        let newCubeColor = this.canvasState.scene.getCubeColor(this.xIndex, this.yIndex, this.zIndex);
                        let newCubeMaterial = this.canvasState.scene.getCubeMaterial(this.xIndex, this.yIndex, this.zIndex);
                        if (newCubeColor != null) this.canvasState.scene.setHoverCubeColor(newCubeColor);
                        if (newCubeMaterial != null) this.canvasState.tracerMaterial = newCubeMaterial;
                        break;
                    case EditToolModes.Selector:
                        switch (this.canvasState.editorAxis) {
                            case Axis.X:
                                this.canvasState.scene.setSelectorDragEnd(this.yIndex, this.zIndex);
                                break;
                            case Axis.Y:
                                this.canvasState.scene.setSelectorDragEnd(this.xIndex, this.zIndex);
                                break;
                            case Axis.Z:
                                this.canvasState.scene.setSelectorDragEnd(this.xIndex, this.yIndex);
                                break;
                        }
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

            if ((this.mouseDown || this.singleTouchDown)) {
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
        if (this.canvasState.camera.getMode() == Mode.EditorY ||
            this.canvasState.camera.getMode() == Mode.EditorX ||
            this.canvasState.camera.getMode() == Mode.EditorZ) {
            switch (this.canvasState.editToolMode) {
                case EditToolModes.Pencil:
                    this.canvasState.scene.addCube(this.xIndex, this.yIndex, this.zIndex);
                    break;
                case EditToolModes.Eraser:
                    this.canvasState.renderHoverCube = false;
                    this.canvasState.scene.deleteCube(this.xIndex, this.yIndex, this.zIndex);
                    break;
                case EditToolModes.EyeDropper:
                    this.canvasState.renderHoverCube = false;
                    let newCubeColor = this.canvasState.scene.getCubeColor(this.xIndex, this.yIndex, this.zIndex);
                    let newCubeMaterial = this.canvasState.scene.getCubeMaterial(this.xIndex, this.yIndex, this.zIndex);
                    if (newCubeColor != null) this.canvasState.scene.setHoverCubeColor(newCubeColor);
                    if (newCubeMaterial != null) this.canvasState.tracerMaterial = newCubeMaterial;
                    break;
                case EditToolModes.Selector:
                    switch (this.canvasState.editorAxis) {
                        case Axis.X:
                            this.canvasState.scene.setSelectorDragStart(this.yIndex, this.zIndex);
                            this.canvasState.scene.setSelectorDragEnd(this.yIndex, this.zIndex);
                            break;
                        case Axis.Y:
                            this.canvasState.scene.setSelectorDragStart(this.xIndex, this.zIndex);
                            this.canvasState.scene.setSelectorDragEnd(this.xIndex, this.zIndex);
                            break;
                        case Axis.Z:
                            this.canvasState.scene.setSelectorDragStart(this.xIndex, this.yIndex);
                            this.canvasState.scene.setSelectorDragEnd(this.xIndex, this.yIndex);
                            break;
                    }
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
        } else if (this.canvasState.camera.getMode() == Mode.EditorY ||
            this.canvasState.camera.getMode() == Mode.EditorX ||
            this.canvasState.camera.getMode() == Mode.EditorZ) {
            let layerScroll = this.layerScrollSpeed * e.deltaY;
            let prevLayer = 0;
            let currentLayer = 0;
            let x = 0, y = 0, z = 0;
            switch (this.canvasState.editorAxis) {
                case Axis.X:
                    prevLayer = Math.round(this.xLayer);
                    this.xLayer = Math.min(this.canvasState.divisionFactor - 1, Math.max(0, this.xLayer - layerScroll));
                    currentLayer = Math.round(this.xLayer);
                    x = currentLayer / this.canvasState.divisionFactor;
                    break;
                case Axis.Y:
                    prevLayer = Math.round(this.yLayer);
                    this.yLayer = Math.min(this.canvasState.divisionFactor - 1, Math.max(0, this.yLayer - layerScroll));
                    currentLayer = Math.round(this.yLayer);
                    y = currentLayer / this.canvasState.divisionFactor;
                    break;
                case Axis.Z:
                    prevLayer = Math.round(this.zLayer);
                    this.zLayer = Math.min(this.canvasState.divisionFactor - 1, Math.max(0, this.zLayer - layerScroll));
                    currentLayer = Math.round(this.zLayer);
                    z = currentLayer / this.canvasState.divisionFactor;
                    break;
            }
            if (prevLayer != currentLayer) {
                this.canvasState.setLayerLabel(currentLayer + 1);
                this.canvasState.renderHoverCube = false;
                switch (this.canvasState.editorAxis) {
                    case Axis.X:
                        this.canvasState.camera.setEditorRefX(vec3.fromValues(x, y, z));
                        break;
                    case Axis.Y:
                        this.canvasState.camera.setEditorRefY(vec3.fromValues(x, y, z));
                        break;
                    case Axis.Z:
                        this.canvasState.camera.setEditorRefZ(vec3.fromValues(x, y, z));
                        break;
                }
                this.canvasState.transitioning = true;
                this.canvasState.transitionTime = 0;
                this.canvasState.scene.setCubeLayer(currentLayer);
                this.canvasState.scene.unsetSelector();
            }
        }
    }

    public increaseCurrentLayer = (decrement = false) => {
        if (!this.canvasState.scene) {
            return;
        }
        let currentLayer = 0;
        const incrementor = decrement ? -1 : 1;
        switch (this.canvasState.editorAxis) {
            case Axis.X:
                this.xLayer = Math.max(0, Math.min(this.xLayer + incrementor, this.canvasState.divisionFactor - 1));
                currentLayer = Math.round(this.xLayer);
                let x = currentLayer / this.canvasState.divisionFactor;
                this.canvasState.camera.setEditorRefX(vec3.fromValues(x, 0, 0));
                break;
            case Axis.Y:
                this.yLayer = Math.max(0, Math.min(this.yLayer + incrementor, this.canvasState.divisionFactor - 1));
                currentLayer = Math.round(this.yLayer);
                let y = currentLayer / this.canvasState.divisionFactor;
                this.canvasState.camera.setEditorRefY(vec3.fromValues(0, y, 0));
                break;
            case Axis.Z:
                this.zLayer = Math.max(0, Math.min(this.zLayer + incrementor, this.canvasState.divisionFactor - 1));
                currentLayer = Math.round(this.zLayer);
                let z = currentLayer / this.canvasState.divisionFactor;
                this.canvasState.camera.setEditorRefZ(vec3.fromValues(0, 0, z));
                break;
        }
        this.canvasState.setLayerLabel(currentLayer + 1);
        this.canvasState.renderHoverCube = false;
        this.canvasState.transitioning = true;
        this.canvasState.transitionTime = 0;
        this.canvasState.scene.setCubeLayer(currentLayer);
        this.canvasState.scene.unsetSelector();
    }

    public toggleToEditor = () => {
        if (!this.canvasState.scene) {
            return;
        }
        let currentLayer = 0;
        switch (this.canvasState.editorAxis) {
            case Axis.X:
                currentLayer = Math.round(this.xLayer);
                break;
            case Axis.Y:
                currentLayer = Math.round(this.yLayer);
                break;
            case Axis.Z:
                currentLayer = Math.round(this.zLayer);
                break;
        }
        this.canvasState.scene.setCubeLayer(currentLayer);
        this.canvasState.setLayerLabel(currentLayer + 1);
        this.canvasState.renderHoverCube = false;
        this.canvasState.transitioning = true;
        this.canvasState.transitionTime = 0;
        this.canvasState.camera.changeToEditor(this.canvasState.editorAxis);
        this.canvasState.scene.updateEditorAxis();
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
        let viewerRefY = (yRange[0] + yRange[1]) / (2 * this.canvasState.divisionFactor) +
            this.canvasState.upperBackLeft[1];
        this.canvasState.camera.setViewerRef(vec3.fromValues(0, viewerRefY, 0));
        this.canvasState.camera.changeToViewer();
        this.canvasState.scene.cubeSpace.populateTexture();
        this.canvasState.setLayerVisible(false);
    }
}