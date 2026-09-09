/*
   Monta a folha dos prédios.

   QUARTA LEVA DE ARTE — pasta inteira nova (pedido explícito: trocar todos os
   dezesseis prédios de uma vez). Ao contrário da leva anterior (fundo PRETO
   chapado, de JPEG convertido), esta vem com fundo CLARO — branco puro
   (255,255,255) na maioria dos arquivos, cinza-claro (~230) em alguns
   (fazendagrande, mina) — e SEM auréola escura de recorte ao redor da
   silhueta (a leva de antes tinha; esta não, conferido pixel a pixel: a
   transição de fundo pra desenho é direta, sem faixa escura sólida no meio).
   Por isso 'removerFundoClaro' não usa cor de referência fixa nem precisa da
   segunda passada de auréola — classifica "é fundo" por ser claro E pouco
   saturado (perto de cinza), o que cobre tanto o branco quanto o cinza sem
   precisar saber de antemão qual dos dois um arquivo usa.

   Depois daqui o pipeline é o de sempre: recorta no que sobrou, reduz de
   tamanho com alfa pré-multiplicado, empacota numa folha, quantiza a cor.
*/
const fs = require('fs');
const { decodificar, codificar } = require('./png.js');

const ORIG = 'C:/Users/PPCP/Downloads/jogo/';
const TILE = 28;
/*
   PEDIDO EXPLÍCITO — "aproveitar a qualidade pra otimizar tamanho": esta
   leva de arte é rica em gradiente e sombra suave (quase foto), então
   comprime bem pior que arte chapada no mesmo tamanho de pixel — testado ao
   vivo, 2,2 (a folga de sempre) dava uma folha de 1075 KB em base64, quase
   o dobro da anterior. 2,0 é o piso que 'ferramentas/LEIAME.md' documenta
   sem borrar no zoom máximo, e cortar até lá (mais DEGRAU=16 — ver o uso
   mais abaixo) trouxe a folha para perto do tamanho de antes, com a mesma
   nitidez a olho nu (conferido: flâmulas e frestas finas do Centro
   continuam limpas, sem halo nem serrilhado).
*/
const ESCALA = 2.0;         // resolução extra guardada, para aguentar o zoom
const ALTURA_MAX = 2.4;      // um prédio pode ser 2,4x a profundidade do lote

/*
   Lote de cada prédio, igual ao PREDIO do jogo — os dezesseis, o pacote
   novo cobre todos. 'w'/'h' são o LOTE de verdade (colisão, plantação de
   rua etc.) e não mudam aqui: só a arte troca, o terreno que cada prédio
   ocupa no jogo continua o mesmo de sempre.

   'mult' é o único número novo: multiplica a caixa na tela DEPOIS da conta
   de sempre (que trava a largura no lote), pra um prédio ocupar mais do que
   o próprio lote sugere — how 'ESCALA_PREDIO' já faz pra todo mundo, só que
   este é POR PRÉDIO, em cima daquele. Serve para um pedido específico: o
   Centro deve parecer que toma o quarteirão inteiro, não só o seu lote 3x3
   — ver a conta em 'tamanhoNaTela'.

   QUANTAS VARIANTES POR PRÉDIO — "aproveitar a qualidade pra otimizar
   tamanho" (pedido explícito): a pasta trouxe 4 ou 5 fotos por prédio, mas
   guardar todas não ajuda em nada um prédio que só existe UMA vez por vila
   (Centro, Prefeitura, Fazenda Grande — cada vila tem no máximo um) — é
   peso de folha sem variedade nenhuma pra mostrar. Só vale variar o que
   REPETE muito na vila: casa é a imensa maioria dos lotes construídos, por
   isso fica com as 5; o resto ganha 2 a 3, o suficiente pra romper a
   repetição sem inchar a folha à toa.
*/
const LOTE = {
  centro:        { w: 3, h: 3, mult: 1.75, arq: 'centro1.PNG' },
  casa:          { w: 2, h: 2,
                    arq: ['casa1.PNG','casa2.PNG','casa3.PNG','casa4.PNG','casa5.PNG'] },
  deposito:      { w: 2, h: 2, arq: ['deposito1.PNG', 'deposito2.PNG'] },
  fazenda:       { w: 3, h: 3, arq: ['fazendapequena1.png', 'fazendapequena2.png'] },
  oficina:       { w: 2, h: 2, arq: ['oficina1.PNG', 'oficina2.PNG', 'oficina3.PNG'] },
  estabulo:      { w: 3, h: 2, arq: ['estabulo1.png', 'estabulo2.png'] },
  cais:          { w: 2, h: 2, arq: 'cais1.PNG' },
  mercado:       { w: 3, h: 2, arq: ['mercado1.png', 'mercado2.png', 'mercado3.png'] },
  sobrado:       { w: 2, h: 2,
                    arq: ['sobrado1.PNG','sobrado2.PNG','sobrado3.PNG','sobrado4.PNG'] },
  predio:        { w: 3, h: 2, arq: ['casarao1.PNG', 'casarao2.PNG', 'casarao3.PNG'] },
  fazendaGrande: { w: 4, h: 3, arq: 'fazendagrande1.png' },
  serraria:      { w: 3, h: 2, arq: ['serraria1.PNG', 'serraria2.PNG'] },
  escola:        { w: 3, h: 2, arq: 'escola1.png' },
  praca:         { w: 3, h: 2, arq: ['praça1.PNG', 'praça2.PNG'] },
  prefeitura:    { w: 4, h: 3, arq: 'prefeitura1.PNG' },
  mina:          { w: 2, h: 2, arq: ['mina1.png', 'mina2.png'] },
};

