import { NextResponse } from "next/server";

import { createMockGameState } from "@/lib/game/mock-game";
import { maskGameStateForPlayer } from "@/lib/game/state";
import type { PlayerId } from "@/lib/game/types";

const VALID_PLAYERS: PlayerId[] = ["red", "blue"];

export async function GET(
  _request: Request,
  context: { params: Promise<{ player: string }> },
) {
  const { player } = await context.params;

  if (!VALID_PLAYERS.includes(player as PlayerId)) {
    return NextResponse.json(
      {
        error: "Unknown player perspective.",
      },
      { status: 400 },
    );
  }

  const state = createMockGameState();
  const maskedState = maskGameStateForPlayer(state, player as PlayerId);

  return NextResponse.json(maskedState);
}
