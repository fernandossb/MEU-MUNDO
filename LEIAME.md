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
| Mover / melhorar / demolir uma construção | **segurar o dedo** nela | segurar o botão do mouse |
| Traçar rua | botão **🛣️ Rua** → desenhar com o dedo → **✓ Construir** | desenhar com o mouse |
| Ver pedidos pendentes | botão **🧾**, ou tocar no quadrado amarelo do mapa | idem |
| Ver de onde vem cada recurso | botão **📊** | idem |
| Acelerar o tempo | tocar no **1×** ao lado da data | idem |
| Ler a história da vila | botão **📜** | idem |

Você **não precisa** dar ordens. A vila se vira sozinha: quem fica parado
procura obra, depois o recurso mais escasso; o conselho ergue o que falta.
Suas ordens são atalhos, não obrigação.

---

## O tempo, as estações e o clima

**Um dia de verdade = um ano de jogo.** O calendário é o normal: 365 dias, doze
meses com o número certo de dias em cada um, sem ano bissexto. Um dia de jogo
passa em uns **quatro minutos**, e o topo da tela mostra `Ano 1 · 02 de Junho`.

| | dura |
|---|---|
| um dia de jogo | ~3,9 min de verdade |
| um mês de jogo | ~2 h de verdade |
| um ano de jogo | **24 h de verdade** |
| uma vida (75 anos) | 75 dias de verdade |

Daí sai o resto: quem morre aos 75 anos vive dois meses e meio de tempo real —
ritmo de mundo para acompanhar todo dia, não de partida de uma tarde.

Envelhecer, casar, nascer e morrer acontecem uma vez por **dia de jogo**, com as
taxas anuais divididas por 365: o comportamento ao longo do ano é o de uma taxa
anual, só distribuído em vez de dar um salto.

O calendário antigo somava dia, mês e ano numa conta só e por isso andava
`01/Janeiro`, `02/Fevereiro`, `03/Março`: o número do dia **era** o do mês. Agora
o dia do ano (0 a 364) é repartido pelos meses com o número certo de dias em
cada um — 31 de Janeiro vira 1º de Fevereiro, e 28 de Fevereiro vira 1º de Março.

A economia não mudou de ritmo: colher, construir e comer rendem o mesmo por
minuto de jogo que sempre renderam. As cadências do motor (conselho a cada
7min30, medição de comida a cada 5 min) são medidas em segundos de verdade, e
não em frações do calendário — assim mudar a escala do tempo não desregula o
que você vê na tela.

**Não há mais noite.** Com o ano passando em uma hora, um ciclo de sol dentro
dele duraria cinco minutos — a vila piscaria entre claro e escuro o tempo todo
e todo mundo passaria metade da vida dormindo. É sempre dia, e os aldeões
trabalham sem parar.

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

---

## Você manda, eles pedem

Os aldeões **pedem licença** antes de construir: aparece um cartão com quem
pediu, o que quer erguer e quanto custa, e o terreno escolhido pisca no mapa.
Permita, recuse, ou marque *não perguntar mais*. Com o jogo fechado a vila
decide sozinha — senão uma noite de sono viraria uma cidade parada esperando
resposta.

**Pedido não some mais.** Eles se acumulam numa fila de até cinco e ficam lá
até você responder:

- o botão **🧾** na lateral abre a aba **Pedidos pendentes**, com o contador de
  quantos esperam e os três botões (permitir / recusar / onde) para cada um;
- no mapa, **tocar no quadrado amarelo** reabre aquele pedido na hora;
- o cartão de baixo mostra um pedido por vez e avisa quantos mais estão na fila.

Um pedido só cai da lista se o terreno dele for ocupado por outra coisa.

### Quem está sem trabalho pede a obra que precisa

Aldeão parado não cruza os braços. Quando ele não tem posto e não sobrou
recurso ao alcance, ele mesmo abre um pedido — *"Gabriela Silveira está sem
trabalho e pede Fazenda"*. A ordem é a ordem do aperto:

1. se o que acabou foi recurso à beira da rua, o pedido é de **quarteirão novo**
   (sai muito mais barato que uma obra);
2. depois, o posto do ofício dele (lavoura para o fazendeiro, cais para o
   pescador, serraria para o carpinteiro…);
