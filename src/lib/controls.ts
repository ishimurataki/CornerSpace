import CanvasState, { TracerMaterial, EditToolModes } from "@/app/create/canvas-state";
import { vec3 } from "@/lib/gl-matrix/index";
import { Mode } from "@/lib/polar-camera"

export default class Controls {

    private mouseDown: boolean = false;
    private moveSun: boolean = false;
    private cubePlacedInCurrentPos: boolean = false;
    private xIndex: number = -1;
    private zIndex: number = -1;
    private layer: number = 0;
    private movementSpeed: number = 0.01;
    private zoomSpeed: number = -0.008;
    private layerScrollSpeed: number = 0.005;

    constructor() {
    }

    registerControls() {
        CanvasState.canvas.addEventListener('mousemove', this.moveHandler, false);
        CanvasState.canvas.addEventListener('mousedown', this.mouseDownHandler, false);
        CanvasState.canvas.addEventListener('mouseup', this.mouseUpHandler, false);
        CanvasState.canvas.addEventListener('wheel', this.mousewheelHandler, false);
        document.getElementById("downloadButton")?.addEventListener('click', this.downloadButtonClickHandler, false);
        document.getElementById("toggleSunButton")?.addEventListener('click', this.toggleSunButtonClickHandler, false);
        document.getElementById("closeEditorButton")?.addEventListener('click', this.closeEditorButtonClickHandler, false);
        document.getElementById("openEditorButton")?.addEventListener('click', this.openEditorButtonClickHanlder, false);
        document.getElementById("modelLoadButton")?.addEventListener('click', this.modelLoadButtonClickHandler, false);
        document.getElementById("tracerMaterial")?.addEventListener('change', this.tracerMaterialChangeHandler, false);
    }

