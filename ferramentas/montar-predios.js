/*
   Monta a folha dos prédios.

   Desta vez a fonte não é PNG com alfa — é um lote de .jpeg convertido para
   PNG (só para poder ser lido por 'png.js', que não fala JPEG), com o fundo
   pintado de PRETO CHAPADO em vez de canal alfa. 'removerFundoPreto' faz esse
   papel: espalha a partir da BORDA da imagem, por pixels escuros conectados, e
   marca cada um como transparente. É flood-fill, não "qualquer pixel escuro
   vira transparente" — a mina tem trilho preto e entrada de caverna escura no
   MEIO do desenho, e aqueles não tocam a borda, então sobrevivem.

   Depois daqui o pipeline é o de sempre: recorta no que sobrou, reduz de
   tamanho com alfa pré-multiplicado, empacota numa folha, quantiza a cor.
*/
const fs = require('fs');
const { decodificar, codificar } = require('./png.js');

/*
   Os .jpeg originais (baixados pelo usuário) moram na mesma pasta, ao lado do
   .png convertido que cada um gerou. A conversão em si é fora deste script —
   'png.js' só fala PNG — e foi feita uma vez com System.Drawing do .NET (que
   o Windows já tem, sem instalar nada):

     Add-Type -AssemblyName System.Drawing
     Get-ChildItem $pasta -Filter *.jpeg | % {
       $img = [System.Drawing.Image]::FromFile($_.FullName)
       $bmp = New-Object System.Drawing.Bitmap($img, $img.Width, $img.Height)
       $bmp.Save((Join-Path $pasta ($_.BaseName + '.png')), [System.Drawing.Imaging.ImageFormat]::Png)
       $bmp.Dispose(); $img.Dispose()
     }
*/
const ORIG = 'C:/Users/PPCP/Downloads/PNG/';
const TILE = 28;
const ESCALA = 2.2;         // resolução extra guardada, para aguentar o zoom
const ALTURA_MAX = 2.4;      // um prédio pode ser 2,4x a profundidade do lote

/*
   Lote de cada prédio, igual ao PREDIO do jogo. Praça, Prefeitura e Mina
   ganham arte pela primeira vez — antes eram só o desenho vetorial genérico.
*/
const LOTE = {
  centro:        { w: 3, h: 3, arq: 'centro.png' },
  casa:          { w: 2, h: 2, arq: ['casa1.png','casa2.png','casa3.png','casa4.png','casa5.png',
                                      'casa6.png','casa7.png','casa8.png','casa9.png','casa10.png','casa11.png'] },
  deposito:      { w: 2, h: 2, arq: ['deposito1.png', 'deposito2.png'] },
  fazenda:       { w: 3, h: 3, arq: 'fazendapequena1.png' },
  oficina:       { w: 2, h: 2, arq: ['oficina1.png', 'oficina2.png'] },
  estabulo:      { w: 3, h: 2, arq: ['estabulo1.png', 'estabulo2.png'] },
  cais:          { w: 2, h: 2, arq: 'cais1.png' },
  mercado:       { w: 3, h: 2, arq: ['mercado1.png', 'mercado2.png'] },
  sobrado:       { w: 2, h: 2, arq: ['sobrado1.png','sobrado2.png','sobrado3.png','sobrado4.png','sobrado5.png'] },
  predio:        { w: 3, h: 2, arq: ['casarao1.png', 'casarao2.png'] },
  fazendaGrande: { w: 4, h: 3, arq: 'fazendagrande1.png' },
  serraria:      { w: 3, h: 2, arq: ['serraria1.png', 'serraria2.png'] },
  escola:        { w: 3, h: 2, arq: 'escola1.png' },
  praca:         { w: 3, h: 2, arq: ['praça1.png', 'praça2.png', 'praça3.png'] },
  prefeitura:    { w: 4, h: 3, arq: 'prefeitura1.png' },
  mina:          { w: 2, h: 2, arq: ['mina1.png', 'mina2.png'] },
};

/*
   Espalha a partir da borda por pixels escuros CONECTADOS, marcando alfa=0.
   Testado à mão: a transição de fundo (0-4 em cada canal) para o desenho de
   verdade (41+ no primeiro pixel de conteúdo) é abrupta — o JPEG manteve o
   preto de fundo limpo. Limiar de 18 fica no meio do vão, com folga dos dois
   lados.
*/
const LIMIAR_FUNDO = 18;

function removerFundoPreto(im) {
  const { larg, alt, px } = im;
  const visitado = new Uint8Array(larg * alt);
  const escuro = i => px[i * 4] <= LIMIAR_FUNDO && px[i * 4 + 1] <= LIMIAR_FUNDO && px[i * 4 + 2] <= LIMIAR_FUNDO;
  const fila = [];
  const semear = (x, y) => {
    if (x < 0 || y < 0 || x >= larg || y >= alt) return;
    const i = y * larg + x;
    if (visitado[i]) return;
    visitado[i] = 1;
    if (escuro(i)) fila.push(i);
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

/*
   Vários destes JPEGs são print de asset pack, com uma LEGENDA DE TEXTO em
   inglês numa faixa separada por fundo preto puro embaixo do desenho (ex.:
   "Stone Hall Tower" sob a torre da prefeitura). 'removerFundoPreto' não pega
   isso: o texto em si não é escuro, só o que está ao redor dele é — sobra
   como uma ilha de pixels opacos, sozinha, flutuando sobre fundo transparente.

   Em vez de caçar rótulo por rótulo, mantém-se só a MAIOR região conectada de
   pixels opacos. É genérico (não depende de saber de antemão qual imagem tem
   legenda) e barato — se algum prédio real ficasse partido em duas ilhas por
   engano isso apareceria óbvio na inspeção visual, e nenhum ficou.
*/
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
   invadir a rua. A altura vem da proporção da arte, com um teto para uma torre
   não virar um poste de trinta metros. */
function tamanhoNaTela(def, im) {
  const razao = im.larg / im.alt;
  let dw = def.w * TILE;
  let dh = dw / razao;
  const teto = def.h * TILE * ALTURA_MAX;
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
    const im = recortar(manterMaiorIlha(removerFundoPreto(bruto)));
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
