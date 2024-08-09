const shimmer =
    'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-rose-100/10 before:to-transparent isolate overflow-hidden';

export function CanvasViewSkeleton() {
    return (
        <div className={`${shimmer} z-40 top-0 left-0 w-screen h-full flex flex-col flex-nowrap gap-2 md:flex-row bg-black bg-opacity-80 overflow-scroll`}>
            <div className="grow flex justify-center items-center w-full h-4/5 min-h-[calc(75%)] md:h-full">
                <div className="w-[calc(100%-30px)] md:w-11/12 h-full md:h-full rounded-lg bg-zinc-700" />
            </div>
            <div className="shrink flex justify-center items-center md:justify-end w-full md:h-full md:max-w-72 lg:max-w-96">
                <div className="bg-white rounded-lg py-2 px-4 flex flex-col gap-2 w-[calc(100%-30px)] md:w-full h-full">
                </div>
            </div>
        </div>
    )
}