3. depois, o que a vila estiver sentindo falta e **empregue alguém**.

Galpão e oficina ficaram de fora da lista de propósito: eles não empregam
ninguém, e a vila estava enchendo de depósito sem resolver a vida de quem
estava parado.

## Mexer no que já está de pé

**Segure o dedo** (ou o botão do mouse) em cima de qualquer construção para
abrir o menu dela:

| Ação | O que faz |
|---|---|
| ✋ **Mover** | o prédio vira fantasma; arraste o mapa e confirme no **✓**. Moradores, obra e trabalhador vão junto |
| ⬆️ **Melhorar** | Casa → Sobrado → Casarão, Fazenda → Fazenda Grande, Depósito → Mercado. Cobra só a diferença de material e encaixa o tamanho novo em volta do lote atual |
| 🧨 **Demolir** | devolve metade do material. Pede confirmação. O último Centro da Vila não pode ser demolido |

Um toque curto continua sendo o de sempre: olhar o prédio, mandar ajudar na
obra ou cuidar da lavoura.

## Traçar rua com o dedo

Botão **🛣️ Rua**: o mapa **trava** sob um dedo e o dedo passa a desenhar o
caminho da via, bloco a bloco, do tamanho que você quiser. Dois dedos continuam
movendo e dando zoom.

Enquanto desenha, cada bloco mostra o que vai acontecer:

| Cor | Significado |
|---|---|
| 🟩 verde | passa |
| 🟧 laranja | fica a menos de seis blocos de uma via paralela — passa, mas a vila avisa |
| 🟥 vermelho | impossível (água funda, construção em cima) |
| 🟦 azul | já é rua |

O rodapé mostra o total de trechos e o custo em pedra **antes** de confirmar. O
traçado é costurado sozinho até a rede que já existe, e a obra para no primeiro
bloco impossível em vez de recusar o desenho inteiro. Antes disso, um toque
traçava uma reta que quase sempre morria no terceiro bloco pela regra de folga
— era o que deixava o modo rua inutilizável.

## Pescadores e comércio

- **🎣 Cais** — só nasce na beira d'água (a vila puxa rua até o mar para
  conseguir); o pescador rende o ano todo, sem estação, só a tempestade atrapalha
- **🏪 Mercado** — troca o que sobra pelo que falta, a três por um, e aumenta o
  teto de estoque

## A vila que anda sozinha

**O conselho** reavalia a vila a cada 7min30 de verdade e decide nesta ordem:

1. **Comida**, se a despensa tem menos de 4 dias — cais primeiro, que rende o
   ano todo, depois lavoura
2. **Teto** (casa, sobrado ou casarão), se a população se aproxima do limite
   **e** o saldo de comida aguenta as bocas que vêm junto
3. **Produção** acompanhando o tamanho: uma lavoura a cada 6 moradores
4. **Serviços** conforme a vila cresce — depósito, oficina, mercado, estábulo,
   prefeitura, praça, serraria, escola
5. **Bairro novo** (outro Centro) quando está cheia e sobrando recurso
6. **Malha viária** à frente das construções

Se falta lote com frente para a rua, os próprios aldeões pedem estrada nova.

**Os ofícios mudam.** A mão de obra é repartida por proporção, não por "qual
falta mais agora" — a regra antiga mandava todo mundo para o mesmo recurso ao
mesmo tempo e a cidade virava monocultura: quinze lenhadores e nenhum pedreiro.

**Estradas** custam 1 de pedra por tile (4 na ponte sobre água rasa) e dão
**+55% de velocidade**. São construídas tile a tile, por gente de verdade — e
são o único chão por onde se anda.

**Veículos**, feitos sozinhos pelos prédios e entregues a quem coleta:

| | onde | carga | velocidade |
|---|---|---|---|
| 🛞 Carroça | Oficina | 26 (contra 12 no braço) | puxada a cavalo |
| 🐴 Cavalo | Estábulo | 6 | 1,65× — montaria |
| ⛵ Barco | Cais | 8 | pescador rende 60% mais |

---

## A regra da rua

**Gente anda na rua.** Fora do calçamento não se passa — e o que não encosta
numa rua simplesmente não existe para a vila: não dá para colher a árvore no
meio do mato, nem construir onde não há testada.