/*
   Espalha a partir da BORDA por pixels CLAROS e POUCO SATURADOS (perto de
   cinza) conectados, marcando alfa=0. "Claro" em vez de "parecido com o
   canto" porque o fundo varia de tom entre arquivos (branco puro num,
   cinza ~230 noutro, às vezes com leve gradiente dentro do MESMO arquivo —
   medido: até ~23 de variação de canto a canto em alguns) — travar num só
   valor de referência deixaria halo cinza sobrando nos cantos mais escuros.
   "Pouco saturado" (min e max dos três canais perto um do outro) é o que
   evita comer parede clara de pedra ou neve do próprio prédio: essas têm
   quase sempre um traço de cor, o fundo não.
*/
const LIMIAR_CLARO = 195;   // canal mínimo, pra contar como "claro"
const LIMIAR_SATURACAO = 22; // maior-menor canal, pra contar como "cinza"

function removerFundoClaro(im) {
  const { larg, alt, px } = im;
  const visitado = new Uint8Array(larg * alt);
  const ehFundo = i => {
    const r = px[i * 4], g = px[i * 4 + 1], b = px[i * 4 + 2];
    const mn = Math.min(r, g, b), mx = Math.max(r, g, b);
    return mn >= LIMIAR_CLARO && (mx - mn) <= LIMIAR_SATURACAO;
  };
  const fila = [];
  const semear = (x, y) => {
    if (x < 0 || y < 0 || x >= larg || y >= alt) return;
    const i = y * larg + x;
    if (visitado[i]) return;
    visitado[i] = 1;
    if (ehFundo(i)) fila.push(i);
  };
  for (let x = 0; x < larg; x++) { semear(x, 0); semear(x, alt - 1); }
  for (let y = 0; y < alt; y++) { semear(0, y); semear(larg - 1, y); }
  while (fila.length) {
    const i = fila.pop();
    px[i * 4 + 3] = 0;
    const x = i % larg, y = (i / larg) | 0;
    semear(x + 1, y); semear(x - 1, y); semear(x, y + 1); semear(x, y - 1);
  }
  return im;
}

/* Mantém só a maior região conectada de pixels opacos — rede de segurança
   contra qualquer ilha solta (marca d'água, legenda) que sobreviva ao passo
   acima. Barato e genérico; nenhum arquivo desta leva precisou dele até
   agora, mas não custa manter. */
