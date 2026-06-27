export type PlayerId = "red" | "blue";

export type PieceRank =
  | "flag"
  | "five-star"
  | "four-star"
  | "three-star"
  | "two-star"
  | "one-star"
  | "colonel"
  | "lieutenant-colonel"
  | "major"
  | "captain"
  | "first-lieutenant"
  | "second-lieutenant"
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
  winner: PlayerId | null;
  winnerReason: string | null;
  moveCount: number;
  board: {
    rows: number;
    columns: number;
  };
  players: Record<PlayerId, PlayerProfile>;
  pieces: Piece[];
  feed: MatchFeedItem[];
}

export type FeedEventType = "init" | "move" | "advance" | "repel" | "split" | "win";

export interface MatchFeedItem {
  id: string;
  message: string;
  turn: number;
  eventType?: FeedEventType;
}

export interface MaskedPieceView {
  id: string;
  owner: PlayerId;
  row: number;
  column: number;
  rank: PieceRank | null;
  rankLabel: string | null;
  visibility: PieceVisibility;
}

export interface MaskedGameState {
  id: string;
  viewer: PlayerId;
  turn: PlayerId;
  winner: PlayerId | null;
  winnerReason: string | null;
  moveCount: number;
  board: {
    rows: number;
    columns: number;
  };
  players: Record<PlayerId, PlayerProfile>;
  pieces: MaskedPieceView[];
  feed: MatchFeedItem[];
}

export interface BoardCellView {
  coordinate: string;
  row: number;
  column: number;
  tone: "dark" | "light";
  piece: MaskedPieceView | null;
}
