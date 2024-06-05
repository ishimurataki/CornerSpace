import { vec3, vec4, mat4 } from "@/lib/gl-matrix/index";

export enum Axis {
    X,
    Y,
    Z
}

enum Mode {
    EditorY,
    EditorX,
    EditorZ,
    Viewer
}

class PolarCamera {
    fovy: number = 45.0 * Math.PI / 180;
    width: number;
    height: number;
    nearClip: number = 0.1;
    farClip: number = 100;

    eye: vec3 = vec3.fromValues(0.0, 1.0, 0.0);
    ref: vec3 = vec3.fromValues(0.0, 0.0, 0.0);
    up: vec3 = vec3.fromValues(0.0, 1.0, 0.0);

    theta: number = 0;                // theta ranges from 0 to 2pi
    phi: number = 0.5 * Math.PI;   // phi ranges from 0 to pi
    r: number = 1.0;

    private mode: Mode = Mode.EditorY;

    private editorR: number = 1.0;

    private editorRefY = vec3.fromValues(0.0, 0.0, 0.0);
    private readonly EDITOR_THETA_Y: number = 0;
    private readonly EDITOR_PHI_Y: number = 0.499 * Math.PI;

    private editorRefX = vec3.fromValues(0.0, 0.0, 0.0);
    private readonly EDITOR_THETA_X: number = 0;
    private readonly EDITOR_PHI_X: number = 0;

    private editorRefZ = vec3.fromValues(0.0, 0.0, 0.0);
    private readonly EDITOR_THETA_Z: number = 0.5 * Math.PI;
    private readonly EDITOR_PHI_Z: number = 0;

    private viewerRef = vec3.fromValues(0.0, 0.0, 0.0);
    private viewerTheta: number = 0.25 * Math.PI;
    private viewerPhi: number = 0.15 * Math.PI;
    private viewerR: number = 1.5;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    changeWidthHeight(w: number, h: number): void {
        console.log("width: " + w + " height: " + h);
        this.width = w;
        this.height = h;

        if (this.width > this.height) {
            this.editorR = 1.0;
        } else {
            this.editorR = this.height / this.width;
        }
        if (this.mode != Mode.Viewer) {
            this.r = this.editorR;
        }
    }

    getPosition(): vec3 {
        return this.eye;
    }

    setRef(r: vec3) {
        this.ref = r;
    }

    getViewMatrix(): mat4 {
        let viewMatrix = mat4.create();
        let viewMatrixInverse = mat4.create();
        let t = this.r * Math.cos(this.phi);

        this.eye[0] = t * Math.cos(this.theta) + this.ref[0];
        this.eye[1] = this.r * Math.sin(this.phi) + this.ref[1];
        this.eye[2] = t * Math.sin(this.theta) + this.ref[2];

        mat4.targetTo(viewMatrix, this.eye, this.ref, this.up);
        mat4.invert(viewMatrixInverse, viewMatrix);
        return viewMatrixInverse;
    }

    getProjMatrix(): mat4 {
        let projMatrix = mat4.create();
        mat4.perspective(projMatrix, this.fovy,
            this.width / this.height,
            this.nearClip, this.farClip);
        return projMatrix;
    }

    getViewProj(): mat4 {
        let projMatrix = this.getProjMatrix();
        let viewMatrix = this.getViewMatrix();
        let viewProjMatrix = mat4.create();

        mat4.multiply(viewProjMatrix, projMatrix, viewMatrix);
        return viewProjMatrix;
    }

    rotateTheta(rad: number): void {
        if (this.mode == Mode.Viewer) {
            this.theta += rad;
            this.theta %= 2 * Math.PI;
            this.viewerTheta = this.theta;
        }
    }

    rotatePhi(rad: number): void {
        if (this.mode == Mode.Viewer) {
            this.phi += rad;
            if (this.phi > (1 / 2) * Math.PI - 0.01) this.phi = (1 / 2) * Math.PI - 0.01;
            if (this.phi < (-1 / 2) * Math.PI + 0.01) this.phi = (-1 / 2) * Math.PI + 0.01;
            this.viewerPhi = this.phi;
        }
    }

    zoom(amt: number): void {
        if (this.mode == Mode.Viewer) {
            this.r += amt * this.r * 0.1;
            this.viewerR = this.r;
        }
    }

    reset(): void {
        this.theta = 0;
        this.phi = (1 / 2) * Math.PI;
        this.r = 50;

        this.ref = vec3.fromValues(0.0, 0.0, 0.0);
        this.up = vec3.fromValues(0.0, 1.0, 0.0);
    }

    debug(): void {
        console.log('Eye: ' + this.eye);
        console.log('Up: ' + this.up);
        console.log('Ref: ' + this.ref);
        console.log('Theta: ' + this.theta);
        console.log('Phi: ' + this.phi);
        console.log('R: ' + this.r);
    }

    getMode(): Mode {
        return this.mode;
    }

    changeToViewer(): void {
        this.mode = Mode.Viewer;
    }

    changeToEditor(axis: Axis) {
        switch (axis) {
            case Axis.X:
                this.mode = Mode.EditorX;
                break;
            case Axis.Y:
                this.mode = Mode.EditorY;
                break;
            case Axis.Z:
                this.mode = Mode.EditorZ;
                break;
        }
    }

    setEditorRefY(ref: vec3): void {
        this.editorRefY = ref;
    }

    setEditorRefX(ref: vec3): void {
        this.editorRefX = ref;
    }

    setEditorRefZ(ref: vec3): void {
        this.editorRefZ = ref;
    }

    setViewerRef(ref: vec3): void {
        this.viewerRef = ref;
    }

    transition(a: number): void {
        a = Math.min(1, Math.max(0, a));
        let refDesired: vec3 = this.viewerRef;
        let rDesired: number = this.editorR;
        let thetaDesired: number = 0;
        let phiDesired: number = 0;
        if (this.mode == Mode.EditorY) {
            refDesired = this.editorRefY;
            thetaDesired = this.EDITOR_THETA_Y;
            phiDesired = this.EDITOR_PHI_Y;
        } else if (this.mode == Mode.EditorX) {
            refDesired = this.editorRefX;
            thetaDesired = this.EDITOR_THETA_X;
            phiDesired = this.EDITOR_PHI_X;
        } else if (this.mode == Mode.EditorZ) {
            refDesired = this.editorRefZ;
            thetaDesired = this.EDITOR_THETA_Z;
            phiDesired = this.EDITOR_PHI_Z;
        } else if (this.mode == Mode.Viewer) {
            refDesired = this.viewerRef;
            rDesired = this.viewerR;
            thetaDesired = this.viewerTheta;
            phiDesired = this.viewerPhi;
        }
        let x = vec3.scale(vec3.create(), this.ref, (1 - a));
        let y = vec3.scale(vec3.create(), refDesired, a);
        this.setRef(vec3.add(vec3.create(), x, y));
        this.r = this.r * (1 - a) + rDesired * a;
        this.theta = this.theta * (1 - a) + thetaDesired * a;
        this.phi = this.phi * (1 - a) + phiDesired * a;
    }
}

export { Mode, PolarCamera };