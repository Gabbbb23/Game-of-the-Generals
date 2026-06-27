import type { GameState, Piece, PieceRank } from "@/lib/game/types";

const RANK_LABELS: Record<PieceRank, string> = {
  flag: "Flag",
  "five-star": "5 Star",
  "four-star": "4 Star",
  "three-star": "3 Star",
  "two-star": "2 Star",
  "one-star": "1 Star",
  colonel: "Colonel",
  "lieutenant-colonel": "Lt Colonel",
  major: "Major",
  captain: "Captain",
  "first-lieutenant": "1st Lt",
  "second-lieutenant": "2nd Lt",
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
    winner: null,
    winnerReason: null,
    moveCount: 0,
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
    feed: [
      {
        id: "feed-1",
        turn: 0,
        message: "Blue Command holds the opening initiative.",
      },
    ],
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
      createPiece("blue-first-lieutenant", "blue", "first-lieutenant", 6, 4),
      createPiece("blue-sergeant", "blue", "sergeant", 5, 3),
    ],
  };
}
