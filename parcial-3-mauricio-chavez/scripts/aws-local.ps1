# Ejecuta AWS CLI con las variables AWS_* de .env sin mostrarlas en pantalla.
$envPath = Join-Path (Split-Path $PSScriptRoot -Parent) '.env'
if (-not (Test-Path -LiteralPath $envPath)) { throw 'No se encontró el archivo .env.' }
$aws = Get-Command aws -ErrorAction SilentlyContinue
if ($aws) { $awsPath = $aws.Source } else {
    $awsPath = Join-Path $env:LOCALAPPDATA 'Programs\Amazon\AWSCLIV2\aws.exe'
    if (-not (Test-Path -LiteralPath $awsPath)) { throw 'AWS CLI no está instalado o no está disponible en PATH.' }
}
$allowed = @('AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN')
foreach ($line in Get-Content -LiteralPath $envPath) {
    if ($line -match '^\s*(AWS_[A-Z_]+)\s*=(.*)$' -and $matches[1] -in $allowed) {
        $name = $matches[1]; $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($name, $value, 'Process')
    }
}
if ($env:AWS_REGION) { $env:AWS_DEFAULT_REGION = $env:AWS_REGION }
& $awsPath @args
exit $LASTEXITCODE
