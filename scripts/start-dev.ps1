$root = Split-Path -Parent $PSScriptRoot
$apiScript = Join-Path $root "scripts\start-shared-api.ps1"
$frontend = Join-Path $root "frontend"

if (-not (Test-Path $frontend)) {
  Write-Error "Missing frontend folder. Use the full Magsayo ERP package."
  exit 1
}

Write-Host "Starting API in a new window (port 8000)..."
Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-ExecutionPolicy", "Bypass",
  "-File", $apiScript
)

Set-Location $frontend
if (-not (Test-Path "node_modules")) {
  Write-Host "Installing frontend dependencies..."
  npm install
}

Write-Host "Starting web on http://localhost:5173 (Ctrl+C to stop web only; close API window separately)"
npm run dev