function manterMaiorIlha(im) {
  const { larg, alt, px } = im;
  const visitado = new Uint8Array(larg * alt);
  const opaco = i => px[i * 4 + 3] > 8;
  let melhor = null;
  for (let ini = 0; ini < larg * alt; ini++) {
    if (visitado[ini] || !opaco(ini)) continue;
    const pixels = [ini];
    visitado[ini] = 1;
    for (let c = 0; c < pixels.length; c++) {
      const i = pixels[c], x = i % larg, y = (i / larg) | 0;
      const viz = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
      for (const [nx, ny] of viz) {
        if (nx < 0 || ny < 0 || nx >= larg || ny >= alt) continue;
        const ni = ny * larg + nx;
        if (visitado[ni] || !opaco(ni)) continue;
        visitado[ni] = 1;
        pixels.push(ni);
      }
    }
    if (!melhor || pixels.length > melhor.length) melhor = pixels;
  }
  const mantido = new Uint8Array(larg * alt);
  if (melhor) for (const i of melhor) mantido[i] = 1;
  for (let i = 0; i < larg * alt; i++) if (!mantido[i]) px[i * 4 + 3] = 0;
  return im;
}

/* Recorta no que não é transparente. */
function recortar(im) {
  let x0 = im.larg, y0 = im.alt, x1 = -1, y1 = -1;
  for (let y = 0; y < im.alt; y++) for (let x = 0; x < im.larg; x++)
    if (im.px[(y * im.larg + x) * 4 + 3] > 8) {
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
  const L = x1 - x0 + 1, A = y1 - y0 + 1;
  const px = Buffer.alloc(L * A * 4);
  for (let y = 0; y < A; y++)
    im.px.copy(px, y * L * 4, ((y + y0) * im.larg + x0) * 4, ((y + y0) * im.larg + x0 + L) * 4);
  return { larg: L, alt: A, px };
}

/* Redução por média de caixa, com alfa pré-multiplicado: sem isso a borda
   ganha um halo escuro, porque a cor dos pixels transparentes entra na conta. */
function reduzir(im, L, A) {
  const px = Buffer.alloc(L * A * 4);
  const ex = im.larg / L, ey = im.alt / A;
  for (let y = 0; y < A; y++) {
    const sy0 = Math.floor(y * ey), sy1 = Math.max(sy0 + 1, Math.ceil((y + 1) * ey));
    for (let x = 0; x < L; x++) {
      const sx0 = Math.floor(x * ex), sx1 = Math.max(sx0 + 1, Math.ceil((x + 1) * ex));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let sy = sy0; sy < sy1 && sy < im.alt; sy++)
        for (let sx = sx0; sx < sx1 && sx < im.larg; sx++) {
          const i = (sy * im.larg + sx) * 4;
          const al = im.px[i + 3] / 255;
          r += im.px[i] * al; g += im.px[i + 1] * al; b += im.px[i + 2] * al;
          a += im.px[i + 3];
          n++;
        }
      if (!n) continue;
      const d = (y * L + x) * 4;
      const am = a / n;
      const peso = am / 255;
      px[d]     = peso > 0 ? Math.min(255, Math.round(r / n / peso)) : 0;
      px[d + 1] = peso > 0 ? Math.min(255, Math.round(g / n / peso)) : 0;
      px[d + 2] = peso > 0 ? Math.min(255, Math.round(b / n / peso)) : 0;
      px[d + 3] = Math.round(am);
    }
  }
  return { larg: L, alt: A, px };
}

/* Quanto o prédio ocupa na tela: a largura é a do lote, cravada, para nunca
   invadir a rua — MULTIPLICADA por 'mult' quando o prédio pede pra ocupar
   mais do que o próprio lote (só o Centro, por ora). A altura vem da
   proporção da arte, com um teto para uma torre não virar um poste de trinta
   metros — o mesmo 'mult' se aplica ao teto, senão o Centro alto bateria no
   limite pensado pra caber num lote 3x3 comum e a ampliação viraria só
   largura, distorcendo a silhueta. */
