import Board from "@/components/Game/board";
import Options from "@/components/Game/options";

export default function Play() {
    return <>
        <div className="flex mr-[10%] items-center">
            <Board/>
            <Options/>
        </div>
    </>
}