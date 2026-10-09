# MySQL dump for Magsayo ERP

## File

- **`rts_system.sql`** — full export of the `rts_system` database from your WAMP MySQL (same data `C:\erp-system` uses).

## phpMyAdmin import

1. Start WAMP (MySQL green).
2. Open phpMyAdmin → **Import**.
3. Choose **`rts_system.sql`** from this folder.
4. If the database does not exist yet, create **`rts_system`** first (utf8mb4_unicode_ci), then import.

Or create DB + import in one step if your phpMyAdmin allows “create database” from the dump (the file includes `DROP TABLE` statements).

## Laravel `.env`

`backend/.env` should match:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rts_system
DB_USERNAME=root
DB_PASSWORD=
```

## Re-export from WAMP (after more work in erp-system)

```powershell
& "C:\wamp64\bin\mysql\mysql8.4.7\bin\mysqldump.exe" -h 127.0.0.1 -u root --single-transaction rts_system > "C:\magsayo erp\backend\database\dumps\rts_system.sql"
```

(Adjust the `mysql8.4.7` folder name if your WAMP version differs.)

## Note

Web (`frontend/`) and mobile (`mobile/`) do **not** read this `.sql` file at runtime. They use the **live MySQL** database via `backend/` API. This file is for backup, clone, or fresh import on another PC.
