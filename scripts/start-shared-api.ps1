# Starts the shared Laravel API used by mobile (and future web transaction sync).
$root = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $root "backend"

if (-not (Test-Path $backend)) {
  Write-Error "Missing folder: $backend"
  exit 1
}

Set-Location $backend

if (-not (Test-Path ".env")) {
  Write-Host "Copy .env.example to .env and configure MySQL before first run."
  Copy-Item ".env.example" ".env" -ErrorAction SilentlyContinue
}

if (-not (Test-Path "vendor")) {
  Write-Host "vendor/ missing. Copy from a machine with composer install, or run: composer install"
  Write-Host "Example: cd backend && composer install"
}

$phpExe = $env:PHP_BIN
if (-not $phpExe -or -not (Test-Path $phpExe)) {
  $candidates = Get-ChildItem "C:\wamp64\bin\php\*\php.exe" -ErrorAction SilentlyContinue |
    Sort-Object FullName -Descending |
    Select-Object -First 1
  if ($candidates) { $phpExe = $candidates.FullName }
}
if (-not $phpExe) { $phpExe = "php" }

& $phpExe artisan serve --host=0.0.0.0 --port=8000
