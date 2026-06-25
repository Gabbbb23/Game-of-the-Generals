import type { GameState, Piece, PieceRank } from "@/lib/game/types";

const RANK_LABELS: Record<PieceRank, string> = {
  flag: "Flag",
  "five-star": "5 Star",
  "four-star": "4 Star",
  colonel: "Colonel",
  major: "Major",
  captain: "Captain",
  lieutenant: "Lt",
  sergeant: "Sgt",
  private: "Pvt",
  spy: "Spy",
};

function createPiece(
  id: string,
  owner: Piece["owner"],
  rank: PieceRank,
  row: number,
  column: number,
): Piece {
  return {
    id,
    owner,
    rank,
    rankLabel: RANK_LABELS[rank],
    row,
    column,
    isAlive: true,
  };
}

export function createMockGameState(): GameState {
  return {
    id: "match-demo-001",
    turn: "blue",
    board: {
      rows: 9,
      columns: 8,
    },
    players: {
      red: {
        id: "red",
        username: "North Command",
        avatarSeed: "red-command",
        accentColor: "#7f3d3d",
        capturedPieces: 1,
      },
      blue: {
        id: "blue",
        username: "South Command",
        avatarSeed: "blue-command",
        accentColor: "#3f5a78",
        capturedPieces: 2,
      },
    },
    pieces: [
      createPiece("red-flag", "red", "flag", 0, 3),
      createPiece("red-major", "red", "major", 1, 2),
      createPiece("red-colonel", "red", "colonel", 1, 4),
      createPiece("red-captain", "red", "captain", 2, 1),
      createPiece("red-private", "red", "private", 2, 5),
      createPiece("red-spy", "red", "spy", 3, 3),
      createPiece("blue-flag", "blue", "flag", 8, 4),
      createPiece("blue-five-star", "blue", "five-star", 7, 3),
      createPiece("blue-major", "blue", "major", 7, 5),
      createPiece("blue-captain", "blue", "captain", 6, 2),
      createPiece("blue-lieutenant", "blue", "lieutenant", 6, 4),
      createPiece("blue-sergeant", "blue", "sergeant", 5, 3),
    ],
  };
}
