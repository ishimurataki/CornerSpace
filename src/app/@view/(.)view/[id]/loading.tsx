import { CanvasViewSkeleton } from "@/components/skeletons";

export default function Loading() {
    return (
        <div className={`h-[calc(100vh-64px)] absolute z-40 top-18 bg-gray-900`} >
            <div className="h-full w-full">
                <CanvasViewSkeleton />
            </div>
        </div>
    )
}