export type PlayerId = "red" | "blue";

export type PieceRank =
  | "flag"
  | "five-star"
  | "four-star"
  | "colonel"
  | "major"
  | "captain"
  | "lieutenant"
  | "sergeant"
  | "private"
  | "spy";

export type PieceVisibility = "revealed" | "hidden";

export interface Piece {
  id: string;
  owner: PlayerId;
  rank: PieceRank;
  rankLabel: string;
  row: number;
  column: number;
  isAlive: boolean;
}

export interface PlayerProfile {
  id: PlayerId;
  username: string;
  avatarSeed: string;
  accentColor: string;
  capturedPieces: number;
}

export interface GameState {
  id: string;
  turn: PlayerId;
  board: {
    rows: number;
    columns: number;
  };
  players: Record<PlayerId, PlayerProfile>;
  pieces: Piece[];
}

export interface MaskedPieceView {
  id: string;
  owner: PlayerId;
  row: number;
  column: number;
  rankLabel: string | null;
  visibility: PieceVisibility;
}

export interface MaskedGameState {
  id: string;
  viewer: PlayerId;
  turn: PlayerId;
  board: {
    rows: number;
    columns: number;
  };
  players: Record<PlayerId, PlayerProfile>;
  pieces: MaskedPieceView[];
}

export interface BoardCellView {
  coordinate: string;
  row: number;
  column: number;
  tone: "dark" | "light";
  piece: MaskedPieceView | null;
}
