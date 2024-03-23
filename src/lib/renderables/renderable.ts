import { TracerMaterial } from "@/app/create/canvas-state";
import Mesh from "@/lib/renderables/mesh";

export default class Renderable {
    mesh: Mesh;
    color: vec3;
    material: TracerMaterial;
    modelMatrix: mat4;


    constructor(mesh: Mesh, color: vec3, modelMatrix: mat4, material = TracerMaterial.Diffuse) {
        this.mesh = mesh;
        this.color = color;
        this.material = material;
        this.modelMatrix = modelMatrix;
    }

    setModelMatrix(modelMatrix: mat4): void {
        this.modelMatrix = modelMatrix;
    }
}