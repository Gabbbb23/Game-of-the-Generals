import "server-only";

import type {
  BoardCellView,
  GameState,
  MaskedGameState,
  MaskedPieceView,
  Piece,
  PlayerId,
} from "@/lib/game/types";

function maskPieceForViewer(piece: Piece, viewer: PlayerId): MaskedPieceView {
  const isOwnPiece = piece.owner === viewer;

  return {
    id: piece.id,
    owner: piece.owner,
    row: piece.row,
    column: piece.column,
    rankLabel: isOwnPiece ? piece.rankLabel : null,
    visibility: isOwnPiece ? "revealed" : "hidden",
  };
}

export function maskGameStateForPlayer(
  state: GameState,
  viewer: PlayerId,
): MaskedGameState {
  return {
    id: state.id,
    viewer,
    turn: state.turn,
    board: state.board,
    players: state.players,
    pieces: state.pieces
      .filter((piece) => piece.isAlive)
      .map((piece) => maskPieceForViewer(piece, viewer)),
  };
}

export function buildBoardCells(state: MaskedGameState): BoardCellView[] {
  const pieceByCoordinate = new Map<string, MaskedPieceView>();

  for (const piece of state.pieces) {
    pieceByCoordinate.set(`${piece.row}:${piece.column}`, piece);
  }

  const cells: BoardCellView[] = [];

  for (let row = 0; row < state.board.rows; row += 1) {
    for (let column = 0; column < state.board.columns; column += 1) {
      cells.push({
        coordinate: `${row}:${column}`,
        row,
        column,
        tone: (row + column) % 2 === 0 ? "light" : "dark",
        piece: pieceByCoordinate.get(`${row}:${column}`) ?? null,
      });
    }
  }

  return cells;
}
