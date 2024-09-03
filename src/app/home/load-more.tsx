"use client";

import React, { useEffect, useRef, useState } from "react";

export type loadMoreActionType = (nextToken: string | null) => Promise<readonly [React.JSX.Element | null, string | null]>

export default function LoadMore({
    children,
    firstNextToken,
    loadMoreAction,
    forStudio,
}: {
    children: React.ReactNode,
    firstNextToken: string | null,
    loadMoreAction: loadMoreActionType,
    forStudio: boolean
}) {

    const ref = useRef<HTMLButtonElement>(null);
    const [loadMoreNodes, setLoadMoreLoads] = useState<React.JSX.Element[]>([]);
    const nextToken = useRef<string | null>(firstNextToken);
    const [scrollLoad, setScrollLoad] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const loadMore = React.useCallback(
        async (abortController?: AbortController) => {
            setLoading(true);
            if (nextToken.current === null) return;

            try {
                const [node, next] = await loadMoreAction(nextToken.current);
                if (abortController?.signal.aborted) return;

                if (node) {
                    setLoadMoreLoads((prev) => [...prev, node]);
                }
                if (next === null) {
                    nextToken.current = null;
                    setDisabled(true);
                    return;
                }

                nextToken.current = next;
            } catch {
            } finally {
                setLoading(false);
            }
        },
        [loadMoreAction]
    );

    useEffect(() => {
        const signal = new AbortController();
        const buttonElement = ref.current;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !disabled) {
                loadMore(signal);
            }
        });

        if (buttonElement && scrollLoad) {
            observer.observe(buttonElement);
        }

        return () => {
            signal.abort();
            if (buttonElement) {
                observer.unobserve(buttonElement);
            }
        }
    }, [loadMore, scrollLoad]);

    return (
        <div className={`flex flex-col justify-between items-center gap-0`}>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-scroll mb-6 no-scrollbar 
            ${forStudio ? "mx-3 md:mx-6 lg:mx-10 mt-2 md:mt-3 lg:mt-5" : ""}`}>
                {children}
                {loadMoreNodes}
            </div>
            <button
                onClick={() => loadMore()}
                disabled={loading || disabled || nextToken.current === null}
                className="p-2 mb-10 flex-none bg-slate-400 text-white rounded-md hover:bg-slate-600 disabled:hover:bg-slate-400"
                ref={ref}
            >
                {nextToken.current === null ? "No more to load" : loading ? "Loading..." : "Load More"}
            </button>
        </div>
    )
}