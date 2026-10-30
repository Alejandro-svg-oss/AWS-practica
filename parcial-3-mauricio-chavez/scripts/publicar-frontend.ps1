# Publica el frontend usando la IP actual de la EC2 de este proyecto.
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$awsLocal = Join-Path $PSScriptRoot 'aws-local.ps1'
$bucket = 'mauriciochavez-parcial-3-frontend'
$instance = 'i-031090590308b639f'
Push-Location $projectRoot
try {
    $account = & $awsLocal sts get-caller-identity --query Account --output text
    if ($LASTEXITCODE -ne 0 -or $account.Trim() -ne '377002438877') { throw 'No se pudo confirmar la cuenta AWS esperada.' }
    $details = & $awsLocal ec2 describe-instances --instance-ids $instance --query 'Reservations[0].Instances[0].[State.Name,PublicIpAddress]' --output json | ConvertFrom-Json
    if ($LASTEXITCODE -ne 0 -or $details[0] -ne 'running' -or -not $details[1]) { throw 'La EC2 del proyecto debe estar activa y tener IP pública.' }
    $env:VITE_API_URL = "http://$($details[1]):3000"
    $response = Invoke-WebRequest -Uri "$env:VITE_API_URL/api/clientes" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -ne 200) { throw 'La API no respondió correctamente; no se publicó el frontend.' }
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw 'Falló la compilación; no se publicó el frontend.' }
    & $awsLocal s3 sync dist/assets "s3://$bucket/assets/" --cache-control 'public,max-age=31536000,immutable' --only-show-errors
    if ($LASTEXITCODE -ne 0) { throw 'Falló la subida de los archivos; no se publicó index.html.' }
    & $awsLocal s3 cp dist/index.html "s3://$bucket/index.html" --cache-control 'no-cache' --content-type 'text/html; charset=utf-8' --only-show-errors
    if ($LASTEXITCODE -ne 0) { throw 'Falló la publicación de index.html.' }
    Write-Host "Frontend publicado con API $env:VITE_API_URL"
} finally {
    Remove-Item Env:VITE_API_URL -ErrorAction SilentlyContinue
    Pop-Location
}
