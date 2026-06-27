"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";

import { getPieceAsset } from "@/lib/game/piece-assets";
import type { BoardCellView, MaskedGameState, PlayerId } from "@/lib/game/types";

const navItems = [
  { label: "Board", icon: "grid" },
  { label: "Matches", icon: "layers" },
  { label: "Archive", icon: "clock" },
  { label: "Rules", icon: "book" },
] as const;

function getCoordinateLabel(row: number, column: number, rows: number): string {
  const fileLabel = String.fromCharCode(65 + column);
  const rankLabel = String(rows - row);
  return `${fileLabel}${rankLabel}`;
}

function getPlayerLabel(player: PlayerId): string {
  return player === "blue" ? "Blue Command" : "North Command";
}

function buildBoardCells(state: MaskedGameState): BoardCellView[] {
  const pieceByCoordinate = new Map<string, MaskedGameState["pieces"][number]>();

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

function countPiecesForOwner(state: MaskedGameState, owner: PlayerId): number {
  return state.pieces.filter((piece) => piece.owner === owner).length;
}

function SidebarIcon({ icon }: { icon: (typeof navItems)[number]["icon"] }) {
  const common = "absolute inset-0 rounded-[inherit] border border-white/12";

  if (icon === "grid") {
    return (
      <span className="relative h-5 w-5 rounded-md border border-white/18">
        <span className={common} />
        <span className="absolute inset-[3px] grid grid-cols-2 gap-[2px]">
          <span className="rounded-[2px] bg-white/80" />
          <span className="rounded-[2px] bg-white/40" />
          <span className="rounded-[2px] bg-white/40" />
          <span className="rounded-[2px] bg-white/80" />
        </span>
      </span>
    );
  }

  if (icon === "layers") {
    return (
      <span className="relative h-5 w-5">
        <span className="absolute inset-x-[2px] top-[2px] h-2.5 rounded-sm border border-white/20 bg-white/10" />
        <span className="absolute inset-x-[4px] top-[7px] h-2.5 rounded-sm border border-white/30 bg-white/20" />
        <span className="absolute inset-x-[6px] top-[12px] h-2 rounded-sm bg-white/75" />
      </span>
    );
  }

  if (icon === "clock") {
    return (
      <span className="relative h-5 w-5 rounded-full border border-white/22">
        <span className="absolute left-1/2 top-[4px] h-[5px] w-px -translate-x-1/2 bg-white/80" />
        <span className="absolute left-1/2 top-1/2 h-px w-[5px] bg-white/80" />
      </span>
    );
  }

  return (
    <span className="relative h-5 w-5 rounded-md border border-white/22">
      <span className="absolute left-[4px] right-[4px] top-[4px] h-px bg-white/80" />
      <span className="absolute left-[4px] right-[4px] top-[8px] h-px bg-white/50" />
      <span className="absolute left-[4px] right-[7px] top-[12px] h-px bg-white/50" />
    </span>
  );
}

function Avatar({ accent, label }: { accent: string; label: string }) {
  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-xs font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
      style={{
        background: `linear-gradient(135deg, ${accent}, rgba(255,255,255,0.12))`,
      }}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}

function PlayerStrip({
  player,
  positionLabel,
  pieceCount,
}: {
  player: MaskedGameState["players"][PlayerId];
  positionLabel: string;
  pieceCount: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-[var(--panel)] px-3 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
      <div className="flex items-center gap-3">
        <Avatar accent={player.accentColor} label={player.username.slice(0, 2).toUpperCase()} />
        <div>
          <p className="text-sm font-semibold leading-tight tracking-tight text-white">
            {player.username}
          </p>
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
            {positionLabel}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-5 text-right">
        <div>
          <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/35">
            Pieces
          </p>
          <p className="mt-0.5 text-sm font-semibold text-white">{pieceCount}</p>
        </div>
        <div>
          <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/35">
            Captured
          </p>
          <p className="mt-0.5 text-sm font-semibold text-[var(--success)]">
            {player.capturedPieces}
          </p>
        </div>
      </div>
    </div>
  );
}

function PieceToken({ piece }: { piece: BoardCellView["piece"] }) {
  if (!piece) {
    return null;
  }

  const isHidden = piece.visibility === "hidden";

  return (
    <div
      className="flex h-[74%] w-[74%] items-center justify-center rounded-[18px] border shadow-[0_10px_24px_rgba(0,0,0,0.14)] transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-[0_14px_32px_rgba(0,0,0,0.28)]"
      style={{
        background: isHidden
          ? "linear-gradient(180deg, rgba(18,12,14,0.92), rgba(31,22,25,0.95))"
          : "linear-gradient(180deg, rgba(239,232,221,0.98), rgba(222,212,199,0.96))",
        borderColor: isHidden ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.14)",
      }}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <Image
          src={getPieceAsset(piece.rank, isHidden)}
          alt={isHidden ? "Hidden opponent piece" : `${piece.rankLabel} piece`}
          width={40}
          height={40}
          className="h-auto w-[56%] object-contain"
          unoptimized
        />
      </div>
    </div>
  );
}

