# Bootstrap RTS Field Flutter app using Flutter installed under this Windows user.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$flutterRoot = $env:FLUTTER_ROOT
if (-not $flutterRoot) {
    $candidates = @(
        "C:\Users\$env:USERNAME\develop\flutter",
        "C:\Users\DELL\develop\flutter",
        "C:\flutter"
    )
    foreach ($c in $candidates) {
        if (Test-Path "$c\bin\flutter.bat") {
            $flutterRoot = $c
            break
        }
    }
}
if (-not $flutterRoot) {
    throw "Flutter SDK not found. Expected C:\Users\$env:USERNAME\develop\flutter"
}

$flutter = Join-Path $flutterRoot "bin\flutter.bat"
$env:FLUTTER_ROOT = $flutterRoot
$env:PATH = "$(Join-Path $flutterRoot 'bin');$env:PATH"

Write-Host "Using Flutter SDK: $flutterRoot"
Write-Host "Fetching packages..."
& $flutter pub get
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Devices:"
& $flutter devices

Write-Host ""
Write-Host "Start Laravel: php artisan serve --host=0.0.0.0 --port=8000"
Write-Host "Then: flutter run"
Write-Host "Emulator API: http://10.0.2.2:8000/api"
