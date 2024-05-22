import { vec3 } from "@/lib/gl-matrix";

export function rgbToHex(rbg: vec3): string {
    const red = Math.round(rbg[0] * 255).toString(16).padStart(2, '0');
    const green = Math.round(rbg[1] * 255).toString(16).padStart(2, '0');
    const blue = Math.round(rbg[2] * 255).toString(16).padStart(2, '0');
    const hexString = ("#" + red + green + blue).toLowerCase();
    return hexString;
}

export function hexToRgb(hexString: string): vec3 {
    if (hexString.startsWith('#')) {
        hexString = hexString.slice(1);
    }
    if (!/^[0-9A-F]{6}$/i.test(hexString)) {
        console.error('Invalid hex string');
        return vec3.fromValues(0, 0, 0);
    }

    const red = parseInt(hexString.substring(0, 2), 16) / 255.0;
    const green = parseInt(hexString.substring(2, 4), 16) / 255.0;
    const blue = parseInt(hexString.substring(4), 16) / 255.0;

    return vec3.fromValues(red, green, blue);
}

export function stringToVec3(vec3String: string): vec3 {
    return vec3String.split(',').map((v) => Number(v))
}