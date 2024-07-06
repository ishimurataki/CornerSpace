import CanvasWrapper from "./canvas-wrapper";

export default function Page() {

    return (
        <main className="h-[calc(100vh-74px)] mt-1 flex flex-col md:overflow-hidden">
            <div className="flex-1 w-full flex flex-row max-h min-h-0 min-w-0">
                <CanvasWrapper canvasId={null} canvasData={null} />
            </div>
        </main>
    )
}