Isso muda o motor do jogo: quando o recurso da beira da rua acaba, o conselho
**abre quarteirão novo** na direção do que falta. A cidade cresce atrás do que
precisa, em vez de espalhar trilhas pelo mapa.

**Vias paralelas precisam de seis blocos de folga.** Sem essa regra a vila
enchia de calçamento e não sobrava terreno para construir — quarteirão estreito
não cabe casa. A regra vale para o conselho e para você: se a rua que você
encomendar correr rente a outra no mesmo sentido, ela é encurtada e o jogo
avisa. Por isso a vila também começa com uma **esquina** em vez de um anel: o
anel já nascia com duas vias paralelas a quatro blocos uma da outra.

**A exceção é a colheita.** Madeira, pedra e comida estão no mato, e exigir que
o recurso encostasse no calçamento travava a vila: quando acabava o que havia
na beira da rua, meia dúzia de aldeões ficava rodando sem ter o que fazer. Quem
vai colher — e quem volta carregado — sai da rua. Lá fora o que barra é o que
barraria de verdade: água funda, rocha e parede de prédio. A rua continua
valendo a pena, porque nela se anda 55% mais rápido.

Quem ficar fora do calçamento sem estar colhendo — recém-nascido, save antigo,
um canto mal resolvido — é trazido de volta para a rua mais próxima.

**As ruas nunca andam na diagonal.** Elas sobem em degraus, sempre ligadas
pelos lados. Dois tiles que só se tocam pela quina não são vizinhos nem para a
busca de caminho nem para a malha — e o traçado antigo, em diagonal, fazia a
vila nascer partida em pedaços de calçamento isolados uns dos outros. Quem
entrasse num deles não saía mais.

