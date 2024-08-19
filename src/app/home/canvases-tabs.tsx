"use client";

import { useState } from "react";

export default function CanvasesTabs({
    PopularCanvasesServerComponent,
    NewCanvasesServerComponent
}: {
    PopularCanvasesServerComponent: React.ReactNode,
    NewCanvasesServerComponent: React.ReactNode,
}) {
    enum TabStates {
        PopularCanvases,
        NewCanvases
    }

    const [tabState, setTabState] = useState<TabStates>(TabStates.PopularCanvases);
    let tabContent = PopularCanvasesServerComponent;
    if (tabState === TabStates.NewCanvases) {
        tabContent = NewCanvasesServerComponent;
    }

    return (
        <div>
            <div className="flex flex-row gap-1 text-lg mt-4 pb-1">
                <button onClick={() => setTabState(TabStates.PopularCanvases)}
                    className={`text-sm md:text-base lg:text-lg rounded-t-lg ${tabState === TabStates.PopularCanvases ? "bg-gray-800 text-white" : "bg-white text-black"} 
                    py-1 px-2 border-2 border-black hover:border-cyan-300`}>
                    Popular
                </button>
                <button onClick={() => setTabState(TabStates.NewCanvases)}
                    className={`text-sm md:text-base lg:text-lg rounded-t-lg ${tabState === TabStates.NewCanvases ? "bg-gray-800 text-white" : "bg-white text-black"} 
                    py-1 px-2 border-2 border-black hover:border-cyan-300`}>
                    New
                </button>
            </div>
            {tabContent}
        </div>

    );
}