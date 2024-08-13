"use client";

import { useState } from "react";

export default function Tabs({
    LikedCanvasServerComponent,
    GalleryServerComponent,
    FollowingServerComponent,
    FollowersServerComponent
}: {
    LikedCanvasServerComponent: React.ReactNode,
    GalleryServerComponent: React.ReactNode,
    FollowingServerComponent: React.ReactNode,
    FollowersServerComponent: React.ReactNode
}) {
    enum TabStates {
        Gallery,
        LikedCanvases,
        Following,
        Followers
    }

    const [tabState, setTabState] = useState<TabStates>(TabStates.Gallery);
    let tabText = "";
    let tabContent = GalleryServerComponent;
    if (tabState === TabStates.Gallery) {
        tabText = "Gallery";
    } else if (tabState === TabStates.LikedCanvases) {
        tabText = "Liked Canvases";
        tabContent = LikedCanvasServerComponent;
    } else if (tabState === TabStates.Following) {
        tabText = "Following";
        tabContent = FollowingServerComponent
    } else if (tabState == TabStates.Followers) {
        tabText = "Followers";
        tabContent = FollowersServerComponent;
    }

    return (
        <div>
            <div className="flex flex-row gap-1 text-lg mt-4">
                <button onClick={() => setTabState(TabStates.Gallery)}
                    className={`text-sm md:text-base lg:text-lg rounded-t-lg ${tabState === TabStates.Gallery ? "bg-gray-800 text-white" : "bg-white text-black"} 
                    py-1 px-2 border-2 border-black hover:border-cyan-300`}>
                    Gallery
                </button>
                <button onClick={() => setTabState(TabStates.LikedCanvases)}
                    className={`text-sm md:text-base lg:text-lg rounded-t-lg ${tabState === TabStates.LikedCanvases ? "bg-gray-800 text-white" : "bg-white text-black"} 
                    py-1 px-2 border-2 border-black hover:border-cyan-300`}>
                    Likes
                </button>
                <button onClick={() => setTabState(TabStates.Following)}
                    className={`text-sm md:text-base lg:text-lg rounded-t-lg ${tabState === TabStates.Following ? "bg-gray-800 text-white" : "bg-white text-black"} 
                    py-1 px-2 border-2 border-black hover:border-cyan-300`}>
                    Following
                </button>
                <button onClick={() => setTabState(TabStates.Followers)}
                    className={`text-sm md:text-base lg:text-lg rounded-t-lg ${tabState === TabStates.Followers ? "bg-gray-800 text-white" : "bg-white text-black"} 
                    py-1 px-2 border-2 border-black hover:border-cyan-300`}>
                    Followers
                </button>
            </div>
            <p className="text-lg mx-3 md:mx-6 lg:mx-10 mt-2 md:mt-3 lg:mt-5" >{tabText}</p>
            {tabContent}
        </div>

    );
}