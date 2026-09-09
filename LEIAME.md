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
ferramenta desta rodada.

**Correção rápida, no mesmo dia**: a arte publicada saiu borrada/em blocos.
Causa direta — estes 37 arquivos chegaram bem menores que as levas
anteriores (100 a 180px, contra os 500px+ de antes), e o pipeline guardava
cada peça em `tela × ESCALA` (a folga de 2,2× reservada para aguentar o
zoom máximo) **sem checar se a origem tinha pixel suficiente para isso**.
Pedir a um filtro de caixa para AMPLIAR uma imagem pequena é exatamente o
oposto do que ele faz bem — sem vizinho de sobra pra tirar média, ele
degenera em vizinho-mais-próximo, e o resultado sai em blocos.

A correção é uma decisão binária por peça, não um corte por eixo (cortar
largura e altura contra a origem de forma independente distorceria a
proporção sempre que só um lado precisasse de mais espaço): se a folga
pedida cabe dentro da origem, reduz como sempre; se a origem é pequena
demais para a folga, guarda na resolução NATIVA, sem tocar, e deixa o
próprio canvas do jogo suavizar ao desenhar (`ctx.imageSmoothingEnabled`
já vem ligado) — um redimensionamento melhor do que o filtro de caixa faria
de qualquer forma.

**A correção ficou pela metade**: consertei só `extrair-individuais.js`
(as 37 peças novas) e esqueci que a Fazenda continua vindo de
`anexar-fazenda.js` — outro arquivo, com a mesma conta de ESCALA copiada e
colada, e o mesmo bug. A fonte dela (`fazendapequena1.png`, sobra da
primeira leva) é só 128×128, bem menor que a folga pedia, então toda vez
que o pipeline rodava ela saía ampliada e em blocos — só que agora era a
ÚNICA construção ainda assim, o que ficou óbvio por comparação com as
outras 36. Mesma decisão binária, copiada para o segundo arquivo.

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

## Corrigido: prédio largo invadia a rua ou o vizinho (não era sombra)

Reportado com print: a Praça (e "algumas outras construções") pareciam
sobrepostas à rua, como se estivessem flutuando, em vez de apoiadas nela.

**Primeiro diagnóstico saiu errado.** A hipótese foi falta de sombra de
contato — nenhuma das 39 peças fotográficas tem um ponto escuro sob a base,
e a Praça, sem parede vertical pra disfarçar, lia como um sticker colado na
grama. A correção (uma elipse escura sob todo prédio, reaproveitando
`sombraNoChao()` de árvore e carroça) foi publicada como 1.0.36 — e piorou
tudo: todo prédio passou a ter uma sombra visivelmente separada da própria
base, como se a vila inteira estivesse flutuando. Reportado assim mesmo,
com bom humor ("ficou um lixo, mas foi engraçado").

**Causa real**, achada depurando o jogo ao vivo no navegador (frame forçado
manualmente, já que a aba em automação não roda `requestAnimationFrame` em
segundo plano — sem isso, o patch de depuração nunca disparava e a sombra
parecia certa nos números mas errada na tela): `ESCALA_PREDIO = 1.3` (da
fase do mapa isométrico) cresce o prédio **para cima E para os lados** a
partir da mesma base. Prédio com parede alta esconde bem o alargamento — a
silhueta continua lendo como "em pé". Prédio baixo e largo, como a Praça,
não tem onde esconder: a arte fica literalmente mais larga que o próprio
lote e vaza por cima de quem estiver do lado — rua ou outro prédio. Sempre
foi isso; a sombra só mascarou o sintoma errado.

A correção de verdade é travar a LARGURA desenhada no teto do próprio lote,
em `caixaDoPredio()` — a altura continua livre pra crescer pra cima (é o
que faz o prédio parecer mais imponente, pedido de uma leva anterior, e
crescer pra cima nunca invade o vizinho do lado). A tentativa de sombra foi
revertida por completo.

Testado ao vivo, praça e castelo lado a lado: a praça parou de tocar a rua,
o castelo continua do mesmo tamanho de antes — sem sombra nenhuma, só sem
vazar.

---

## Mais uma volta na praça, e um bug de verdade nas sombras

Depois de travar a largura só da Praça (a única sem parede pra disfarçar),
mais três rodadas de ajuste fino nela, cada uma com o próprio efeito
colateral — vale registrar os dois problemas de verdade que sobraram,
porque um deles derrubou uma frase escrita algumas seções acima.

**"A praça não está centralizada nos tiles" (com print do contorno verde de
"Movendo")**: ancoragem vertical sempre colava a arte na base do lote — faz
sentido pra prédio alto (cresce pra cima do próprio chão), mas a praça não
cresce mais além do lote, então colar na base sobrava como desalinhamento.
Corrigido centralizando quando o prédio cabe no lote (`dh <= h`), mantendo
ancoragem na base só pra quem ainda cresce além dele.

**Daí veio a comparação direta com o losango**: a praça, mesmo centralizada,
renderizava visivelmente menor que o próprio lote. Causa real — numa
projeção isométrica 2:1, a largura na tela de um lote w×h é `(w+h)*TILE`,
não `w*TILE`; a conta usa só a largura desde a primeira leva de arte.
Escalar a praça pro tamanho exato do losango resolveu — E quebrou outra
coisa: prédio vizinho também vaza um pouco da própria arte pra fora do
lote dele (mesmo motivo do parágrafo anterior a este bloco), então duas
peças do tamanho exato do próprio lote colidem numa vila apertada.
Revertido pro tamanho anterior (um pouco menor que o losango perfeito, mas
que não invade ninguém) — depois de tanta ida e volta nesse ajuste fino
específico, esse foi o trade-off aceito.

**Efeito colateral do trava-largura que quase passou despercebido**: a
largura salva na folha já nasce igual à do próprio lote pra quase toda
peça (não só a praça) — então travar a largura de TODO MUNDO, tentativa
que durou algumas versões, zerava sozinho o `ESCALA_PREDIO` pra quase todo
prédio, não só pra praça. Reportado como "tudo parece muito pequeno,
exceto fazenda grande e praça". Corrigido: só a Praça trava a largura; todo
o resto volta a crescer os 1,3x de sempre.

**E o bug de verdade, sem relação nenhuma com tamanho ou posição**: "quando
apagou o fundo preto tirou também a sombra de algumas casas". A leva atual
tinha uma segunda passada (`removerAureola`) pensada pra comer uma
auréola escura que pareceria sobra de drop shadow da ferramenta de recorte
do usuário — só que **a maioria das peças tinha mesmo uma sombra de
contato própria**, e sombra colada no prédio é exatamente tão escura
quanto um artefato de recorte pra um flood-fill que só olha "é escuro".
A segunda passada comia as duas coisas juntas, silenciosamente, desde a
publicação da terceira leva. Isso contradiz o que ficou escrito acima
("nenhuma das 39 peças fotográficas tem um ponto escuro sob a base") — era
verdade pra Praça (conferido, ela mesma não tem sombra própria), mas não
para o resto; a frase generalizou de menos dado.

Confirmado comparando bruto × processado numa folha de contato dos 29
arquivos de fundo claro: `removerFundo` sozinho, sem a segunda passada, já
limpa o fundo sem sobra nenhuma em TODOS os 29 — a segunda passada nunca
foi necessária. Removida (função e chamada), pipeline reprocessado do
zero. Sombra de contato de volta em casa, castelo, moinho, tudo — e de
brinde, ajuda a "grudar" a própria praça no chão, sem precisar de nenhuma
elipse sintética.

**Esse diagnóstico também saiu errado — e rápido: publicado, virou "borda
preta ao redor das construções".** A folha de contato que "provou" a
sombra tinha uns 120px por peça; nesse tamanho a faixa escura ao redor da
silhueta e uma sombra de verdade se confundem a olho nu. Medindo pixel a
pixel (não mais olhando miniatura): numa linha horizontal cortando o TOPO
do telhado de uma casa — onde sombra de chão jamais chegaria — havia uma
faixa sólida, opaca, de 13 a 15px, cor (32,32,32), idêntica à faixa medida
na altura da parede. Largura constante ao redor de toda a silhueta, sem
gradiente nenhum: perfil de artefato de recorte, não de sombra alguma. A
segunda passada (`removerAureola`) estava certa desde o início; a versão
que a removeu é que criou o problema. Restaurada como era.

---

## Prédios 50% maiores, e a árvore ganhou foto

Dois pedidos diretos depois de ver a vila com os tamanhos corrigidos: mais
escala nos prédios (a leva anterior tinha restaurado os 30% de sempre,
`ESCALA_PREDIO` foi pra 1,5 — só isso, mesmo mecanismo, praça continua de
fora pelo próprio teto), e duas coisas nas árvores.

**Copa em cima da rua.** A árvore é desenhada mais larga que o próprio tile
(dá volume, evita fileira de palito) — encostada numa rua, a copa passa
visivelmente por cima do calçamento. `jogo.estradas.has(k)` só impedia
NASCER em cima da rua; faltava impedir nascer COLADO nela. Três frentes:
`pertoDeRua()` barra a rebrota (`rebrotarMata`, primavera) a um tile de
qualquer rua, não só em cima dela; `limparArvoresRentesA()` remove árvore
de pé colada numa rua recém-aberta, chamada nos três lugares que constroem
rua — não espera a próxima primavera; e a mesma limpeza roda uma vez sobre
as ruas já salvas no carregamento, pra quem já tinha o problema de sessões
anteriores.

**Árvore fotográfica.** Trocado o desenho vetorial (`spriteArvore`/
`spriteConifera`) por fotos — 10 arquivos do usuário (`C:\Users\PPCP\
Downloads\ÁRVORES`), fundo preto chapado, mesma técnica da primeira leva
de prédio (jpeg → png via System.Drawing do .NET, sem instalar nada;
flood-fill a partir da borda). Cada espécie tem uma foto "normal" e uma
irmã "com neve" do mesmo molde — o pareamento saiu do CONTEÚDO da imagem,
não do número do arquivo (`NORMAL1`=bidoeiro↔`NEVE3`, `NORMAL2`=conífera↔
`NEVE2`, `NORMAL3`=carvalho↔`NEVE4`, `NORMAL4`=morta/seca↔`NEVE1`,
`FRUTIFERA1`↔`FRUTIFERANEVE1`).

