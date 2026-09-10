/*
   Monta a arte do CENTRO (castelo) a partir da folha nova do usuário.

   Fase 1 do plano "quarteirões 18x18": a arte antiga do castelo estava
   guardada a 296x245px e o jogo a ampliava ~4,7x no zoom — daí o borrão.
   O usuário refez em 1024x1024. Como a pasta-fonte dos outros 15 prédios
   sumiu, o castelo não entra em 'predios.png' — vai numa folha própria,
   'centro.png', embutida à parte ('FOLHA_CENTRO' no index.html).

   FUNDO. A folha veio como JPEG (.jfif) com o xadrez de transparência
   CHAPADO nos pixels — dois cinzas bem separados (~120 escuro, ~227
   claro), medido. O castelo é de pedra CINZA também, então um limiar de
   fundo largo comeria parede. A saída: duas FAIXAS ESTREITAS em volta dos
   dois cinzas do xadrez (a pedra do castelo cai no vão entre elas, ou é
   escura demais / quente demais pra faixa). Espalha da borda, fica com a
   maior ilha, come 1px de orla do JPEG. NÃO faz a passada de "limpa todo
   pixel cor-de-fundo preso na silhueta" (as do aldeão fazem) — aqui isso
   arriscaria furar janela e sombra de pedra clara no meio do castelo.

   TAMANHO NA TELA. A entrada nova de 'MAPA_PREDIOS' usa dw=147 (o mesmo de
   antes), então o castelo aparece do MESMO tamanho que hoje — só que
   nítido, porque a fonte agora tem resolução de sobra. A Fase 3 (lote
   16x16) mexe nisso.
*/
const fs = require('fs');
const { decodificar, codificar } = require('./png.js');

const ORIG = 'C:/Users/PPCP/Downloads/aldeoes2/centro.png';   // convertido do .jfif
const LARG_ALVO = 147;   // dw da entrada de MAPA_PREDIOS (igual ao de hoje)

/* Os dois cinzas do xadrez, DEPOIS do estrago do JPEG: os blocos DCT de
   8x8 fazem os tons chapados variarem (medido: claro de ~195 a ~240,
   escuro de ~95 a ~150) e criam uma orla de transição de 1px entre as
   células. Faixas largas o bastante pra cobrir a variação; o vão entre
   elas (151..184) é onde a pedra cinza do castelo cai — e a pedra quase
   sempre tem um traço de cor (sat > 14) ou é escura demais, então a trava
   de saturação segura o resto. */
const ehFundo = (r, g, b) => {
  const lt = (r + g + b) / 3, sat = Math.max(r, g, b) - Math.min(r, g, b);
  if (sat > 14) return false;
  return (lt >= 92 && lt <= 150) || (lt >= 186 && lt <= 250);
};

/* Flood da borda em 8 direções: o xadrez alterna as duas cores, então
   células da MESMA cor só se tocam pela QUINA. Com 4 vizinhos o flood
   ficava preso na primeira fileira de células; com 8 ele anda de célula
   em célula pela quina e limpa o xadrez inteiro. A orla de transição
   (1px, não passa em 'ehFundo') sobra como uma teia fina que a 'maiorIlha'
   e o 'comerOrla' tiram depois. */
function espalharDaBorda(im) {
  const { larg: L, alt: A, px } = im;
  const vis = new Uint8Array(L * A), fila = [];
  const semear = (x, y) => {
    if (x < 0 || y < 0 || x >= L || y >= A) return;
    const i = y * L + x; if (vis[i]) return; vis[i] = 1;
    if (ehFundo(px[i * 4], px[i * 4 + 1], px[i * 4 + 2])) { px[i * 4 + 3] = 0; fila.push(i); }
  };
  for (let x = 0; x < L; x++) { semear(x, 0); semear(x, A - 1); }
  for (let y = 0; y < A; y++) { semear(0, y); semear(L - 1, y); }
  while (fila.length) {
    const i = fila.pop(), x = i % L, y = (i / L) | 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) semear(x + dx, y + dy);
  }
  return im;
}

/* Depois do flood sobra a teia de 1px das transições entre células. Este
   passo tira todo pixel opaco cercado (>=5 dos 8 vizinhos) por
   transparência: é a teia, e nada do castelo (silhueta cheia). Roda umas
   poucas vezes pra descascar a teia camada por camada. */
function tirarTeia(im, voltas) {
  const { larg: L, alt: A, px } = im;
  for (let v = 0; v < (voltas || 3); v++) {
    const alvo = [];
    for (let y = 0; y < A; y++)
      for (let x = 0; x < L; x++) {
        const i = y * L + x; if (px[i * 4 + 3] <= 8) continue;
        let vazios = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= L || ny >= A || px[(ny * L + nx) * 4 + 3] <= 8) vazios++;
        }
        if (vazios >= 5) alvo.push(i);
      }
    if (!alvo.length) break;
    for (const i of alvo) px[i * 4 + 3] = 0;
  }
  return im;
}

/* Bolsões de xadrez presos DENTRO da silhueta (entre torre e muralha, na
   base da rocha) que o flood da borda não alcança. Some com todo BLOCO
   grande (>= 'minBloco' px) de pixels cor-de-fundo ainda opaco — o xadrez
   é chapado e grande; pedra do castelo que porventura caia na faixa é
   speckle pequeno e espalhado, não bloco. */
