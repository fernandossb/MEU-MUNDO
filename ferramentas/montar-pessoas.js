/*
   Monta a folha da GENTE (aldeões) a partir das folhas novas do usuário.

   TERCEIRA LEVA. A primeira (homem.png/mulher.png, 12x4) veio com as
   direções EMBARALHADAS nas linhas. A segunda foi UM ARQUIVO POR DIREÇÃO
   mas com a MESMA arte pra homem e mulher. Agora o usuário refez de novo:
   UM ARQUIVO POR DIREÇÃO e POR SEXO. Só as quatro DIAGONAIS: 'sudoeste',
   'sudeste', 'noroeste', 'nordeste'; o homem sem sufixo ('sudoeste.png'),
   a mulher com sufixo 'mulher' ('sudoestemulher.png'). Cada folha tem uma
   faixa de título em cima, uma grade de células e OITO quadros de caminhada
   numa linha só.

   AS QUATRO CHEGAM E O JOGO PEDE OITO. 'direcaoDoAngulo' arredonda o ângulo
   de caminhada (em MUNDO) para 8 fatias; a projeção isométrica gira isso 45°,
   então cada fatia de MUNDO vira uma direção de TELA:

     fatia 0 (sul do mundo)       → anda pra baixo-esquerda da tela
     fatia 1 (sudoeste do mundo)  → anda pra esquerda
     fatia 2 (oeste do mundo)     → anda pra cima-esquerda
     fatia 3 (noroeste do mundo)  → anda pra cima
     fatia 4 (norte do mundo)     → anda pra cima-direita
     fatia 5 (nordeste do mundo)  → anda pra direita
     fatia 6 (leste do mundo)     → anda pra baixo-direita
     fatia 7 (sudeste do mundo)   → anda pra baixo

   Ou seja, o que importa pro sprite é a direção de TELA, e ela cai em quatro
   arcos de duas fatias: baixo-esquerda, cima-esquerda, cima-direita,
   baixo-direita — exatamente as quatro artes que chegaram. O mapa
   'FATIA_PARA_ARTE' é isso. Nenhum espelhamento: as quatro artes cobrem tudo.

   A CRIANÇA não veio (e nem aparece mais em tela — ver 'criancaEscondida' no
   index.html). A linha dela na folha é copiada tal e qual da folha atual, só
   pra não deixar buraco.

   A arte da mulher veio um tico mais alta que a do homem (~9px na fonte de
   1408x768). Como a escala do recorte é FIXA (senão o aldeão encolhe e cresce
   a cada passo), a mulher renderiza proporcionalmente um tico mais alta — o
   que é aceitável e até natural. Se algum dia incomodar, é só medir a altura
   real de cada recorte e normalizar ali no 'porNoQuadro'.
*/
const fs = require('fs');
const { decodificar, codificar } = require('./png.js');

const ORIG = 'C:/Users/PPCP/Downloads/aldeoes2/';
const ALVO = 'C:/Users/PPCP/Documents/PROJETOS/reino-infinito/index.html';

/* --- o que o jogo espera (tem de bater com o index.html) --- */
const LADO = 48;          // SP_LADO
const QUADROS = 6;        // SP_QUADROS — os quadros de caminhada
const DIRECOES = 8;       // SP_DIRECOES
const COLS_SAIDA = QUADROS + 1;   // +1 de parado
const ANCORA_Y = 0.90;    // os pés a 90% da altura do quadro

/* Altura do personagem no quadro de 48px. FIXA — escalar cada quadro pra
   "caber" faria o aldeão encolher e crescer a cada passo. */
const ALTURA_ALVO = 42;
const ALTURA_FONTE = 170;   // referência do recorte mais alto

/* --- a grade das folhas novas ---
   8 colunas de quadro, entre as faixas vazias medidas na imagem. A linha do
   sprite fica entre y≈205 e y≈405; o resto é título e células vazias. */
const COLUNAS_X = [162, 325, 491, 659, 822, 980, 1148, 1309];  // centros
const CAIXA_W = 96, LINHA_Y0 = 198, LINHA_Y1 = 412;

