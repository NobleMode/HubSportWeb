param (
    [string]$Command,
    [string]$Type
)

function Show-Usage {
    Write-Host "Usage: .\qs.ps1 start [full|min]" -ForegroundColor Yellow
    Write-Host "   full : Installs dependencies, setup DB, and starts servers."
    Write-Host "   min  : Just starts the backend and frontend servers."
}

if ($Command -ne "start") {
    Show-Usage
    exit
}

if ($Type -eq "full") {
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "      HubSport Quick Start: FULL" -ForegroundColor Cyan
    Write-Host "=========================================="
    
    # Backend Setup
    Write-Host "`n[1/5] Backend: Installing dependencies..." -ForegroundColor Green
    Push-Location backend
    npm install
    if ($LASTEXITCODE -ne 0) { Write-Error "Backend install failed"; Pop-Location; exit }
    
    Write-Host "`n[2/5] Backend: Generating Prisma Client..." -ForegroundColor Green
    npx prisma generate
    if ($LASTEXITCODE -ne 0) { Write-Error "Prisma generate failed"; Pop-Location; exit }

    Write-Host "`n[3/5] Backend: Pushing DB Schema..." -ForegroundColor Green
    npx prisma db push
    if ($LASTEXITCODE -ne 0) { Write-Error "Prisma db push failed"; Pop-Location; exit }

    Write-Host "`n[4/5] Backend: Seeding Database..." -ForegroundColor Green
    npm run prisma:seed
    if ($LASTEXITCODE -ne 0) { Write-Error "Database seeding failed"; Pop-Location; exit }
    Pop-Location

    # Frontend Setup
    Write-Host "`n[5/5] Frontend: Installing dependencies..." -ForegroundColor Green
    Push-Location frontend
    npm install
    if ($LASTEXITCODE -ne 0) { Write-Error "Frontend install failed"; Pop-Location; exit }
    Pop-Location
}
elseif ($Type -ne "min") {
    Show-Usage
    exit
}

# Start Servers (Min Start)
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "      HubSport Quick Start: SERVERS" -ForegroundColor Cyan
Write-Host "=========================================="

Write-Host "Starting Backend..." -ForegroundColor Green
Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "backend" -WindowStyle Normal

Write-Host "Starting Frontend..." -ForegroundColor Green
Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "frontend" -WindowStyle Normal

Write-Host "`nServers started in separate windows." -ForegroundColor Cyan
