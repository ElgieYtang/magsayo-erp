# RTS ERP — Frontend

Office web app for ResponsivCode ERP (React + Vite + JavaScript + Tailwind).

## Run locally

```bash
cd C:\erp-system\frontend
npm install
npm run dev
```

Open http://localhost:5173 (Vite uses the next free port if 5173 is busy).

Laravel API proxy: `/api` → `http://127.0.0.1:8000` (when backend is running).

## Stack

- React 19 + Vite 8
- JavaScript only (`.jsx` / `.js`)
- Tailwind CSS v4
- React Router
- Lucide icons

## Source

Ported from `erp-gui` prototype (TypeScript → JavaScript via `scripts/port-from-gui.mjs`).

Data is still in-memory via `DemoContext` until Laravel endpoints are wired slice by slice.

## Re-port from prototype

If `erp-gui` is updated:

```bash
node scripts/port-from-gui.mjs
```
