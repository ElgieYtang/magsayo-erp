# Web + mobile shared API

## Canonical stack

- **API:** `backend/` on `http://127.0.0.1:8000` (use `--host=0.0.0.0` for phones/emulators)
- **Web:** `frontend/` — React app wired to `/api` (same as `erp-system` office app)
- **Mobile:** `mobile/` — Flutter app, same routes and `{ data }` JSON shape

## Not shared

- **`src/`** (root TypeScript app) still stores transactions in **localStorage**. It does not read MySQL. Use **`npm run dev`** (frontend) for production-style workflows.
- **`laravel/`** was an older API for `/setups` only; the full ERP API lives in **`backend/`**.

## Auth

| Client | Login endpoint | Body |
|--------|----------------|------|
| Web `frontend/` | `POST /api/auth/login` | `{ "login": "admin", "password": "..." }` |
| Mobile | same | same |

Web login UI accepts username/email; send it as `login`.

## After you change data on web

Mobile lists refresh on pull-to-refresh / revisit screen. Both clients hit the same tables (`delivery_receipts`, `outslips`, etc.).
