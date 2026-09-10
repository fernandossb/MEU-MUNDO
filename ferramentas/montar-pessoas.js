/*
   Monta a folha da GENTE (aldeões) a partir das duas folhas novas.

   A FONTE. Duas imagens de 1408x768, uma do homem e uma da mulher, em grade
   de 12 colunas x 4 linhas (célula de 117,33 x 192). Vieram como JPEG (.jfif)
   com o xadrez de transparência CHAPADO nos pixels — não há canal alfa — e
   com uma linha separadora azul-escura desenhada na borda de cada célula.
   A conversão pra PNG é fora daqui (System.Drawing do Windows, o mesmo
   caminho descrito em 'montar-predios.js').

   AS POSIÇÕES NÃO VÊM ORGANIZADAS. Revisado quadro a quadro, ampliado, as
   quatro linhas NÃO são quatro direções: elas misturam. O que existe de
   verdade na fonte:

     linha 0, quadros 0,1,2,5 ......... NORTE (de costas)
     linha 0, quadros 3,4,6..11 ....... SUL   (de frente)
     linha 1, quadro  0 ............... SUL   (parado, de frente)
     linha 1, quadros 1,2 ............. SUDOESTE (3/4 virado à esquerda)
     linha 1, quadros 3..11 ........... OESTE (perfil, andando à esquerda)
     linha 2, quadros 0..11 ........... SUL
     linha 3, quadros 0..11 ........... SUDOESTE

   Ou seja: só QUATRO direções reais (sul, sudoeste, oeste, norte). O jogo
   pede OITO. Leste e sudeste saem espelhando oeste e sudoeste — é o padrão
   e ninguém percebe. Nordeste e noroeste não existem na fonte: recebem os
   quadros de costas (o de trás espelhado, no caso do nordeste). Numa vila
   desenhada com ESCALA_PESSOA de 1/3, um aldeão fecha em ~11px de altura na
   tela: a diferença entre "oeste" e "noroeste" nesse tamanho não se lê.

   A CRIANÇA não veio nas folhas novas. A linha dela é copiada tal e qual da
   folha ATUAL embutida no index.html — arte própria, proporção de criança,
   que reduzir um adulto não daria.

   Saída: 'pessoas.b64.txt', que entra no lugar de FOLHA_PESSOAS.
*/
const fs = require('fs');
const { decodificar, codificar } = require('./png.js');

const ORIG = 'C:/Users/PPCP/Downloads/aldeoes/';
const ALVO = 'C:/Users/PPCP/Documents/PROJETOS/reino-infinito/index.html';

/* --- o que o jogo espera (tem de bater com o index.html) --- */
const LADO = 48;          // SP_LADO
const QUADROS = 6;        // SP_QUADROS — andando
const DIRECOES = 8;       // SP_DIRECOES
const COLS_SAIDA = QUADROS + 1;   // +1 de parado
const ANCORA_Y = 0.90;    // os pés a 90% da altura do quadro

/* Altura do personagem dentro do quadro de 48px. Fixa de propósito: escalar
   cada quadro pra "caber" faria o aldeão encolher e crescer a cada passo,
   porque o recorte varia de 154 a 169px na fonte. */
const ALTURA_ALVO = 40;
const ALTURA_FONTE = 168;   // referência: o recorte mais alto da fonte

/* --- a grade da fonte --- */
const COLS = 12, LINHAS = 4, MOLDURA = 3;

/* Fundo: o xadrez é claro e dessaturado (branco ~255 e cinza-azulado ~188).
   O desenho é todo saturado — palha, pele, pano, couro. A linha separadora
   da célula é escura e não passa neste teste, por isso a moldura é jogada
   fora antes (ver 'recortarCelula'). */
const ehFundo = (r, g, b) => {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  return mn >= 170 && (mx - mn) <= 26;
};

