import Square from "@/components/Game/square"

function Column(){
    return(<>
        <Square/>
        <Square/>
        <Square/>
        <Square/>
        <Square/>
        <Square/>
        <Square/>
        <Square/>
        <Square/>
    </>)
}

export default function Board(){
    return <>
        <div className="flex flex-col ml-2 min-h-screen w-[57.3%] flex-1">
            <div className="ml-2 mb-1 mt-1">Opponent</div>

            <div className="flex-1 flex border items-center justify-center">
                <div className="grid grid-cols-9 grid-rows-8 w-full h-full">
                    {Array.from({ length: 72 }).map((_, i) => (
                        <div key={i} className="aspect-square border border-gray-700" />
                    ))}
                </div>
            </div> 

            <div className="ml-2 mb-1 mt-1">You</div>
        </div>
    </>
}