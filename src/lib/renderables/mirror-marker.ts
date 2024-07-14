import Mesh from "@/lib/renderables/mesh";
import { vec3 } from "@/lib/gl-matrix/index";

export default class MirrorMarker extends Mesh {
    color = vec3.fromValues(1, 1, 1);

    constructor(sideLength: number) {
        super();
        let y = sideLength * 1.02;
        this.vertices = [
            0.0, y, 0.0,
            sideLength / 2.0, y, 0.0,
            sideLength, y, sideLength,
            sideLength, y, sideLength,
            sideLength / 2.0, y, 0.0,
            sideLength, y, sideLength / 2.0,

            y, 0.0, 0.0,
            y, sideLength / 2.0, 0.0,
            y, sideLength, sideLength,
            y, sideLength, sideLength,
            y, sideLength / 2.0, 0.0,
            y, sideLength, sideLength / 2.0,

            0.0, 0.0, y,
            sideLength / 2.0, 0.0, y,
            sideLength, sideLength, y,
            sideLength, sideLength, y,
            sideLength / 2.0, 0.0, y,
            sideLength, sideLength / 2.0, y
        ];
    }
}