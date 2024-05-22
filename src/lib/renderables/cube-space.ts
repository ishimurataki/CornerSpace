import { vec2 } from "@/lib/gl-matrix/index";
import { TracerMaterial } from "@/app/create/canvas-state";
import { Voxel } from "@/backend-lib/data";

export default class CubeSpace {
    readonly cubeColorSpace: (vec3 | undefined)[];
    readonly cubeMaterialSpace: number[];
    cubeSpacePositionBuffer: WebGLBuffer | null = null;
    cubeSpaceNormalBuffer: WebGLBuffer | null = null;
    cubeSpaceColorBuffer: WebGLBuffer | null = null;
    cubeSpaceMaterialBuffer: WebGLBuffer | null = null;
    cubeSpaceNumberOfVertices: number = 0;
    divisionFactor: number;
    cubeSideLength: number;
    upperLeft: vec2;
    gl: WebGLRenderingContext | null = null;

    cubeColorSpaceTextureData: number[] = [];
    cubeColorSpaceTexture: WebGLTexture | null = null;
    cubeMaterialSpaceTexture: WebGLTexture | null = null;

    constructor(divisionFactor: number, upperLeft: vec2) {
        this.cubeColorSpace = new Array<vec3>(Math.pow(divisionFactor, 3));
        this.cubeColorSpace.fill(undefined);
        this.cubeMaterialSpace = new Array<TracerMaterial>(Math.pow(divisionFactor, 3));
        this.cubeMaterialSpace.fill(0);

        this.divisionFactor = divisionFactor;
        this.cubeSideLength = 1 / this.divisionFactor;
        this.upperLeft = upperLeft;

        this.cubeColorSpaceTextureData = new Array<number>(4 * Math.pow(divisionFactor, 3));
        this.cubeColorSpaceTextureData.fill(0);
    }

    bindToGLContext(gl: WebGLRenderingContext) {
        this.gl = gl;
    }

    private getCubeIndex(x: number, y: number, z: number): number {
        return (y * Math.pow(this.divisionFactor, 2)) + (x * this.divisionFactor) + z;
    }

    setCube(x: number, y: number, z: number, color: vec3, material: TracerMaterial): void {
        let cubeIndex = this.getCubeIndex(x, y, z);
        this.cubeColorSpace[cubeIndex] = color;
        this.cubeMaterialSpace[cubeIndex] = material;
        this.cubeColorSpaceTextureData[4 * cubeIndex] = 255 * color[0];
        this.cubeColorSpaceTextureData[4 * cubeIndex + 1] = 255 * color[1];
        this.cubeColorSpaceTextureData[4 * cubeIndex + 2] = 255 * color[2];
        this.cubeColorSpaceTextureData[4 * cubeIndex + 3] = 255;
    }

    deleteCube(x: number, y: number, z: number): void {
        let cubeIndex = this.getCubeIndex(x, y, z);
        this.cubeColorSpace[cubeIndex] = undefined;
        this.cubeMaterialSpace[cubeIndex] = 0;
        this.cubeColorSpaceTextureData[4 * cubeIndex + 3] = 0;
    }

    setCubeSpace(cubeSpace: (vec3 | undefined)[]) {
        for (let y = 0; y < this.divisionFactor; y++) {
            let yIndex = y * Math.pow(this.divisionFactor, 2);
            for (let x = 0; x < this.divisionFactor; x++) {
                let xIndex = x * this.divisionFactor;
                for (let z = 0; z < this.divisionFactor; z++) {
                    let cubeIndex = yIndex + xIndex + z;
                    let color = cubeSpace[cubeIndex];
                    this.cubeColorSpace[cubeIndex] = color;
                    if (color != undefined) {
                        this.cubeColorSpaceTextureData[4 * cubeIndex] = 255 * color[0];
                        this.cubeColorSpaceTextureData[4 * cubeIndex + 1] = 255 * color[1];
                        this.cubeColorSpaceTextureData[4 * cubeIndex + 2] = 255 * color[2];
                        this.cubeColorSpaceTextureData[4 * cubeIndex + 3] = 255;
                    } else {
                        this.cubeColorSpaceTextureData[4 * cubeIndex + 3] = 0;
                    }
                }
            }
        }
    }

