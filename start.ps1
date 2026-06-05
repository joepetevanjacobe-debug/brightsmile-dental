# ============================================================
#  Confi-dent Family Dental Care — local dev launcher
#  Starts the Spring Boot backend and the Vite frontend.
#  Run from PowerShell:   .\start.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

# --- Paths (adjust if your installs move) ---
$JavaHome = "C:\Users\Joepet Evan\AppData\Local\jdks\jdk-21.0.10"
$Mvn      = "C:\Users\Joepet Evan\.maven\maven-3.9.16\bin\mvn.cmd"

# --- Database connection (local MySQL) ---
$DbUrl  = "jdbc:mysql://localhost:3306/brightsmile?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$DbUser = "root"
$DbPass = "Jacobe123!"

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host " Confi-dent Family Dental Care - starting services" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# --- 1. Backend (Spring Boot, port 8080) ---
Write-Host "`n[1/2] Starting backend (Spring Boot) on http://localhost:8080 ..." -ForegroundColor Yellow
$backendCmd = @"
`$env:JAVA_HOME = '$JavaHome'
`$env:SPRING_DATASOURCE_URL = '$DbUrl'
`$env:SPRING_DATASOURCE_USERNAME = '$DbUser'
`$env:SPRING_DATASOURCE_PASSWORD = '$DbPass'
Set-Location '$root\brightsmile-api'
& '$Mvn' spring-boot:run
"@
Start-Process powershell -ArgumentList '-NoExit', '-Command', $backendCmd

# --- 2. Frontend (Vite, port 3000/3001) ---
Write-Host "[2/2] Starting frontend (Vite) ..." -ForegroundColor Yellow
$frontendCmd = "Set-Location '$root\brightsmile-web'; npm run dev"
Start-Process powershell -ArgumentList '-NoExit', '-Command', $frontendCmd

Write-Host "`n-----------------------------------------------------" -ForegroundColor Green
Write-Host " Two new PowerShell windows are launching." -ForegroundColor Green
Write-Host " Backend : http://localhost:8080" -ForegroundColor Green
Write-Host " Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host " Admin   : /admin/login  -  admin@brightsmile.com / admin123" -ForegroundColor Green
Write-Host "-----------------------------------------------------" -ForegroundColor Green
Write-Host " The backend takes ~10-20s to finish starting." -ForegroundColor DarkGray
Write-Host " Close those windows to stop the servers." -ForegroundColor DarkGray