function recortarCelula(im, x0, y0, w, h) {
  const { larg: L, px } = im;
  const p = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++)
    px.copy(p, y * w * 4, ((y0 + y) * L + x0) * 4, ((y0 + y) * L + x0 + w) * 4);

  // 1. joga fora a moldura (a linha separadora) e semeia o espalhamento dali
  const vis = new Uint8Array(w * h), fila = [];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (x < MOLDURA || y < MOLDURA || x >= w - MOLDURA || y >= h - MOLDURA) {
        const i = y * w + x; vis[i] = 1; p[i * 4 + 3] = 0; fila.push(i);
      }
  const semear = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = y * w + x; if (vis[i]) return; vis[i] = 1;
    if (ehFundo(p[i * 4], p[i * 4 + 1], p[i * 4 + 2])) { p[i * 4 + 3] = 0; fila.push(i); }
  };
  while (fila.length) {
    const i = fila.pop(), x = i % w, y = (i / w) | 0;
    semear(x + 1, y); semear(x - 1, y); semear(x, y + 1); semear(x, y - 1);
  }

  /* 2. bolsões de xadrez PRESOS dentro da silhueta (entre o braço e o corpo,
        entre o cajado e a perna) não são alcançados pelo espalhamento —
        ficavam como manchas brancas no meio do aldeão. Como nada no desenho
        é claro E dessaturado, dá pra tirar todos de uma vez. */
  for (let i = 0; i < w * h; i++)
    if (p[i * 4 + 3] && ehFundo(p[i * 4], p[i * 4 + 1], p[i * 4 + 2])) p[i * 4 + 3] = 0;

  // 3. maior ilha: qualquer resto solto (respingo de JPEG) some
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

  /* 4. o JPEG deixa uma orla de um pixel meio-fundo meio-desenho em volta da
        silhueta; ela vira um contorno claro quando o quadro encolhe. Come um
        pixel da borda — a 40px de altura final, ninguém sente falta. */
  const orla = Buffer.from(p);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x; if (orla[i * 4 + 3] <= 8) continue;
      let borda = false;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]])
        if (nx < 0 || ny < 0 || nx >= w || ny >= h || orla[(ny * w + nx) * 4 + 3] <= 8) borda = true;
      if (borda) p[i * 4 + 3] = 0;
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

/* Onde o corpo PISA, horizontalmente. Centrar pela caixa faria o aldeão
   balançar de lado a cada passo: a caixa cresce e encolhe conforme o cajado
   entra e sai dela. O centro de massa do terço de baixo (pernas e botas) é
   estável — é por ele que os quadros se alinham. */
function centroDosPes(im, bb) {
  let soma = 0, n = 0;
  const ya = bb.y0 + Math.round(bb.h * 0.66);
  for (let y = ya; y <= bb.y1; y++)
    for (let x = bb.x0; x <= bb.x1; x++)
      if (im.px[(y * im.larg + x) * 4 + 3] > 8) { soma += x; n++; }
  return n ? soma / n : (bb.x0 + bb.x1) / 2;
}

/* Redução por média de caixa, com alfa pré-multiplicado (senão a borda ganha
   um halo escuro). Desenha o recorte já posicionado dentro do quadro final. */