    populateBuffers(): vec2 {
        if (!this.gl) {
            throw new Error("No GL context bound.");
        }

        let vertices = [];
        let normals = [];
        let colors = [];
        let materials = [];
        let xStart = this.upperLeft[0];
        let zStart = this.upperLeft[1];
        let yMin = Number.MAX_SAFE_INTEGER;
        let yMax = -1;
        for (let y = 0; y < this.divisionFactor; y++) {
            let yPad = this.divisionFactor * this.divisionFactor * y;
            let yPadBelow = this.divisionFactor * this.divisionFactor * (y - 1);
            let yWorldSpace = y * this.cubeSideLength;
            let yNextWorldSpace = (y + 1) * this.cubeSideLength;
            for (let x = 0; x < this.divisionFactor; x++) {
                let xPad = this.divisionFactor * x;
                let xPadLeft = this.divisionFactor * (x - 1);
                let xWorldSpace = xStart + x * this.cubeSideLength;
                let xNextWorldSpace = xStart + (x + 1) * this.cubeSideLength;
                for (let z = 0; z < this.divisionFactor; z++) {
                    let zWorldSpace = zStart + z * this.cubeSideLength;
                    let zNextWorldSpace = zStart + (z + 1) * this.cubeSideLength;
                    let cubeColor = this.cubeColorSpace[yPad + xPad + z];
                    let cubeMaterial = this.cubeMaterialSpace[yPad + xPad + z];

                    // Bottom faces
                    let renderBottomFace = false;
                    let renderBottomColor = cubeColor;
                    let renderBottomMaterial = cubeMaterial;
                    if (y == 0) {
                        renderBottomFace = cubeColor != undefined;
                    } else {
                        let cubeBelowColor = this.cubeColorSpace[yPadBelow + xPad + z];
                        if (cubeColor != undefined && cubeBelowColor == undefined) {
                            renderBottomFace = true;
                            renderBottomColor = cubeColor;
                        } else if (cubeColor == undefined && cubeBelowColor != undefined) {
                            renderBottomFace = true;
                            renderBottomColor = cubeBelowColor;
                            renderBottomMaterial = this.cubeMaterialSpace[yPadBelow + xPad + z];
                        }
                    }
                    if (renderBottomFace && renderBottomColor != undefined) {
                        vertices.push(
                            xWorldSpace, yWorldSpace, zWorldSpace,
                            xWorldSpace, yWorldSpace, zNextWorldSpace,
                            xNextWorldSpace, yWorldSpace, zNextWorldSpace,
                            xNextWorldSpace, yWorldSpace, zNextWorldSpace,
                            xNextWorldSpace, yWorldSpace, zWorldSpace,
                            xWorldSpace, yWorldSpace, zWorldSpace
                        );
                        let normal = (cubeColor != undefined) ? -1.0 : 1.0;
                        for (let i = 0; i < 6; i++) {
                            colors.push(renderBottomColor[0], renderBottomColor[1], renderBottomColor[2]);
                            normals.push(0.0, normal, 0.0);
                            materials.push(renderBottomMaterial);
                        }
                    }

                    // Left faces
                    let renderLeftFace = false;
                    let renderLeftColor = cubeColor;
                    let renderLeftMaterial = cubeMaterial;
                    if (x == 0) {
                        renderLeftFace = cubeColor != undefined;
                    } else {
                        let cubeLeftColor = this.cubeColorSpace[yPad + xPadLeft + z];
                        if (cubeColor != undefined && cubeLeftColor == undefined) {
                            renderLeftFace = true;
                            renderLeftColor = cubeColor;
                        } else if (cubeColor == undefined && cubeLeftColor != undefined) {
                            renderLeftFace = true;
                            renderLeftColor = cubeLeftColor;
                            renderLeftMaterial = this.cubeMaterialSpace[yPad + xPadLeft + z];
                        }
                    }
                    if (renderLeftFace && renderLeftColor != undefined) {
                        vertices.push(
                            xWorldSpace, yWorldSpace, zWorldSpace,
                            xWorldSpace, yWorldSpace, zNextWorldSpace,
                            xWorldSpace, yNextWorldSpace, zNextWorldSpace,
                            xWorldSpace, yNextWorldSpace, zNextWorldSpace,
                            xWorldSpace, yNextWorldSpace, zWorldSpace,
                            xWorldSpace, yWorldSpace, zWorldSpace
                        );
                        let normal = (cubeColor != undefined) ? -1.0 : 1.0;
                        for (let i = 0; i < 6; i++) {
                            colors.push(renderLeftColor[0], renderLeftColor[1], renderLeftColor[2]);
                            normals.push(normal, 0.0, 0.0);
                            materials.push(renderLeftMaterial);
                        }
                    }

                    // Front faces
                    let renderFrontFace = false;
                    let renderFrontColor = cubeColor;
                    let renderFrontMaterial = cubeMaterial;
                    if (z == 0) {
                        renderFrontFace = cubeColor != undefined;
                    } else {
                        let cubeFrontColor = this.cubeColorSpace[yPad + xPad + z - 1];
                        if (cubeColor != undefined && cubeFrontColor == undefined) {
                            renderFrontFace = true;
                            renderFrontColor = cubeColor;
                        } else if (cubeColor == undefined && cubeFrontColor != undefined) {
                            renderFrontFace = true;
                            renderFrontColor = cubeFrontColor;
                            renderFrontMaterial = this.cubeMaterialSpace[yPad + xPad + z - 1];
                        }
                    }
                    if (renderFrontFace && renderFrontColor != undefined) {
                        vertices.push(
                            xWorldSpace, yWorldSpace, zWorldSpace,
                            xNextWorldSpace, yWorldSpace, zWorldSpace,
                            xNextWorldSpace, yNextWorldSpace, zWorldSpace,
                            xNextWorldSpace, yNextWorldSpace, zWorldSpace,
                            xWorldSpace, yNextWorldSpace, zWorldSpace,
                            xWorldSpace, yWorldSpace, zWorldSpace
                        );
                        let normal = (cubeColor != undefined) ? -1.0 : 1.0;
                        for (let i = 0; i < 6; i++) {
                            colors.push(renderFrontColor[0], renderFrontColor[1], renderFrontColor[2]);
                            normals.push(0.0, 0.0, normal)
                            materials.push(renderFrontMaterial);
                        }
                    }

                    // Top, right, and back faces 
                    if (cubeColor != undefined) {
                        if (y == this.divisionFactor - 1) {
                            vertices.push(
                                xWorldSpace, 1.0, zWorldSpace,
                                xWorldSpace, 1.0, zNextWorldSpace,
                                xNextWorldSpace, 1.0, zNextWorldSpace,
                                xNextWorldSpace, 1.0, zNextWorldSpace,
                                xNextWorldSpace, 1.0, zWorldSpace,
                                xWorldSpace, 1.0, zWorldSpace
                            );
                            for (let i = 0; i < 6; i++) {
                                colors.push(cubeColor[0], cubeColor[1], cubeColor[2]);
                                normals.push(0.0, 1.0, 0.0);
                                materials.push(cubeMaterial);
                            }
                        }
                        if (x == this.divisionFactor - 1) {
                            vertices.push(
                                xStart + 1.0, yWorldSpace, zWorldSpace,
                                xStart + 1.0, yWorldSpace, zNextWorldSpace,
                                xStart + 1.0, yNextWorldSpace, zNextWorldSpace,
                                xStart + 1.0, yNextWorldSpace, zNextWorldSpace,
                                xStart + 1.0, yNextWorldSpace, zWorldSpace,
                                xStart + 1.0, yWorldSpace, zWorldSpace
                            );
                            for (let i = 0; i < 6; i++) {
                                colors.push(cubeColor[0], cubeColor[1], cubeColor[2]);
                                normals.push(1.0, 0.0, 0.0);
                                materials.push(cubeMaterial);
                            }
                        }
                        if (z == this.divisionFactor - 1) {
                            vertices.push(
                                xWorldSpace, yWorldSpace, zStart + 1.0,
                                xNextWorldSpace, yWorldSpace, zStart + 1.0,
                                xNextWorldSpace, yNextWorldSpace, zStart + 1.0,
                                xNextWorldSpace, yNextWorldSpace, zStart + 1.0,
                                xWorldSpace, yNextWorldSpace, zStart + 1.0,
                                xWorldSpace, yWorldSpace, zStart + 1.0
                            );
                            for (let i = 0; i < 6; i++) {
                                colors.push(cubeColor[0], cubeColor[1], cubeColor[2]);
                                normals.push(0.0, 0.0, 1.0);
                                materials.push(cubeMaterial);
                            }
                        }
                    }

                    if (cubeColor != undefined) {
                        yMax = Math.max(y, yMax);
                        yMin = Math.min(y, yMin);
                    }
                }
            }
        }
        this.cubeSpacePositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeSpacePositionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.cubeSpaceNormalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeSpaceNormalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);
        this.cubeSpaceColorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeSpaceColorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
        this.cubeSpaceMaterialBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeSpaceMaterialBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(materials), this.gl.STATIC_DRAW);
        this.cubeSpaceNumberOfVertices = vertices.length / 3;
        return vec2.fromValues(yMin, yMax);
    }

    populateTexture() {
        if (!this.gl) {
            throw new Error("No GL context bound.");
        }

        let level = 0;
        let width = Math.pow(this.divisionFactor, 2);
        let height = this.divisionFactor;
        let border = 0;
        let type = this.gl.UNSIGNED_BYTE;

        this.cubeColorSpaceTexture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.cubeColorSpaceTexture);

        this.gl.texImage2D(this.gl.TEXTURE_2D, level, this.gl.RGBA, width, height, border, this.gl.RGBA, type,
            new Uint8Array(this.cubeColorSpaceTextureData));

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        this.cubeMaterialSpaceTexture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.cubeMaterialSpaceTexture);

        this.gl.texImage2D(this.gl.TEXTURE_2D, level, this.gl.LUMINANCE,
            width, height, border, this.gl.LUMINANCE, type, new Uint8Array(this.cubeMaterialSpace));

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    }
}