/* Fundo: as folhas são um mockup de UI. As do HOMEM têm célula cinza-clara
   chapada (~223); as da MULHER vieram com um xadrez de transparência de dois
   cinzas (~150 e ~184). Em vez de um limiar fixo, cada folha diz a sua faixa:
   varre a moldura (as bordas são sempre fundo), pega os pixels sem cor e usa
   a faixa de claridade deles — com folga — como "isto é fundo". O desenho é
   saturado ou bem escuro (contornos, botas, cabelo), então não cai na faixa. */
function faixaDeFundo(im) {
  const { larg: L, alt: H, px } = im, cl = [];
  const anota = (x, y) => {
    const i = (y * L + x) * 4, r = px[i], g = px[i + 1], b = px[i + 2];
    if (Math.max(r, g, b) - Math.min(r, g, b) <= 24) cl.push((r + g + b) / 3);
  };
  for (let x = 0; x < L; x += 2) { for (let y = 0; y < 3; y++) { anota(x, y); anota(x, H - 1 - y); } }
  for (let y = 0; y < H; y += 2) { for (let x = 0; x < 3; x++) { anota(x, y); anota(L - 1 - x, y); } }
  cl.sort((a, b) => a - b);
  const lo = cl[Math.floor(cl.length * 0.02)] - 12;
  const hi = cl[Math.floor(cl.length * 0.98)] + 16;
  return { lo, hi };
}
const fazEhFundo = ({ lo, hi }) => (r, g, b) => {
  const lt = (r + g + b) / 3;
  return lt >= lo && lt <= hi && (Math.max(r, g, b) - Math.min(r, g, b)) <= 24;
};

/* Cada fatia do 'direcaoDoAngulo' recebe a arte da direção de TELA em que
   ela anda (ver comentário grande no topo).

   As quatro artes ficam nas quatro DIAGONAIS de tela; as quatro fatias
   cardeais de tela (esquerda, cima, direita, baixo) caem no meio de duas
   artes. Pra esquerda e direita a escolha é a FRENTE dos dois lados (SO à
   esquerda, SE à direita) — aldeão andando de lado com o rosto pra câmera lê
   melhor que de costas, e fica simétrico. Cima é de costas; baixo é de
   frente.

     fatia:  0=sul 1=SO 2=oeste 3=NO 4=norte 5=NE 6=leste 7=SE   (nome de MUNDO)
     tela:   ↙     ←    ↖       ↑    ↗       →    ↘      ↓
     arte:   SO    SO   NO      NO   NE      SE   SE     SE
*/
const SO = 'sudoeste', SE = 'sudeste', NO = 'noroeste', NE = 'nordeste';
const FATIA_PARA_ARTE = [SO, SO, NO, NO, NE, SE, SE, SE];
const SUFIXO = ['', 'mulher'];   // 0 = homem (sem sufixo), 1 = mulher