function porNoQuadro(cel, bb, pesX, espelhar) {
  const q = Buffer.alloc(LADO * LADO * 4);
  const esc = ALTURA_ALVO / ALTURA_FONTE;
  const pesY = LADO * ANCORA_Y;              // onde os pés pousam no quadro
  for (let dy = 0; dy < LADO; dy++)
    for (let dx = 0; dx < LADO; dx++) {
      // volta do quadro final para a fonte
      const fx0 = (( espelhar ? (LADO - 1 - dx) : dx ) - LADO / 2) / esc + pesX;
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

/* --- de onde sai cada direção ---
   [linha, coluna] na folha da fonte. 'esp' espelha na horizontal.
   A ordem das direções é a do jogo ('direcaoDoAngulo'):
   0 sul, 1 sudoeste, 2 oeste, 3 noroeste, 4 norte, 5 nordeste, 6 leste, 7 sudeste. */
const SUL      = [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]];
const SUL_PARADO = [1,0];
const SUDOESTE = [[3,0],[3,1],[3,2],[3,3],[3,4],[3,5]];
const SUDOESTE_PARADO = [3,1];
const OESTE    = [[1,3],[1,4],[1,5],[1,6],[1,7],[1,8]];
const OESTE_PARADO = [1,3];
// só quatro quadros de costas existem; vai e volta pra fechar os seis
const NORTE    = [[0,0],[0,1],[0,2],[0,5],[0,2],[0,1]];
const NORTE_PARADO = [0,0];

const DIRECAO = [
  { nome:'sul',      andar:SUL,      parado:SUL_PARADO,      esp:false },
  { nome:'sudoeste', andar:SUDOESTE, parado:SUDOESTE_PARADO, esp:false },
  { nome:'oeste',    andar:OESTE,    parado:OESTE_PARADO,    esp:false },
  { nome:'noroeste', andar:NORTE,    parado:NORTE_PARADO,    esp:false },
  { nome:'norte',    andar:NORTE,    parado:NORTE_PARADO,    esp:false },
  { nome:'nordeste', andar:NORTE,    parado:NORTE_PARADO,    esp:true  },
  { nome:'leste',    andar:OESTE,    parado:OESTE_PARADO,    esp:true  },
  { nome:'sudeste',  andar:SUDOESTE, parado:SUDOESTE_PARADO, esp:true  },
];

/* --- lê a folha atual do index.html, só pra reaproveitar a criança --- */
function folhaAtual() {
  const t = fs.readFileSync(ALVO, 'utf8');
  const marca = 'const FOLHA_PESSOAS = "data:image/png;base64,';
  const i0 = t.indexOf(marca);
  if (i0 < 0) throw new Error('FOLHA_PESSOAS não encontrada');
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

const fontes = { 0: 'homem.png', 1: 'mulher.png' };
for (const personagem of [0, 1]) {
  const im = decodificar(ORIG + fontes[personagem]);
  const CW = im.larg / COLS, CH = im.alt / LINHAS;
  const cache = new Map();
  const pegar = (l, c) => {
    const k = l + ',' + c;
    if (!cache.has(k)) {
      const x0 = Math.round(c * CW), y0 = Math.round(l * CH);
      const cel = recortarCelula(im, x0, y0, Math.round((c + 1) * CW) - x0, Math.round((l + 1) * CH) - y0);
      const bb = caixa(cel);
      cache.set(k, { cel, bb, pes: centroDosPes(cel, bb) });
    }
    return cache.get(k);
  };
  DIRECAO.forEach((dir, d) => {
    const linha = personagem * DIRECOES + d;
    dir.andar.forEach(([l, c], i) => {
      const f = pegar(l, c);
      colar(porNoQuadro(f.cel, f.bb, f.pes, dir.esp), i, linha);
    });
    const p = pegar(dir.parado[0], dir.parado[1]);
    colar(porNoQuadro(p.cel, p.bb, p.pes, dir.esp), QUADROS, linha);
  });
  console.log(fontes[personagem] + ': 8 direções x ' + COLS_SAIDA + ' quadros');
}

/* criança: copiada da folha de hoje, sem tocar */
const atual = folhaAtual();
if (atual.larg !== LARG_SAIDA)
  console.log('AVISO: folha atual tem ' + atual.larg + 'px de largura, a nova tem ' + LARG_SAIDA);
for (let d = 0; d < DIRECOES; d++) {
  const orig = 2 * DIRECOES + d;      // linha da criança na folha atual
  for (let col = 0; col < COLS_SAIDA; col++)
    for (let y = 0; y < LADO; y++) {
      const de = ((orig * LADO + y) * atual.larg + col * LADO) * 4;
      const para = (((2 * DIRECOES + d) * LADO + y) * LARG_SAIDA + col * LADO) * 4;
      atual.px.copy(folha, para, de, de + LADO * 4);
    }
}
console.log('criança: copiada da folha atual');

const png = codificar(LARG_SAIDA, ALT_SAIDA, folha);
fs.writeFileSync('pessoas.png', png);
fs.writeFileSync('pessoas.b64.txt', png.toString('base64'));
console.log('\nfolha: ' + LARG_SAIDA + 'x' + ALT_SAIDA + '  ' + (png.length / 1024).toFixed(0) + ' KB');
console.log('base64: ' + (png.toString('base64').length / 1024).toFixed(0) + ' KB');
