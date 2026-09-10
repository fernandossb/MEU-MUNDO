/*
   Monta a folha do CHÃO: a textura de gramado e a de rua (pedra), as duas
   fotos que o usuário mandou, viram tiles REPETÍVEIS e vão pra uma folha só
   ('FOLHA_CHAO' no index.html).

   - 'montarChunk' desenha a grama por cima do terreno procedural (só CAMPO/
     FLORESTA), no modo 'multiply' e com alfa — a base procedural dá a
     variação de cor/sombra em escala grande, a foto dá a textura fina.
   - 'desenharEstrada' usa a pedra no lugar dos paralelepípedos vetoriais.

   SEM COSTURA. As fotos não são tileáveis (bordas não casam). Técnica:
   desloca a imagem por meia largura/altura (leva as costuras da borda pro
   MEIO) e cura a cruz do meio cruzando-a com a imagem SEM deslocar (que ali
   é interior liso). Sobra só um respingo nos cantos da cruz, invisível numa
   textura orgânica desenhada com alfa.
*/
const fs = require('fs');
const { decodificar, codificar } = require('./png.js');

const ORIG = 'C:/Users/PPCP/Downloads/aldeoes2/';
const LARG = 560;   // largura guardada (tile repetível) — altura pela proporção

function reduzir(im, L, A) {
  const px = Buffer.alloc(L * A * 4);
  const ex = im.larg / L, ey = im.alt / A;
  for (let y = 0; y < A; y++) {
    const sy0 = Math.floor(y * ey), sy1 = Math.max(sy0 + 1, Math.ceil((y + 1) * ey));
    for (let x = 0; x < L; x++) {
      const sx0 = Math.floor(x * ex), sx1 = Math.max(sx0 + 1, Math.ceil((x + 1) * ex));
      let r = 0, g = 0, b = 0, n = 0;
      for (let sy = sy0; sy < sy1 && sy < im.alt; sy++)
        for (let sx = sx0; sx < sx1 && sx < im.larg; sx++) {
          const i = (sy * im.larg + sx) * 4;
          r += im.px[i]; g += im.px[i + 1]; b += im.px[i + 2]; n++;
        }
      const d = (y * L + x) * 4;
      px[d] = Math.round(r / n); px[d + 1] = Math.round(g / n); px[d + 2] = Math.round(b / n); px[d + 3] = 255;
    }
  }
  return { larg: L, alt: A, px };
}

/* Deslocada de (dx,dy), com wrap. */
function rolar(im, dx, dy) {
  const { larg: L, alt: A, px } = im;
  const o = Buffer.alloc(L * A * 4);
  for (let y = 0; y < A; y++)
    for (let x = 0; x < L; x++) {
      const sx = ((x - dx) % L + L) % L, sy = ((y - dy) % A + A) % A;
      px.copy(o, (y * L + x) * 4, (sy * L + sx) * 4, (sy * L + sx) * 4 + 4);
    }
  return { larg: L, alt: A, px: o };
}

function semCostura(im) {
  const { larg: L, alt: A } = im;
  const J = rolar(im, L >> 1, A >> 1);   // costuras no meio
  const K = im.px;                        // sem deslocar: liso no meio, costura na borda
  const fw = Math.round(L * 0.16), fwY = Math.round(A * 0.16);
  const o = Buffer.alloc(L * A * 4);
  const cx = L / 2, cy = A / 2;
  for (let y = 0; y < A; y++)
    for (let x = 0; x < L; x++) {
      const tX = Math.max(0, (fw - Math.abs(x - cx)) / fw);
      const tY = Math.max(0, (fwY - Math.abs(y - cy)) / fwY);
      const t = Math.max(tX, tY);
      const i = (y * L + x) * 4;
      for (let c = 0; c < 3; c++) o[i + c] = Math.round(J.px[i + c] * (1 - t) + K[i + c] * t);
      o[i + 3] = 255;
    }
  return { larg: L, alt: A, px: o };
}

function prep(arq) {
  let im = decodificar(ORIG + arq);
  const A = Math.round(LARG * im.alt / im.larg);
  im = reduzir(im, LARG, A);
  im = semCostura(im);
  console.log(arq.padEnd(18) + im.larg + 'x' + im.alt);
  return im;
}

const grama = prep('tex-gramado.png');
const rua = prep('tex-rua.png');

/* Folha: grama em cima, rua embaixo, empilhadas. */
const AG = grama.alt, AR = rua.alt;
const H = AG + AR;
const folha = Buffer.alloc(LARG * H * 4);
grama.px.copy(folha, 0);
rua.px.copy(folha, LARG * AG * 4);

const png = codificar(LARG, H, folha);
fs.writeFileSync('chao.png', png);
fs.writeFileSync('chao.b64.txt', png.toString('base64'));
const mapa = { grama: [0, 0, LARG, AG], rua: [0, AG, LARG, AR] };
fs.writeFileSync('chao.mapa.txt', JSON.stringify(mapa));
console.log('\nchao.png: ' + (png.length / 1024).toFixed(0) + ' KB   base64: ' + (png.toString('base64').length / 1024).toFixed(0) + ' KB');
console.log('MAPA_CHAO = ' + JSON.stringify(mapa));