function tirarBolsoes(im, minBloco) {
  const { larg: L, alt: A, px } = im;
  const cor = i => {
    const r = px[i * 4], g = px[i * 4 + 1], b = px[i * 4 + 2];
    if (px[i * 4 + 3] <= 8) return false;
    const lt = (r + g + b) / 3, sat = Math.max(r, g, b) - Math.min(r, g, b);
    if (sat > 16) return false;
    return (lt >= 92 && lt <= 152) || (lt >= 184 && lt <= 252);
  };
  const vis = new Uint8Array(L * A);
  for (let s = 0; s < L * A; s++) {
    if (vis[s] || !cor(s)) continue;
    const pil = [s]; vis[s] = 1;
    for (let c = 0; c < pil.length; c++) {
      const i = pil[c], x = i % L, y = (i / L) | 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= L || ny >= A) continue;
        const ni = ny * L + nx;
        if (vis[ni] || !cor(ni)) continue;
        vis[ni] = 1; pil.push(ni);
      }
    }
    if (pil.length >= (minBloco || 400)) for (const i of pil) px[i * 4 + 3] = 0;
  }
  return im;
}

function maiorIlha(im) {
  const { larg: L, alt: A, px } = im;
  const vis = new Uint8Array(L * A);
  const opaco = i => px[i * 4 + 3] > 8;
  let melhor = null;
  for (let s = 0; s < L * A; s++) {
    if (vis[s] || !opaco(s)) continue;
    const pil = [s]; vis[s] = 1;
    for (let c = 0; c < pil.length; c++) {
      const i = pil[c], x = i % L, y = (i / L) | 0;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (nx < 0 || ny < 0 || nx >= L || ny >= A) continue;
        const ni = ny * L + nx;
        if (vis[ni] || !opaco(ni)) continue;
        vis[ni] = 1; pil.push(ni);
      }
    }
    if (!melhor || pil.length > melhor.length) melhor = pil;
  }
  const fica = new Uint8Array(L * A);
  if (melhor) for (const i of melhor) fica[i] = 1;
  for (let i = 0; i < L * A; i++) if (!fica[i]) px[i * 4 + 3] = 0;
  return im;
}

function comerOrla(im) {
  const { larg: L, alt: A, px } = im;
  const orla = Buffer.from(px);
  for (let y = 0; y < A; y++)
    for (let x = 0; x < L; x++) {
      const i = y * L + x; if (orla[i * 4 + 3] <= 8) continue;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]])
        if (nx < 0 || ny < 0 || nx >= L || ny >= A || orla[(ny * L + nx) * 4 + 3] <= 8) { px[i * 4 + 3] = 0; break; }
    }
  return im;
}

function recortar(im) {
  let x0 = im.larg, y0 = im.alt, x1 = -1, y1 = -1;
  for (let y = 0; y < im.alt; y++)
    for (let x = 0; x < im.larg; x++)
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

/* Redução por média de caixa com alfa pré-multiplicado (mesma de montar-predios). */
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
          const i = (sy * im.larg + sx) * 4, al = im.px[i + 3] / 255;
          r += im.px[i] * al; g += im.px[i + 1] * al; b += im.px[i + 2] * al;
          a += im.px[i + 3]; n++;
        }
      if (!n) continue;
      const d = (y * L + x) * 4, am = a / n, peso = am / 255;
      px[d]     = peso > 0 ? Math.min(255, Math.round(r / n / peso)) : 0;
      px[d + 1] = peso > 0 ? Math.min(255, Math.round(g / n / peso)) : 0;
      px[d + 2] = peso > 0 ? Math.min(255, Math.round(b / n / peso)) : 0;
      px[d + 3] = Math.round(am);
    }
  }
  return { larg: L, alt: A, px };
}

/* --- monta --- */
let im = decodificar(ORIG);
console.log('fonte:', im.larg + 'x' + im.alt);
im = espalharDaBorda(im);
im = tirarBolsoes(im, 180);
im = tirarTeia(im, 6);
im = tirarBolsoes(im, 180);
im = maiorIlha(im);
im = comerOrla(im);
im = comerOrla(im);
im = recortar(im);
console.log('recorte:', im.larg + 'x' + im.alt);

/* Guarda em resolução ALTA — o suficiente pra cobrir o zoom sem ampliar.
   Pior caso na tela hoje: dw(147) x DPR(2) x ZOOM_MAX(1,8) x ESCALA_PREDIO(1,5)
   ~ 794px. Guardar >= 900 cobre com folga; acima de ~1000 é peso à toa. */
const alvoLarg = Math.min(im.larg, 1000);
if (alvoLarg < im.larg) im = reduzir(im, alvoLarg, Math.round(im.alt * alvoLarg / im.larg));
console.log('guardado:', im.larg + 'x' + im.alt);

const png = codificar(im.larg, im.alt, im.px);
fs.writeFileSync('centro.png', png);
fs.writeFileSync('centro.b64.txt', png.toString('base64'));

const dh = Math.round(LARG_ALVO * im.alt / im.larg);
const mapa = `[[0, 0, ${im.larg}, ${im.alt}, ${LARG_ALVO}, ${dh}]]`;
fs.writeFileSync('centro.mapa.txt', mapa);

console.log('\ncentro.png: ' + (png.length / 1024).toFixed(0) + ' KB   base64: ' + (png.toString('base64').length / 1024).toFixed(0) + ' KB');
console.log('MAPA_PREDIOS.centro = ' + mapa);
