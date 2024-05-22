export default class Mesh {
    vertices: number[] = [];
    positionBuffer: WebGLBuffer | null = null;
    drawingMode: number = 0;
    gl: WebGLRenderingContext | null = null;

    constructor() {
    }

    bindToGLContext(glContext: WebGLRenderingContext) {
        this.gl = glContext;
        this.positionBuffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.positionBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(this.vertices), glContext.STATIC_DRAW);
        this.drawingMode = glContext.TRIANGLE_FAN;
    }

    setDrawingMode(drawingMode: number) {
        this.drawingMode = drawingMode;
    }
}