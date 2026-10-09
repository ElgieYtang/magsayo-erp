# Magsayo ERP — full stack (web + mobile + API)

One Laravel API and MySQL database power **both** the office web app and the Flutter field app.

## What to use (only this for real data)

| Folder | Role |
|--------|------|
| **`backend/`** | Laravel API (`/api/*`) — **run this on port 8000** |
| **`frontend/`** | Office web — `npm run dev` |
| **`mobile/`** | Flutter field app |

**Do not use for shared data:** root **`src/`** (localStorage), **`laravel/`** (old API). See `src/LEGACY_README.md` and `laravel/README.md`.

## First-time setup (Windows)

```powershell
cd "C:\magsayo erp"
npm run bootstrap
```

Then:

1. **WAMP** — MySQL on; database **`rts_system`** (empty? Import `backend\database\dumps\rts_system.sql` in phpMyAdmin).
2. **Run everything:**
   ```powershell
   npm run dev:all
   ```
3. **Mobile** (separate terminal):
   ```powershell
   cd mobile
   flutter run
   ```
4. **Verify API:**
   ```powershell
   npm run smoke
   ```

- Web: http://localhost:5173 — login field **`login`** (e.g. `admin`).
- API health: http://127.0.0.1:8000/api/health
- Mobile emulator API: `http://10.0.2.2:8000/api`

## Database

- **Live data:** MySQL **`rts_system`** (`backend/.env`).
- **Backup file:** `backend/database/dumps/rts_system.sql` — re-export with `scripts\export-database.ps1`.
- **Not** `backend/database/database.sqlite` (Laravel default only).

## How web and mobile stay in sync

Both call **`backend/`** → same MySQL. Change a record on web; refresh on mobile.

## Docs

| Doc | Purpose |
|-----|---------|
| `docs/MOBILE_AND_WEB.md` | Architecture |
| `docs/DEPLOYMENT.md` | Production |
| `docs/QA_CHECKLIST.md` | Manual QA |
| `backend/docs/sql/add_item_barcode.sql` | DR product barcode column |

## Git remotes

Push target: **https://github.com/ElgieYtang/magsayo-erp** (`git remote add magsayo-erp …` if needed).
