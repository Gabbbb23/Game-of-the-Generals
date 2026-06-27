# Game of the Generals

A modern web implementation of Game of the Generals built on Next.js.

The current project includes:
- A matte-maroon game interface with sidebar, board, coordinates, and player cards
- Server-side masked game-state scaffolding for hidden-information play
- A demo API route that returns per-player board views

## Project Status

Right now, the playable work lives in `frontend/`.

There is not yet a real multiplayer backend or WebSocket move loop. The `backend/`
directory is still just a placeholder.

## Run From Repo Root

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Then open:

```text
http://localhost:3000
```

## Production Commands

Build the frontend:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

## Demo API

The secure masking demo route exposes player-specific board state:

- `GET /api/game/demo/blue`
- `GET /api/game/demo/red`

Example:

```bash
curl http://localhost:3000/api/game/demo/blue
```

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4

## Notes

- If `pnpm` is not installed, install it with `npm install -g pnpm`.
- The root `package.json` forwards commands into `frontend/` so you can work from
  the repo root without remembering the subdirectory.
- Piece glyph assets in `frontend/public/pieces/` were imported from
  `PuffyThePuff/game-of-the-generals-AI`:
  https://github.com/PuffyThePuff/game-of-the-generals-AI
  That repository does not appear to include a license file, so confirm reuse
  permissions before distributing this project publicly.
