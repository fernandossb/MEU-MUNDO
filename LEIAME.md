# Reino Infinito

Um simulador de vila viva num mapa procedural sem bordas. As pessoas nascem,
crescem, escolhem ofício, casam, envelhecem e morrem — e o conselho da vila
decide o que construir **mesmo com o jogo fechado**.

Tudo vive em **um único arquivo** (`index.html`): nenhuma biblioteca, nenhuma
requisição de rede, nenhuma instalação. Funciona 100% offline no celular.

> O jogo é pacífico por decisão de projeto: não há exércitos nem combate, e
> nada disso está planejado. Desde a Fase 7 existe uma disputa **de território
> e prosperidade** contra vilas rivais opcionais — mas ninguém empunha arma;
> quem vive melhor atrai a gente da vizinha, e é assim que se domina. Veja
> [A disputa de território](#a-disputa-de-território).

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
| Voltar ao Centro da Vila | botão **🏰** | idem |
| Trocar o nome da vila | botão **☰** → campo *Nome* | idem |
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

## A vila tem nome

Ela nasce com um: o nome sai das duas famílias fundadoras — *Serra dos
Silveira*, *Porto dos Lopes*. Você troca quando quiser, no **☰**, e ele aparece
no menu, na crônica e no botão 🏰.

---

## Linhagem: a semente das dinastias

Cada pessoa carrega **pai, mãe, geração e ano de nascimento**. Quem morre não
some: vai para um cemitério enxuto (`jogo.ancestrais`) com o mesmo registro,
mais o ano da morte. A ficha de qualquer aldeão já mostra de quem ele é filho,
quantos filhos teve, e quantos deles já se foram — e o nome do pai continua
aparecendo depois que o pai morreu.

**Por que isto entrou tão cedo, se a árvore genealógica é a última coisa do
roteiro:** história só se acumula para frente. Se a captura começasse junto com
a tela, todo mundo que já viveu nasceria sem pais, e a graça toda era poder
subir do bisneto até o fundador do ano 1. Com uma vida durando 75 dias de
verdade, quem jogar dois meses vê três gerações passarem — mas só se estiverem
gravadas.

A família que se muda já chega com três degraus: os mais velhos são a geração
1, o casal a 2, as crianças a 3. Assim a árvore não começa rasa nem para quem
chegou hoje.

O cemitério tem teto de 4000 registros, e a poda derruba primeiro quem **não é
pai nem mãe de ninguém** — uma limpeza nunca corta o meio de uma linhagem.

---

## Bairros

O botão **🗺️ Bairro**, na barra de construção, trava o mapa sob um dedo e deixa
você pintar o chão: **🏠 moradia** ou **🌾 produção**. O conselho passa a
preferir aqueles pedaços na hora de escolher o lote.

Até aqui o seu papel era aprovar ou recusar o que a vila pedia — o lugar era
sempre escolha dela. A zona inverte isso sem tirar a autonomia: o conselho
continua decidindo **o que** e **quando**; você diz **onde**.

É preferência, não cerca. Sem lote na zona certa, a vila constrói fora dela em
vez de parar — regra que trava é regra que quebra o jogo, e este já teve becos
demais. Os bairros só aparecem na tela dentro do modo bairro; fora dele a
cidade fica limpa.

---

## As estações no chão

Elas mexiam na lavoura desde sempre, mas o mapa era o mesmo o ano inteiro. Agora
o terreno muda: o **inverno** branqueia a terra (rasa no campo, funda no morro),
o **outono** puxa o verde para o ocre, a **primavera** satura, o **verão**
resseca de leve. A água não muda — lago congelado seria outra história, e
mexer nela confundiria a leitura do que é navegável.

O mapa é assado em pedaços e guardado. Se cada pedaço lesse o mês na hora, um
assado em Junho e outro em Setembro ficariam de cores diferentes lado a lado —
então todos são pintados com o mesmo mês, e o mapa inteiro se refaz quando a
**estação** vira: quatro remontagens por ano de jogo, uma a cada seis horas de
verdade.

---

## As dinastias

Esta é a última peça do roteiro, e a única que **não precisou de código novo
para existir**: a linhagem vinha sendo gravada desde a Fase 2 exatamente para
este momento.

O botão **🌳 Linhagem**, na ficha de qualquer aldeão, abre a árvore: de quem ele
veio, subindo até o fundador, e quem veio dele, descendo até os bisnetos. Os
mortos aparecem em cinza, com as duas datas; tocar num deles abre a árvore
dele, tocar num vivo abre a ficha.

O desenho é lista indentada, não diagrama: numa tela de celular a árvore larga
vira emaranhado, e o que se quer saber é *"de quem eu venho e quem veio de
mim"*, que a lista responde melhor.

> Numa vila pequena os ramos se cruzam — o mesmo bisavô chega pelo lado do pai e
> pelo da mãe. A árvore guarda quem já entrou e fica com a aparição mais
> próxima, senão ele apareceria duas vezes.

## A linha do tempo

O filtro **⏳ história** da crônica troca a lista por um gráfico: moradores,
construções e ruas ao longo dos anos, com **faixa vermelha em cada ano de crise
ou de fome** — que é onde as curvas dobram. Abaixo, os anos em que a vila mais
mudou.

Como a linhagem, a história só acumula para frente: um retrato por ano, quatro
números, seiscentos anos de teto.

---

## Crises

A única adversidade era a fome — e fome é consequência de má administração, não
acontecimento. Faltava o que não se controla.

| | O que faz | Quanto dura |
|---|---|---|
| 🌵 **Seca** | a lavoura rende metade | 30 a 90 dias |
| 🤒 **Doença** | os idosos morrem 3× mais; os adultos, 1,4× | 20 a 60 dias |
| 🔥 **Incêndio** | um prédio cai para 33% e os moradores ficam sem teto | instantâneo |

Todas são sobreviveis de propósito. Uma de cada vez, nada abaixo de vinte
moradores, e o **Centro da Vila nunca queima** — crise que acaba com o jogo não
é crise. Medido em dois anos de vila: 12% do tempo sob alguma crise e um
incêndio. A vila apanha, se recupera, e a crônica ganha o que contar.

---

## Pessoas memoráveis

O `traco` era enfeite: dez palavras bonitas que não mudavam nada. Se duas
pessoas fazem exatamente o mesmo, não há por que lembrar de nenhuma — e lembrar
delas era o pedido original deste jogo.

Agora cada jeito mexe em **uma** coisa: *trabalhadora* colhe 20% mais,
*destemido* anda 15% mais rápido, *generoso* carrega 30% a mais, *calado*
constrói 20% mais rápido, *teimosa* insiste o dobro antes de desistir, *curiosa*
procura recurso 40% mais longe, *sonhador* anda devagar mas aprende bem,
*paciente* rende mais no posto, *brincalhona* vive quatro anos a mais.

E cada um acumula o que fez: obras erguidas, material trazido, filhos criados.
O filtro **⭐ notáveis** da crônica lista quem mais fez pela vila, com o jeito e
os feitos ao lado — e tocar num nome abre a ficha dele. A conta soma coisas de
naturezas diferentes de propósito: o construtor calado e a lenhadora
trabalhadora disputam a mesma lista.

---

## A crônica ganhou filtro

Com duzentas e quarenta entradas, achar quem nasceu no meio de trinta obras era
impossível. Os chips separam **vida**, **obras**, **crises** e **vila** — e o
⭐ notáveis, que mostra gente em vez de eventos.

## Seguir um aldeão

Na ficha de qualquer pessoa, o botão **👁 Seguir** gruda a câmera nela. Ela vai
atrás com folga (puxar direto para o centro a cada quadro dá enjoo), e qualquer
arrasto seu solta na hora: quem manda na câmera é você.

## Demolir avisa

Demolir casa habitada deixava gente sem teto em silêncio. Agora o aviso diz
quantos perdem a casa e **se a vila tem teto sobrando para eles**.

---

## O galpão cheio

Isto o painel de produção denunciava desde que nasceu: **102 de comida por dia
indo para o lixo** numa vila de 83 pessoas. Foram três causas somadas, e o
conserto precisou das três:

1. o gatilho de depósito era *"gente longe de um galpão"* — que mede distância,
   não espaço. Agora a falta de espaço também manda construir;
2. o conselho erguia lavoura até um sexto da população **independente de já haver comida
   demais**: treze lavouras para oitenta e três bocas. Com a despensa perto do
   teto, a vila para de plantar;
3. os pesos dos ofícios são **relativos** — com os três recursos fartos, todos
   caíam para 0,5 e a repartição continuava a mesma. Trinta e três colhedores
   trazendo comida que transbordava. Agora o galpão cheio zera o peso daquele
   recurso.

Medido depois: perda de **102 → 15,6 por dia**, lavouras de 13 → 10, e a mão de
obra rebalanceada (colhedores 33 → 24, pedreiros 2 → 7).

---

## A cadeia de produção

Madeira, comida e pedra eram terminais: entravam no galpão e paravam. Serraria
e oficina existiam como prédio e não faziam nada além de ocupar um trabalhador.

| Prédio | Transforma | Efeito |
|---|---|---|
| 🪚 **Serraria** | madeira → **🟫 tábua** (3 por 1) | com tábua no galpão, **toda obra anda 50% mais rápido** |
| 🛞 **Oficina** | madeira + pedra → **🔨 ferramenta** | quem colhe com ferramenta rende **35% mais**, e a ferramenta se gasta |

Os dois bens **nunca são exigência, só bônus**. Acabou a tábua, a obra continua
— mais devagar. Acabou a ferramenta, colhe-se no ritmo de antes. Isso é de
propósito: insumo obrigatório vira travamento, e este jogo já teve um beco
desses com a pedra.

O desgaste da ferramenta é o que dá demanda contínua à oficina: uma oficina
sustenta uns sete colhedores, então a vila precisa de mais conforme cresce.
Tábua e ferramenta só aparecem no alto da tela depois que há como fabricá-las.

### O conselho precisou de conserto para isso funcionar

A cadeia não saía do papel: numa vila de setenta e três moradores havia **zero
serrarias**. A regra de moradia acerta quase sempre, e como o conselho devolve
assim que enfileira uma obra, ela consumia todas as rodadas — o bloco de
serviços nunca era alcançado. Agora a moradia tem cota (no máximo duas casas em
obra ao mesmo tempo) e oficina e serraria acompanham o tamanho da vila, em vez
de serem "uma e pronto".

---

## A fila de obras

O painel 📊 termina com o que está sendo construído: prédio e rua, com quanto já
andou, quantos estão martelando e — quando é o caso — **parada**, que é o aviso
de que ninguém pegou aquele canteiro.

## Marcadores no minimapa

O minimapa mostrava um borrão amarelo igual para tudo. Agora se distingue o que
precisa de atenção: **laranja** para canteiro de prédio, **azul** para obra de
rua, **amarelo piscando** para pedido esperando resposta, e um **círculo
branco** no Centro da Vila.

---

## Pontes

A água rasa sempre virou ponte de madeira (4 de pedra o trecho). Agora a **água
funda** também pode ser vencida, a 9 de pedra o trecho, **desde que a travessia
seja curta** — cinco tiles é rio, não mar. O vão é medido no sentido em que a
rua está indo, então a vila atravessa um rio e não calça um lago.

> **Este mundo não tem rios.** Amostrando 766 tiles de água funda num raio de
> 300 tiles, nenhum tinha travessia curta: o relevo nasce de ruído de elevação,
> que produz costa e lago, não canal. O mecanismo da ponte está pronto e
> testado, mas não há o que atravessar até o gerador de terreno ganhar rios — e
> isso mudaria o mapa de quem já joga, o que a regra do mapa fixo não permite
> sem começar vila nova.

---

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

## A grade de quarteirões

As ruas cresciam pela ponta mais distante do centro, e esticavam de quatro a
sete tiles sempre para fora — nunca fechando o que ficava para trás. Isso dava
tentáculos, e casa erguida na ponta de um tentáculo, uma fileira de fundo só. A
regra antiga de manter seis blocos de folga entre vias tentava consertar isso
medindo vizinho a vizinho, e deixava só cinco tiles de miolo — onde um prédio
grande (três de profundidade) cabe uma vez, com um tile morto sobrando.

Agora existe uma **grade**, ancorada no Centro, com período de nove tiles: rua,
oito de quarteirão, rua. O crescimento inverteu a lógica — em vez de esticar a
fronteira, ele **fecha o quarteirão aberto mais perto do centro**, um lado do
anel por vez, e só solta lote depois que a quadra está com os quatro lados
calçados. É o que faz a rua transversal nascer antes das casas, em vez de a
cidade virar uma fita descendo o mapa sem cruzamento nenhum.

O oito não é gosto: quatro prédios grandes (4×3, o maior do jogo) em arranjo
2×2, todos com testada para a rua, pedem miolo de 8×6. Com quarteirão quadrado,
o período de nove garante isso sempre, em qualquer parte do mapa:

```
 #########        # rua
 #.......#        . miolo do quarteirão, 8×8
 #[][][].#        [] prédio grande 4×3, encostado na testada
 #[][][].#        as duas fileiras do meio sobram de quintal
 #.......#
 #[][][].#
 #[][][].#
 #.......#
 #########
```

Testado num quarteirão vazio: cabem exatamente 4 prédios grandes (4×3), ou 8
médios (3×2), ou 12 casas (2×2) — a testada é que limita, não a área.

A folga de seis blocos saiu de cena — a grade garante o espaçamento por
construção, sem precisar medir nada. E a rua com destino (a que busca madeira,
pedra ou beira d'água) agora anda **em L pela própria grade** em vez de em
diagonal escalonada: sai pela linha em que já está, vira a esquina, chega. Ela
não precisa mais perseguir árvore — desde a Fase 3 o aldeão sai da rua para
colher — então sua única função voltou a ser ligar prédio e dar velocidade.

Vila que já existe fica com o traçado torto que tem: não dá para redesenhar
rua já construída sem demolir o que está encostado nela, e o mapa é fixo por
regra do projeto. O que muda é o crescimento **daqui para frente**. Vila nova
nasce certinha desde o primeiro quarteirão — a fundação (antes uma cruz de
ruas ao redor do Centro) agora é o **anel do próprio quarteirão do Centro**,
fechado de graça, sem gastar pedra.

---

## A comida com desafio de verdade

O painel de produção denunciou isto assim que passou a medir: numa vila de 73
pessoas, **uma única lavoura alimentava 30 moradores**. Oito lavouras davam
conta de setenta e três bocas, e o excedente ia para a feira ou apodrecia no
galpão — a despensa nunca precisava ser olhada, porque nunca chegava perto de
zero. O número de rendimento por segundo estava calibrado para a economia
antiga (1 hora real = 1 ano de jogo) e nunca foi reajustado quando o calendário
virou 1 dia real = 1 ano.

Agora **uma lavoura alimenta seis pessoas** — a mesma proporção que o conselho
já usava para decidir quando construir mais uma, só que a conta finalmente bate
de verdade. Três consequências, e as três são o jogo:

1. a **estação passa a doer**: o inverno derruba o rendimento da lavoura para
   40% durante três meses, e é aí que a vila come do que guardou no verão —
   é esse ciclo que dá função real à despensa e ao Depósito;
2. **colher no mato não compete mais com plantar**: fruta apanhada rendia mais
   por pessoa do que lavoura (a estação só descontava quem plantava), e a vila
   podia ignorar a lavoura inteira vivendo do mato. Agora o mato rende 55% do
   normal, e também segue a estação — pela metade da força que pesa sobre a
   lavoura, porque somar as duas quedas cheias deixava o primeiro inverno
   impossível de atravessar, não difícil;
3. a **imigração passa a exigir fartura real**: antes o gatilho era só a
   despensa em dias (que engana dos dois lados — vila pequena com galpão cheio
   parecia rica, vila grande e próspera nunca alcançava o número porque o
   galpão não cresce sozinho). Agora entra quem sobra comida medida no
   livro-caixa, não só quem tem estoque.

Ajustes que vieram junto, para a dificuldade nova não virar fome de largada:
a despensa inicial subiu de 200 para 380 (o fôlego para erguer duas lavouras
antes do primeiro inverno, que chega no quinto mês); a meta do conselho subiu
de "uma lavoura a cada seis" para **"uma a cada cinco, mais uma"** (a conta
exata dava saldo zero e a vila travava, sem excedente para crescer nem motivo
para plantar mais); o teto de gente em posto de trabalho (fazenda, mina,
oficina...) subiu de metade dos adultos para 60% (com mais lavoura por
morador, metade não tinha braço de sobra); e a fome grave (menos de 30 dias de
estoque) agora **para tudo** — antes o conselho seguia abrindo mina e casa com
quinze dias de comida no galpão porque "já tem lavoura em obra" bastava para a
regra de cima se dar por satisfeita.

No primeiro mês de outono, o conselho faz a conta do inverno e avisa em voz
alta se a despensa não vai atravessar — descobrir isso em pleno janeiro, com o
galpão vazio, é tarde demais para plantar.

---

## O aldeão no posto

Quem chegava ao trabalho parava a dois tiles do prédio e ficava ali, imóvel,
para sempre — e boa parte da sensação de "vila parada" era isto, não gente de
fato travada. Agora o posto tem duas naturezas:

- **sob um teto** (serraria, oficina, escola, mercado, mina): o aldeão entra e
  some de vista. Quem mostra que há gente ali é uma janelinha acesa, pulsando
  de leve no prédio;
- **ao ar livre** (lavoura e cais): ele entra no lote e trabalha **andando**,
  cruzando os sulcos de um lado a outro do terreno. Fazendeiro trancado dentro
  de casa seria pior do que fazendeiro parado na esquina.

A soleira por onde ele entrou fica guardada, e é para lá que ele volta ao
largar o posto — sem isso ele reapareceria no meio do lote, fora da rua, e a
regra de "gente anda na rua" o teletransportaria para o calçamento mais
próximo, que pode ser o de trás do prédio.

---

## A disputa de território

Uma vila que vive melhor não precisa de exército para tomar o lugar da
vizinha — ela só precisa **crescer mais rápido**. É essa a aposta desta fase: a
economia de comida apertada do item anterior deixa de ser só dificuldade e
vira a arma da disputa.

No menu, ao começar uma vila nova, você escolhe **quantas vilas rivais**
enfrentar (0 a 4). Elas nascem longe, em direções diferentes, e a partir daí:

- **Território é quarteirão.** Cada vila acumula pressão conforme sua
  prosperidade e, ao encher, avança a fronteira um quarteirão por vez — sempre
  preferindo terra de ninguém; só toma quarteirão de outra vila quando vive
  **1,5× melhor** que ela (sem essa margem a fronteira ficaria trocando de dono
  todo dia por causa de decimais);
- **Prosperidade é medida**, de 0 a 1, por três números: quantos dias de
  comida por boca, quanto teto ainda sobra, quantos quarteirões por morador.
  Uma vila cheia de comida sem casa vazia não atrai ninguém; uma vila com casas
  vazias e sem comida também não;
- **Ninguém empunha arma.** As pessoas migram para onde se vive melhor —
  quando a vizinha vive pior que você, gente de lá se muda para cá sozinha;
  quando é o contrário, é a sua vila que perde gente. Quando uma vila esvazia
  de vez, o território dela passa para quem tiver mais fronteira em comum —
  **quem de fato a absorveu**, não quem estava por perto por acaso.

A decisão de arquitetura que torna isto possível **sem reescrever o jogo**: a
vila rival **não é uma segunda simulação**. O miolo do jogo (alcance, A*,
desencalhar, o conselho) assume uma malha viária só, e essa foi justamente a
parte mais frágil e mais recentemente consertada — um segundo enxame de
pessoas com ruas próprias reabriria tudo aquilo, e quinhentos aldeões por vila
não caberiam no orçamento de um quadro.

Então a vizinha é um **modelo**: população, despensa, lavouras, casas e
território avançados uma vez por dia de jogo pela mesma matemática que rege a
sua vila — a mesma taxa de lavoura, o mesmo consumo por pessoa, a mesma
estação. Os prédios e as ruas dela existem e são desenhados (com uma
bandeirinha da cor dela no telhado, e a calçada num tom diferente da sua), mas
moram em listas próprias: sua malha viária continua sendo só sua, e nenhum
aldeão seu jamais tenta andar por lá. Isso também é o que permite a vizinha
**seguir vivendo com o app fechado** — ela avança pelo mesmo motor de
recuperação offline que já existia, um dia de cada vez, sem código novo para
isso.

Se você dominar todas as vilas rivais, a disputa termina — o placar de
território (🚩, no alto da tela) some, e nada te impede de seguir jogando.

---

## Arte nova para todos os prédios

Os dezesseis prédios do jogo trocaram de arte — e Praça, Prefeitura e Mina
ganharam a delas pela primeira vez; antes eram só o desenho vetorial genérico.
Casa e Sobrado, que tinham três e uma variante, agora têm onze e cinco.

A fonte desta vez não eram PNGs com canal alfa como da última vez — eram
**.jpeg**, com o fundo pintado de **preto chapado**. Isso pediu um pipeline
diferente:

1. **Conversão**: `.jpeg` não é um formato que `ferramentas/png.js` entende
   (ele só fala PNG, decodificado à mão com zlib). A conversão em si usa
   `System.Drawing` do .NET — que o Windows já tem, sem instalar nada — só
   para trocar de contêiner; nenhum pixel é recomprimido demais nesse passo;
2. **Remover o fundo**: em vez de canal alfa, um flood-fill a partir da
   BORDA da imagem, por pixels escuros **conectados**. Isso importa: a Mina
   tem trilho preto e entrada de caverna escura no meio do desenho, que não
   tocam a borda e por isso sobrevivem — um corte por "todo pixel escuro vira
   transparente", sem olhar conectividade, teria apagado metade da arte;
3. **Descartar legenda**: vários arquivos vêm de print de asset pack, com uma
   legenda em inglês numa faixa isolada por fundo preto (a torre da
   Prefeitura carregava "Stone Hall Tower" escrito embaixo dela). Texto não é
   fundo — o flood-fill não pega — mas também não é a maior peça conectada da
   imagem. A correção manteve só a **maior ilha de pixels opacos**, o que
   resolve isso sem precisar saber de antemão qual arquivo tem rótulo: letra
   separada de letra raramente forma uma ilha do tamanho de um prédio inteiro.

Cada passo foi conferido contra uma folha de contato com as 39 peças lado a
lado antes de ir para o jogo — é onde o rótulo da Prefeitura foi encontrado.

---

## A segunda leva de arte — e por que a técnica teve que mudar

Uma versão com qualidade melhorada das mesmas 39 peças chegou depois, só que
desta vez **numa montagem única** — as 39 imagens já juntas numa folha, sem
grade regular (cada fileira tem a altura do seu prédio mais alto: 4, 4, 4, 5,
6, 7, 7 e 2 peças, oito fileiras, não uma grade uniforme) e com o fundo em
**gradiente com textura**, não mais preto chapado.

Isso quebrou as duas técnicas da leva anterior:

- o flood-fill "perto do preto" não serve quando o fundo não é uma cor só;
- detectar a grade sozinho também falhou — tentei três jeitos (diferença
  contra a imagem borrada, energia de borda por coluna/linha, os dois
  suavizados) e nenhum separou bem prédio de fundo, porque o próprio fundo
  tinha textura demais para essas contas confiarem nele.

A saída foi **medir na mão**: recortar a imagem em fatias com uma régua de
pixels desenhada em cima (linhas a cada 16px, número a cada 64), e ler direto
onde cada prédio começa e termina. Lento — oito fileiras, cada uma conferida
individualmente antes de fechar a coordenada — mas confiável onde o
automático não foi.

A remoção de fundo, depois do recorte, também mudou: em vez de um valor fixo,
a cor de referência sai da **mediana dos quatro cantos daquele recorte
específico** (não a moldura inteira — uma moldura de recorte largo às vezes
cruza por cima do prédio VIZINHO, e a média saía puxada para uma cor que não
era o fundo). Mediana em vez de média por um motivo direto: se um dos quatro
cantos pegou o vizinho por engano, os outros três ainda dominam a conta.

Duas peças exigiram ajuste fino manual (a base da fonte grande e a barraca de
garrafas), encontradas comparando o antes/depois numa folha de contato — o
mesmo hábito de conferência da leva anterior.

**A Fazenda ficou de fora desta leva** — nenhuma das 39 peças é uma lavoura —
e continua com a arte processada da vez passada, só colada na mesma folha.

`ferramentas/extrair-montagem.js` faz o recorte com coordenadas medidas à mão
e a remoção de fundo por mediana; `ferramentas/anexar-fazenda.js` cola a
Fazenda reaproveitada na folha final.

---

## A terceira leva — 37 arquivos individuais, e por que isso resolveu de vez

A medição manual da leva anterior não ficou confiável — a arte publicada
saiu com recorte errado, mesmo com toda a conferência por folha de contato.
Não foi possível confirmar com certeza qual caixa media qual pixel errado
(os testes locais, em vários tamanhos de tela e níveis de zoom, não
reproduziram o defeito), mas medir grade e coluna à mão sempre foi a parte
frágil do processo — e trocar por arquivos já separados elimina essa parte
inteira, não só conserta o sintoma.

Desta vez o usuário mandou **um arquivo por prédio** (37 PNGs, numerados) —
exatamente o formato mais confiável que este projeto já usou. Sem grade pra
adivinhar, sem risco de uma caixa pegar o vizinho, cada peça já vem isolada.

Um detalhe novo: os recortes têm **dois estilos de fundo** diferentes,
conforme a ferramenta que gerou cada um —

- **preto chapado** (um punhado de arquivos): a mesma remoção por
  flood-fill de sempre;
- **fundo claro com uma AURÉOLA ESCURA contornando a silhueta** (a
  maioria): um "drop shadow" que sobra colado nas bordas do prédio se só o
  fundo claro for removido. A correção é uma segunda passada de flood-fill,
  desta vez partindo de onde o fundo já virou transparente e comendo
  qualquer pixel escuro adjacente, até parar de encontrar — ou seja, até
  alcançar o prédio de verdade, que não é escuro por toda parte.

Qual dos dois estilos vale para cada arquivo é decidido sozinho, pela cor
dos quatro cantos (escura ou clara) — nenhuma lista manual de exceções.

A Fazenda de novo ficou de fora (nenhum dos 37 é lavoura) e continua
reaproveitada da primeira leva. `ferramentas/extrair-individuais.js` é a
ferramenta desta rodada — mantém `anexar-fazenda.js` como estava.

---

## Teto de gente na tela

Simular uma vila de milhares já estava resolvido (`atualizarPovo` bota quem
está fora da tela num rodízio, com passo maior). O que ainda podia travar era
**desenhar**: centenas de `drawImage` por quadro, cada um com composição de
alfa, custam caro num celular mesmo com a simulação correndo rápido.

Agora no máximo **500 adultos e 50 crianças** aparecem na tela ao mesmo
tempo — o resto continua existindo, trabalhando, envelhecendo, só não é
desenhado. Numa aglomeração grande (a praça de uma vila de milhares, por
exemplo) o corte poderia sempre recair nas mesmas primeiras pessoas do
array; para isso não acontecer, o ponto de partida do percurso **gira um
passo a cada quadro**, e o grupo visível se reveza suavemente em vez de
travar sempre nos mesmos rostos.

---

## As vilas rivais na cor delas

Prédio, rua e gente de uma vila rival passaram a usar exatamente a mesma arte
que a sua vila — só **tingida na cor dela**. É o pedido direto de "mesmo
sprite, cor de time": olhar o mapa e saber de quem é aquele canto sem
precisar ler nada.

**Tingir sem estragar a silhueta.** A forma óbvia — pintar por cima com
`source-atop` direto no canvas do jogo — não funciona aqui: o terreno por
baixo já pintou o retângulo inteiro de opaco, então a tinta vazaria para a
grama nos cantos vazios do sprite (uma casa raramente é um retângulo cheio).
A correção é desenhar o recorte num canvas em branco à parte, tingir só o que
ficou opaco ALI — que é exatamente a silhueta, nada mais — e colar o
resultado por cima do jogo.

**Prédio e gente têm caches diferentes, por motivos diferentes.** Um prédio
pronto nunca muda de arte: o tingimento dele é feito uma vez e fica guardado
pelo id para sempre. A gente troca de quadro de passo e de direção o tempo
todo, então tingi-la é sempre um rascunho descartável, refeito a cada quadro
— mas são poucas (teto de 28 por vila), então o custo não incomoda.

**A rua era o problema de verdade.** Ela não tem id fixo como um prédio — é
um tile por vez, potencialmente centenas visíveis ao mesmo tempo — e a
primeira versão refazia o desenho inteiro (limpar, onze `fillRect`, duas
trocas de modo de composição) a cada quadro, para cada tile. Medido: **34ms
só nisso**, com uma vila de território médio à vista — sozinho, mais que o
quadro inteiro de 60fps (16,6ms). A aparência de um tile só depende de quatro
booleanos (vizinho a norte/sul/leste/oeste) e é sempre a MESMA até a malha
daquele canto crescer, então cada tile é assado uma vez, num canvas próprio,
e guardado — o mesmo truque que os pedaços de terreno já usam. Nos quadros
seguintes o que roda é um `drawImage` só; o cache invalida sozinho quando a
vizinhança muda. Depois do ajuste: **34ms → menos de 1ms**.

**A gente das vizinhas é decorativa, de propósito.** Dar população de
verdade a cada vila rival — com ofício, fome, pathfinding — multiplicaria a
simulação inteira pelo número de vilas, e é exatamente isso que a decisão de
"modelo, não segunda simulação" (Fase 7) evita. O que faltava era só vida
visível. Cada vila mantém uma fração pequena da população real como figuras
sem estado de jogo nenhum — sem emprego, sem fome — que só caminham de um
ponto a outro dentro do próprio território, devagar, com teto de 28 por
vila. A cor entra do mesmo jeito que no prédio e na rua: mesmo sprite do seu
aldeão, tingido.

---

## O mapa virou isométrico

Os prédios da Fase 8 vieram numa perspectiva de losango; o mapa era visto de
cima, reto. Medido na base da Praça — 185×123 px de bounding box — dava uns
33,6° de inclinação; a malha adotou a proporção 2:1 (a convenção clássica de
jogo isométrico em pixel art) por ser perto o bastante do que a arte já tem,
sem herdar números quebrados.

**A regra que guiou tudo**: a simulação não muda. Pathfinding, alcance,
distância, colisão continuam em coordenadas de mundo, no grid quadrado de
sempre. Só o DESENHO passa por uma projeção antes de virar pixel de tela — e
mesmo aí, de duas formas diferentes:

- O **chão** (terreno, rua, obra, bairro, território) ganha a inclinação
  pela própria matriz do canvas: um quadrado desenhado em coordenadas de
  mundo, sem nenhuma mudança de código, sai como losango sozinho. É por isso
  que `desenharEstrada` não precisou ser reescrita — ela roda dentro de um
  trecho com a matriz inclinada, e o resultado sai certo.
- Um **objeto em pé** (prédio, gente, árvore) não pode receber a mesma
  inclinação — a arte dele já é isométrica, e inclinar de novo destorceria o
  sprite, como uma foto esticada. Em vez disso, só a ORIGEM do desenho se
  move: a função calcula sua posição normalmente, em pixels de mundo, e um
  deslocamento (dx0,dy0) — vindo da projeção do ponto onde o objeto pisa — é
  somado onde ela já lia sua própria posição.

Toque, arrastar o mapa e WASD passaram pela mesma virada: `telaParaMundo`
ganhou a fórmula isométrica inversa, e um deslocamento de tela (arrastar o
dedo, apertar uma seta) agora vira deslocamento de mundo pela mesma inversa
— sem isso, "esquerda" no teclado andaria na diagonal do mundo, não na tela.

**Dois problemas de escala, achados testando com centenas de gente e vilas
rivais** — nenhum visível numa vila pequena, os dois travando o jogo numa
grande:

1. A primeira versão movia a origem de cada objeto em pé com
   `ctx.save()+translate()+restore()` — correto, mas empilhar e desempilhar
   o estado do canvas centenas de vezes por quadro não escala como uma soma.
   Numa vila de 307 pessoas, `desenhar()` foi a 197ms. A troca por
   deslocamento somado (o dx0,dy0 do parágrafo acima, em vez de mexer na
   matriz) trouxe de volta a menos de 1ms;
2. Um bug **anterior a esta fase**, só exposto porque a área de mundo que a
   câmera isométrica precisa varrer é maior que antes: o cálculo de quais
   quarteirões de disputa pintar misturava pixel de câmera com tile de
   quarteirão. Com a tela sempre mostrando uma janela pequena isso nunca
   dava zebra visível; a nova área ampliada empurrou a conta para **65 mil
   blocos por quadro**. A correção foi só bater as unidades.

Os prédios também saíram 30% maiores — a arte isométrica ocupava menos da
caixa do que o desenho vetorial antigo ocupava, e ficaram pequenos demais na
tela. Crescem para cima e para os lados a partir da MESMA base: a fundação
continua exatamente sobre o lote.

O minimapa continua visto de cima, de propósito — é a convenção comum em
jogo isométrico (um "mapa de bolso" que orienta, não a cena principal) e o
código dele já era independente da câmera principal.

---

## Corrigido: a vila esvaziava sozinha com vilas rivais ativas

Um bug sério, publicado sem correção por algumas horas antes de ser achado:
em partidas longas com vilas rivais, a comida da SUA vila ia a zero e os
adultos morriam de fome — mesmo com lavoura de sobra e a vila aparentemente
saudável.

Causa raiz medida, não suposta: as quatro vilas rivais chegavam à nota de
prosperidade **máxima (1.0) já no quarto dia de jogo** e ficavam lá para
sempre. A fórmula (`nota()`, em "A disputa de território") normaliza folga de
casas e quarteirões por morador usando um piso pequeno — fácil de saturar com
população baixa — e o conselho rival mantém a folga sempre perto do ideal por
construção reativa. A sua vila, crescendo de verdade, nunca alcançava 1.0.
Resultado: migração constante para fora, um sentido só, mesmo com a vila bem.

E cada saída tinha um efeito em cascata que não era óbvio: menos adulto
reduz o teto de gente em posto (`distribuirOficios`), e **fazendeiro é o
primeiro nome da lista quando esse teto aperta** — regra antiga, de antes de
existir vila rival, nunca um problema até a migração passar a cortar adulto
com frequência. A fazenda ficava sem ninguém, a comida parava de entrar, a
fome fazia o resto.

Duas correções, medidas antes e depois:

1. **A fórmula ficou mais difícil de saturar** — pisos e divisores maiores
   fazem a mesma folga pequena valer bem menos nota numa vila pequena;
2. **Período de graça**: abaixo de vinte pessoas, sua vila não perde ninguém
   para fora, não importa o desnível. É a mesma regra que já valia para a
   fronteira territorial ("um período inicial de desenvolvimento antes que os
   territórios entrem em conflito") — só que também precisava valer aqui.

Testado com o mesmo cenário que expôs o bug (4 vilas rivais, recuperação
offline de vários anos): antes, colapsava para 3 habitantes e comida zero por
volta do ano 9; depois, mais de 1400 habitantes e comida sobrando no ano 3,
com as quatro vilas rivais igualmente vivas e saudáveis. A migração continua
funcionando nos dois sentidos quando o desequilíbrio é de verdade — testado
forçando fome numa vila rival e vendo gente dela se mudar para a sua.

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

- **Arte própria da Praça, da Prefeitura e da Mina**: as três continuam no
  desenho vetorial de sempre, sem sprite — nenhuma arte pronta para elas ainda.
- **Rios**: o gerador de terreno não produz travessias curtas de água profunda
  neste mundo (amostrado: 766 tiles de água funda em 600×600, nenhuma
  travessia curta). A ponte existe e funciona — só não há rio para ela vencer.
  Adicionar rio mudaria o mapa de quem já joga, o que fere a regra de mapa fixo.
- **Combate**: a disputa de território (Fase 7) é só migração e prosperidade.
  Não há planos de introduzir exército ou luta — é decisão de projeto, não
  limitação técnica.

[un]: https://www.un.org/development/desa/pd/sites/www.un.org.development.desa.pd/files/aging_theme_household_size_and_composition_around_the_world_2017_data_booklet.pdf
[genus]: https://genus.springeropen.com/articles/10.1186/s41118-024-00211-6
[nature]: https://www.nature.com/articles/s44284-026-00447-7
[oecd]: https://www.oecd.org/en/data/indicators/labour-force-participation-rate.html
[usa]: https://usafacts.org/answers/what-is-the-labor-force-participation-rate-in-the-us/country/united-states/
[census]: https://www.census.gov/library/stories/2025/06/metro-areas-median-age.html
