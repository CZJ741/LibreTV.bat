$host.ui.RawUI.WindowTitle = "LibreTV Service"
Set-Location -LiteralPath $PSScriptRoot

$env:PASSWORD = "libretv"
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^\s*([^#=\s]+)\s*=\s*(.*)$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
}

Write-Host "Starting LibreTV on http://localhost:8080 ..." -ForegroundColor Cyan
Write-Host "Default Password: $($env:PASSWORD)" -ForegroundColor Green
npm run start
