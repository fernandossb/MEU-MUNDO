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

$arquivo  = Join-Path $PSScriptRoot "meu-mundo.jks"
$anotacao = Join-Path $PSScriptRoot "SEGREDOS-PARA-O-GITHUB.txt"

if (Test-Path $arquivo) {
    if (Test-Path $anotacao) {
        # A chave já existe e as anotações também: só mostra tudo de novo.
        Write-Host "A chave ja existe e os valores estao anotados." -ForegroundColor Green
        Write-Host "Abrindo $anotacao"
        Write-Host ""
        Get-Content $anotacao | Write-Host
        Start-Process notepad.exe $anotacao
        exit 0
    }
    Write-Host "Existe um meu-mundo.jks aqui, mas nao existe o arquivo de anotacoes" -ForegroundColor Yellow
    Write-Host "com a senha - ou seja, a senha se perdeu e essa chave nao serve." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Como nada foi assinado com ela ainda, o certo e apagar e refazer:" -ForegroundColor Yellow
    Write-Host "  del meu-mundo.jks, chave-base64.txt" -ForegroundColor Cyan
    Write-Host "e rodar este script de novo." -ForegroundColor Yellow
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

# Confere que a senha realmente abre a chave antes de seguir.
& $keytool -list -keystore $arquivo -storepass $senha -storetype PKCS12 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "A chave foi criada mas nao abriu com a senha. Apague o .jks e tente de novo." -ForegroundColor Red
    exit 1
}

$base64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($arquivo))
$saida = Join-Path $PSScriptRoot "chave-base64.txt"
Set-Content -Path $saida -Value $base64 -Encoding ascii -NoNewline

# Grava os 4 valores num arquivo. Senha que só existe no console some quando a
# janela fecha — e perder a senha da chave significa nunca mais atualizar o app
# por cima. O arquivo esta no .gitignore e nao vai para o GitHub.
@"
SEGREDOS DO MEU MUNDO - cadastre em:
https://github.com/fernandossb/MEU-MUNDO/settings/secrets/actions

Clique em "New repository secret" e crie um por um, com estes nomes exatos:

[1] ANDROID_KEYSTORE_BASE64
    Valor: o conteudo inteiro do arquivo chave-base64.txt
    (abra o arquivo, Ctrl+A, Ctrl+C, cole no campo)

[2] ANDROID_KEYSTORE_PASSWORD
    Valor: $senha

[3] ANDROID_KEY_ALIAS
    Valor: $alias

[4] ANDROID_KEY_PASSWORD
    Valor: $senha

--------------------------------------------------------------------
GUARDE a senha acima e o arquivo meu-mundo.jks em lugar seguro
(gerenciador de senhas, backup). Sem eles voce nao consegue mais
publicar atualizacao por cima da versao ja instalada no celular.

Depois de cadastrar os 4 segredos, pode apagar ESTE arquivo.
--------------------------------------------------------------------
"@ | Set-Content -Path $anotacao -Encoding utf8

Write-Host ""
Write-Host "Chave criada: $arquivo" -ForegroundColor Green
Write-Host "Valores anotados em: $anotacao" -ForegroundColor Green
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
Write-Host "Tudo isso tambem esta salvo em SEGREDOS-PARA-O-GITHUB.txt," -ForegroundColor Green
Write-Host "entao a senha nao se perde se voce fechar esta janela." -ForegroundColor Green
Write-Host ""
Write-Host "Depois de cadastrar os 4, va em Actions > 'Gerar APK' > 'Run workflow'"
Write-Host "para compilar ja assinado."
Write-Host ""
Write-Host "O .jks, o chave-base64.txt e as anotacoes estao no .gitignore:" -ForegroundColor DarkGray
Write-Host "nao vao para o GitHub." -ForegroundColor DarkGray

Start-Process notepad.exe $anotacao