A escolha de espécie preserva o que já existia: conífera continua vindo da
elevação do terreno (`coniferaEm`, monte vira pinheiro), e as outras quatro
espécies se revezam pela semente do próprio nó — não é aleatório a cada
quadro, é sempre a mesma árvore no mesmo lugar. Neve é a mesma flag de
bioma que já existia. Âncora replicada do vetorial que substituiu: centro
horizontal, base do tronco ~3px abaixo do centro do tile — sem isso a
árvore nova ficaria flutuando ou afundada em relação ao lugar onde a
antiga sempre encostou.

Ferramenta nova, `ferramentas/extrair-arvores.js` — mesmo cuidado de nunca
ampliar além da origem (fonte é só 128×128) que as levas de prédio já
tinham. Pedra e moita (arbusto) continuam vetoriais — só árvore foi pedida.

---

## O planeta

Pedido: dar zoom além do limite de hoje e ver o mundo de longe, "como um
planeta girando" — sem oceano gigante atrapalhando. Antes de sair
implementando, uma pergunta de escopo: planeta de verdade (3D, giro real
de esfera) exigiria trocar o motor do jogo inteiro (canvas 2D puro, nunca
teve WebGL) por uma engine 3D — mudança de projeto, não de feature. A
resposta escolhida foi o meio-termo: planeta ESTILIZADO — um efeito visual
decorativo, não o mapa de verdade renderizado de cima.

**O que é real e o que é decoração.** Abaixo de `ZOOM_LIMIAR` (o chão de
zoom de sempre, 0.55) a câmera não sai mais da vila pra sempre — antes
disso ela era o limite. Agora `ZOOM_MIN` (0.15) abre uma faixa nova, onde
`desenharVisaoDistante()` assume por inteiro:

- **disco do planeta**: gradiente radial fixo (luz de cima-esquerda,
  escurece pra borda — o "rim-light" é o que vende esfera sem nenhuma
  geometria 3D), puramente decorativo;
- **relevo de montanha**: blobs com posição estável por hash (não é
  `elevacao()` de verdade), decoração, deriva bem lenta;
- **pontos de civilização**: esses SIM são dado real — todo quarteirão
  com dono em `jogo.dono` (seu ou de vila rival) vira um ponto colorido,
  na cor de quem é dono, posicionado pela coordenada de mundo de verdade
  (via `origemMalha`) numa escala fixa pequena (`ESCALA_PLANETA`),
  centrada na câmera — arrastar o mapa aqui ainda "anda pela superfície",
  só que a passos enormes;
- **nuvens**: blobs claros, deriva bem mais rápida que o relevo. É essa
  DIFERENÇA de velocidade entre as duas camadas — não qualquer rotação de
  verdade — que o olho lê como "o planeta girando por baixo das nuvens".

Truque simples, sem física nem 3D nenhuma: duas camadas de blob 2D
andando em velocidades diferentes por cima de um gradiente parado.

Zoom out geral também ficou mais generoso na vila mesmo (`ZOOM_MIN`
substitui os `0.55` antigos nos dois controles de zoom, roda e pinça — o
zoom inicial de partida de jogo não mudou).

Testado ao vivo: transição exata no limiar (vila cheia de um lado, planeta
do outro, nada de meio-termo quebrado), pontos de civilização com dado
semeado à mão (não tinha vila rival no save de teste), deriva de nuvem
confirmada comparando dois quadros bem afastados no tempo, mobile e
desktop.

---

## O planeta, parte 2: a troca virou seca demais

Reportado assim que publicado: "funcionou, porém a mudança ficou muito
brusca". Fazia sentido — o corte era exatamente no `ZOOM_LIMIAR`, sem
gradação nenhuma: um quadro é vila cheia, o próximo é disco de planeta.

Criada uma FAIXA de transição entre `ZOOM_LIMIAR` (0.55, como sempre) e um
novo `ZOOM_TRANSICAO_FIM` (0.40). Dentro dela, `desenhar()` chama as duas
visões no mesmo quadro — a vila (renomeada `desenharVilaNormal`, sem
mudança nenhuma no próprio desenho) primeiro, e o planeta por cima com uma
transparência que cresce de 0 a 1 ao longo da faixa. Fora da faixa, só uma
das duas roda — o dobro de desenho fica restrito a uma janela de zoom
estreita, não à sessão inteira.

`desenharVisaoDistante` ganhou o parâmetro `alpha`: aplicado uma vez em
`ctx.globalAlpha` logo no início, e como o resto da função só usa cor com
opacidade própria (`rgba(...)`) ou cor sólida — nunca reatribui
`globalAlpha` de novo —, tudo dentro dela (fundo do espaço, disco, relevo,
pontos, nuvem, borda) sai multiplicado pela mesma transparência sem
precisar tocar em cada trecho um por um. Único cuidado: o loop de estrelas
JÁ mexia em `globalAlpha` pra variar o brilho de cada uma — teve que
multiplicar por `alpha` ali também, senão a transparência externa se
perdia assim que a primeira estrela era desenhada.

`prof` (o quanto o disco encolhe conforme desce o zoom) continua com a
conta de sempre, sobre a faixa toda (`ZOOM_LIMIAR` a `ZOOM_MIN`) — não
depende da mistura, então o disco segue encolhendo suave mesmo depois que
a troca com a vila já terminou.

Testado ao vivo em três pontos da faixa (perto do topo: vila quase pura
com o planeta mal visível por cima; meio; perto do fim: planeta quase
opaco com a vila apenas insinuada nos cantos) e nos dois extremos (acima
de 0.55 e abaixo de 0.40, cada um só com a própria visão, sem sobra da
outra) — mobile e desktop.

---

## O planeta, parte 3: transparência não é a mesma coisa que encolher

"Ficou melhor, mas eu preciso que o mapa vá diminuindo gradualmente, como
se fosse o mapa do Google Earth." A parte 2 resolveu o corte seco, mas
trocou por um cross-fade — duas imagens diferentes se misturando no
lugar. O Google Earth não faz isso: o mapa dele não troca de imagem, ele
ENCOLHE até virar globo, com a área visível fechando como um obturador de
câmera. É outro efeito, não só "mais suave".

Sem geometria 3D não dá pra encolher/curvar o mapa de verdade — mas dá pra
imitar bem o RESULTADO: o planeta agora desenha PRIMEIRO, cobrindo a tela
inteira; a vila desenha por cima, mas só dentro de uma janela circular que
fecha. No topo da faixa (`ZOOM_LIMIAR`) a janela é maior que a diagonal da
tela — nenhum corte visível ainda, é só o zoom normal encolhendo o
conteúdo, como sempre foi. No fundo da faixa (`ZOOM_TRANSICAO_FIM`) a
janela já fechou exatamente no raio do disco (`raioDoPlaneta()`, extraída
numa função à parte pra `desenhar()` e `desenharVisaoDistante()` usarem o
mesmo número — sem isso a janela podia fechar num tamanho diferente do
disco por baixo, e sobraria uma quina visível bem no fim da transição). A
vila ainda esmaece dentro da janela (mesma conta de transparência da parte
2), mas agora é o ENCOLHER que carrega o efeito — a transparência só
amacia o traço final da borda, não faz mais o trabalho sozinha.

`ctx.clip()` aplicado num circulo em espaço de tela (`ctx.setTransform(DPR,
0,0,DPR,0,0)` antes do clip) sobrevive a `desenharVilaNormal()` trocando de
transform internamente pra desenhar chão, prédio, gente — clip recorta a
REGIÃO de composição do canvas, não é afetado por mudança de matriz depois
de aplicado. Mesma lógica pra `globalAlpha`: setado antes da chamada, dura
até algo de dentro da função reatribuir (só acontece no brilho de janela
noturno, bem no fim do desenho — sem efeito no que importa: chão, rua,
prédio, gente, árvore, tudo desenhado antes disso).

Testado ao vivo cruzando a faixa inteira: janela grande sem corte visível
logo depois do limiar, fechando visivelmente com o espaço escuro
aparecendo nos cantos, sumindo quase por completo perto do fim, e batendo
sem salto nenhum com o disco puro do outro lado — mobile e desktop.

---

## Sistema multi-escala: da decoração pro dado real (etapas 1 e 2 de 6)

Pedido grande, com escopo definido em plano escrito antes de qualquer
código (`.claude/plans/robust-conjuring-reef.md`, aprovado por você):
transformar o planeta de decoração pura em algo que preserva a posição
real de tudo, com câmera subindo em camadas de detalhe — vila, região,
território, planeta — em vez de só vila e um disco decorativo. Decisão de
arquitetura confirmada antes de escrever: **o mundo continua infinito**
(não vira um globo fechado com fronteira) — a "curvatura de planeta" no
zoom máximo é a mesma malha de ruído infinita de sempre, só vista de muito
longe, dentro de um horizonte redondo. Um mundo finito de verdade
(circundável) seria um projeto ainda maior e diferente deste.

**Etapa 1 — generalizar o dispatcher.** `desenhar()` virou um loop sobre
uma lista de camadas (`CAMADAS_ZOOM`) em vez do bloco fixo de duas visões.
A transição em si ganhou DUAS variantes, escritas uma vez e reaproveitadas
por qualquer par de camadas vizinhas: cross-fade simples (duas visões
retângulo-contra-retângulo, sem curvatura ainda) e a janela circular
fechando (só pro par que entra na visão curva do planeta). Publicada sem
nenhuma mudança visual, só provando que a generalização não quebrou nada.

**Etapa 2 — camada Região.** Nova, entre vila e planeta: mesmo terreno de
verdade (`pegarChunk`, o mesmo bitmap de sempre), sem o loop de prédio/
gente/árvore individual — no lugar de cada prédio, um ponto na posição
REAL de cada vila (a sua e as rivais vivas), pela primeira vez fora do
zoom de jogo normal. "Vestígio de civilização" deixou de ser decoração.

