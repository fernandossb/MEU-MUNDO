# Cria a chave que assina o APK. Rode UMA VEZ.
#
# Sem uma chave fixa, cada compilação sai com assinatura diferente e o Android
# recusa instalar a atualização por cima ("app não instalado"). Com ela, o jogo
# se atualiza sozinho pelo GitHub.
#
# Como usar: clique com o botão direito neste arquivo > "Executar com PowerShell"
# (ou rode  powershell -ExecutionPolicy Bypass -File criar-chave-de-assinatura.ps1)
#
# A chave NÃO vai para o GitHub como arquivo: ela vira 4 segredos no repositório.
# Guarde o arquivo .jks e a senha em lugar seguro — se perder, você não consegue
# mais publicar atualização por cima da versão já instalada.

$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot

Write-Host ""
Write-Host "=== Chave de assinatura do Meu Mundo ===" -ForegroundColor Cyan
Write-Host ""

# --- acha o keytool ---
$keytool = $null
foreach ($p in @(
    "$env:JAVA_HOME\bin\keytool.exe",
    "C:\Program Files\Java\jre1.8.0_461\bin\keytool.exe",
    "C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe"
)) { if ($p -and (Test-Path $p)) { $keytool = $p; break } }
if (-not $keytool) {
    $cmd = Get-Command keytool -ErrorAction SilentlyContinue
    if ($cmd) { $keytool = $cmd.Source }
}
if (-not $keytool) {
    Write-Host "Nao encontrei o keytool (vem junto com o Java)." -ForegroundColor Red
    exit 1
}
Write-Host "keytool: $keytool" -ForegroundColor DarkGray

$arquivo = Join-Path $PSScriptRoot "meu-mundo.jks"
if (Test-Path $arquivo) {
    Write-Host "Ja existe um meu-mundo.jks aqui. Se criar outro, o app instalado" -ForegroundColor Yellow
    Write-Host "para de aceitar atualizacao. Apague o arquivo antes se for mesmo trocar." -ForegroundColor Yellow
    exit 1
}

# --- senha forte, gerada aqui ---
$bytes = New-Object byte[] 18
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$senha = [Convert]::ToBase64String($bytes) -replace '[+/=]', 'x'
$alias = 'meu-mundo'

& $keytool -genkeypair -v `
    -keystore $arquivo `
    -storetype PKCS12 `
    -keyalg RSA -keysize 2048 -validity 10000 `
    -alias $alias `
    -storepass $senha -keypass $senha `
    -dname "CN=Meu Mundo, OU=Jogo, O=fernandossb, L=Brasil, C=BR" | Out-Null

if (-not (Test-Path $arquivo)) { Write-Host "Falhou ao criar a chave." -ForegroundColor Red; exit 1 }

$base64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($arquivo))
$saida = Join-Path $PSScriptRoot "chave-base64.txt"
Set-Content -Path $saida -Value $base64 -Encoding ascii -NoNewline

Write-Host ""
Write-Host "Chave criada: $arquivo" -ForegroundColor Green
Write-Host ""
Write-Host "AGORA CADASTRE OS 4 SEGREDOS NO GITHUB" -ForegroundColor Cyan
Write-Host "Abra: https://github.com/fernandossb/MEU-MUNDO/settings/secrets/actions"
Write-Host "e clique em 'New repository secret' para cada um:"
Write-Host ""
Write-Host "  Nome: ANDROID_KEYSTORE_BASE64" -ForegroundColor Yellow
Write-Host "  Valor: o conteudo inteiro do arquivo chave-base64.txt"
Write-Host "         (abra o arquivo, Ctrl+A, Ctrl+C)"
Write-Host ""
Write-Host "  Nome: ANDROID_KEYSTORE_PASSWORD" -ForegroundColor Yellow
Write-Host "  Valor: $senha"
Write-Host ""
Write-Host "  Nome: ANDROID_KEY_ALIAS" -ForegroundColor Yellow
Write-Host "  Valor: $alias"
Write-Host ""
Write-Host "  Nome: ANDROID_KEY_PASSWORD" -ForegroundColor Yellow
Write-Host "  Valor: $senha"
Write-Host ""
Write-Host "Anote essa senha em lugar seguro. Ela nao aparece de novo." -ForegroundColor Red
Write-Host ""
Write-Host "Depois de cadastrar os 4, va em Actions > 'Gerar APK' > 'Run workflow'"
Write-Host "para compilar ja assinado."
Write-Host ""
Write-Host "O .jks e o chave-base64.txt estao no .gitignore: nao vao para o GitHub." -ForegroundColor DarkGray
