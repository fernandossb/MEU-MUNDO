/*
   Monta a folha dos prédios. Os PNGs vêm com uns 500 px de lado — seis a nove
   vezes maior do que o jogo desenha. Cada um é recortado no que não é
   transparente e reduzido para o tamanho de tela vezes ESCALA, que é a folga
   que o zoom máximo precisa. Sem isso a folha passaria de dois megabytes.
*/
const fs = require('fs');
const { decodificar, codificar } = require('./png.js');

const ORIG = 'C:/Users/PPCP/Downloads/PNG/buildings/building_1/';
const TILE = 28;
const ESCALA = 2.2;         // resolução extra guardada, para aguentar o zoom
const ALTURA_MAX = 2.4;      // um prédio pode ser 2,4x a profundidade do lote

// Lote de cada prédio, igual ao PREDIO do jogo.
const LOTE = {
  centro:        { w: 3, h: 3, arq: 'centro.png' },
  casa:          { w: 2, h: 2, arq: ['casa1.png', 'casa2.png', 'casa3.png'] },
  deposito:      { w: 2, h: 2, arq: 'depósito.png' },
  fazenda:       { w: 3, h: 3, arq: 'fazendapequena.png' },
  oficina:       { w: 2, h: 2, arq: 'oficina.png' },
  estabulo:      { w: 3, h: 2, arq: 'estabulo.png' },
  cais:          { w: 2, h: 2, arq: 'cais.png' },
  mercado:       { w: 3, h: 2, arq: 'mercado.png' },
  sobrado:       { w: 2, h: 2, arq: 'sobrado1.png' },
  predio:        { w: 3, h: 2, arq: 'casarão.png' },
  fazendaGrande: { w: 4, h: 3, arq: 'fazendagrande.png' },
  serraria:      { w: 3, h: 2, arq: 'serraria.png' },
  escola:        { w: 3, h: 2, arq: 'escola.png' },
};

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
    const im = recortar(decodificar(ORIG + arq));
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
const LARG_FOLHA = 640;
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