function recortarColuna(im, cx, ehFundo) {
  const { larg: L, px } = im;
  const x0 = Math.max(0, Math.round(cx - CAIXA_W / 2)), y0 = LINHA_Y0;
  const w = CAIXA_W, h = LINHA_Y1 - LINHA_Y0;
  const p = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++)
    px.copy(p, y * w * 4, ((y0 + y) * L + x0) * 4, ((y0 + y) * L + x0 + w) * 4);

  // espalha o fundo a partir da borda
  const vis = new Uint8Array(w * h), fila = [];
  const semear = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = y * w + x; if (vis[i]) return; vis[i] = 1;
    if (ehFundo(p[i * 4], p[i * 4 + 1], p[i * 4 + 2])) { p[i * 4 + 3] = 0; fila.push(i); }
  };
  for (let x = 0; x < w; x++) { semear(x, 0); semear(x, h - 1); }
  for (let y = 0; y < h; y++) { semear(0, y); semear(w - 1, y); }
  while (fila.length) {
    const i = fila.pop(), x = i % w, y = (i / w) | 0;
    semear(x + 1, y); semear(x - 1, y); semear(x, y + 1); semear(x, y - 1);
  }
  // bolsões de fundo presos dentro da silhueta
  for (let i = 0; i < w * h; i++)
    if (p[i * 4 + 3] && ehFundo(p[i * 4], p[i * 4 + 1], p[i * 4 + 2])) p[i * 4 + 3] = 0;

  // maior ilha
  const v2 = new Uint8Array(w * h); let melhor = null;
  for (let s = 0; s < w * h; s++) {
    if (v2[s] || p[s * 4 + 3] <= 8) continue;
    const pil = [s]; v2[s] = 1;
    for (let c = 0; c < pil.length; c++) {
      const i = pil[c], x = i % w, y = (i / w) | 0;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const ni = ny * w + nx;
        if (v2[ni] || p[ni * 4 + 3] <= 8) continue;
        v2[ni] = 1; pil.push(ni);
      }
    }
    if (!melhor || pil.length > melhor.length) melhor = pil;
  }
  const fica = new Uint8Array(w * h);
  if (melhor) for (const i of melhor) fica[i] = 1;
  for (let i = 0; i < w * h; i++) if (!fica[i]) p[i * 4 + 3] = 0;

  // come um pixel da borda (a orla meio-fundo do JPEG)
  const orla = Buffer.from(p);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x; if (orla[i * 4 + 3] <= 8) continue;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]])
        if (nx < 0 || ny < 0 || nx >= w || ny >= h || orla[(ny * w + nx) * 4 + 3] <= 8) { p[i * 4 + 3] = 0; break; }
    }
  return { larg: w, alt: h, px: p };
}

