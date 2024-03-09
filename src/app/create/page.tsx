import ToolsMenu from "@/app/ui/create/tools-menu";
import Canvas from '@/app/create/canvas';

export default function Page() {

    return (
        <main className="h-screen p-8 flex flex-col md:overflow-hidden">
            <h1 className={`flex-none mb-2 text-3xl md:text-4xl`}>
                CuBit
            </h1>
            <div className="space-x-1 [&>*]:rounded-t-md [&>*]:px-3 [&>*]:bg-pastel-orange [&>*:hover]:bg-pastel-red">
                <button className="">Edit</button>
                <button className="">Render</button>
                <button className="">Save</button>
            </div>
            <div className="flex-1 w-full flex flex-row max-h-[90%] min-h-0 min-w-0">
                <div className="my-1 bg-sea-green p-1">
                    <ToolsMenu />
                </div>
                <div className="flex-1 p-1">
                    <Canvas />
                </div>
            </div>
        </main>
    )
}