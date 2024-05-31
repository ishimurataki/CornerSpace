import Mesh from "@/lib/renderables/mesh";

export default class Square extends Mesh {
    constructor(sideLength = 1.0) {
        // super();
        // let p0 = sideLength * 0.2;
        // let p1 = sideLength * 0.8;
        // this.vertices = [
        //     p0, p0, p0,
        //     p1, p0, p0,
        //     p1, p0, p1,
        //     p0, p0, p1
        // ];
        super();
        let x = sideLength / 2;
        this.vertices = [
            x, 0, x,
            x, 0, -x,
            -x, 0, -x,
            -x, 0, x
        ];
    }
}