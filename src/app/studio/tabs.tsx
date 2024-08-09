"use client";

import { useState } from "react";

export default function Tabs({
    LikedCanvasServerComponent,
    GalleryServerComponent
}: {
    LikedCanvasServerComponent: React.ReactNode,
    GalleryServerComponent: React.ReactNode
}) {
    const [showGallery, setShowGallery] = useState(true);

    return (
        <div>
            <div className="flex flex-row gap-2 text-lg mt-4">
                <button onClick={() => setShowGallery(true)}
                    className={`rounded-t-lg ${showGallery ? "bg-gray-800 text-white" : "bg-white text-black"} 
                    py-1 px-2 border-2 border-black hover:border-cyan-300`}>
                    Gallery
                </button>
                <button onClick={() => setShowGallery(false)} className={`rounded-t-lg ${!showGallery ? "bg-gray-800 text-white" : "bg-white text-black"} 
                    py-1 px-2 border-2 border-black hover:border-cyan-300`}>
                    Liked Canvases
                </button>
            </div>
            <p className="text-lg mx-3 md:mx-6 lg:mx-10 mt-2 md:mt-3 lg:mt-5" >{showGallery ? "Your Gallery" : "Your Liked Canvases"}</p >
            {showGallery ? GalleryServerComponent : LikedCanvasServerComponent}
        </div>

    );
}