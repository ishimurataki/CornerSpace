import Mesh from "@/lib/renderables/mesh";
import { vec3 } from "@/lib/gl-matrix/index";

export default class MirrorMarker extends Mesh {
    color = vec3.fromValues(1, 1, 1);

    constructor(glContext: WebGLRenderingContext, sideLength: number) {
        super();
        let y = sideLength * 1.1;
        this.vertices = [
            0.0, y, 0.0,
            sideLength / 2.0, y, 0.0,
            sideLength, y, sideLength,
            sideLength, y, sideLength,
            sideLength / 2.0, y, 0.0,
            sideLength, y, sideLength / 2.0
        ];
        this.positionBuffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.positionBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(this.vertices), glContext.STATIC_DRAW);
        this.drawingMode = glContext.TRIANGLES
    }
}