**Um bug real no meio do caminho**: a primeira tentativa de dar à Região
seus próprios limiares reaproveitou `ZOOM_TRANSICAO_FIM` (o fim da vila)
como o TETO da região também — o que colapsava a faixa inteira da região
em transição contínua com o planeta, sem sobrar nenhum ponto realmente
"só região". Cada fronteira entre camadas precisa do PRÓPRIO par de
limiares — por isso `REGIAO_LIMIAR` (teto da região) é uma constante nova,
separada de `ZOOM_TRANSICAO_FIM` (que já era o piso da vila). Achado e
corrigido antes de publicar, testando ao vivo em cada zoom candidato, não
só nos extremos.

Testado ao vivo: vila pura, transição vila→região (blend visível, sutil
porque os dois usam o mesmo terreno de baixo — só prédio/árvore que
esmaece), região pura (com o ponto da vila certo), transição região→
planeta (janela fechando, mesmo terreno visível encolhendo dentro dela),
planeta puro — mobile e desktop.

Faltam as etapas 3-6 do plano (território, planeta com dado real, UI por
camada, passe de performance).

---

## Sistema multi-escala: camada Território (etapa 3 de 6)

Terceira camada, entre região e planeta. A área visível aqui é grande o
bastante pra que o truque da Região (chunk fino de sempre, `pegarChunk`)
ficasse caro — dezenas de chunks caberiam na tela ao mesmo tempo, cada um
com a mesma bake fina (grama, rachadura) que a vila usa de perto, sem
ninguém for ver esse detalhe daquela distância.

