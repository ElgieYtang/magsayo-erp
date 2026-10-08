# Magsayo ERP — full stack (web + mobile + API)

One Laravel API and MySQL database power **both** the office web app and the Flutter field app.

## Layout

| Folder | Role |
|--------|------|
| **`backend/`** | Laravel API (`/api/*`) — quotations through accomplishments, gate pass, DR serials |
| **`frontend/`** | Office web (React + Vite) — uses the same API as mobile |
| **`mobile/`** | Flutter field app — same API, no layout changes |
| **`src/`** | Legacy TypeScript UI (browser `localStorage`) — **not** used for shared data; use **`frontend/`** |
| **`laravel/`** | Old Sanctum shell — **not** used when running the full package |

## Quick start (Windows)

### 1. Database

Create MySQL database **`rts_system`** (WAMP/phpMyAdmin). Import your data or run migrations.

### 2. API

```powershell
cd "C:\magsayo erp\backend"
copy .env.example .env
# Edit .env: DB_*, then:
composer install
php artisan key:generate
php artisan migrate
php artisan serve --host=0.0.0.0 --port=8000
```

Check: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

### 3. Web

```powershell
cd "C:\magsayo erp\frontend"
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite proxies `/api` → port 8000.

Login: **`login`** field (e.g. `admin` / `p@ssw0rd` from `setup_users`).

### 4. Mobile

```powershell
cd "C:\magsayo erp\mobile"
flutter pub get
flutter run
```

Emulator API: `http://10.0.2.2:8000/api` (default). Phone: `flutter run --dart-define=API_BASE_URL=http://YOUR-PC-IP:8000/api`

### One script (API + web)

```powershell
cd "C:\magsayo erp"
powershell -File scripts\start-dev.ps1
```

## How sync works

- Web **`frontend/`** loads and saves transactions through **`backend/`**.
- **Mobile** uses the same endpoints and presenters (`TransactionPresenter` camelCase JSON).
- Change a DR on web → refresh mobile (or reopen list) → same data from MySQL.

## Optional SQL

`backend/docs/sql/add_item_barcode.sql` — item barcodes for DR scanning.

See also `docs/MOBILE_AND_WEB.md`.