    private moveHandler = (e: MouseEvent) => {
        const rect = CanvasState.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const clipX = x / rect.width * 2 - 1;
        const clipY = y / rect.height * -2 + 1;

        const start: vec3 = vec3.transformMat4(vec3.create(), vec3.fromValues(clipX, clipY, -1), CanvasState.viewProjectionInverse);
        const end: vec3 = vec3.transformMat4(vec3.create(), vec3.fromValues(clipX, clipY, 1), CanvasState.viewProjectionInverse);

        const v: vec3 = vec3.sub(vec3.create(), end, start);
        if (CanvasState.camera.getMode() == Mode.Editor) {

            let currentLayerY = Math.round(this.layer) / CanvasState.divisionFactor;
            let t = (currentLayerY - start[1]) / v[1];

            let cursorXWorld = start[0] + t * v[0];
            let cursorZWorld = start[2] + t * v[2];

            let xIndexNow = Math.floor((cursorXWorld - CanvasState.upperLeft[0]) / CanvasState.sideLength);
            let zIndexNow = Math.floor((cursorZWorld - CanvasState.upperLeft[1]) / CanvasState.sideLength);

            if (xIndexNow != this.xIndex || zIndexNow != this.zIndex) {
                CanvasState.renderHoverCube = CanvasState.scene.setHoverCubePosition(xIndexNow, zIndexNow);
                this.cubePlacedInCurrentPos = false;
                this.xIndex = xIndexNow;
                this.zIndex = zIndexNow;
            }
            if (this.mouseDown && !this.cubePlacedInCurrentPos) {
                switch (CanvasState.editToolMode) {
                    case EditToolModes.Pencil:
                        CanvasState.scene.addCube(this.xIndex, this.zIndex);
                        break;
                    case EditToolModes.Eraser:
                        CanvasState.renderHoverCube = false;
                        CanvasState.scene.deleteCube(this.xIndex, this.zIndex);
                        break;
                    case EditToolModes.EyeDropper:
                        CanvasState.renderHoverCube = false;
                        let newCubeColor = CanvasState.scene.getCubeColor(this.xIndex, this.zIndex);
                        let newCubeMaterial = CanvasState.scene.getCubeMaterial(this.xIndex, this.zIndex);
                        if (newCubeColor != null) CanvasState.scene.setHoverCubeColor(newCubeColor);
                        if (newCubeMaterial != null) CanvasState.tracerMaterial = newCubeMaterial;
                        break;
                }
                this.cubePlacedInCurrentPos = true;
            }
        } else if (CanvasState.camera.getMode() == Mode.Viewer) {
            // Detect if curser is over sun box
            let sunHit = false;
            for (let i = 0; i < 3; i++) {
                let t = (CanvasState.scene.sunCorner[i] - start[i]) / v[i];
                let dim1 = (i + 1) % 3;
                let dim2 = (i + 2) % 3;
                let dim1Value = start[dim1] + t * v[dim1];
                let dim2Value = start[dim2] + t * v[dim2];
                let dim1FromSun = dim1Value - CanvasState.scene.sunCorner[dim1];
                let dim2FromSun = dim2Value - CanvasState.scene.sunCorner[dim2];
                if (dim1FromSun >= 0 && dim1FromSun <= CanvasState.sideLength
                    && dim2FromSun >= 0 && dim2FromSun <= CanvasState.sideLength) {
                    sunHit = true;
                    break;
                }
                t = (CanvasState.scene.sunCorner[i] + CanvasState.sideLength - start[i]) / v[i];
                dim1Value = start[dim1] + t * v[dim1];
                dim2Value = start[dim2] + t * v[dim2];
                dim1FromSun = dim1Value - CanvasState.scene.sunCorner[dim1];
                dim2FromSun = dim2Value - CanvasState.scene.sunCorner[dim2];
                if (dim1FromSun >= 0 && dim1FromSun <= CanvasState.sideLength
                    && dim2FromSun >= 0 && dim2FromSun <= CanvasState.sideLength) {
                    sunHit = true;
                    break;
                }
            }
            CanvasState.renderSunSelection = sunHit;

            if (this.mouseDown) {
                let xMove = e.movementX * this.movementSpeed;
                let yMove = e.movementY * this.movementSpeed;
                if (sunHit) {
                    this.moveSun = true;
                }
                if (this.moveSun) {
                    let a = vec3.sub(vec3.create(), CanvasState.scene.sunCenter, CanvasState.camera.getPosition());
                    let b = vec3.sub(vec3.create(), CanvasState.camera.ref, CanvasState.camera.getPosition());
                    let projection = vec3.dot(a, b) / Math.pow(vec3.length(b), 2);
                    let passThroughPoint = vec3.add(vec3.create(), CanvasState.camera.getPosition(), vec3.scale(vec3.create(), b, projection));

                    let tNumerator = (b[0] * (start[0] - passThroughPoint[0])) +
                        (b[1] * (start[1] - passThroughPoint[1])) +
                        (b[2] * (start[2] - passThroughPoint[2]));
                    let tDenominator = (-b[0] * v[0]) - (b[1] * v[1]) - (b[2] * v[2]);
                    let tNew = tNumerator / tDenominator;
                    let sunPosition = vec3.add(vec3.create(), start, vec3.scale(vec3.create(), v, tNew));
                    CanvasState.scene.setSunCenter(sunPosition);
                } else {
                    CanvasState.camera.rotateTheta(xMove);
                    CanvasState.camera.rotatePhi(yMove);
                }
                CanvasState.sampleCount = 0;
            }
        }
    }

