export default class Mesh {
    vertices: number[] = [];
    positionBuffer: WebGLBuffer | null = null;
    drawingMode: number = 0;

    constructor() {
    }
}