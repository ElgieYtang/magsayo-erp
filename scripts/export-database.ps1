# Export WAMP MySQL rts_system into backend/database/dumps/rts_system.sql
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "backend\database\dumps"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$outFile = Join-Path $outDir "rts_system.sql"

$mysqldump = Get-ChildItem "C:\wamp64\bin\mysql\*\bin\mysqldump.exe" -ErrorAction SilentlyContinue |
  Sort-Object FullName -Descending | Select-Object -First 1
if (-not $mysqldump) {
  Write-Error "mysqldump not found under C:\wamp64\bin\mysql"
}

$db = $env:DB_DATABASE
if (-not $db) { $db = "rts_system" }

& $mysqldump.FullName -h 127.0.0.1 -u root --single-transaction --routines --triggers $db |
  Set-Content -Path $outFile -Encoding utf8

Write-Host "Exported $db -> $outFile ($((Get-Item $outFile).Length) bytes)"