function caixa(im) {
  let x0 = im.larg, y0 = im.alt, x1 = -1, y1 = -1;
  for (let y = 0; y < im.alt; y++)
    for (let x = 0; x < im.larg; x++)
      if (im.px[(y * im.larg + x) * 4 + 3] > 8) {
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
  return { x0, y0, x1, y1, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

/* Centro horizontal pelo centro de massa das pernas (terço de baixo) — a
   caixa balança conforme o cajado entra e sai dela. */
function centroDosPes(im, bb) {
  let soma = 0, n = 0;
  const ya = bb.y0 + Math.round(bb.h * 0.66);
  for (let y = ya; y <= bb.y1; y++)
    for (let x = bb.x0; x <= bb.x1; x++)
      if (im.px[(y * im.larg + x) * 4 + 3] > 8) { soma += x; n++; }
  return n ? soma / n : (bb.x0 + bb.x1) / 2;
}

function porNoQuadro(cel, bb, pesX) {
  const q = Buffer.alloc(LADO * LADO * 4);
  const esc = ALTURA_ALVO / ALTURA_FONTE;
  const pesY = LADO * ANCORA_Y;
  for (let dy = 0; dy < LADO; dy++)
    for (let dx = 0; dx < LADO; dx++) {
      const fx0 = (dx - LADO / 2) / esc + pesX;
      const fy0 = (dy - pesY) / esc + bb.y1 + 1;
      const fx1 = fx0 + 1 / esc, fy1 = fy0 + 1 / esc;
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let sy = Math.floor(fy0); sy < fy1; sy++)
        for (let sx = Math.floor(fx0); sx < fx1; sx++) {
          if (sx < 0 || sy < 0 || sx >= cel.larg || sy >= cel.alt) { n++; continue; }
          const i = (sy * cel.larg + sx) * 4, al = cel.px[i + 3] / 255;
          r += cel.px[i] * al; g += cel.px[i + 1] * al; b += cel.px[i + 2] * al;
          a += cel.px[i + 3]; n++;
        }
      if (!n) continue;
      const d = (dy * LADO + dx) * 4, am = a / n, peso = am / 255;
      q[d]     = peso > 0 ? Math.min(255, Math.round(r / n / peso)) : 0;
      q[d + 1] = peso > 0 ? Math.min(255, Math.round(g / n / peso)) : 0;
      q[d + 2] = peso > 0 ? Math.min(255, Math.round(b / n / peso)) : 0;
      q[d + 3] = Math.round(am);
    }
  return q;
}

/* --- lê a folha atual só pra reaproveitar a criança --- */
function folhaAtual() {
  const t = fs.readFileSync(ALVO, 'utf8');
  const marca = 'const FOLHA_PESSOAS = "data:image/png;base64,';
  const i0 = t.indexOf(marca);
  const i1 = t.indexOf('";', i0 + marca.length);
  const b64 = t.slice(i0 + marca.length, i1);
  const tmp = require('os').tmpdir() + '/pessoas-atual.png';
  fs.writeFileSync(tmp, Buffer.from(b64, 'base64'));
  return decodificar(tmp);
}

/* --- monta --- */
const LARG_SAIDA = LADO * COLS_SAIDA;
const ALT_SAIDA = LADO * DIRECOES * 3;
const folha = Buffer.alloc(LARG_SAIDA * ALT_SAIDA * 4);
const colar = (q, col, linha) => {
  for (let y = 0; y < LADO; y++)
    q.copy(folha, ((linha * LADO + y) * LARG_SAIDA + col * LADO) * 4, y * LADO * 4, (y + 1) * LADO * 4);
};

// cache: cada arquivo de direção é lido e recortado uma vez
const artes = new Map();
function quadrosDe(arq) {
  if (artes.has(arq)) return artes.get(arq);
  const im = decodificar(ORIG + arq);
  const faixa = faixaDeFundo(im);
  const ehFundo = fazEhFundo(faixa);
  const qs = COLUNAS_X.map(cx => {
    const cel = recortarColuna(im, cx, ehFundo);
    const bb = caixa(cel);
    return { cel, bb, pes: centroDosPes(cel, bb) };
  });
  artes.set(arq, qs);
  console.log(arq.padEnd(18) + `fundo[${faixa.lo.toFixed(0)}..${faixa.hi.toFixed(0)}]  `
    + qs.map(q => q.bb.w + 'x' + q.bb.h).join(' '));
  return qs;
}

for (const personagem of [0, 1]) {          // 0 = homem, 1 = mulher — arte separada
  for (let d = 0; d < DIRECOES; d++) {
    const linha = personagem * DIRECOES + d;
    const qs = quadrosDe(FATIA_PARA_ARTE[d] + SUFIXO[personagem] + '.png');
    // 8 quadros na fonte, o jogo quer 6 de andar + 1 parado.
    // andar: quadros 0..5. parado: quadro 0 (pé junto).
    for (let i = 0; i < QUADROS; i++) {
      const f = qs[i];
      colar(porNoQuadro(f.cel, f.bb, f.pes), i, linha);
    }
    const p = qs[0];
    colar(porNoQuadro(p.cel, p.bb, p.pes), QUADROS, linha);
  }
}
console.log('homem e mulher: 8 direções cada, arte própria, ' + COLS_SAIDA + ' quadros');

/* criança: copiada da folha de hoje, sem tocar */
const atual = folhaAtual();
for (let d = 0; d < DIRECOES; d++) {
  const orig = 2 * DIRECOES + d;
  for (let col = 0; col < COLS_SAIDA; col++)
    for (let y = 0; y < LADO; y++) {
      const de = ((orig * LADO + y) * atual.larg + col * LADO) * 4;
      const para = ((orig * LADO + y) * LARG_SAIDA + col * LADO) * 4;
      atual.px.copy(folha, para, de, de + LADO * 4);
    }
}
console.log('criança: copiada da folha atual (fora de tela de qualquer jeito)');

const png = codificar(LARG_SAIDA, ALT_SAIDA, folha);
fs.writeFileSync('pessoas.png', png);
fs.writeFileSync('pessoas.b64.txt', png.toString('base64'));
console.log('\nfolha: ' + LARG_SAIDA + 'x' + ALT_SAIDA + '  ' + (png.length / 1024).toFixed(0) + ' KB');
console.log('base64: ' + (png.toString('base64').length / 1024).toFixed(0) + ' KB');
