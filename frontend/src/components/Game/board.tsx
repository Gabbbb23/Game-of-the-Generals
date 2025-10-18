import Square from "@/components/Game/square"
import Image from "next/image";

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
    const pieces = ["Private", "Spy" ,"1_General", "2_General", "3_General", "4_General", "5_General", "1st_Lt", "2nd_Lt", "Lt_Col", "Captain", "Colonel", "Major", "Sergeant", "Flag"]
    var counter = 2;
    const initialBoard = Array.from({length : 72}, (_, i) => {
        var piece = ""
        var owner = ""
        // Set the sides as null lol
        if(i === 0 || i === 9 || i === 18 || i === 8 || i === 17 || i === 26 || i >= 27 && i <= 44 || i === 45 || i === 53 || i === 54 || i === 62 || i === 63 || i === 71){
            piece == null;
        }
        else{
            owner = "Black"
            piece = "Blank"
        }

        // 6 Private pieces
        if(i >= 46 && i <= 51){
            owner = "White";
            piece = pieces[0];
        }

        // 2 Spies
        if(i === 52 || i === 55){
            owner = "White";
            piece = pieces[1];
        }

        // the rest of the pieces
        if(i>=56 && i<=61 || i>=64 && i<=70){
            owner = "White"
            piece = pieces[counter]
            counter += 1;
        }
        return {
            id: i,
            piece: piece,       
            owner: owner
        }  
    })

    
    return <>
        <div className="flex flex-1 flex-col ml-4 mr-4 min-h-screen">
            <div className="flex gap-2 text-sm mt-2 mb-2">
                <Image src="https://www.chess.com/bundles/web/images/black_400.png" alt="Avatar of Opponent" height="40" width="40"/>
                <span className="truncate">Opponent</span>
            </div>
            
            <div className="flex flex-1 flex-col justify-center">
                <div>
                    <div className="grid grid-cols-9 grid-rows-8 w-full h-full">
                        {initialBoard.map(({ id, piece, owner }) => {
                            // const row = Math.floor(id / 9);
                            // const col = id % 9;
                            // const isDark = (row + col) % 2 === 0;
                            var isDark = 0
                            if(id >= 36){
                                isDark = 1;
                            }

                            return (
                                <div
                                key={id}
                                className={`aspect-square border border-black flex items-center justify-center ${
                                    isDark ? "bg-gray-700" : "bg-[#ebecd0]"
                                }`}
                                >
                                    {piece && (
                                        <Image
                                        src={`/${owner}/${owner}_${piece}.png`}
                                        alt={`${owner} ${piece}`}
                                        width={50}
                                        height={50}
                                        sizes="100vw"
                                        style={{ width: "90%", height: "auto" }}
                                        draggable={false}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div> 
            </div>

            <div className="flex gap-2 text-sm mt-2 mb-2">
                <Image src="https://www.chess.com/bundles/web/images/white_400.png" alt="Avatar of Opponent" height="40" width="40"/>
                <span className="truncate">You</span>
            </div>
        </div>
    </>
}