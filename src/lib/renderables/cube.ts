import Mesh from "@/lib/renderables/mesh";

export default class Cube extends Mesh {

    constructor(sideLength = 1.0) {
        super();
        this.vertices = [
            // Bottom face
            0.0, 0.0, 0.0,
            sideLength, 0.0, 0.0,
            sideLength, 0.0, sideLength,
            sideLength, 0.0, sideLength,
            0.0, 0.0, sideLength,
            0.0, 0.0, 0.0,

            // Top face
            0.0, sideLength, 0.0,
            sideLength, sideLength, 0.0,
            sideLength, sideLength, sideLength,
            sideLength, sideLength, sideLength,
            0.0, sideLength, sideLength,
            0.0, sideLength, 0.0,

            // Left face
            0.0, 0.0, 0.0,
            0.0, sideLength, 0.0,
            0.0, sideLength, sideLength,
            0.0, sideLength, sideLength,
            0.0, 0.0, sideLength,
            0.0, 0.0, 0.0,

            // Right face
            sideLength, 0.0, 0.0,
            sideLength, sideLength, 0.0,
            sideLength, sideLength, sideLength,
            sideLength, sideLength, sideLength,
            sideLength, 0.0, sideLength,
            sideLength, 0.0, 0.0,

            // Back face
            0.0, 0.0, 0.0,
            sideLength, 0.0, 0.0,
            sideLength, sideLength, 0.0,
            sideLength, sideLength, 0.0,
            0.0, sideLength, 0.0,
            0.0, 0.0, 0.0,

            // Front face
            0.0, 0.0, sideLength,
            sideLength, 0.0, sideLength,
            sideLength, sideLength, sideLength,
            sideLength, sideLength, sideLength,
            0.0, sideLength, sideLength,
            0.0, 0.0, sideLength,
        ];
    }
}