Em vez disso, `desenharTerritorio()` amostra `elevacao`/`biomaEm` a cada
`TERRITORIO_STRIDE` (6) tiles — uma célula preenchida por amostra, não
tile a tile — reaproveitando `corTerrenoDe` (a mesma função de cor que o
chunk fino usa) pra manter a paleta idêntica à da região, só mais grossa.
Células agrupadas em "setores" de 12×12 e cacheadas (`territorios`, Map
com o mesmo padrão de expiração por tempo não visto que `chunks` já usa) —
o número de setores visíveis não cresce com a distância, então o custo
fica limitado independente de quanto o jogador afastar dentro desta
camada. Marcador de vila maior que na região (pedido do plano — "daqui de
cima o ponto pequeno não se acharia mais").

**Só a fronteira território→planeta ganhou a janela circular** (curvatura
começando a aparecer); vila→região e região→território continuam
cross-fade simples, retângulo contra retângulo. Isso segue o pedido
original ao pé da letra — curvatura só "numa altitude extremamente alta",
perto do fim da jornada, não antes.

Faixas de zoom recalculadas do zero pras quatro camadas caberem, cada
teto de camada do meio deliberadamente MENOR que o piso da anterior (a
regra aprendida corrigindo o bug da etapa 2, documentada em comentário no
código junto das constantes agora).

Testado ao vivo: território puro (com marcador maior e mesma água visível
que já aparecia na região), as duas transições novas, planeta puro no
novo piso, vila normal sem nenhuma mudança — mobile e desktop.

Faltam as etapas 4-6 (planeta com dado real, UI por camada, passe de
performance).

---

## Sistema multi-escala: planeta com dado real (etapa 4 de 6)

Últimos blobs decorativos caem: o "relevo" do planeta (posição por hash,
nunca foi terreno de verdade) virou amostra real de `elevacao`, colorida
pela MESMA rampa (`corDaRampa`) que pinta o chão de perto — o planeta
passa a mostrar a geografia de verdade ao redor da vila (água, floresta,
rocha, neve), não uma textura genérica.

Amostrar `elevacao` ponto a ponto a cada quadro (o grid cobre uma boa
faixa do disco) seria caro demais parado olhando pro planeta — por isso
`planetaTextura()` cozinha uma canvas pequena (96×96) e GUARDA: só refaz
quando a câmera anda mais de 300px de mundo desde a última vez, ou o raio
do disco muda. Medido ao vivo: ~1,7ms por quadro parado (a textura já
cacheada, só reaproveitada), ~18ms por quadro arrastando o mapa sem parar
dentro do planeta (pior caso, refazendo a textura toda hora) — no limite
de 60fps mas não quebra; candidato a ajuste fino na etapa 6 (passo de
amostragem maior, ou distância maior antes de refazer) se o arrasto
contínuo no planeta ficar sensivelmente pesado num aparelho real.

Nuvem, estrelas e rim-light continuam exatamente como estavam — só o
relevo do meio (que sempre foi a peça "falsa" da composição) virou dado
real; o resto já era atmosfera, não mapa.

Testado ao vivo: geografia reconhecível (lago, floresta, neve) visível no
disco, pontos de civilização certos por cima do terreno real, transição
território→planeta com cores batendo dos dois lados, tempo de quadro
medido parado e arrastando — mobile e desktop.

Faltam as etapas 5-6 (UI por camada, passe de performance).

---

## Sistema multi-escala: UI por camada (etapa 5 de 6)

Construir e selecionar só fazem sentido perto o bastante pra ver casa e
gente — nas camadas de longe (região, território, planeta) a barra de
construção some, e um rótulo pequeno avisa em qual camada você está.

`atualizarUiDeZoom()`, chamada de dentro de `desenhar()` (já sabe qual
camada está ativa, ou quais duas em transição — durante a mistura, mostra
o nome de quem tem mais peso visual no momento, trocando no meio da
faixa). A barra ganhou uma classe nova (`zoom-distante`) em vez de mexer
na `escondido` que os outros fluxos de UI (folha aberta, colocando prédio,
traçando rua) já usam — as duas classes escondem independente uma da
outra, então não há risco de uma pisar na lógica da outra.

**Um acerto de posição no meio do caminho**: o rótulo nasceu centralizado
no topo, do lado do painel de recursos — e em tela de celular, que é
estreita, o painel de recursos já usa quase a largura toda, então o
rótulo caiu por baixo dele, coberto (`#topo` vem depois no HTML, pinta por
cima). Resolvido reposicionando pra baixo, onde a barra de construção
"deixou vago" — mesma condição de visibilidade das duas (`zoom-distante`),
nunca vão competir pelo mesmo espaço ao mesmo tempo.

Testado ao vivo: barra sumindo/voltando exatamente na fronteira da vila,
rótulo certo nas três camadas de longe e ausente na vila, sem sobreposição
com o painel de recursos — mobile e desktop.

Falta só a etapa 6 (passe de performance).

---

## Sistema multi-escala: passe de performance (etapa 6 de 6, plano concluído)

Última etapa do plano: zoom saindo e voltando rápido pelas quatro camadas,
medindo tempo de quadro de verdade em vez de confiar que "deve estar bom".

**Achado real: a camada Região tinha um buraco de desempenho ao arrastar.**
`desenharRegiao()` reaproveita `pegarChunk` (o mesmo bitmap fino da vila) —
o plano previa isso como "quase grátis", mas medir revelou o contrário:
cozinhar UM chunk novo (`montarChunk`) custa sozinho **22 a 26ms**, mais
que o quadro inteiro a 60fps. Arrastando o mapa na Região, cada chunk novo
que entra na tela pagava esse custo inteiro na hora, sem limite de quantos
por quadro — o mesmo padrão de "orçamento por quadro" que `ORCAMENTO_SIMULACAO`
já usa pra IA, só que faltando aqui pro desenho.

Corrigido com o mesmo idioma: `pegarChunk` agora aceita no máximo
`CHUNKS_NOVOS_POR_QUADRO` (1) chunk novo por quadro — pedidos além disso
recebem `chunkVazio()` (uma canvas 1×1 reaproveitada, sem custo) só nesse
quadro, e voltam a pedir o chunk de verdade no próximo, até o cache
alcançar tudo que está visível. Testado com arrasto NA VELOCIDADE REAL de
um dedo (30px de mundo por quadro): média caiu de 22,9-23,8ms sustentados
para **4,48ms** (p90 21,3ms — só o quadro que efetivamente cozinha o chunk
novo custa mais, os outros ficam baratos). Até no arrasto absurdamente
rápido usado só pra estressar (400px/quadro) o pior quadro individual
ficou em 48,8ms, um soluço pontual, não um travamento contínuo.

**As outras duas suspeitas do plano não eram problema de verdade:**
- O custo de `planetaTextura()` refazendo a bake ao arrastar dentro do
  planeta (a etapa 4 tinha deixado isso como "candidato a ajuste fino") —
  medido de novo agora com arrasto realista: 3,15ms em média, pior quadro
  13ms. Até no arrasto de estresse (400px/quadro) ficou em 14,8ms médio,
  27,8ms pior caso. Sem problema, sem mudança necessária.
- Cozinhar um setor da camada Território (`montarSetorTerritorio`) custa
  ~1ms cada, e uma tela cheia de setores novos do zero sai por ~2,5ms — não
  precisa de orçamento por quadro como o chunk fino precisou. Um teste
  inicial de varredura contínua de zoom (ponta a ponta, instantânea, sem
  pausa entre quadros) mostrou picos isolados de centenas de ms — mas
  repetindo a mesma varredura três vezes o pico pulava pra um zoom
  diferente a cada vez, sem relação com território ou qualquer camada
  específica: é pausa de coleta de lixo do próprio teste sintético (80+
  quadros sem nenhuma folga entre eles, o que uma sessão de jogo real nunca
  faz), não custo do código.

Com o gargalo real corrigido, plano das 6 etapas está completo: vila,
região, território e planeta mostram o mesmo mundo, na mesma posição, em
qualquer zoom — com detalhe (LOD) crescendo suavemente conforme a câmera
se aproxima, sem trocar de mapa em nenhuma fronteira.

Testado ao vivo: arrasto realista na Região sem buraco nem lentidão visível
(chunk placeholder nunca aparece como buraco perceptível — o chunk real
chega dentro de 1-2 quadros), mesmo teste no celular, sem erro no console —
mobile e desktop.

---

## Três ajustes de simulação: vila rival, melhoria de prédio, excesso de fazendeiro

Pedido de três melhorias separadas, investigadas lendo o código antes de
mexer em qualquer coisa (plano em `.claude/plans/robust-conjuring-reef.md`).

**1 — vila rival só tinha prédio perto da fundação.** Causa raiz: território
cresce por pressão de prosperidade (`avancarFronteira`), sem custar recurso
— e prédio só saía UM por dia, `casa` OU `fazenda`, os dois únicos tipos que
uma vizinha já construía. As duas coisas descolam: medido ao vivo, uma vila
sozinha chegou a 388 quarteirões com só 12 prédios em 2000 dias, e o prédio
NUNCA mais crescia depois disso — travado pra sempre, era esse o "só rua"
relatado.

Duas mudanças, a primeira não bastou sozinha: **(a)** vila rival agora
constrói variedade nova — oficina, serraria, depósito e mina (mina só perto
de rocha de verdade, mesma exigência do jogador) — em até 4 tentativas por
dia quando sobra quarteirão vazio, e constrói casa até um pouco à frente da
necessidade (mesma filosofia do conselho do jogador), o que também ajuda a
população a crescer (mais teto → mais nascimento → mais gente pra outros
postos). Sozinho isso já tira a vila do travamento (12 → 20-30 prédios
variados), mas medindo mais longe (3000 dias) a lacuna prédio-vs-quarteirão
ainda voltava a crescer sem limite — população não acompanha o ritmo do
território de jeito nenhum. **(b)** freio na fronteira: a vila só toma
quarteirão NOVO se o que já tem não estiver muito vazio (pelo menos 1 prédio
a cada 3 quarteirões reclamados) — a pressão continua se acumulando
("no banco") enquanto isso, sem mexer na fórmula dela nem no prazo da
disputa com você. Medido ao vivo por 4000 dias: a proporção prédio/quarteirão
fica travada em 0,33 o tempo todo, população sai de 10 para 28 (bem mais
saudável que antes), e a vizinha vira uma cidade de verdade — densa perto do
centro, com borda de terreno ainda crua, não um mar de rua vazia.

**2 — melhorar prédio já existia, só nunca era o conselho que decidia.**
Achado direto no código: `MELHORIA` (casa→sobrado, sobrado→predio,
fazenda→fazendaGrande, deposito→mercado) e `melhorarPredio` já existiam —
só o botão "⬆️ Virar X" no menu do prédio chamava isso, nunca o conselho
sozinho. E a busca de espaço pro prédio maior era reativa (só na hora de
melhorar), então se o vizinho já tivesse construído em cima nesse meio
tempo, a melhoria falhava com "Não há espaço em volta".

Agora **todo prédio novo com melhoria à frente já reserva a coluna extra que
vai precisar** (`calcularReservaDeMelhoria`, chamada de `criarPredio`) —
tenta o lado direito do lote primeiro, depois o esquerdo, usando a mesma
`cabeAqui` que já rejeita rua e terreno sólido. A reserva ocupa `ocupado`
apontando pro MESMO prédio, então quando a melhoria chega (`melhorarPredio`,
sem nenhuma mudança na lógica de busca dela) o espaço já está lá — zero
"não há espaço" pra quem foi construído depois desta mudança. E **o
conselho tenta melhorar antes de construir novo**, nas três frentes que já
tinham essa escolha (moradia, produção, depósito) — "antes de criar mais
casas, melhorar as que já existem", ao pé da letra do pedido. Melhoria
decidida pelo conselho acontece na hora, sem pedido de aprovação — mesmo
comportamento do botão manual de sempre.

Reserva sobrevive a mover prédio (recalculada do zero — a antiga ficaria
apontando pro endereço errado) e a salvar/carregar (guardada no save,
`rtx`/`rw`, restaurada tal e qual — recalcular durante o carregamento veria
`ocupado` incompleta, com prédios salvos mais adiante na lista ainda por vir).

**3 — gente demais virando fazendeiro, fazenda grande demais no mapa.** Dois
fatores medidos: **(a)** a meta de produção contava PRÉDIO, não RENDIMENTO —
mas `fazendaGrande` rende 1,9× uma fazenda comum, e a partir de pop 14 toda
fazenda nova já nascia Grande. Contar prédio por prédio quando um vale quase
dois pedia fazenda demais, sistematicamente. Agora a meta soma rendimento
(fazenda=1, fazendaGrande=1.9, cais=proporção real de `PESCA_SEG/LAVOURA_SEG`),
mesmo alvo de sempre (`ceil(pop/5)+1`), só medido certo. **(b)** vaga de
fazenda parava de ser preenchida só quando NOMEADA pela primeira vez — quem
já estava lá ficava pra sempre, e como fazenda é disparado o prédio de posto
mais numeroso (a meta é ~5× a de mina, ~7× a de oficina), a maioria das vagas
de posto disponíveis sempre foi fazenda. Agora `distribuirOficios` pula vaga
de fazenda (só fazenda — pescador fica de fora) quando a comida já está a
85% do teto do galpão, mesmo limiar que o conselho já usa — dinâmico, comida
caindo a vaga volta a preencher.

Testado ao vivo: vila rival simulada 4000 dias com proporção prédio/
quarteirão estável e cidade visualmente densa (desktop e mobile); melhoria
automática confirmada ponta a ponta — casa→sobrado e fazenda→fazendaGrande
pousando exatamente na coluna reservada, sem busca reativa; reserva
sobrevivendo a um ciclo salvar/carregar de verdade; botão manual "⬆️ Virar"
testado depois da mudança, continua idêntico; fórmula de produção ponderada
conferida contra cálculo manual; vaga de fazenda pausando com galpão cheio e
voltando a preencher com comida escassa, nos dois sentidos.

---

## Território rival aparece no minimapa

O zoom normal já pinta o quarteirão de vila rival na cor dela desde a Fase 7
("A DISPUTA, NO CHÃO") — mas isso só se vê andando pela vila. O minimapa
mostrava só um pontinho no centro de cada rival, sem a FRONTEIRA: dava pra
saber que existe uma vila ali, não quanto território ela já tomou nem onde
sua terra encosta na dela.

`desenharMinimapa()` agora tinge cada quarteirão de `jogo.dono` com a cor da
vila dona, amostrado em BLOCO (não tile a tile — caro demais pra rodar todo
quadro) dentro da janela visível do minimapa, do mesmo jeito que o zoom
normal já faz. Território seu (`id 0`) fica sem tingir, também igual ao zoom
normal — você já vê onde é seu pelos prédios; só a terra de vizinha precisa
do aviso extra. Só roda quando há disputa (`emDisputa()`), então sem vila
rival o minimapa continua exatamente como sempre foi.

Testado ao vivo (não só visual — lido pixel a pixel do canvas do minimapa):
um quarteirão confirmado de uma vila rival no `jogo.dono` bate EXATAMENTE
com a cor dela (`#d2704a` → pixel `[210,112,74]`) na posição esperada do
minimapa; um quarteirão seu, na mesma checagem, não pega a cor de nenhuma
vila — fica por conta de outra camada (prédio, rua).

---

## Vila rival nasce bem mais longe

`DIST_ENTRE_VILAS` foi de 46 pra 100 numa fase anterior — o bastante pra uma
malha de estrada, curto demais pra sentir distância de verdade num mundo sem
borda nenhuma. Cem tiles a pé nem chega a ser um passeio. Foi pra **800**
(escala de quilômetro, não de quarteirão) — dá pra chegar lá se você decidir
ir andando, mas o encontro normal com uma vizinha passa a acontecer anos
depois, quando o TERRITÓRIO de cada lado avança o bastante pra fronteira se
tocar (e agora que o freio na fronteira existe — ver "Três ajustes de
simulação" — esse avanço é bem mais contido, então o reencontro é mesmo
gradual, não instantâneo).

Mesma busca de terreno de sempre (`lugarDeVilaRival`), só partindo mais
longe — testado em 12 seeds diferentes, as quatro vilas (cantos
noroeste/nordeste/sudoeste/sudeste) sempre nasceram na primeira distância
tentada, sem precisar de nenhum dos passos de busca extra que já existiam
pra terreno difícil.

---

## Cais: por que não construía, e a faixa de areia

Três pedidos ligados, investigados antes de mexer em qualquer coisa.

**Por que o cais não ia — achado direto no código, duas causas somadas.**
(1) `SOLIDO[AGUA]` e `SOLIDO[RASO]` são `true` — todo prédio, cais incluído,
tinha o próprio chão barrado em qualquer tile de água, sem exceção nenhuma
pro único prédio que devia ficar bem ali. (2) `confirmarColocacao` exigia
`encostaNaRua` pra QUALQUER prédio, cais incluído — e terreno de beira
d'água que já tenha rua por perto é raro, ainda mais longe da vila. As duas
travas juntas praticamente impediam o cais de sair do papel, com ou sem
água por perto.

**Cais agora é o único prédio que não precisa de rua** (pedido explícito).
`areaValida`/`cabeAqui` ganharam um parâmetro `def` opcional: quando
`def.beiraDagua` (só o cais tem essa marca), o próprio chão do prédio pode
cair em água RASA — a doca de verdade avançando sobre a água, não só
encostada nela — e a exigência de `encostaNaRua` é pulada em todo lugar que
a checava (colocação manual, pedido do conselho, fantasma de arrasto,
mover prédio existente). `decidirObra` não tenta mais "abrir rua até a
água" pro cais — não faz mais sentido pedir rua pra quem não precisa dela.

**Nova regra: nem rua nem prédio nasce perto da faixa de areia.** Não existe
areia de deserto neste jogo — o bioma AREIA só nasce como praia (ver "O
mundo"), então "perto de areia" já é "perto da beira d'água". Antes dava
pra calçar rua em cima de qualquer RASO sem limite nenhum de comprimento —
media (achado ao vivo): um lago de ~17 tiles de água rasa deixava calçar o
trajeto inteiro, tile a tile, sem nunca esbarrar em nada. Agora:

- Rua nunca nasce EM cima de areia (`podeVirarRua`).
- Água RASA passa a exigir o MESMO vão curto que água FUNDA já exigia
  (`vaoCurto`/`VAO_MAXIMO`) — sem isso RASO tinha passe livre.
- Prédio comum (todos, menos o cais) não nasce no halo de 1 tile ao redor
  de qualquer areia (`pertoDaPraia`, mesmo padrão de `temAguaPerto`/
  `temRochaPerto` que já existiam).

**A ponte continua funcionando.** Cogitei bloquear rua perto de areia em
QUALQUER situação, mas isso aposentaria a ponte (rua atravessando água
funda, já existente, com custo maior) em qualquer costa arenosa — pra
lançar uma ponte a rua precisa chegar até a margem, que quase sempre tem
areia do lado. Confirmado com você: a checagem de praia trava só o tile que
É areia — o tile de terra firme colado nela (de onde uma ponte de verdade
lança) continua liberado. Testado ao vivo, num lago real do mundo: tile de
campo a 1 tile da areia (bem na margem) segue calçável; tile de raso a 17
tiles da margem oposta (fora do vão máximo) não.

Nada disso mexe retroativamente em rua ou prédio já existente de antes da
regra — `cabeAqui` (usado por mover e melhorar prédio JÁ CONSTRUÍDO) não
ganhou a checagem de praia, só `areaValida` (usado só pra construção NOVA).

Testado ao vivo num trecho de costa real do mundo (não hipotético): cais
construído com sucesso direto na areia/raso, sem rua num raio de dezenas de
tiles, confirmado visualmente (desktop e mobile) parado sozinho na beira
d'água; prédio comum barrado no mesmo lugar exato onde o cais passou;
`podeVirarRua` testado tile a tile na transição real água→raso→areia→
campo; construção normal longe de qualquer água (perto do Centro)
re-testada sem nenhuma mudança de comportamento.

---

## Vila rival: por que só um adulto trabalhava

Duas causas achadas lendo o código, as duas em `distribuirTrabalhoRival`
(o "emprego" da vizinha, roda uma vez por dia junto do resto do conselho
rival) e em `transferirPredio` (a função que muda um prédio de dono).

**1 — moradia comia toda gente nova antes de emprego.** Medido numa vila
real simulada por 800 dias: 8 pessoas morando, só 3 trabalhando, com 7
prédios de emprego de pé — a maioria vazia mesmo tendo prédio pronto. Causa:
`distribuirTrabalhoRival` varria `v.predios` em ordem de CONSTRUÇÃO,
misturando casa e prédio de trabalho na mesma passada. Casa nasce um pouco
à frente da necessidade de propósito (mesma filosofia de "não espera lotar
pra construir" — ver "Três ajustes de simulação"), então quase sempre tem
vaga de moradia sobrando; como é sempre a mais numerosa e aparece cedo na
lista, a gente nova (o pingo diário de crescimento da população) era sempre
consumida ali primeiro — fazenda, mina, oficina nunca chegavam a ter vez.
Corrigido: emprego agora é uma passada própria, sempre ANTES de moradia. Só
sobra pra morar quem já não tinha vaga de trabalho pra ocupar. Medido de
novo depois: 5-6 trabalhando contra 5 morando, 5-6 de 6-7 prédios de
emprego com gente (~85%, contra ~43% antes).

**2 — achado investigando: prédio duplicado ao reclamar o próprio
abandonado.** `donoDoPredio` devolve 0 (convenção "sem dono de vila") pra
QUALQUER prédio abandonado, não importa de quem era antes. Mas
`transferirPredio` usava esse 0 pra achar a LISTA de origem
(`listaDaFaccao(0)` sempre aponta pra `jogo.predios`, a sua) — então
reclamar uma fazenda abandonada de uma VILA RIVAL nunca achava essa fazenda
em `jogo.predios` (ela nunca esteve lá), o `splice` não tirava de lugar
nenhum, e o `push` final criava uma cópia nova sem apagar a antiga.
Medido ao vivo: uma vila sozinha acumulou o mesmo id de fazenda duas vezes
na própria lista em 800 dias, só de reclamar prédio abandonado seu mesmo (o
caso mais comum — job-holder morre, prédio abandona, dia seguinte alguém
novo reclama). Corrigido: em vez de confiar em `donoDoPredio` (que não sabe
mais de quem era, justamente por já estar abandonado), procura o prédio em
TODAS as listas que existem — a sua e a de cada vila — e tira de onde ele
estiver de verdade. Save antigo que já tinha acumulado essa sobra ganha uma
limpeza automática no carregamento (duas construções nunca dividem o mesmo
tile de origem — qualquer colisão só pode ser essa sobra).

Testado ao vivo, duas vilas criadas juntas (do jeito que o jogo faz de
verdade — `criarRivais` só roda uma vez, na criação do mundo) simuladas por
1000 dias: zero prédio duplicado nas duas, ~85% dos prédios de emprego com
trabalhador nas duas, confirmado visualmente (desktop e mobile) gente
trabalhando em fazenda/oficina/mina ao mesmo tempo, não só uma pessoa.

---

## Cor de prédio misturada dentro da mesma vila

Efeito colateral direto da correção anterior (prédio fantasma): "vila
laranja com prédio verde e outros laranjas" — achado sem precisar
investigar de novo, a causa já estava à vista no código que acabou de mexer
em `transferirPredio`.

`cachePredioTingido` (onde o sprite tingido na cor da vila fica guardado,
pra não recortar e tingir de novo a cada quadro) guarda o recorte pronto
por `pr.id` — SOZINHO, sem `pr.vila`. Fazia sentido antes: um prédio pronto
nunca trocava de dono de um jeito que se via na tela — a troca ficava presa
no bug do prédio fantasma. Agora que `transferirPredio` funciona direito
(commit anterior), um prédio PODE trocar de dono de verdade no meio da
partida — e sem apagar o cache antigo, ele continuava desenhado pra sempre
na cor de quem era ANTES da troca, mesmo já pertencendo a outra vila.

Corrigido: `transferirPredio` apaga a entrada do cache na hora exata em que
`pr.vila` muda — o próximo quadro tinge de novo, com a cor certa.

Testado ao vivo, não só visual: pegou um prédio de verdade da vila A
(laranja `#d2704a`), tingiu (populando o cache), transferiu pra vila B
(roxa `#7a6fd0`) com a função de produção, e comparou a média de RGB do
recorte tingido ANTES e DEPOIS — o canal azul mais que dobrou (57→125,
puxando pra família roxa de B) e o vermelho caiu (184→133, afastando da
família laranja de A), contra uma casa de A nunca transferida (184,102,57,
claramente laranja) tingida ao lado pra comparar lado a lado. Confirmado
visual (desktop e mobile): castelo e casa da mesma vila, cores batendo.

---

## Vila rival no mesmo ritmo, e o painel "Vilas rivais"

Pedido explícito, três partes: vila rival crescer no mesmo ritmo que a sua
(só a cor muda), isso valer com o tempo acelerado, e dar pra VER o
desempenho de cada uma. Plano em `.claude/plans/robust-conjuring-reef.md`.

**O relógio já era o mesmo — investigado, não era isso.** `quadro()` roda
`passo(dt)` até `velocidade` vezes por quadro, e é dentro de `passo()` que
`tickDia()` dispara ao cruzar um dia — a mesma chamada que processa
nascimento/morte da sua vila E roda `tickVilas()` pra cada rival.
Acelerar pra 16× não desacopla os dois: os dois avançam dia a dia juntos,
pela mesma chamada.

**O painel "Vilas rivais"** (🏘️ novo na barra lateral, só aparece com
`emDisputa()`) veio primeiro de propósito — item 3 do pedido, e também a
ferramenta que tornou possível medir os itens 1 e 2 de verdade, com número
do jogo real em vez de suposição. Mesmo padrão visual de "📊 Produção da
vila" (as classes já existiam); reaproveita a mesma fórmula de economia da
vizinha só pra LER (`saldoDiarioRival`, não muda estoque — quem muda é
sempre `diaDaVilaRival`), e mostra por vila: população/capacidade,
comida/madeira/pedra (estoque sobre teto + saldo por dia), prédios,
quarteirões — com a sua vila resumida no topo, pra comparar sem trocar de
tela.

**O que a medição achou — dois bugs de verdade, não a vizinha sendo lenta
por natureza.**

Medindo emparelhado (jogador e uma vila rival, mesmo ponto de partida,
mesmos dias, usando `recuperarOffline` — a MESMA rotina que o jogo já usa
pra avançar sua vila quando você estava fora, reaproveitada pra medir em
vez de esperar dias de verdade passarem): nos primeiros ~280 dias os dois
cresciam parecido. Depois, a SUA vila disparava — 8→481 pessoas em 480
dias, contra a vizinha crescendo devagar e constante. Isso não era "a
vizinha devagar" — era a SUA vila rápida demais.

**Bug 1 — `avancarObras` (o motor de construção de `recuperarOffline`)
dava o ritmo INTEIRO pra CADA canteiro aberto, não pra vila toda.**
O comentário do próprio código já dizia a intenção: "1,65 é o ritmo que o
jogo sempre teve sem você — um operário e meio martelando", no SINGULAR,
descrevendo a vila inteira. Mas o código aplicava esse 1,65 a CADA prédio
em obra independentemente — com até três ao mesmo tempo (`OBRAS_AO_MESMO_
TEMPO`), uma casa (tempo:70) terminava em bem menos de um dia, e o
conselho enfileirava outra no dia seguinte, sem parar: um circuito
casa→gente→trabalhador→recurso→casa girando livre, sem o freio de mão de
obra que o jogo aberto sempre teve (equipe pequena por obra, gente ocupada
com outra coisa). Corrigido: reparte o mesmo 1,65 entre os canteiros
abertos, não dá um inteiro pra cada.

**Bug 2 — a vizinha só sabia construir `casa` (5 de teto), nunca
`sobrado` (9), mesmo com prédio e recurso de sobra.** Mesmo com o Bug 1
corrigido e sem teto artificial de tentativas por dia (ver "Três ajustes
de simulação" — o teto de 4 tentativas fazia sentido pro problema que
resolvia, mas virou gargalo novo numa vila grande com mais de quatro
coisas genuinamente faltando no mesmo dia), a população da vizinha ainda
ficava bem atrás da sua numa vila grande — porque o TETO de moradia dela
crescia mais devagar, preso a `casa` só, enquanto a sua já escolhe sobrado
a partir de pop 20 (mesmo `conselho()`). `capacidadeMoradiaRival` soma de
verdade sobre os prédios da vizinha (funciona pra qualquer mistura de
tipo), e `chaveDeMoradiaRival` aplica o MESMO limiar de pop 20 que o seu
conselho já usa.

**Testado ao vivo, medição pareada de verdade (não só o primeiro dia):**
com as três correções, jogador e vizinha ficaram próximos (proporção
0,8–1,2, a vizinha às vezes até na frente em prédio) por um bom trecho —
até uns 350 dias simulados. Depois disso ainda sobra uma divergência
menor, plausivelmente o próprio mecanismo de migração (`migrarEntreVilas`)
puxando gente pro lado mais próspero — que é a disputa territorial
FUNCIONANDO como já era pra funcionar, não um bug novo; fica registrado
como algo a olhar de novo se continuar incomodando, não escondido.

---

## A caminho de um motor só pra toda vila (etapa 1 de 8)

Pedido novo, revendo a decisão anterior de vila rival ser um modelo
simplificado: toda vila — a sua e cada rival — deve rodar o MESMO
mecanismo e as MESMAS regras. Plano de 8 etapas em
`.claude/plans/robust-conjuring-reef.md`. Dois sintomas concretos
motivaram: gente rival visivelmente mais devagar que a sua, e no máximo
uns 3 aldeões rivais visíveis na tela ao mesmo tempo (mesmo com população
grande).

**Conserto imediato, sem esperar as próximas etapas**: `VELOCIDADE_GENTE_
RIVAL` (o passo de quem anda por uma vila rival) era menos de um terço de
`VEL` (o passo do jogador) — 16 contra 47, sem motivo pra ser diferente.
Agora aponta pro mesmo `VEL`, nunca mais descola.

**Etapa 1 — a base, antes de qualquer coisa arriscada**: dar a cada vila
rival uma malha (`estradas`, um Set de verdade) e fila de obra de rua
(`obrasEstrada`) própria, no lugar do `v.ruas` puramente decorativo de
hoje — pré-requisito pras próximas etapas poderem usar o A* de verdade
(`acharCaminho`) e o resto do motor de movimento do jogador pra gente
rival.

**Bug evitado ANTES de acontecer, achado investigando (não vivido ainda,
mas real)**: os caches de malha (`indiceDeRuas`, `pedacoPrincipal`,
`quarteiroesPorPerto`) se invalidavam comparando só o TAMANHO da malha
contra a última vez — certo enquanto só existia UM `estradas` (o seu).
Assim que uma vila rival também tiver `estradas` própria e as próximas
etapas passarem a trocar entre elas, duas malhas de vilas diferentes com o
MESMO tamanho por coincidência fariam o cache devolver a malha ERRADA, sem
avisar nada. Corrigido antes de expor o risco: os três caches agora também
conferem a IDENTIDADE do Set, não só o tamanho.

Testado ao vivo, não só teoria: criei um Set do MESMO tamanho que a malha
real mas com tiles completamente diferentes, troquei `jogo.estradas` pra
ele — o índice de rua mudou de verdade (não serviu o cache velho),
confirmado comparando a primeira chave de cada índice (`-5,-5` contra
`9000,9000`); restaurando a malha original, o índice voltou a bater
exatamente com o de antes. Malha normal do jogo (índice, quarteirão por
perto, pedaço principal) re-testada sem nenhuma mudança de comportamento.

Faltam as etapas 2-8 (troca de contexto entre vilas, gente rival com o
mesmo molde que a sua, motor único de verdade, "ao vivo" vs "adormecida"
como freio de desempenho, teto de população medido, migração de save,
conferência visual) — trabalho grande, contínuo nas próximas sessões.

## Troca de contexto entre vilas (etapa 2 de 8)

Continuação do plano acima. Nenhuma função do motor de verdade
(`acharCaminho`, `atualizarPessoa`, `conselho()`, `distribuirOficios()`,
`criarPessoa`, `tickDia`) recebe "qual vila" como argumento — todas leem e
escrevem direto em `jogo.recursos`/`predios`/`pessoas`/`estradas`/
`obrasEstrada`/`ano`/`anoFrac`/`clima`/`fome`. Fazer essas funções rodarem
de verdade pra uma vila rival não é reescrevê-las — é apontar esses nove
campos pros da vila por um instante e devolver depois.

`trocarContexto(v)`/`restaurarContexto()` fazem exatamente isso. Os campos
de objeto/array (`recursos`, `predios`, `pessoas`, `estradas`,
`obrasEstrada`) trocam por REFERÊNCIA — o motor escreve neles em cada tick
e a escrita cai direto no objeto da própria vila, sem copiar de volta. Os
de valor (`ano`, `anoFrac`, `clima`, `fome`) são número/texto/booleano —
trocam por CÓPIA, então `restaurarContexto` devolve pra vila o que mudou
antes de repor os do jogador. `jogo.autoAprovar` vira `true` emprestado
enquanto uma vila rival está no contexto (ela não tem jogador esperando
responder pedido de obra) e volta pro valor real do jogador ao sair.
`ocupado` (tile ocupado) e a grade de quarteirão ficam de fora de
propósito — continuam globais, compartilhadas por todas as vilas, porque
um caminho de qualquer uma precisa desviar de prédio de qualquer outra.

Uma trava evita o erro mais fácil de cometer nas próximas etapas: chamar
`trocarContexto` duas vezes sem restaurar entre elas agora lança erro em
vez de perder silenciosamente o contexto do jogador.

Cada vila rival ganhou os campos que faltavam pra poder entrar no lugar de
`jogo` (`recursos`, `pessoas`, `ano`, `anoFrac`, `clima`) — os campos
soltos antigos (`v.comida`, `v.madeira`, `v.pop`...) continuam de pé por
ora, ainda lidos pelo modelo simplificado atual (`diaDaVilaRival` e
companhia), aposentado só na etapa 4.

**Save salvo antes desta mudança**: vila rival carregada de save antigo
não tem esses campos novos ainda (o `carregar()` desserializa só o que
existia na hora do save) — confirmado ao vivo, é exatamente o que a etapa
7 (migração de save) vai preencher. Não afeta o jogo hoje porque nada
ainda chama `trocarContexto` fora de teste — só passa a importar a partir
da etapa 3.

Testado ao vivo, isolado, com try/finally: guardei os nove campos do
jogador, troquei pra uma vila rival, confirmei que os arrays/objetos são a
MESMA referência (`jogo.predios === v.predios`, etc.), mudei `jogo.ano` e
`jogo.clima` dentro do contexto trocado, restaurei — e a vila recebeu de
volta exatamente o que mudou (`v.ano` virou 999, `v.clima` virou 'chuva'),
enquanto o jogador voltou com os nove campos intactos, byte a byte
(comida com casas decimais idênticas, mesmo tamanho de malha). Chamar
`trocarContexto` duas vezes seguidas sem restaurar lançou o erro esperado
e não corrompeu nada — `restaurarContexto()` ainda devolveu os dados do
jogador certos.

## Gente rival de verdade, em paralelo (etapa 3 de 8)

Continuação do plano. `sincronizarPessoasRival(v)` cria gente rival no
MESMO molde `criarPessoa` que a sua gente já usa — idade, sexo, nome,
sobrenome, ofício, casaId, conjugeId, geração, o que nasce e o que
morre registrado no mesmo cemitério (`jogo.ancestrais`) — rodando DENTRO
do contexto trocado da vila (etapa 2): `criarPessoa`/`removerPessoa`
escrevem direto em `jogo.pessoas`, que durante a troca é o mesmo array
que `v.pessoas`, então a gente nova já nasce no lugar certo sem copiar
nada de volta. Usa o mesmo teto de simulação que o modelo antigo
(`TETO_ADULTOS_RIVAL`/`TETO_CRIANCAS_RIVAL`), até a etapa 5/6 medir e
ajustar de vez.

**Ainda não é o que anda na tela.** `v.gente` (o modelo antigo — papel
morador/trabalhador, sem A*) continua sendo quem se move, trabalha e
aparece, exatamente como hoje — `v.pessoas` cresce e encolhe do lado,
com gente de verdade mas parada (ninguém tem ofício nem casa atribuídos
ainda: isso é `distribuirOficios()`/`conselho()`, que só passam a rodar
pra vila rival na etapa 4). É a mesma lógica de escada da etapa 1
(`estradas` sem ninguém usando o A* ainda) e da etapa 2 (`trocarContexto`
sem ninguém chamando fora de teste ainda): cada etapa entrega uma peça
testável isolada, sem arriscar quebrar o que já funciona pro jogador ou
pro visual da vila rival hoje.

Testado ao vivo: criei gente pra duas vilas rivais (12 e 6 de população)
com `sincronizarPessoasRival` — todo mundo saiu com nome/sobrenome/sexo/
idade coerentes, ofício 'nenhum', casaId/conjugeId nulos, id sequencial
saindo do MESMO contador global que o jogador usa (`jogo.proxId` foi de
135 a 153, os 18 criados pras duas vilas). Contexto do jogador (prédios,
pessoas, próximo id) idêntico antes e depois. Reduzi a população de uma
vila de 12 para 4 — `sincronizarPessoasRival` removeu 8 pessoas usando o
`removerPessoa` de verdade (não um truncamento cru): os 8 foram
registrados no cemitério igual a qualquer morte real, e `v.gente` (modelo
antigo) ficou intacto do lado, sem interferência. Devolvi a população a
12 e conferi que voltou a crescer certo. `trocarContexto`/
`restaurarContexto` ficaram limpos (sem contexto pendurado) em todas as
chamadas. Sem erro no console depois de recarregar.

## Aldeão vai buscar material não importa a distância

Pedido explícito: "os aldeões devem ir buscar o material necessário o
quanto longe for necessário, materiais básicos não podem chegar a zero,
eles devem ir atrás não importa a distância".

O raio de busca de recurso (`acharNo`) era o freio contra o aldeão
atravessar o mapa atrás de uma árvore — 45 tiles para o próprio ofício,
16 para "qualquer recurso", e o mesmo 45 para a vila decidir se vale abrir
rua nova até um recurso sem calçamento por perto. Curto demais para uma
vila que já cresceu ou pousou numa região pobre num dos três materiais:
sem achar nada dentro do raio, o aldeão nunca soube que aquele material
existia mais longe, e a vila nunca puxou rua até lá — o estoque só descia.

Três lugares decidem "até onde vale a pena procurar" e agora usam o mesmo
raio bem maior: `RAIO_RECURSO_LARGO` (260 tiles — vila rival nasce a 800
de distância da outra, `DIST_ENTRE_VILAS`, e território alheio já é
bloqueado à parte dentro do próprio `acharNo`, então esse raio nunca sai
comendo terra de vizinha) no lugar do 45 antigo, tanto para o aldeão ir
colher sozinho (`procurarTrabalho`) quanto para a vila decidir abrir rua
nova até o recurso (o pedido que o próprio aldeão dispara, e o item 2 do
`conselho()`). `RAIO_RECURSO_QUALQUER` (90, era 16) para o fallback "não
achei o meu, pego o que tiver".

**Medido o custo antes de subir o número**: `acharNo` só é caro quando NÃO
acha nada — aí varre o raio inteiro em anéis. Com 260 tiles, uma busca sem
resultado nenhum levou ~1s (medido ao vivo). Como é exatamente numa vila
em crise — vários aldeões sem material ao mesmo tempo, cada um tentando
de novo a cada ~2s (`procurarTrabalho` roda por aldeão ocioso) — que essa
busca cara mais aconteceria, sem freio o próprio conserto travaria o jogo
bem na hora que mais precisa não travar. `acharNoLonge` resolve isso
memorizando por 15 segundos reais quando a busca grande não achou nada de
um tipo — todo aldeão que perguntar de novo nesse intervalo aceita o "não
tem" sem pagar a varredura de novo. Não é um teto de distância disfarçado:
o freio é só no RITMO da tentativa cara, e assim que o intervalo passa (ou
assim que alguém já achou aquele tipo), a busca de verdade volta a valer.

Testado ao vivo: 30 chamadas simultâneas simulando uma vila em crise
inteira perguntando pelo mesmo recurso ausente levaram ~1,37s no total —
praticamente só o custo da PRIMEIRA (as outras 29 bateram no cache e
saíram de graça), contra os ~30s que 30 varreduras cheias custariam sem o
freio. Busca por recurso que existe de verdade (madeira/comida/pedra reais
da vila) continuou achando normalmente e não fica presa em cache de "não
tem" — só a busca que falhou é que memoriza. Jogo recarregado, sem erro no
console, aldeões andando e trabalhando normalmente.

## Motor único, de verdade (etapas 4 e 5 de 8)

Continuação do plano em `.claude/plans/robust-conjuring-reef.md`. Esta é a
etapa grande: aposenta de vez o modelo simplificado da vila rival
(economia por fórmula agregada, gente sem A*, emprego só posto/moradia) e
faz QUALQUER vila — a sua ou uma rival — rodar o mesmo motor, através da
troca de contexto da etapa 2.

**O que mudou por baixo**: `demografiaDoDia()` — envelhecer, casar,
nascer, imigrar, morrer — foi fatorado pra fora de `tickDia()`, porque
agora roda tanto pra você (todo dia, como sempre) quanto pra qualquer vila
rival em contexto. `render`/`avancarObras` (antes presos dentro de
`recuperarOffline`, sua própria recuperação ao reabrir o app) viraram
`renderDia`/`avancarObrasDia`, module-level — a MESMA conta de produção
sem ninguém "ao vivo" agora serve às duas coisas: você fechando o app, ou
uma vila rival adormecida. `diaDaVilaRival(v)` — que calculava sua própria
economia por fórmula — agora troca de contexto e deixa `renderDia` +
`avancarObrasDia` + `conselho()` (que decide E constrói, com
`autoAprovar` forçado) + `demografiaDoDia()` tocarem um dia da vida dela,
igualzinho ao seu. `v.pop`/`v.comida`/`v.madeira`/`v.pedra` (os campos
soltos antigos) viram só um ESPELHO sincronizado no fim de cada dia, pra
quem ainda lê deles fora da simulação (fronteira, migração, absorção, o
painel "Vilas rivais" — reescrito pra mostrar estoque de verdade em vez
da fórmula `saldoDiarioRival`, aposentada).

**"Ao vivo" vs. adormecida (etapa 5)**: só a vila rival perto o bastante
da câmera pra aparecer na tela roda `atualizarPovo` (a MESMA função do
jogador, sem mudar uma linha) através do contexto trocado — pathfinding
de verdade, pessoa por pessoa. As demais ficam adormecidas: ninguém se
move entre um quadro e outro (custo zero), e como também não são
desenhadas, ninguém percebe — o crescimento delas continua vindo do dia a
dia comprimido, ao vivo ou não.

**Aposentado de vez** (não fica como sobra morta): `v.gente`,
`criarGenteRival`, `removerGenteRival`, `sincronizarGenteRival`,
`distribuirTrabalhoRival`, `rotinaRival`, `atualizarGenteRival`,
`tentarConstruirNaVilaRival`, `saldoDiarioRival`, `chaveDeMoradiaRival`,
`podeVilaRivalPagar`, `pagarVilaRival`, `dentroOuPertoDoTerritorio`,
`proxGenteRivalId`. `criarPessoa`/`criarPredio` ganharam uma linha cada
(`vila: vilaEmContexto ? vilaEmContexto.id : undefined`) — sozinho isso já
resolve o dono/tingimento certo de gente E prédio novo de qualquer vila,
sem precisar passar "de quem é" em cada chamada.

**Vazamentos de contexto achados e fechados** (o tipo de bug que só
aparece quando duas simulações passam a dividir o mesmo código): `jogo.
cronica`/`jogo.ancestrais`/toast (`aviso`)/`flutuar`/`fluxoDia`
(`anotarFluxo`) são todos estado só do JOGADOR, não fazem parte da troca
de contexto — sem guarda, cada nascimento/morte/aviso de uma vila rival em
contexto vazaria pro diário, cemitério, toast ou média de fluxo do
jogador. Todos ganharam `if (vilaEmContexto) return;` (ou equivalente).
`saldoComidaPorAno()` (mede o fluxo do JOGADOR quadro a quadro) virou
`saldoComidaAtual()`, que cai no cálculo teórico — já usado como
fallback, e por isso já corretamente genérico — quando uma rival está no
contexto. `avaliarCombate`/`transferirPredio`/a lista de "prédio
abandonado pra ocupar" (dentro de `distribuirOficios`) tinham a facção
`0` (jogador) HARDCODED — corrigido pra `vilaEmContexto ? vilaEmContexto.
id : 0` em cada um; sem isso, uma vila rival ocupando prédio abandonado
ocuparia EM NOME DO JOGADOR.

**Bug achado ao vivo, o mais sério dos três** — medindo 60 dias de vida de
uma vila rival recém-fundada sem uma casa nova sair do papel: o anel de
rua que `anelDoQuarteirao` desenha na fundação é só DECORATIVO (etapa 1:
"nunca é lido por pathfinding nenhum"). O anel de VERDADE
(`jogo.estradas`/`v.estradas`, o que `escolherLote`/`crescerRua`
realmente enxergam) só nasce de graça pra VOCÊ, em `ruaFundadora` — nunca
existiu pra vila rival. Sem uma rua real pra encostar, `escolherLote`
nunca achava lote, e `crescerRua` nunca crescia nada (precisa ENCOSTAR
numa rua existente pra começar) — a vila travava pra sempre com só
centro+casa, população crescendo sem nenhum lugar pra morar ou trabalhar.
`ruaFundadoraRival(v)` fecha o mesmo anel, mas sem tocar
`jogo.malhaOx`/`malhaOy` (a origem da grade é do MUNDO inteiro,
compartilhada — mexer nela pela fundação de uma vila rival deslocaria a
grade de todo mundo). Chamada na fundação de toda vila nova, e também no
carregamento de save — de QUALQUER idade, incluindo save feito nesta
mesma sessão antes deste conserto — sempre que a vila carrega com
`estradas` vazia.

**Save/load**: `v.pessoas` agora salva no MESMO formato compacto que
`jogo.pessoas` do jogador (era o objeto cru de `v.gente` antes). Achado
no caminho, antes de virar problema: `v.estradas` é um `Set`, e
`JSON.stringify` de um Set vira `{}` — sem converter pra array antes de
salvar, a malha de CADA vila rival se perderia por completo a cada
save/reload, silenciosamente. Save antigo (sem `v.pessoas`, só o `v.gente`
de antes ou nada): decisão já tomada — a vila rival refunda a população do
zero (`sincronizarPessoasRival`, a mesma rotina da fundação).

**Testado ao vivo, de ponta a ponta**: fundei duas vilas rivais do zero
(8 pessoas reais cada, no molde `criarPessoa`, prédios corretos); rodei
`diaDaVilaRival` 60 vezes seguidas numa delas — população 8→13→53,
prédios 2→23 (casa, sobrado, casarão, mercado, seis fazendaGrande, duas
oficinas, serraria, escola, prefeitura, praça, estábulo, um SEGUNDO
centro — bairro novo), malha de rua 19→63 tiles, uma obra em progresso
real (progresso 0→1, não instantânea) — em 339ms pros 60 dias, sem
travar. Todo prédio e toda pessoa nasceu com `vila` certo (tingimento
correto). Contexto do jogador (prédios/pessoas/recursos) idêntico antes e
depois em toda chamada. `passo()` chamado direto 40 vezes com a câmera
perto da vila "ao vivo" — todas as pessoas amostradas se moveram de
verdade (pathfinding real, não simulação abstrata). Índice de combate e
`matarPorCombate` testados contra gente de vila rival: sem erro, remove
de `v.pessoas` de verdade, sincroniza `v.pop` na hora, cemitério do
jogador intacto (não ganhou entrada da rival). Save/load com as duas
vilas (52 e 8 pessoas, 23 e 2 prédios, malha de 63 e 19 tiles) voltou
byte a byte — população, prédios, recursos, malha, tingimento, tudo.
Jogo recarregado várias vezes ao longo do teste, sem erro no console.

Faltam as etapas 6-8 (teto de população ajustado com base no que foi
medido aqui, migração de save mais ampla se precisar, conferência visual
final) — mas o motor em si, o ponto central do pedido original, já roda
igual dos dois lados.

## Teto medido, save antigo e conferência visual (etapas 6, 7 e 8 de 8)

Fecha o plano de 8 etapas.

**Etapa 6 — o teto de verdade.** Medindo ao vivo (o pedido explícito da
etapa 5: "vou medir o custo real... e baixar o teto pro que aguentar"),
achei DOIS custos diferentes, não um só:

- O movimento "ao vivo" (`atualizarPovo` de verdade, pathfinding
  incluído) é barato mesmo em população grande — 534 pessoas, câmera
  enquadrando a vila inteira, saíram em ~1,5ms por quadro. Não era esse o
  risco.
- `conselho()`/`distribuirOficios()` — que varrem `jogo.predios`/
  `jogo.pessoas` várias vezes cada, toda vez que o dia muda — são bem mais
  caros, e o custo segue mais o NÚMERO DE PRÉDIOS do que a população: uma
  vila que cresceu (com o teto de população antigo, 550) até 140 prédios
  levou **485ms só no `conselho()`** — quase meio segundo travado num
  quadro só. Com até quatro vilas rivais mudando de dia junto (mesmo
  `tickDia()`, sempre — não é caso raro), a soma broke a casa dos 60-90ms
  já com população bem mais modesta.

Dois freios, não um: `TETO_ADULTOS_RIVAL`/`TETO_CRIANCAS_RIVAL` (500/50 →
**200/25**) agora valem como teto de POPULAÇÃO de verdade — `popMax()`
capa o valor devolvido pra qualquer vila em contexto, e o próprio
`conselho()` da vila para de pedir mais moradia sozinho assim que bate no
teto (mesma conta de `querMaisTeto`, sem precisar de freio extra em
nascimento/imigração). E um `TETO_PREDIOS_RIVAL` novo (**45**) capa
`construirAuto()` — o gatilho de "bairro novo" (conselho, item 5) olha só
recurso sobrando e população perto do teto, então uma vila rica continuava
abrindo quarteirão e prédio pra sempre mesmo com gente já capada; isso
fecha essa porta direto na fonte.

Testado ao vivo, do zero: uma vila rival, crescendo só por dia comprimido
(sem eu forçar população), bateu o teto de prédios (45) e PAROU — população
estabilizou em 96 (bem abaixo do teto de 225, naturalmente limitada pela
moradia que os 45 prédios comportam) e ficou EXATAMENTE nesse número por
180 dias seguidos medidos. `conselho()` nesse estado estável: **~10ms** —
a maior parte do caminho de volta pro custo barato medido em vilas
pequenas, contra os 485ms do descontrole antigo. Com até quatro vilas
nesse mesmo estado, o pior caso realista fica por volta de 40ms — um
tranco breve uma vez por dia de jogo (~4 minutos reais), não mais uma
trava de quase meio segundo.

**Bug achado no caminho, sem relação com desempenho** — testando fundação
do zero repetidas vezes, uma em cada duas vilas nascia sem Centro (só
`casa`), mesmo com lote de sobra no quarteirão — `erguerNaVilaRival` pro
Centro (3x3) falhava na primeira tentativa, mas tentar de novo (já com a
casa no lugar) sempre achava vaga. Não cheguei à causa exata, mas a
repetição é barata e resolveu de forma confiável em vários testes
seguidos — sem ela, a vila ficava PRA SEMPRE sem Centro (`centroDaVila()`
cai pra `jogo.predios[0]`, a casa, dimensão errada) e boa parte do
conselho trava. `fundarVilaRival` agora tenta o Centro de novo depois da
casa, e mais uma vez depois da rua de verdade, se ainda faltar.

**Etapa 7 — save antigo, confirmado.** Já estava praticamente pronto desde
a etapa 4 (`carregar()` refunda a população de uma vila sem `v.pessoas`
salvo, preservando prédio e território). Testado agora de propósito: peguei
um save real (uma vila com 96 pessoas/45 prédios), apaguei à mão os campos
novos (`pessoas`/`recursos`/`ano`/`anoFrac`/`clima`/`estradas`,
simulando um save de antes da etapa 2) e recarreguei — a vila manteve os
45 prédios e a malha de 155 tiles, e a população recomeçou do zero no
molde novo (96 pessoas frescas, `criarPessoa` de verdade, tingidas
certo) — exatamente a decisão combinada ("vila rival recomeça do zero,
mesmo lugar, mesma cor — só a gente recomeça").

**Etapa 8 — conferência visual.** Vila rival com 45 prédios (toda a
variedade: fazenda, centro, casa, sobrado, casarão, depósito) e ~90
aldeões rodando de verdade, vista de perto: prédio e gente aparecem,
tingidos, com aldeões andando entre as construções — confirma que
`desenharPredio`/`desenharPessoa` (já compartilhados entre jogador e
rival desde antes deste plano) continuam funcionando sem qualquer ajuste,
porque só o FORMATO por trás de `v.pessoas`/`v.predios` mudou ao longo
das 8 etapas, nunca como são desenhados.

**Com isso, o plano de 8 etapas do motor único termina aqui.** Toda vila —
a sua ou uma rival — corre a mesma simulação, com o mesmo freio de
desempenho (ao vivo perto da câmera, adormecida longe) e o mesmo teto
medido de verdade, não estimado.

## Sem teto de verdade — consertando a causa em vez de limitar (etapa 6, revista)

Pedido explícito, direto: teto de população/prédio pra vila rival (a
etapa 6 acima) resolvia o travamento, mas também condenava a vila rival a
nunca crescer o bastante pra disputar fronteira de verdade — o motivo
inteiro do plano de motor único. Errado limitar o CRESCIMENTO pra
consertar um problema de DESEMPENHO — o certo era achar por que
`conselho()` ficava caro, e consertar isso.

Achei dois laços O(prédios × pessoas) escondidos dentro do que já rodava
todo dia:

- `pessoaPorId` era `jogo.pessoas.find(...)` — O(pessoas) TODA chamada.
  `distribuirOficios()` chama ela uma vez por PRÉDIO com trabalhador (duas
  passadas: soltar quem trocou de ofício, dispensar excedente). Virou um
  índice id→pessoa (`indicePessoas`), refeito sob demanda (uma vez por
  "geração" do array — invalidado por identidade do array E por um
  contador bumped em `criarPessoa`/`removerPessoa`, os dois únicos lugares
  que mexem em `jogo.pessoas`) — O(1) por busca daí em diante.
- `entregaMaisProxima` (usada também na entrega de carga de verdade, ao
  vivo) varre TODO `jogo.predios` por dentro. `conselho()` chamava ela uma
  vez por PESSOA só pra contar quem está "longe" de um depósito. Prédio de
  entrega é sempre pouco (depósito, centro, mercado — não cresce com
  casa/fazenda): filtra essa lista pequena uma vez, fora do laço por
  pessoa, e repete a mesma lógica só sobre ela.

Medido: a mesma vila de 140 prédios/534 pessoas que dava **485ms** em
`conselho()` caiu pra **3-5ms**. Em 300 prédios/1000 pessoas, ainda só
2-11ms. **Os dois tetos artificiais foram removidos** — `popMax()` não
capa mais população de vila rival, e `construirAuto()` não capa mais
prédio. A vila cresce exatamente como a sua: limitada só pela própria
moradia que ela constrói.

**Segundo problema, esse escondido atrás do primeiro** — mesmo sem teto
nenhum, uma vila rival travava sozinha em pop 18: fome permanente.
`EFIC_AUSENTE` (0,55×, "sem ninguém ao vivo por perto") foi pensado pra
UMA AUSÊNCIA CURTA da sua vila — o app fechado por algumas horas. Mas é
também a ÚNICA produção de qualquer vila rival adormecida, que passa a
vida INTEIRA adormecida (só a vila mais perto da câmera fica ao vivo por
vez). O desconto que devia ser ocasional virava permanente: quatro
fazendeiros pra dezoito pessoas — a MESMA proporção "uma lavoura pra cada
cinco" que o conselho já mira — rendiam só 55% do esperado, sempre abaixo
do consumo. A vila morria de fome pra sempre, bem antes de qualquer teto
importar. `eficienciaProducao()` agora devolve 100% pra qualquer vila
rival em contexto — ela não tem "jogador ausente", é sempre assim, e
essa é a simulação dela.

**Terceiro achado, ao testar do zero com sementes diferentes** — uma vila
em cada duas ou três nascia perto de uma praia, e a checagem de terreno
de `lugarDeVilaRival` só barra ÁGUA FUNDA num raio grosseiro, não a FAIXA
DE AREIA (a regra do Cais, `pertoDaPraia`, dentro de `areaValida`). Um
lugar sem água nenhuma no raio passava, mas a faixa de areia bloqueava o
quarteirão INTEIRO por dentro — a vila nascia sem conseguir erguer nem
Centro, prédio nenhum, pra sempre. `cabeNoQuarteirao` (a mesma busca que
`erguerNaVilaRival` já fazia, sem construir nada) agora confirma de
verdade que Centro E Casa cabem ali antes de aceitar o lugar — testado
com a semente exata que reproduzia o bug: a vila passou a nascer num
lugar diferente, mais longe da praia, com os dois prédios de pé.

Testado ao vivo, do zero, várias sementes: fundação sempre com Centro e
Casa (ou a vila é pulada de vez, se genuinamente não achar lugar — nunca
mais nasce quebrada). Uma vila cresceu, sem nenhum teto, de 8 pra 255
pessoas e 158 prédios em pouco mais de 800 dias simulados, sem fome,
território (`v.blocos`) crescendo de verdade via `tickVilas()` (mais
devagar que população/prédio — mesma pressão de prosperidade que já rege
a sua vila, não um bug novo). Save/load com esse estado voltou byte a
byte. `pessoaPorId`/`entregaMaisProxima` continuam corretos pro jogador
(testado: acham a pessoa certa, o depósito certo) — a otimização é
transparente, não muda resultado, só o custo.

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
