# QA checklist (web + mobile + DB)

Run after bootstrap or before a release.

## Environment

- [ ] WAMP MySQL running
- [ ] `backend/.env` → `DB_DATABASE=rts_system`
- [ ] `powershell -File scripts\bootstrap.ps1` completed
- [ ] API: `php artisan serve --host=0.0.0.0 --port=8000`
- [ ] `powershell -File scripts\smoke-test.ps1` → health OK

## Auth

- [ ] Web login at http://localhost:5173 (`login` + password)
- [ ] Mobile login (same user)

## Shared data (pick one flow)

- [ ] Create or edit a **delivery receipt** on web → visible on mobile after refresh
- [ ] Scan **product barcode** + **serial** on mobile → saved → visible on web DR detail

## Barcodes

- [ ] `setup_items.barcode` populated (run `backend/docs/sql/add_item_barcode.sql` if column missing)
- [ ] At least one test item barcode matches a DR line

## Admin vs staff

- [ ] Staff can open mobile modules and read setup lists (customers/items)
- [ ] Admin can approve/dispatch outslip on web

## Not in scope for shared DB

- [ ] Confirm you are **not** using `npm run dev:legacy-gui` (`src/`) for UAT
