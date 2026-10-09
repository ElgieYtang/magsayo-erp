# One-time (or after clone) setup for Magsayo ERP on Windows.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"
$mobile = Join-Path $root "mobile"

function Find-Php {
  if ($env:PHP_BIN -and (Test-Path $env:PHP_BIN)) { return $env:PHP_BIN }
  $wamp = Get-ChildItem "C:\wamp64\bin\php\*\php.exe" -ErrorAction SilentlyContinue |
    Sort-Object FullName -Descending | Select-Object -First 1
  if ($wamp) { return $wamp.FullName }
  return "php"
}

function Find-Composer {
  if (Get-Command composer -ErrorAction SilentlyContinue) { return "composer" }
  $php = Find-Php
  $phar = Join-Path $backend "composer.phar"
  if (-not (Test-Path $phar)) {
    Write-Host "Downloading composer.phar..."
    Invoke-WebRequest -Uri "https://getcomposer.org/download/latest-stable/composer.phar" -OutFile $phar
  }
  return "$php `"$phar`""
}

Write-Host "=== Magsayo ERP bootstrap ===" -ForegroundColor Cyan
Write-Host "Root: $root"

# Backend
Set-Location $backend
if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host "Created backend/.env from .env.example — set DB_DATABASE=rts_system and DB_PASSWORD if needed."
}
$php = Find-Php
$composer = Find-Composer
if (-not (Test-Path "vendor")) {
  Write-Host "Running composer install..."
  Invoke-Expression "$composer install --no-interaction"
}
if (-not (Select-String -Path ".env" -Pattern "^APP_KEY=base64:" -Quiet)) {
  Write-Host "Generating APP_KEY..."
  & $php artisan key:generate --force
}
Write-Host "Running migrations (safe if DB already imported)..."
& $php artisan migrate --force 2>&1 | Out-Host

# Frontend
Set-Location $frontend
if (-not (Test-Path "node_modules")) {
  Write-Host "Running npm install (frontend)..."
  npm install
}
if (-not (Test-Path ".env") -and (Test-Path ".env.example")) {
  Copy-Item ".env.example" ".env"
}

# Mobile
Set-Location $mobile
if (Get-Command flutter -ErrorAction SilentlyContinue) {
  Write-Host "Running flutter pub get..."
  flutter pub get
} else {
  Write-Host "Flutter not on PATH — skip mobile pub get."
}

Set-Location $root
Write-Host ""
Write-Host "Bootstrap done." -ForegroundColor Green
Write-Host "Next:"
Write-Host "  1. WAMP MySQL on, database rts_system (import backend\database\dumps\rts_system.sql if empty)"
Write-Host "  2. npm run dev:all   OR   scripts\start-dev.ps1"
Write-Host "  3. mobile: cd mobile && flutter run"
Write-Host "  4. scripts\smoke-test.ps1   (API must be running)"
