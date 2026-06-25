import { createMockGameState } from "@/lib/game/mock-game";
import { buildBoardCells, maskGameStateForPlayer } from "@/lib/game/state";
import type { BoardCellView, MaskedGameState, PlayerId } from "@/lib/game/types";

const navItems = [
  { label: "Board", icon: "grid" },
  { label: "Matches", icon: "layers" },
  { label: "Archive", icon: "clock" },
  { label: "Rules", icon: "book" },
] as const;

const statusItems = [
  { label: "Turn", value: "Blue Command" },
  { label: "Board", value: "8 by 9 field" },
  { label: "Visibility", value: "Server-masked" },
] as const;

function getCoordinateLabel(row: number, column: number, rows: number): string {
  const fileLabel = String.fromCharCode(65 + column);
  const rankLabel = String(rows - row);
  return `${fileLabel}${rankLabel}`;
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
      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
      style={{
        background: `linear-gradient(135deg, ${accent}, rgba(255,255,255,0.12))`,
      }}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}

function PlayerCard({
  player,
  perspective,
  positionLabel,
}: {
  player: MaskedGameState["players"][PlayerId];
  perspective: PlayerId;
  positionLabel: string;
}) {
  const isPerspective = player.id === perspective;

  return (
    <div className="flex items-center justify-between rounded-[28px] border border-white/10 bg-[var(--panel)] px-4 py-3 shadow-[var(--shadow)] backdrop-blur">
      <div className="flex items-center gap-3">
        <Avatar accent={player.accentColor} label={player.username.slice(0, 2).toUpperCase()} />
        <div>
          <p className="text-sm font-semibold tracking-[0.04em] text-white">{player.username}</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
            {positionLabel}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
          {isPerspective ? "Your force" : "Hidden force"}
        </p>
        <p className="mt-1 text-sm text-[var(--success)]">{player.capturedPieces} captured</p>
      </div>
    </div>
  );
}

function PieceToken({
  piece,
  ownerAccent,
}: {
  piece: BoardCellView["piece"];
  ownerAccent: string;
}) {
  if (!piece) {
    return null;
  }

  const isHidden = piece.visibility === "hidden";

  return (
    <div
      className="flex h-[72%] w-[72%] items-center justify-center rounded-2xl border text-center shadow-[0_12px_24px_rgba(0,0,0,0.16)]"
      style={{
        background: isHidden
          ? "linear-gradient(180deg, rgba(18,12,14,0.92), rgba(31,22,25,0.95))"
          : `linear-gradient(180deg, ${ownerAccent}, rgba(22,18,20,0.9))`,
        borderColor: isHidden ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.16)",
      }}
    >
      <div className="flex flex-col items-center gap-0.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
          {piece.owner}
        </span>
        <span className="text-sm font-semibold text-white">
          {isHidden ? "?" : piece.rankLabel}
        </span>
      </div>
    </div>
  );
}

function BoardCell({
  cell,
  rows,
  perspective,
  state,
}: {
  cell: BoardCellView;
  rows: number;
  perspective: PlayerId;
  state: MaskedGameState;
}) {
  const ownerAccent = cell.piece
    ? state.players[cell.piece.owner].accentColor
    : "transparent";
  const coordinate = getCoordinateLabel(cell.row, cell.column, rows);
  const showCoordinate =
    cell.row === 0 ||
    cell.row === rows - 1 ||
    cell.column === 0 ||
    cell.column === state.board.columns - 1;
  const isPerspectivePiece = cell.piece?.owner === perspective;

  return (
    <div
      className="relative aspect-square min-h-[56px] border border-[color:var(--board-grid)]"
      style={{
        backgroundColor: cell.tone === "dark" ? "var(--board-dark)" : "var(--board-light)",
      }}
    >
      {showCoordinate ? (
        <span
          className="absolute left-2 top-1.5 font-mono text-[10px] tracking-[0.14em]"
          style={{
            color:
              cell.tone === "dark"
                ? "rgba(245, 237, 226, 0.78)"
                : "rgba(48, 37, 40, 0.56)",
          }}
        >
          {coordinate}
        </span>
      ) : null}

      <div className="flex h-full items-center justify-center p-2">
        <PieceToken piece={cell.piece} ownerAccent={ownerAccent} />
      </div>

      {cell.piece && isPerspectivePiece ? (
        <span className="absolute bottom-1.5 right-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/78">
          Own
        </span>
      ) : null}
    </div>
  );
}

function StatusPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

export default function Home() {
  const perspective: PlayerId = "blue";
  const state = maskGameStateForPlayer(createMockGameState(), perspective);
  const cells = buildBoardCells(state);

  return (
    <main className="min-h-screen bg-transparent text-[var(--foreground)]">
      <div className="grid min-h-screen lg:grid-cols-[96px_minmax(0,1fr)]">
        <aside className="flex min-h-full flex-row items-center justify-between border-b border-[var(--sidebar-border)] bg-[var(--sidebar)] px-5 py-4 lg:flex-col lg:justify-start lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
          <div className="flex items-center gap-3 lg:flex-col">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04] text-lg font-semibold text-white">
              GG
            </div>
            <div className="lg:[writing-mode:vertical-rl]">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
                Generals
              </p>
            </div>
          </div>

          <nav className="hidden flex-1 items-center justify-center lg:flex">
            <ul className="flex flex-col gap-4">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href="#"
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-white/78 transition hover:bg-[var(--accent-soft)] hover:text-white"
                    aria-label={item.label}
                  >
                    <SidebarIcon icon={item.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex gap-2 lg:mt-auto lg:w-full lg:flex-col">
            <button className="rounded-2xl border border-[color:rgba(183,119,102,0.28)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[rgba(183,119,102,0.22)] lg:px-0">
              Sign Up
            </button>
            <button className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-[var(--muted)] transition hover:text-white lg:px-0">
              Log In
            </button>
          </div>
        </aside>

        <section className="relative overflow-hidden bg-[var(--background)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,68,68,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_35%)]" />
          <div className="relative mx-auto flex min-h-screen w-full max-w-[1520px] flex-col px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
            <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                  War table / hidden ranks
                </p>
                <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-none font-semibold tracking-[-0.04em] text-white sm:text-6xl">
                  Fog of command, laid out as a quiet matte-maroon war room.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
                  The board stays central, the chrome stays disciplined, and hidden information
                  remains a server concern rather than a client-side promise.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {statusItems.map((item) => (
                  <StatusPill key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
            </header>

            <div className="mt-8 grid flex-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <section className="rounded-[36px] border border-white/8 bg-[var(--panel-strong)] p-4 shadow-[var(--shadow)] sm:p-6">
                <PlayerCard
                  player={state.players.red}
                  perspective={perspective}
                  positionLabel="Opponent / North edge"
                />

                <div className="mt-4 rounded-[32px] border border-white/8 bg-[var(--board-frame)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-4">
                  <div className="mb-3 flex items-center justify-between px-1">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
                      Active theater
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
                      South perspective
                    </p>
                  </div>
                  <div
                    className="grid overflow-hidden rounded-[24px] border border-white/8 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_60px_rgba(0,0,0,0.22)]"
                    style={{
                      gridTemplateColumns: `repeat(${state.board.columns}, minmax(0, 1fr))`,
                    }}
                  >
                    {cells.map((cell) => (
                      <BoardCell
                        key={cell.coordinate}
                        cell={cell}
                        rows={state.board.rows}
                        perspective={perspective}
                        state={state}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <PlayerCard
                    player={state.players.blue}
                    perspective={perspective}
                    positionLabel="You / South edge"
                  />
                </div>
              </section>

              <aside className="grid gap-4 self-start">
                <section className="rounded-[30px] border border-white/8 bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                    Arbiter model
                  </p>
                  <div className="mt-4 grid gap-3 text-sm leading-6 text-[var(--muted)]">
                    <p>
                      This page is rendered from a masked server snapshot. Your pieces retain
                      rank labels. Opponent pieces expose only ownership and position.
                    </p>
                    <p>
                      The same projection backs the API route, which keeps the future WebSocket
                      layer honest: clients receive only the view they are entitled to inspect.
                    </p>
                  </div>
                </section>

                <section className="rounded-[30px] border border-white/8 bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                    Match feed
                  </p>
                  <ul className="mt-4 grid gap-3 text-sm text-white/88">
                    <li className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                      Blue Major advanced and now pressures the center lane.
                    </li>
                    <li className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                      Red presence on the north file remains unidentified.
                    </li>
                    <li className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                      Next integration step: authoritative move submission over WebSockets.
                    </li>
                  </ul>
                </section>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
