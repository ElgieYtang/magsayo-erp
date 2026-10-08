# RTS ERP — Laravel API

JSON API at `/api/*` for the React office UI (and later Flutter).

## Requirements

- PHP 8.2+ (WAMP: `C:\wamp64\bin\php\php8.3.28\php.exe`)
- Composer
- MySQL database `rts_system`

## Setup

```powershell
$php = "C:\wamp64\bin\php\php8.3.28\php.exe"
cd backend
copy .env.example .env
# Set DB_* for rts_system
& $php artisan key:generate
& $php artisan storage:link
& $php artisan erp:hash-passwords
& $php artisan serve
```

### Path migrations (legacy DB)

Do **not** run bare `artisan migrate` (conflicts with existing tables). Run only when a phase doc says so, e.g.:

```powershell
& $php artisan migrate --path=database/migrations/2026_08_20_000003_phase4_fulfillment_tables.php --force
```

## Main API surface (auth required unless noted)

| Area | Paths |
|------|--------|
| Health (public) | `GET /api/health` |
| Auth | `POST /api/auth/login` (throttled), `GET /api/auth/me`, `POST /api/auth/logout` |
| Setup | `/api/setup/{resource}` |
| Transactions | quotations, purchase-orders, receivings, outslips, delivery-receipts, billings |
| Reports | `/api/reports/soa`, `customer-ledger`, `supplier-ledger`, `inventory` |
| Accomplishments | `/api/accomplishments` (+ photos) |

## Production

- `APP_ENV=production`, `APP_DEBUG=false`
- `FRONTEND_URL` for CORS when SPA is on another origin
- `storage:link` for public disk photos
- See root [README.md](../README.md) and [docs/PHASES.md](../docs/PHASES.md)
