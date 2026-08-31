# Reino Infinito

Um simulador de vila viva num mapa procedural sem bordas. As pessoas nascem,
crescem, escolhem ofício, casam, envelhecem e morrem — e o conselho da vila
decide o que construir **mesmo com o jogo fechado**.

Tudo vive em **um único arquivo** (`index.html`): nenhuma biblioteca, nenhuma
requisição de rede, nenhuma instalação. Funciona 100% offline no celular.

> O jogo é pacífico por decisão de projeto: não há exércitos, combate nem
> inimigos, e nada disso está planejado.

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

## A vila que anda sozinha

**O conselho** reavalia a vila a cada ano e decide, nesta ordem:

1. **Casa**, se a população encostou no teto — e só com comida guardada para
   sustentar mais bocas (o freio que impede a bola de neve)
2. **Fazenda**, uma a cada 8 moradores
3. **Depósito**, se muita gente está andando longe demais para entregar
4. **Estrada**, ligando o que ficou solto na malha
5. **Oficina** (10+ moradores) e **Estábulo** (18+)
6. **Centro da Vila** novo, quando a vila está cheia e sobrando recurso — é
   assim que a expansão vira infinita

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

## Rodar offline no celular

1. Copie **`index.html`** para o telefone (cabo, Google Drive, mandar pra si mesmo — tanto faz).
2. Abra pelo gerenciador de arquivos escolhendo o Chrome.
3. Pronto. O jogo salva sozinho no aparelho, a cada 0,6 s e ao sair.

Para testar pela Wi-Fi antes de copiar, com o celular na mesma rede do PC:

```bash
node servidor.js
```

E abra `http://IP-DO-PC:8123` no celular (`ipconfig` mostra o IP).

Se o navegador bloquear o armazenamento local, o jogo continua rodando —
só não salva.

---

## Estrutura

```
index.html    o jogo inteiro (terreno, IA, demografia, desenho, save)
servidor.js   servidor estático de 20 linhas, só para testar na rede local
LEIAME.md     este arquivo
```

O save mora no `localStorage`, na chave `reinoInfinito.v2`, e ocupa ~3 KB
para uma vila de 10 pessoas.

---

## O que ainda não existe

- **Pathfinding A\***: hoje as pessoas contornam obstáculos por desvio simples.
  Funciona com prédios espalhados; vai falhar quando a vila virar um labirinto.
- **Depleção de recursos no modo offline**: com o jogo fechado, as árvores não
  diminuem. Simplificação consciente — o teto de estoque segura o exagero.
- **Estações do ano e clima**.

[un]: https://www.un.org/development/desa/pd/sites/www.un.org.development.desa.pd/files/aging_theme_household_size_and_composition_around_the_world_2017_data_booklet.pdf
[genus]: https://genus.springeropen.com/articles/10.1186/s41118-024-00211-6
[nature]: https://www.nature.com/articles/s44284-026-00447-7
[oecd]: https://www.oecd.org/en/data/indicators/labour-force-participation-rate.html
[usa]: https://usafacts.org/answers/what-is-the-labor-force-participation-rate-in-the-us/country/united-states/
[census]: https://www.census.gov/library/stories/2025/06/metro-areas-median-age.html
