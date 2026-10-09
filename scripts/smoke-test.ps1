# Quick check: API health + optional login (set $LoginUser / $LoginPass).
$ErrorActionPreference = "Continue"
$base = "http://127.0.0.1:8000/api"

Write-Host "GET $base/health"
try {
  $health = Invoke-RestMethod -Uri "$base/health" -Method Get -TimeoutSec 5
  Write-Host "  status: $($health.status)" -ForegroundColor Green
} catch {
  Write-Host "  FAILED — start API: cd backend && php artisan serve --host=0.0.0.0 --port=8000" -ForegroundColor Red
  exit 1
}

$user = $env:ERP_SMOKE_USER
$pass = $env:ERP_SMOKE_PASS
if ($user -and $pass) {
  Write-Host "POST $base/auth/login"
  try {
    $body = @{ login = $user; password = $pass } | ConvertTo-Json
    $login = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -Body $body -ContentType "application/json"
    $who = if ($login.user.username) { $login.user.username } else { $login.user.name }
    Write-Host "  login OK for $who" -ForegroundColor Green
  } catch {
    Write-Host "  login FAILED: $_" -ForegroundColor Yellow
  }
} else {
  Write-Host "Skip login (set ERP_SMOKE_USER and ERP_SMOKE_PASS to test)."
}

Write-Host "Smoke test finished."