function StatusRail({ turn }: { turn: PlayerId }) {
  return (
    <div className="mx-auto flex w-full max-w-[560px] items-center justify-center rounded-full border border-white/8 bg-[var(--panel)] px-5 py-2.5 shadow-[0_18px_44px_rgba(0,0,0,0.22)]">
      <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] sm:text-[11px]">
        <span className="text-white/40">Turn</span>
        <span className="font-semibold text-white">{getPlayerLabel(turn)}</span>
        <span className="mx-2 h-3 w-px bg-white/10" />
        <span className="text-white/40">Board</span>
        <span className="font-semibold text-white">8×9</span>
        <span className="mx-2 h-3 w-px bg-white/10" />
        <span className="text-white/40">State</span>
        <span className="font-semibold text-white">Masked</span>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <main className="flex h-screen items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
      <div className="rounded-2xl border border-white/8 bg-[var(--panel)] px-6 py-5 shadow-[0_24px_56px_rgba(0,0,0,0.24)]">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/35">
          Loading match
        </p>
      </div>
    </main>
  );
}

export default function Home() {
  const [perspective, setPerspective] = useState<PlayerId>("blue");
  const [state, setState] = useState<MaskedGameState | null>(null);
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [movingPieceId, setMovingPieceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    async function loadState() {
      const response = await fetch(`/api/game/local?player=${perspective}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as MaskedGameState | { error: string };

      if (cancelled) {
        return;
      }

      if (!response.ok || "error" in data) {
        setError("Unable to load the local match.");
        return;
      }

      setState(data);
      setSelectedPieceId(null);
      setError(null);
    }

    void loadState();

    return () => {
      cancelled = true;
    };
  }, [perspective]);

  const cells = useMemo(() => (state ? buildBoardCells(state) : []), [state]);
  const selectedPiece = useMemo(
    () => state?.pieces.find((piece) => piece.id === selectedPieceId) ?? null,
    [selectedPieceId, state],
  );

  const legalTargets = useMemo(() => {
    if (!state || !selectedPiece || state.turn !== perspective || state.winner) {
      return new Set<string>();
    }

    const occupiedByFriendly = new Set(
      state.pieces
        .filter((piece) => piece.owner === perspective)
        .map((piece) => `${piece.row}:${piece.column}`),
    );
    const deltas = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ] as const;
    const nextTargets = new Set<string>();

    for (const [rowDelta, columnDelta] of deltas) {
      const nextRow = selectedPiece.row + rowDelta;
      const nextColumn = selectedPiece.column + columnDelta;

      if (
        nextRow < 0 ||
        nextRow >= state.board.rows ||
        nextColumn < 0 ||
        nextColumn >= state.board.columns
      ) {
        continue;
      }

      if (occupiedByFriendly.has(`${nextRow}:${nextColumn}`)) {
        continue;
      }

      nextTargets.add(`${nextRow}:${nextColumn}`);
    }

    return nextTargets;
  }, [perspective, selectedPiece, state]);

  async function refreshState(nextPerspective: PlayerId) {
    const response = await fetch(`/api/game/local?player=${nextPerspective}`, {
      cache: "no-store",
    });
    const data = (await response.json()) as MaskedGameState | { error: string };

    if (!response.ok || "error" in data) {
      setError("Unable to refresh the local match.");
      return;
    }

    setState(data);
    setSelectedPieceId(null);
    setError(null);
  }

  async function submitMove(targetRow: number, targetColumn: number) {
    if (!selectedPiece || !state) {
      return;
    }

    setError(null);
    setMovingPieceId(selectedPiece.id);

    const response = await fetch("/api/game/local/move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        player: perspective,
        pieceId: selectedPiece.id,
        targetRow,
        targetColumn,
      }),
    });

    const data = (await response.json()) as MaskedGameState | { error: string };

    setMovingPieceId(null);

    if (!response.ok || "error" in data) {
      setError("error" in data ? data.error : "Move failed.");
      return;
    }

    setState(data);
    setSelectedPieceId(null);
  }

  async function resetMatch() {
    await fetch("/api/game/local", {
      method: "DELETE",
    });
    await refreshState(perspective);
  }

  function handleCellClick(cell: BoardCellView) {
    if (!state || isPending) {
      return;
    }

    const cellKey = `${cell.row}:${cell.column}`;
    const isLegalTarget = legalTargets.has(cellKey);

    if (selectedPiece && isLegalTarget) {
      void submitMove(cell.row, cell.column);
      return;
    }

    if (!cell.piece) {
      setSelectedPieceId(null);
      return;
    }

    const isOwnPiece = cell.piece.owner === perspective;
    const canSelect = isOwnPiece && state.turn === perspective && !state.winner;

    if (!canSelect) {
      setSelectedPieceId(null);
      return;
    }

    setSelectedPieceId((current) => (current === cell.piece?.id ? null : cell.piece?.id ?? null));
  }

  if (!state) {
    return <LoadingScreen />;
  }

  const northCount = countPiecesForOwner(state, "red");
  const southCount = countPiecesForOwner(state, "blue");

  return (
    <main className="h-screen overflow-hidden bg-transparent text-[var(--foreground)]">
      <div className="grid h-full lg:grid-cols-[84px_minmax(0,1fr)]">
        <aside className="flex items-center justify-between border-b border-[var(--sidebar-border)] bg-[var(--sidebar)] px-4 py-3 lg:flex-col lg:justify-start lg:border-b-0 lg:border-r lg:px-3 lg:py-5">
          <div className="flex items-center gap-3 lg:flex-col">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04]">
              <span className="font-display text-xl font-semibold italic tracking-tight text-white">
                G
              </span>
            </div>
            <div className="lg:[writing-mode:vertical-rl]">
              <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/35">
                Command
              </p>
            </div>
          </div>

          <nav className="hidden flex-1 items-center justify-center lg:flex">
            <ul className="flex flex-col gap-3">
              {navItems.map((item) => (
                <li key={item.label}>
                    <a
                        href="#"
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-white/78 transition-all duration-200 ease-out hover:scale-110 hover:bg-[var(--accent-soft)] hover:text-white active:scale-95"
                        aria-label={item.label}
                      >
                    <SidebarIcon icon={item.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden h-11 w-11 rounded-2xl border border-white/8 bg-white/[0.03] lg:block" />
        </aside>

        <section className="relative overflow-hidden bg-[var(--background)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,68,68,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_35%)]" />
          <div className="relative mx-auto grid h-full max-w-[1500px] grid-rows-[auto_minmax(0,1fr)] gap-4 px-4 py-4 sm:px-6 lg:px-7 lg:py-5">
            <StatusRail turn={state.turn} />

            <div className="grid min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
              <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-3 rounded-2xl border border-white/8 bg-[var(--panel-strong)] p-3 shadow-[0_28px_64px_rgba(0,0,0,0.28)] sm:p-4">
                <PlayerStrip
                  player={state.players.red}
                  positionLabel="North command"
                  pieceCount={northCount}
                />

                <div className="relative flex min-h-0 items-center justify-center rounded-xl border border-white/8 bg-[var(--board-frame)] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-3">
                  {state.winner ? (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-black/60 backdrop-blur-[2px]">
                      <div className="rounded-2xl border border-amber-300/15 bg-[var(--panel-strong)]/95 px-7 py-5 text-center shadow-[0_24px_56px_rgba(0,0,0,0.4)]">
                        <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-amber-300/60">
                          Game Over
                        </p>
                        <p className="mt-2 font-display text-2xl font-semibold italic tracking-tight text-white">
                          {getPlayerLabel(state.winner)} wins
                        </p>
                        <p className="mt-1.5 text-[13px] leading-5 text-white/45">
                          {state.winnerReason}
                        </p>
                        <button
                          type="button"
                          onClick={() => void resetMatch()}
                          className="mt-4 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-medium text-white transition-all duration-150 ease-out hover:bg-white/[0.12] active:scale-95"
                        >
                          New Match
                        </button>
                      </div>
                    </div>
                  ) : null}
                  <div
                    className={`grid aspect-[8/9] h-full max-h-[60vh] w-auto max-w-full overflow-hidden rounded-xl border border-white/8 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_26px_54px_rgba(0,0,0,0.2)] ${
                      state.winner ? "pointer-events-none opacity-40" : ""
                    }`}
                    style={{
                      gridTemplateColumns: `repeat(${state.board.columns}, minmax(0, 1fr))`,
                    }}
                  >
                    {cells.map((cell) => {
                      const isSelected = cell.piece?.id === selectedPieceId;
                      const isMoving = cell.piece?.id === movingPieceId;
                      const isLegalTarget = legalTargets.has(`${cell.row}:${cell.column}`);

                      return (
                        <button
                          key={cell.coordinate}
                          type="button"
                          onClick={() => handleCellClick(cell)}
                          className={`relative aspect-square border border-[color:var(--board-grid)] transition-shadow duration-200 hover:z-10 ${isMoving ? "pointer-events-none" : "cursor-pointer"}`}
                          style={{
                            backgroundColor:
                              cell.tone === "dark" ? "var(--board-dark)" : "var(--board-light)",
                            boxShadow: isMoving
                              ? "inset 0 0 0 2px rgba(232,226,217,0.3), inset 0 0 24px rgba(232,226,217,0.06)"
                              : isSelected
                                ? "inset 0 0 0 2px rgba(232,226,217,0.95), inset 0 0 20px rgba(232,226,217,0.12)"
                                : isLegalTarget
                                  ? "inset 0 0 0 3px rgba(183,119,102,0.85), inset 0 0 16px rgba(183,119,102,0.2)"
                                  : undefined,
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected && !isLegalTarget) {
                              e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(255,255,255,0.15)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected && !isLegalTarget) {
                              e.currentTarget.style.boxShadow = "";
                            }
                          }}
                        >
                          {cell.row === 0 ||
                          cell.row === state.board.rows - 1 ||
                          cell.column === 0 ||
                          cell.column === state.board.columns - 1 ? (
                            <span
                              className="absolute left-1 top-1 text-[8px] font-semibold leading-none sm:left-1.5 sm:top-1.5 sm:text-[9px]"
                              style={{
                                color:
                                  cell.tone === "dark"
                                    ? "rgba(245, 237, 226, 0.82)"
                                    : "rgba(48, 37, 40, 0.72)",
                                letterSpacing: "0.04em",
                              }}
                            >
                              {getCoordinateLabel(cell.row, cell.column, state.board.rows)}
                            </span>
                          ) : null}

                          <div className={`flex h-full items-center justify-center p-1.5 sm:p-2 ${isMoving ? "group" : "group"}`}>
                            {isMoving ? (
                              <span className="absolute inset-[2px] animate-ping rounded-[22px] border-2 border-white/20 opacity-40" />
                            ) : null}
                            <PieceToken piece={cell.piece} />
                          </div>

                          {cell.piece?.owner === perspective ? (
                            <span className="absolute bottom-1 right-1.5">
                              <span className="block h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_rgba(183,119,102,0.5)]" />
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <PlayerStrip
                  player={state.players.blue}
                  positionLabel="South command"
                  pieceCount={southCount}
                />
              </section>

              <aside className="flex min-h-0 flex-col rounded-2xl border border-white/8 bg-[var(--panel)] p-4 shadow-[0_24px_56px_rgba(0,0,0,0.24)]">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-white/40">
                    Match feed
                  </p>
                  <span className="font-display text-[11px] font-medium italic tracking-tight text-white/20">
                    Local
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => startTransition(() => setPerspective("blue"))}
                    className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all duration-150 ease-out active:scale-95 ${
                      perspective === "blue"
                        ? "bg-[var(--accent-soft)] text-white"
                        : "text-white/40 hover:bg-white/[0.06] hover:text-white/70"
                    }`}
                  >
                    Blue
                  </button>
                  <button
                    type="button"
                    onClick={() => startTransition(() => setPerspective("red"))}
                    className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all duration-150 ease-out active:scale-95 ${
                      perspective === "red"
                        ? "bg-[var(--accent-soft)] text-white"
                        : "text-white/40 hover:bg-white/[0.06] hover:text-white/70"
                    }`}
                  >
                    Red
                  </button>
                  <button
                    type="button"
                    onClick={() => void resetMatch()}
                    className="ml-auto rounded-lg px-3 py-1.5 text-[11px] font-medium text-white/30 transition-all duration-150 ease-out hover:bg-white/[0.06] hover:text-white/60 active:scale-95"
                  >
                    Reset
                  </button>
                </div>

                <div className="mt-3 rounded-2xl border border-white/7 bg-white/[0.03] px-3 py-3">
                  <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/35">
                    Viewing
                  </p>
                  <p className="mt-1 text-sm font-semibold tracking-tight text-white">{getPlayerLabel(perspective)}</p>
                  <p className="mt-2 text-[12px] leading-5 text-[var(--muted)]">
                    {state.winner
                      ? `${getPlayerLabel(state.winner)} wins. ${state.winnerReason}`
                      : state.turn === perspective
                        ? "Select one of your pieces, then click an adjacent square."
                        : "It is the other side's turn. Switch perspective or wait."}
                  </p>
                  {error ? (
                    <p className="mt-2 rounded-xl border border-red-500/20 bg-red-500/8 px-3 py-2 text-[12px] font-medium text-red-300">
                      {error}
                    </p>
                  ) : null}
                </div>

                <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
                  {state.feed.length === 0 ? (
                    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/8 bg-white/[0.02] px-4 py-8 text-center">
                      <div>
                          <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-white/25">
                            No events yet
                          </p>
                        <p className="mt-2 text-[12px] leading-5 text-white/25">
                          Move a piece to start the match log.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <ul className="grid gap-1.5 text-[12px] leading-5 text-white/75">
                      {state.feed.map((item) => {
                        const eventStyles = {
                          init: "border-l-2 border-white/10",
                          move: "border-l-2 border-white/15",
                          advance: "border-l-2 border-[var(--success)]/50",
                          repel: "border-l-2 border-red-400/35",
                          split: "border-l-2 border-amber-400/35",
                          win: "border-l-2 border-amber-300/60",
                        }[item.eventType ?? "move"];

                        return (
                          <li
                            key={item.id}
                            className={`flex items-start gap-2.5 rounded-r-lg px-3 py-2.5 ${eventStyles}`}
                          >
                            <span className="mt-1 flex-shrink-0">
                              {item.eventType === "advance" || item.eventType === "repel" || item.eventType === "split" ? (
                                <span className="block h-1.5 w-1.5 rounded-full bg-current"
                                  style={{
                                    color:
                                      item.eventType === "advance"
                                        ? "var(--success)"
                                        : item.eventType === "repel"
                                          ? "rgb(248 113 113)"
                                          : item.eventType === "split"
                                            ? "rgb(251 191 36)"
                                            : "inherit",
                                  }}
                                />
                              ) : item.eventType === "win" ? (
                                <span className="mt-0.5 block h-[5px] w-[5px] rotate-45 rounded-sm bg-amber-300/70" />
                              ) : null}
                            </span>
                            <span className="leading-snug">{item.message}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