function tamanhoNaTela(def, im) {
  const razao = im.larg / im.alt;
  const mult = def.mult || 1;
  let dw = def.w * TILE * mult;
  let dh = dw / razao;
  const teto = def.h * TILE * ALTURA_MAX * mult;
  if (dh > teto) { dh = teto; dw = dh * razao; }
  return { dw: Math.round(dw), dh: Math.round(dh) };
}

/* ---- prepara cada quadro ---- */
const quadros = [];
for (const chave in LOTE) {
  const def = LOTE[chave];
  const arqs = Array.isArray(def.arq) ? def.arq : [def.arq];
  arqs.forEach((arq, i) => {
    const bruto = decodificar(ORIG + arq);
    const im = recortar(manterMaiorIlha(removerFundoClaro(bruto)));
    const { dw, dh } = tamanhoNaTela(def, im);
    const fL = Math.max(1, Math.round(dw * ESCALA)), fA = Math.max(1, Math.round(dh * ESCALA));
    const red = reduzir(im, fL, fA);
    quadros.push({ chave, vari: i, arq, dw, dh, im: red });
    console.log((chave + (arqs.length > 1 ? '#' + i : '')).padEnd(18) +
      arq.padEnd(20) + im.larg + 'x' + im.alt + ' → tela ' + dw + 'x' + dh + ' → folha ' + fL + 'x' + fA);
  });
}

/* ---- empacota em prateleiras, do mais alto para o mais baixo ----
   Na ordem em que vieram, a torre de quarenta e quatro linhas definia a altura
   de uma prateleira inteira e sobrava meia folha vazia. Ordenar por altura
   junta os parecidos e aperta o empacotamento. */
const LARG_FOLHA = 900;
const porAltura = quadros.slice().sort((a, b) => b.im.alt - a.im.alt);
let cx = 0, cy = 0, alturaLinha = 0;
for (const q of porAltura) {
  if (cx + q.im.larg > LARG_FOLHA) { cx = 0; cy += alturaLinha; alturaLinha = 0; }
  q.x = cx; q.y = cy;
  cx += q.im.larg;
  alturaLinha = Math.max(alturaLinha, q.im.alt);
}
const ALT_FOLHA = cy + alturaLinha;

const folha = Buffer.alloc(LARG_FOLHA * ALT_FOLHA * 4);
for (const q of quadros)
  for (let y = 0; y < q.im.alt; y++)
    q.im.px.copy(folha, ((q.y + y) * LARG_FOLHA + q.x) * 4, y * q.im.larg * 4, (y + 1) * q.im.larg * 4);

/* Arte chapada como esta usa pouquíssimos tons de verdade. Arredondar cada
   canal para um degrau fixo não muda nada aos olhos e deixa os resíduos do
   filtro muito mais repetitivos — é onde o zlib ganha. */
const DEGRAU = +(process.env.DEGRAU || 1);
if (DEGRAU > 1) {
  for (let i = 0; i < folha.length; i += 4) {
    if (folha[i + 3] === 0) continue;
    for (let k = 0; k < 3; k++)
      folha[i + k] = Math.min(255, Math.round(folha[i + k] / DEGRAU) * DEGRAU);
  }
}

const png = codificar(LARG_FOLHA, ALT_FOLHA, folha);
fs.writeFileSync('predios.png', png);
fs.writeFileSync('predios.b64.txt', png.toString('base64'));

/* ---- manifesto para o jogo ---- */
const mapa = {};
for (const q of quadros) {
  if (!mapa[q.chave]) mapa[q.chave] = [];
  mapa[q.chave].push([q.x, q.y, q.im.larg, q.im.alt, q.dw, q.dh]);
}
fs.writeFileSync('predios.json', JSON.stringify(mapa));

console.log('\nfolha: ' + LARG_FOLHA + 'x' + ALT_FOLHA + '  ' + (png.length / 1024).toFixed(0) + ' KB');
console.log('base64: ' + (png.toString('base64').length / 1024).toFixed(0) + ' KB');
