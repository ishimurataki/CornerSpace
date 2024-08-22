"use server";

import { getNewCanvasesServer } from "@/backend-lib/actions";
import LoadMore, { loadMoreActionType } from "./load-more";
import { CanvasesList } from "./popular-canvases";

const loadMoreNewCanvases: loadMoreActionType = async (currentToken: string | null) => {
    "use server";
    const { areCanvasIdsLoaded, canvasIds, nextToken, errorMessage } = await getNewCanvasesServer(currentToken);
    if (!areCanvasIdsLoaded || canvasIds == null) {
        console.log(errorMessage);
        return [<></>, null];
    }
    if (canvasIds.length === 0) {
        return [null, null];
    }

    return [<CanvasesList canvasIds={canvasIds} key="NewCanvasesList" />, nextToken] as const;
}

export default async function NewCanvases() {

    const { areCanvasIdsLoaded, canvasIds: initialCanvasIds, nextToken, errorMessage } = await getNewCanvasesServer(null);
    if (!areCanvasIdsLoaded || initialCanvasIds == null) {
        console.log(errorMessage);
        return (
            <div>Unexpected error</div>
        );
    }

    return (
        <LoadMore firstNextToken={nextToken} loadMoreAction={loadMoreNewCanvases}
            key={"loadMoreContainerForNewCanvases"} forStudio={false}>
            <CanvasesList canvasIds={initialCanvasIds} />
        </LoadMore>
    );
}