# Reino Infinito

Um simulador de vila viva num mapa procedural sem bordas. As pessoas nascem,
crescem, escolhem ofício, casam, envelhecem e morrem — e o conselho da vila
decide o que construir **mesmo com o jogo fechado**.

Tudo vive em **um único arquivo** (`index.html`): nenhuma biblioteca, nenhuma
requisição de rede, nenhuma instalação. Funciona 100% offline no celular.

> O jogo é pacífico por decisão de projeto: não há exércitos, combate nem
> inimigos, e nada disso está planejado.

## O mundo

O relevo tem praia, campo, **mata fechada**, morros, serras de rocha e **picos
com neve** — as montanhas se formam em cadeias no interior dos continentes, não
como picos soltos no meio do campo. O terreno é sombreado pela inclinação
(encosta virada para a luz clareia, a oposta escurece), que é o que faz o mapa
ter volume em vez de ser mancha colorida.

Os pesos do relevo foram **medidos, não chutados**: amostrando 40 mil tiles, a
combinação escolhida dá cerca de 7% de terreno alto sem mexer na linha da água.
Regiões diferentes do mundo têm caráter diferente — pode ser preciso viajar
para achar montanha.

---

## Como jogar

| Ação | Celular | Computador |
|---|---|---|
| Mover o mapa | arrastar | arrastar ou `WASD` |
| Zoom | pinçar com 2 dedos | roda do mouse |
| Selecionar uma pessoa | tocar nela | clicar nela |
| Ver a ficha (nome, idade, família) | tocar **de novo** na pessoa selecionada | idem |
| Mandar coletar | com alguém selecionado, tocar numa árvore, arbusto ou pedra | idem |
| Construir | botão do prédio → arraste o mapa para mirar → **✓** | idem, ou `Enter` |
| Cuidar da fazenda | pessoa selecionada → tocar na fazenda | idem |
| Ler a história da vila | botão **📜** | idem |

Você **não precisa** dar ordens. A vila se vira sozinha: quem fica parado
procura obra, depois o recurso mais escasso; o conselho ergue o que falta.
Suas ordens são atalhos, não obrigação.

---

## O tempo, as estações e o clima

O ano continua em **5 minutos**. Para o dia e a noite serem assistíveis, o ciclo
do sol precisa de uns 25 segundos — o que dá exatamente **12 ciclos por ano**.
Então cada mês passa como um dia completo: o relógio marca a hora, a data anda
de mês em mês. Foi o único jeito de ter dia e noite mantendo a proporção.

À noite todo mundo larga o serviço e volta para casa: as ruas esvaziam, as
janelas acendem. As taxas de coleta foram aumentadas para compensar o
expediente menor.

As quatro estações (hemisfério sul) e o clima mexem na lavoura:

| | efeito na lavoura |
|---|---|
| 🌸 Primavera | ×1,25 — e a mata **rebrota**, então o mapa não fica pelado |
| ☀️ Verão | ×1,00 |
| 🍂 Outono | ×0,85 |
| ❄️ Inverno | ×0,40 |
| 🌧️ Chuva | ×1,35, mas todos andam 10% mais devagar |
| 🌨️ Neve | ×0,25 e 22% mais devagar |
| ⛈️ Tempestade | tira o barco da água e atrasa o passo em 28% |

## Você manda, eles pedem

Os aldeões **pedem licença** antes de construir: aparece um cartão com quem
pediu, o que quer erguer e quanto custa, e o terreno escolhido pisca no mapa.
Permita, recuse, ou marque *não perguntar mais*. Com o jogo fechado a vila
decide sozinha — senão uma noite de sono viraria uma cidade parada esperando
resposta.

Você também traça ruas: botão **🛣️ Rua**, toque no destino, e a equipe abre a
via a partir da rede que já existe, pagando 1 de pedra por trecho.

## Pescadores e comércio

- **🎣 Cais** — só nasce na beira d'água (a vila puxa rua até o mar para
  conseguir); o pescador rende o ano todo, sem estação, só a tempestade atrapalha
- **🏪 Mercado** — troca o que sobra pelo que falta, a três por um, e aumenta o
  teto de estoque

## A vila que anda sozinha