    private mouseDownHandler = (e: MouseEvent) => {
        switch (e.button) {
            case 0:
                this.mouseDown = true;
                break;
        }
        if (CanvasState.camera.getMode() == Mode.Editor) {
            switch (CanvasState.editToolMode) {
                case EditToolModes.Pencil:
                    CanvasState.scene.addCube(this.xIndex, this.zIndex);
                    break;
                case EditToolModes.Eraser:
                    CanvasState.renderHoverCube = false;
                    CanvasState.scene.deleteCube(this.xIndex, this.zIndex);
                    break;
                case EditToolModes.EyeDropper:
                    CanvasState.renderHoverCube = false;
                    let newCubeColor = CanvasState.scene.getCubeColor(this.xIndex, this.zIndex);
                    let newCubeMaterial = CanvasState.scene.getCubeMaterial(this.xIndex, this.zIndex);
                    if (newCubeColor != null) CanvasState.scene.setHoverCubeColor(newCubeColor);
                    if (newCubeMaterial != null) CanvasState.tracerMaterial = newCubeMaterial;
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
        e.preventDefault();
        if (CanvasState.camera.getMode() == Mode.Viewer) {
            let zoom = this.zoomSpeed * e.deltaY;
            CanvasState.camera.zoom(zoom);
            CanvasState.sampleCount = 0;
        } else if (CanvasState.camera.getMode() == Mode.Editor) {
            let prevLayer = Math.round(this.layer);
            let layerScroll = this.layerScrollSpeed * e.deltaY;
            this.layer = Math.min(CanvasState.divisionFactor - 1, Math.max(0, this.layer - layerScroll));
            let currentLayer = Math.round(this.layer);
            if (prevLayer != currentLayer) {
                let layerLabel = document.getElementById("layerLabel");
                if (layerLabel != null) {
                    layerLabel.innerHTML = currentLayer.toString();
                }
                CanvasState.renderHoverCube = false;
                console.log("Setting layer to: " + currentLayer);
                CanvasState.camera.setEditorRef(vec3.fromValues(0.0, currentLayer / CanvasState.divisionFactor, 0.0));
                CanvasState.transitioning = true;
                CanvasState.transitionTime = 0;
                CanvasState.scene.setCubeLayer(currentLayer);
            }
        }
    }

    public toggleToEditor = () => {
        CanvasState.renderHoverCube = false;
        CanvasState.transitioning = true;
        CanvasState.transitionTime = 0;
        CanvasState.camera.changeToEditor();
    }

    public toggleToViewer = () => {
        CanvasState.renderHoverCube = false;
        CanvasState.transitioning = true;
        CanvasState.transitionTime = 0;
        let yRange: vec2 = CanvasState.scene.cubeSpace.populateBuffers();
        let viewerRefY = (yRange[0] + yRange[1]) / (2 * CanvasState.divisionFactor);
        CanvasState.camera.setViewerRef(vec3.fromValues(0, viewerRefY, 0));
        CanvasState.camera.changeToViewer();
        CanvasState.scene.cubeSpace.populateTexture();
    }

    private downloadButtonClickHandler = () => {
        let cubeSpaceString = JSON.stringify(CanvasState.scene.cubeSpace.cubeColorSpace);
        const file = new File([cubeSpaceString], 'voxel_design.txt', {
            type: 'text/plain',
        });

        const link = document.createElement('a');
        const url = URL.createObjectURL(file);

        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    private toggleSunButtonClickHandler = () => {
        CanvasState.scene.toggleSun();
        let toggleSunButton = document.getElementById("toggleSunButton");
        if (toggleSunButton != null) {
            toggleSunButton.innerHTML = (CanvasState.scene.sunOn) ? "Turn Off" : "Turn On"
        }
    }

    private closeEditorButtonClickHandler = () => {
        let editorPaneElement = document.getElementById("editorPane");
        if (editorPaneElement != null) {
            editorPaneElement.style.display = "none";
        }
    }

    private openEditorButtonClickHanlder = () => {
        let editorPaneElement = document.getElementById("editorPane");
        if (editorPaneElement != null) {
            editorPaneElement.style.display = "block";
        }
    }

    private modelLoadButtonClickHandler = () => {
        let selectElement = document.getElementById("models");
        if (selectElement != null) {
            let modelName = (selectElement as HTMLSelectElement).value;
            fetch("/models/" + modelName)
                .then((res) => {
                    return res.text();
                })
                .then((text) => {
                    let model: (vec3 | undefined)[] = JSON.parse(text);
                    CanvasState.scene.cubeSpace.setCubeSpace(model);
                    this.toggleToViewer();
                    CanvasState.scene.setCubeLayer(Math.round(this.layer));
                })
                .catch((e) => console.error(e));
        }
    }

    private tracerMaterialChangeHandler = () => {
        let selectElement = document.getElementById("tracerMaterial");
        if (selectElement != null) {
            let materialName = (selectElement as HTMLSelectElement).value;
            if (materialName == "diffuse") {
                CanvasState.tracerMaterial = TracerMaterial.Diffuse;
            } else if (materialName == "mirror") {
                CanvasState.tracerMaterial = TracerMaterial.Mirror;
            }
        }
        CanvasState.sampleCount = 0;
    }
}