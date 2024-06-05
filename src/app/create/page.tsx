import CanvasWrapper from "./canvas-wrapper";

export default function Page() {

    return (
        <main className="h-screen flex flex-col md:overflow-hidden">
            <h1 className={`flex-none text-3xl md:text-4xl`}>
                CuBit
            </h1>
            <div className="flex-1 w-full flex flex-row max-h min-h-0 min-w-0">
                <CanvasWrapper canvasId={null} canvasData={null} />
            </div>
        </main>
    )
}