**O conselho** reavalia a vila a cada ano e decide, nesta ordem:

1. **Rua nova**, se a malha está menor que o tamanho da população pede — a via
   vem antes do lote
2. **Fazenda**, se a comida está curta (menos de 8 por morador guardados)
3. **Casa**, se a população encostou no teto e há comida para sustentar mais
   bocas — o freio que impede a bola de neve
4. **Fazenda** de rotina, uma a cada 7 moradores
5. **Oficina** (10+ moradores) e **Estábulo** (18+)
6. **Depósito**, se muita gente anda longe demais para entregar
7. **Centro da Vila** novo, quando a vila está cheia e sobrando recurso — é
   assim que a expansão vira infinita

Se falta lote com frente para a rua, ele abre rua e constrói no ano seguinte.

**Os ofícios mudam.** Todo ano parte dos adultos reconsidera a vida e migra
para o recurso mais escasso. Sem isso, quem virava colhedor no primeiro ano
nunca mais mudava e a vila morria sem pedra.

**Estradas** custam 1 de pedra por tile e dão **+55% de velocidade** a quem
anda por cima. São construídas tile a tile, por gente de verdade.

**Veículos**, feitos sozinhos pelos prédios e entregues a quem coleta:

| | onde | carga | velocidade |
|---|---|---|---|
| 🛞 Carroça | Oficina | 26 (contra 12 no braço) | 0,92× |
| 🐴 Cavalo | Estábulo | 6 | 1,65× |

---

## As pessoas

Seis perfis desenhados: **criança**, **adulto** e **idoso**, em masculino e
feminino. Criança é menor e tem a cabeça maior; idoso anda curvado, de cabelo
branco e bengala; mulher usa saia e cabelo comprido. Cada pessoa tem nome,
sobrenome, um jeito (teimosa, generoso, sonhador…), cônjuge, filhos e casa.

- **Criança** (0–14): não trabalha, brinca perto de casa
- **Adulto** (15–64): trabalha a plena força
- **Idoso** (65+): coleta a 60%, carrega 70%, anda mais devagar — e continua útil

A **📜 Crônica** guarda a história: casamentos, nascimentos, mortes, mudanças
de ofício, obras. É onde a vila vira narrativa.

---

## Demografia baseada em censo real

Os números não foram inventados:

| Regra do jogo | Dado real |
|---|---|
| Cada casa nova traz **2 a 5 pessoas** | 80% dos países têm domicílios de **2,3 a 5** pessoas; média global ~3,45 ([ONU][un], [Genus][genus]) |
| Alvo de ~25% crianças, ~10% idosos | razão de dependência global caiu de 0,87 para **0,59** entre 2000 e 2020 → ~63% em idade ativa ([Nature Cities][nature]) |
| Nem todo adulto trabalha | participação na força de trabalho ~**61%** ([OCDE][oecd], [USAFacts][usa]) |
| Crescimento de vila em expansão | metrópole que mais cresceu nos EUA: **38,9% numa década** (~3,3%/ano) ([US Census][census]) |

Uma partida típica fica em torno de **25% crianças e 7% idosos**, com ~4,8% de
crescimento ao ano — na faixa de uma cidade de fronteira em expansão.

Outras regras: cada pessoa come **6 de comida por ano**; um ano de jogo dura
**5 minutos**; vida entre 62 e 92 anos; sem comida, a vila entra em fome, os
nascimentos param e as mortes aumentam.

---

## A vila continua sem você

Ao fechar e reabrir, o jogo recupera até **6 horas** de ausência — o que dá
até **72 anos de vila**. Aparece um relatório do que aconteceu: quanto foi
colhido, quem nasceu, quem morreu, o que foi construído.

A recuperação produz e consome **ano a ano** (não de uma vez só), senão
qualquer ausência longa viraria fome garantida. As obras que o conselho
enfileira durante a ausência também são erguidas, e a oficina e o estábulo
continuam produzindo.

**O estoque tem teto: 300 + 700 por depósito.** O que passa disso se perde.
É o que dá função ao Depósito e o que impede a economia de explodir enquanto
você dorme.

---

## Jogar no celular

Três caminhos, do mais simples ao mais completo:

**1. Aplicativo (APK)** — o jeito recomendado
Baixe o APK mais recente em
[Releases](https://github.com/fernandossb/MEU-MUNDO/releases/latest) e instale.
O app **procura atualização sozinho** ao abrir: se houver versão nova, ele
mostra o que mudou, baixa e instala. Sua vila continua salva.

**2. Pelo navegador, sem instalar**
https://fernandossb.github.io/MEU-MUNDO/ — abre e joga. Precisa de internet só
para carregar a página; depois funciona.

**3. Arquivo solto, 100% offline**
Copie o `index.html` para o telefone e abra escolhendo o Chrome. Nem rede,
nem instalação.

Para testar pela Wi-Fi com o celular na mesma rede do PC: `node servidor.js`
e abra `http://IP-DO-PC:8123` (o `ipconfig` mostra o IP).

O jogo salva sozinho a cada 0,6 s e ao sair. Se o navegador bloquear o
armazenamento local, ele continua rodando — só não salva.

---

## Como as atualizações funcionam

Cada envio para o `main` dispara dois robôs:

| Robô | O que faz |
|---|---|
| **Gerar APK** | confere a sintaxe do jogo, empacota no app, compila e publica um Release novo |
| **Publicar prévia** | atualiza o site do GitHub Pages |

O número da versão é a **contagem de commits** — ninguém edita versão à mão.
O Release recebe a tag `build-N`, e é exatamente essa tag que o app compara
com o próprio `versionCode` para saber se há coisa nova.

### A chave de assinatura (uma vez só)

O Android recusa instalar uma atualização assinada com chave diferente da que
está no aparelho. Por isso, rode **uma vez**:

```powershell
powershell -ExecutionPolicy Bypass -File criar-chave-de-assinatura.ps1
```

Ele cria a chave e mostra os 4 segredos para cadastrar em
[Settings → Secrets → Actions](https://github.com/fernandossb/MEU-MUNDO/settings/secrets/actions):
`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`,
`ANDROID_KEY_PASSWORD`.

Sem esses segredos o robô ainda compila, mas sai uma **versão de teste**: ela
instala normalmente, só não aceita atualizar por cima (é preciso desinstalar
antes). Com eles, a atualização automática funciona.

> A chave e o `chave-base64.txt` estão no `.gitignore` e nunca vão para o
> GitHub. Guarde o `.jks` e a senha: perdê-los significa não conseguir mais
> atualizar por cima da versão instalada.

---

## Estrutura

```
index.html                     o jogo inteiro (terreno, IA, demografia, desenho, save)
app/                           casca Android (WebView + checagem de atualização)
.github/workflows/             os dois robôs: APK e prévia
criar-chave-de-assinatura.ps1  gera a chave de assinatura (rodar uma vez)
servidor.js                    servidor estático, só para testar na rede local
```

O jogo é copiado para dentro do app só na hora de compilar — não existe uma
segunda cópia no repositório para sair do lugar.

O save mora no `localStorage`, na chave `reinoInfinito.v2`, e ocupa ~3 KB
para uma vila de 10 pessoas. **Atualizar o app não apaga o save.**

---

## O que ainda não existe

- **Pathfinding A\***: hoje as pessoas contornam obstáculos por desvio simples.
  Funciona com prédios espalhados; vai falhar quando a vila virar um labirinto.
- **Depleção de recursos no modo offline**: com o jogo fechado, as árvores não
  diminuem. Simplificação consciente — o teto de estoque segura o exagero.
- **Estações do ano e clima**.
- **Depleção de recursos com o jogo fechado**: as árvores não diminuem offline.

[un]: https://www.un.org/development/desa/pd/sites/www.un.org.development.desa.pd/files/aging_theme_household_size_and_composition_around_the_world_2017_data_booklet.pdf
[genus]: https://genus.springeropen.com/articles/10.1186/s41118-024-00211-6
[nature]: https://www.nature.com/articles/s44284-026-00447-7
[oecd]: https://www.oecd.org/en/data/indicators/labour-force-participation-rate.html
[usa]: https://usafacts.org/answers/what-is-the-labor-force-participation-rate-in-the-us/country/united-states/
[census]: https://www.census.gov/library/stories/2025/06/metro-areas-median-age.html
