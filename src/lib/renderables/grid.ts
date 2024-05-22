import Mesh from "@/lib/renderables/mesh";
import { vec3 } from "@/lib/gl-matrix/index";

export default class Grid extends Mesh {
    divisionFactor = 0;
    color = vec3.fromValues(1, 1, 1);

    constructor(divisionFactor: number) {
        super();
        this.divisionFactor = divisionFactor;
        for (let i = 0; i <= divisionFactor; i++) {
            let delta = i / divisionFactor;
            this.vertices.push(0.0, -0.001, delta);
            this.vertices.push(1.0, -0.001, delta);

            this.vertices.push(delta, -0.001, 1.0);
            this.vertices.push(delta, -0.001, 0.0);
        }

        let sideLength = 1 / divisionFactor;
        for (let i = 0; i <= divisionFactor; i++) {
            let delta = i / divisionFactor;
            this.vertices.push(0.0, sideLength + 0.001, delta);
            this.vertices.push(1.0, sideLength + 0.001, delta);

            this.vertices.push(delta, sideLength + 0.001, 1.0);
            this.vertices.push(delta, sideLength + 0.001, 0.0);
        }
    }
}