# Deployment (production outline)

## Stack

| Layer | Host |
|--------|------|
| API | Laravel `backend/public` → PHP-FPM or `php artisan serve` (dev only) |
| Web | Static `frontend/dist` behind nginx/IIS, or Vite host |
| DB | MySQL 8+ (`rts_system` or renamed) |
| Mobile | Store build; `API_BASE_URL` points to public HTTPS API |

## API (`backend/.env`)

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.your-domain.com
LOG_LEVEL=error
DB_*=production credentials
FRONTEND_URL=https://office.your-domain.com
```

Run `php artisan config:cache` and `php artisan route:cache` on the server.

## Web

```bash
cd frontend
npm ci
npm run build
```

Serve `frontend/dist`. Either:

- Proxy `/api` to the API host (same as local Vite), or
- Set `VITE_API_URL=https://api.your-domain.com/api` at build time.

## Mobile

```bash
flutter build apk --dart-define=API_BASE_URL=https://api.your-domain.com/api
```

Use HTTPS in production; update Android network security if not using TLS.

## Database

- Never commit `backend/.env` or `database/dumps/*.sql` with real data.
- Backup with `scripts/export-database.ps1` or mysqldump on a schedule.
