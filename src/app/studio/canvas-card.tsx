"use sever";

import { loadCanvasSever } from "@/backend-lib/actions";
import Canvas from "./canvas";
import {
    GlobeAmericasIcon,
    EyeSlashIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function CanvasCard({ canvasId }: { canvasId: string }) {
    const { isCanvasLoaded, canvasData, errorMessage } = await loadCanvasSever(canvasId);
    if (!canvasData) {
        return (
            <div className="border-4 border-pastel-green h-60 w-80">{errorMessage}</div>
        )
    }
    return (
        <div className="flex flex-row gap-6 items-center">
            <Canvas canvasData={canvasData} />
            <div>
                <Link href={`/create/${canvasId}`} className="text-xl hover:text-green-900 hover:text-2xl">{canvasData.name}</Link>
                <p className="min-h-10 max-h-40 overflow-scroll p-1.5">{canvasData.description}</p>
                <div>{canvasData.publicity == 0 ?
                    <div className="flex flex-row"><p>Public</p><GlobeAmericasIcon className="w-6" /></div> :
                    <div className="flex flex-row"><p>Private</p><EyeSlashIcon className="w-6" /></div>}
                </div>
            </div>
        </div>
    );
}