A folga de seis blocos é dispensada nos primeiros blocos de uma rua **com
destino** (buscar madeira, pedra ou a beira d'água). Sem isso a cidade ficava
trancada dentro de si mesma: toda saída do miolo corre paralela a alguma via, e
a vila morria cercada de floresta que não podia tocar.

Dois tetos evitam que a vila se desequilibre: no máximo **metade** dos adultos
em posto fixo (fazenda, oficina, escola…) e no máximo **um terço** no canteiro
de obras. Sem eles, a vila inteira virava construtor e ninguém trazia madeira.

## Como eles andam

As pessoas usam **busca de caminho (A*)** pelo grid de tiles, mas só quando
precisam: primeiro tentam a linha reta, e a busca só entra quando há obstáculo
nos 150 px à frente. A rota cobra mais barato por andar na rua, então a vila
usa as vias que construiu. Antes elas só escorregavam de lado ao bater — o que
resolve uma pedra e não uma casa, e por isso ficavam presas atrás dos prédios.

### Beco sem saída

O que segurava gente presa não era ficar imóvel — era **andar sem chegar**. Num
beco o aldeão vai até a ponta, volta, vai de novo: ele se mexe o tempo todo,
então o antigo contador de "travado" nunca disparava e ele nunca desistia.

Agora o que vale é **encurtar a distância até o alvo**:

- seis segundos andando sem chegar mais perto contam como travado;
- todo alvo tem prazo, proporcional à distância — quem estoura não está indo a
  lugar nenhum;
- o recurso que ninguém alcançou entra numa lista negra por um tempo, senão o
  mesmo aldeão escolheria a mesma árvore impossível a cada dois segundos;
- na terceira desistência seguida ele volta para a malha principal, que é a
  mesma regra de teletransporte que já valia para quem sai do calçamento.

A malha viária é indexada em **pedaços conectados**, e ninguém escolhe alvo
fora do próprio pedaço: nem árvore, nem lavoura, nem galpão de entrega, nem
canteiro de obras. A vila também só cresce rua a partir do pedaço principal —
antes ela preferia a ponta mais distante do centro, que costumava ser
justamente um trecho solto, e mandava todos os construtores para um canteiro
onde não dava para chegar.

Com muita gente, quem está fora da tela é atualizado em rodízio, recebendo o
tempo acumulado de uma vez: anda igual, em passos maiores, e o celular aguenta
a cidade grande.

## O painel de produção

O botão **📊** abre o livro-caixa da vila: de onde vem e para onde vai cada
recurso, por dia de jogo.

Ele é **medido, não estimado**. Cada entrada e cada saída é anotada no momento
em que acontece — colheita entregue no galpão, lavoura, mina, feira, prêmio de
meta; consumo, obras, ruas, veículos, e o que se perde com o galpão cheio. A
conta teórica já enganou o conselho uma vez: ele autorizava casas achando que
havia fartura e a vila passava fome.

Cada recurso mostra o saldo do dia, a barra de entra-contra-sai, as linhas
ordenadas por tamanho e quem está atrás daquilo (`3 lenhador(es)`,
`6 lavoura(s) e cais em atividade`). No fim, uma linha da vila: população,
despensa em dias, adultos, quantos estão sem serviço agora e quantas obras
estão abertas.

É a ferramenta que faltava para ajustar o jogo sem adivinhar. Nas sessões
anteriores eu descobri "setenta e seis lenhadores e nenhum pedreiro" e "a pedra
em três com a madeira batendo no teto do galpão" rodando simulação e imprimindo
tabela — isto põe a mesma informação na tela.

---

## A velocidade do tempo

O chip ao lado da data alterna **1× · 4× · 16×**.

Acelerar **não** é multiplicar o passo: com passo grande o aldeão pula um tile
inteiro e atravessa parede. O que o jogo faz é rodar a mesma física várias
vezes por quadro, com o passinho de sempre. Por isso existe um orçamento: se um
quadro passar de 12 ms simulando, ele corta e entrega o resto no quadro
seguinte — vila grande acelera menos, e ninguém trava. O chip fica **amarelo**
quando a vila ficou pesada demais para a velocidade pedida.

O tempo com o app fechado não muda: ele continua saindo do relógio de parede.

---

## A mina

Pedra é o único recurso que **não rebrota**, e rua custa pedra. Toda partida
acabava estrangulada, com a madeira batendo no teto do galpão e a pedra em zero.

A **⛰️ Mina** tira pedra do veio sem gastar o pedregulho que está no chão —
uns 14 por dia contra os ~10 de um pedreiro no mato. Rende mais porque custa
140 de madeira e prende um adulto para sempre; e, ao contrário do pedregulho,
nunca acaba.

Ela só pode ser cavada **encostada num veio**: o morro, ou um tile que a
natureza fez de pedra. A conta usa a pedra *natural* do terreno, não a que
sobrou — cavar fundo justamente onde o pedregulho da superfície se esgotou é o
certo. Quando não há lote com veio à mão, o conselho puxa rua até o morro, do
mesmo jeito que já puxava até a água para o cais.

O conselho ergue uma mina quando a pedra cai abaixo de 400, até uma a cada
quinze moradores.

> A mina ainda não tem arte própria e é desenhada em vetorial, como a praça e a
> prefeitura.

---

## Os prédios

Treze dos quinze prédios são arte de verdade, numa folha só embutida no arquivo
como data URI — o jogo continua sendo um arquivo único, offline. A **Casa** tem
três variantes, sorteadas por um hash do id do prédio: sempre a mesma para a
mesma casa, senão a rua se reconstruiria a cada recarregamento.

| Prédio | Arte |
|---|---|
| Centro da Vila | `centro.png` |
| Casa | `cais.png`, `casa2.png`, `sobrado1.png` |
| Sobrado | `casa3.png` |
| Casarão | `casarão.png` |
| Depósito | `depósito.png` |
| Fazenda | `fazendapequena.png` |
| Fazenda Grande | `fazendagrande.png` |
| Oficina | `oficina.png` |
| Serraria | `serraria.png` |
| Estábulo | `estabulo.png` |
| Cais | `casa1.png` |
| Mercado | `mercado.png` |
| Escola | `escola.png` |
| Praça, Prefeitura | *ainda vetoriais* |

> **Por que os nomes dos arquivos não batem com o prédio.** Três artes foram
> remanejadas para a escada de moradia fazer sentido na tela. `casa3.png` é uma
> casa de dois andares com sacada — é literalmente um sobrado, e é a arte mais
> alta que cabe num lote 2×2. `casa1.png` é uma palafita, que é o que se põe na
> beira d'água, então virou o Cais. E `cais.png` (a cabana redonda) virou
> variante de casa. Trocar de volta é uma linha em `LOTE` e um comando.

### A escada da moradia

A altura desenhada tinha de crescer junto com o prédio, senão o Sobrado (nove
moradores) aparecia menor que a Casa (cinco):

| | Desenhado | Moradores |
|---|---|---|
| Casa | 56×60, 56×48, 56×48 | 5 |
| Sobrado | 56×82 | 9 |
| Casarão | 84×101 | 14 |

Como a largura é cravada na do lote, quem manda na "presença" do prédio é a
proporção da arte: arte larga fica baixa, arte alta fica alta. Por isso a
correção foi remanejar as artes, e não esticar nenhuma — esticar sairia
deformado ou invadiria a rua.

### A regra de tamanho

**A largura desenhada é exatamente a largura do lote.** É o que garante que
nenhum prédio invade a rua ao lado — conferido prédio a prédio. A altura vem da
proporção da arte, com teto de 2,4 vezes a profundidade do lote, senão a torre
viraria um poste. A base fica cravada na beirada de baixo do lote: o telhado
sobe acima do terreno, como deve, mas nada desce para o calçamento.

### Como a folha foi montada

Os PNGs originais tinham uns 500 px de lado — seis a nove vezes o que o jogo
desenha, e 2,1 MB no total. Cada um foi recortado no que não é transparente e
reduzido para o tamanho de tela vezes 2,2, que é a folga que o zoom máximo
precisa. A redução usa alfa pré-multiplicado, senão a borda ganha halo escuro.

Duas economias fizeram a folha caber: **filtro adaptativo no PNG** (testar os
cinco filtros por linha e ficar com o de menor soma absoluta) e **arredondar a
cor em degraus de oito** — em arte chapada isso não muda nada aos olhos. De
2,1 MB para 306 KB.

Janela acesa, fumaça de chaminé e os enfeites desenhados à mão (sulcos da
lavoura, toldo do mercado, roda da oficina) valem só para os prédios vetoriais:
a arte nova já traz tudo isso desenhado, e fumaça saindo de um telhado liso
parece defeito, não vida.

---

## As pessoas

Três personagens em arte pixel — **homem, mulher e criança** — cada um com oito
direções e animação de caminhada. Criança não tem sexo: é criança.

- **Criança** (0–17): não trabalha, brinca perto de casa
- **Adulto** (18+): trabalha a plena força; depois dos 60 rende um pouco menos
- Morrem por volta dos **75 anos**

Cada pessoa tem nome, sobrenome, um jeito, cônjuge, filhos e casa. Quem nasce
com escola aberta na vila trabalha 20% melhor pelo resto da vida.

**Ofícios**: lenhador, colhedor, pedreiro, construtor, fazendeiro, pescador,
carpinteiro (serraria), professor (escola), comerciante (mercado) e
administrador (prefeitura). Os quatro últimos são postos fixos: ficam presos ao
prédio. No máximo metade dos adultos fica em posto — alguém precisa colher.

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

Uma partida típica fica em torno de **30% crianças**, com o resto em idade de
trabalhar — na faixa de uma cidade de fronteira em expansão.

Outras regras: cada pessoa come **144 de comida por ano** (os mesmos 6 por hora de verdade de sempre); vira adulta aos **18**
e morre por volta dos **75**; sem comida, a vila entra em fome, os nascimentos
param e as mortes aumentam.

### O crescimento vem da imigração, não do berço

Com o tick valendo um ano inteiro, a taxa antiga (quase um filho por casal
**por ano**) dava vinte e sete filhos por casal ao longo da vida fértil. A vila
virava um berçário: medindo, **71% da população tinha menos de dezoito anos** —
e criança não trabalha. Era isso que enchia a tela de gente parada.

O número certo sai do próprio censo acima. Numa população que cresce uns 3% ao
ano, a natalidade bruta precisa cobrir as mortes (1/75) mais o crescimento:
~4,6% da população por ano. Como as mulheres em idade fértil são perto de 18%
da vila, dá **0,26 filho por casal por ano** — um filho a cada quatro anos, que
é ritmo de família de verdade.

Quem faz a vila crescer, então, é a **família que se muda**: duas a cinco
pessoas de uma vez, com ~62% de adultos (antes era sempre "o casal e o resto
criança", o que sozinho já emperrava a pirâmide). Elas chegam de dois jeitos —
quando uma casa fica pronta, e quando a vila tem **cama sobrando e despensa
cheia**, porque aí ela atrai gente de fora. Sem essa segunda porta o
crescimento parava seco assim que o conselho abria teto à frente da população:
a casa ficava lá, vazia, esperando um bebê que demora anos.

Por isso o conselho também não espera lotar para construir — abre teto enquanto
a folga for pequena diante do tamanho da vila, com o freio de sempre: só ergue
casa se a lavoura já aguentar as bocas a mais.

Medido depois do ajuste: adultos ficam **ociosos 0,2% do tempo**, e os ofícios
voltaram a se repartir (lenhador, colhedor, pedreiro, lavoura, postos) em vez
da monocultura de fazenda que aparecia antes — o teto de "metade dos adultos em
posto fixo" agora **dispensa** quem sobra, e não só deixa de nomear mais.

---

## A vila continua sem você

Ao fechar e reabrir, o jogo recupera até **24 horas** de ausência — o que dá
até **24 dias de vila, dois anos**. O relatório diz **a que horas você saiu e a
que horas voltou**, e o que aconteceu no meio: quanto foi colhido, quem nasceu,
quem morreu, o que foi construído.

Isso vale para as três formas de sair, não só para fechar o app de vez:

- **botão Voltar** (que manda o app para segundo plano sem matá-lo);
- **tela apagada** ou app trocado;
- **app fechado** de verdade.

Nos dois primeiros casos o app não é recarregado — o WebView só congela, e com
ele congelava a vila inteira.

**Quem manda é o relógio de parede, não os avisos do sistema.** A cada quadro o
jogo compara o `Date.now()` com o do quadro anterior; se ele pulou, o aparelho
esteve dormindo e a diferença é cobrada. Isso não depende do `visibilitychange`
chegar (no WebView do Android ele nem sempre chega) nem do `performance.now()`,
que conta tempo de máquina acordada e não tempo de calendário. Voltou a
desenhar um quadro? O tempo é cobrado. A casca nativa ainda avisa o jogo no
`onPause` e no `onResume`, mas só para adiantar e para o save ficar fresco caso
o Android mate o processo.

**O relógio anda o tempo exato, não em dias inteiros.** Este era o defeito que
fazia parecer que nada corria com o app fechado: a recuperação só avançava o
calendário uma vez por unidade cheia, e essa unidade é uma hora de verdade — logo
sair por cinquenta minutos movia o relógio em zero. Agora o resto do dia entra
na conta.

Como cada minuto real vale vinte e quatro minutos de vila, dá para conferir
na hora: **três minutos fora = 1h12 de vila; meia hora = 12 horas; oito horas =
oito dias.** Ausência curta mostra um aviso; a partir de dez minutos abre o
relatório completo.

A recuperação produz e consome **dia a dia** (não de uma vez só), senão
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

## Metas

O botão **🎯** abre as metas da vila. Todas empurram para o mesmo objetivo:
mais gente vivendo bem, sem passar fome. Cumprir uma rende recurso — não há
moeda no jogo, então o prêmio é o que destrava a próxima obra.

As nove primeiras ensinam o jogo e cabem nas primeiras horas. Depois começa a
**escada longa**, cada degrau multiplicando o anterior:

| Meta | Moradores |
|---|---|
| Burgo | 150 |
| Comuna | 400 |
| 👑 Capital | **1.000** |
| 🌆 Metrópole | 10.000 |
| 🌃 Megalópole | **100.000** |
| 🌍 Reino Infinito | **1.000.000** |

No caminho há metas de apoio: 600 e 5.000 trechos de rua, 60 construções de pé,
40 lavouras trabalhando, e um **século de vila** (cem anos desde a fundação).
São metas de longuíssimo prazo de propósito — a cidade tem para onde crescer
por muito tempo.

## O que o conselho persegue

A vila tem um objetivo declarado: **crescer sem passar fome**. Ele decide oito
vezes com base em duas contas — quantos dias a despensa aguenta e qual
o **saldo real de comida**, medido (não estimado: a conta teórica
ignorava o tempo gasto andando até o recurso e errava cinco vezes para mais).

Só abre teto novo quando a lavoura já sustenta as bocas que vêm junto. Quando
falta terreno com frente para a rua, os próprios aldeões pedem estrada nova —
e a rua atravessa água rasa virando **ponte**, por quatro vezes o preço.

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
