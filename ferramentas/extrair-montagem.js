/*
   Extrai os 39 prédios de uma montagem única (predios-fonte.png) cujo fundo é
   um GRADIENTE com textura — não uma cor chapada como da vez passada, então
   o floodfill por "perto do preto" não serve aqui.

   As 39 caixas abaixo foram medidas à mão, régua por régua, porque a grade
   não é regular (é empacotada por fileira, cada fileira com a altura do seu
   prédio mais alto — 4, 4, 4, 5, 6, 7, 7 e 2 itens, nessa ordem, exatamente
   os mesmos 39 arquivos de origem de antes, só remontados). Detecção
   automática (blur, borda, projeção) foi tentada e falhou: o fundo desta
   imagem tem textura demais para se distinguir do desenho por essas contas.

   Depois do recorte, o fundo de CADA caixa é removido por flood-fill a partir
   da borda, mas agora comparando com a cor MÉDIA DA MOLDURA daquele recorte
   (não mais um valor fixo) — dentro de uma janela pequena o gradiente já
   varia pouco, e a média local dá conta disso.
*/
const fs = require('fs');
const { decodificar, codificar } = require('./png.js');

const FONTE = 'C:/Users/PPCP/Documents/PROJETOS/reino-infinito/ferramentas/predios-fonte.png';
const TILE = 28;
const ESCALA = 2.2;
const ALTURA_MAX = 2.4;

// [x0,y0,x1,y1, chave, w, h]  — w,h são o lote do PREDIO correspondente.
const CAIXAS = [
  [0,0,250,330,      'fazendaGrande', 4,3],   // moinho de vento
  [250,0,510,330,    'prefeitura',    4,3],
  [510,0,770,330,    'predio',        3,2],   // casa de duas torres
  [770,0,1024,330,   'predio',        3,2],   // loja de dois andares

  [0,330,250,512,    'mercado',       3,2],   // barraca de frutas 1
  [250,330,510,512,  'centro',        3,3],
  [510,330,770,512,  'serraria',      3,2],   // celeiro com roda e toras
  [770,330,1024,512, 'escola',        3,2],   // igreja

  [0,512,250,704,    'mercado',       3,2],   // barraca de frutas 2
  [250,512,510,704,  'serraria',      3,2],   // moinho d'água com riacho
  [510,512,770,704,  'estabulo',      3,2],   // com cavalo
  [770,512,1024,704, 'estabulo',      3,2],   // feno aberto

  [0,690,210,910,    'deposito',      2,2],   // casa com barris
  [210,690,415,910,  'sobrado',       2,2],
  [415,690,620,910,  'sobrado',       2,2],
  [645,715,825,905,  'praca',         3,2],   // fonte grande
  [835,690,1024,910, 'sobrado',       2,2],

  [0,895,165,1025,   'praca',         3,2],   // fonte fina
  [165,895,325,1025, 'praca',         3,2],   // fonte baixa
  [325,895,465,1025, 'sobrado',       2,2],   // com bandeira
  [465,895,595,1025, 'sobrado',       2,2],
  [595,895,735,1025, 'predio',        3,2],
  [735,895,875,1025, 'sobrado',       2,2],

  [0,1015,145,1230,  'casa',          2,2],
  [145,1015,290,1230,'mina',          2,2],   // madeira e carvão
  [290,1015,435,1230,'casa',          2,2],
  [435,1015,585,1230,'mercado',       3,2],   // taverna
  [585,1015,730,1230,'oficina',       2,2],   // forja
  [745,1075,870,1225,'mercado',       3,2],   // garrafas
  [875,1015,1024,1230,'casa',         2,2],

  [0,1210,145,1420,  'casa',          2,2],
  [145,1210,290,1420,'mina',          2,2],   // rochosa
  [290,1210,435,1420,'casa',          2,2],
  [435,1210,585,1420,'casa',          2,2],
  [585,1210,730,1420,'casa',          2,2],
  [730,1210,875,1420,'cais',          2,2],
  [875,1210,1024,1420,'casa',         2,2],

  [0,1400,145,1536,  'casa',          2,2],
  [145,1400,320,1536,'oficina',       2,2],
];

const im = decodificar(FONTE);
const { larg: L, alt: A, px } = im;

function recortarCaixa([x0, y0, x1, y1]) {
  const w = x1 - x0, h = y1 - y0;
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++)
    im.px.copy(out, y * w * 4, ((y0 + y) * L + x0) * 4, ((y0 + y) * L + x0 + w) * 4);
  return { larg: w, alt: h, px: out };
}

// Fundo por flood-fill a partir da borda, comparando com a cor MÉDIA da
// própria moldura do recorte (não um valor fixo — o gradiente muda por caixa).
function removerFundoLocal(rec, limiar) {
  const { larg: w, alt: h, px } = rec;
  /*
     A cor de referência do fundo vem só dos 4 CANTOS (uma amostra pequena em
     cada), não da moldura inteira. As caixas foram medidas com folga, e uma
     moldura inteira às vezes cruza por cima do prédio VIZINHO (feno, portão)
     — aí a "cor média do fundo" saía errada, puxada pra cor de um prédio que
     não é este, e o flood-fill comia o prédio errado.
  */
  const cantoR=5;
  const amostraCanto = (cx, cy) => {
    let r=0,g=0,b=0,n=0;
    for (let y=Math.max(0,cy-cantoR); y<Math.min(h,cy+cantoR); y++)
      for (let x=Math.max(0,cx-cantoR); x<Math.min(w,cx+cantoR); x++) {
        const i=(y*w+x)*4; r+=px[i];g+=px[i+1];b+=px[i+2]; n++;
      }
    return [r/n,g/n,b/n];
  };
  const cantos = [amostraCanto(0,0), amostraCanto(w-1,0), amostraCanto(0,h-1), amostraCanto(w-1,h-1)];
  // mediana por canal, entre os 4 cantos — se UM canto pegou prédio vizinho,
  // os outros três ainda dominam.
  const medianaDe = arr => { const s=arr.slice().sort((a,b)=>a-b); return (s[1]+s[2])/2; };
  const mr = medianaDe(cantos.map(c=>c[0])), mg = medianaDe(cantos.map(c=>c[1])), mb = medianaDe(cantos.map(c=>c[2]));

  const visitado = new Uint8Array(w*h);
  const parece = i => Math.abs(px[i*4]-mr)+Math.abs(px[i*4+1]-mg)+Math.abs(px[i*4+2]-mb) <= limiar;
  const fila = [];
  const semear = (x,y) => {
    if (x<0||y<0||x>=w||y>=h) return;
    const i = y*w+x;
    if (visitado[i]) return;
    visitado[i]=1;
    if (parece(i)) fila.push(i);
  };
  for (let x=0;x<w;x++){ semear(x,0); semear(x,h-1); }
  for (let y=0;y<h;y++){ semear(0,y); semear(w-1,y); }
  while (fila.length) {
    const i = fila.pop();
    px[i*4+3]=0;
    const x=i%w, y=(i/w)|0;
    semear(x+1,y); semear(x-1,y); semear(x,y+1); semear(x,y-1);
  }
  return rec;
}

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
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
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

function recortarAlfa(im) {
  let x0 = im.larg, y0 = im.alt, x1 = -1, y1 = -1;
  for (let y = 0; y < im.alt; y++) for (let x = 0; x < im.larg; x++)
    if (im.px[(y * im.larg + x) * 4 + 3] > 8) {
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
  const L2 = x1 - x0 + 1, A2 = y1 - y0 + 1;
  const px = Buffer.alloc(L2 * A2 * 4);
  for (let y = 0; y < A2; y++)
    im.px.copy(px, y * L2 * 4, ((y + y0) * im.larg + x0) * 4, ((y + y0) * im.larg + x0 + L2) * 4);
  return { larg: L2, alt: A2, px };
}

function reduzir(im, L2, A2) {
  const px = Buffer.alloc(L2 * A2 * 4);
  const ex = im.larg / L2, ey = im.alt / A2;
  for (let y = 0; y < A2; y++) {
    const sy0 = Math.floor(y * ey), sy1 = Math.max(sy0 + 1, Math.ceil((y + 1) * ey));
    for (let x = 0; x < L2; x++) {
      const sx0 = Math.floor(x * ex), sx1 = Math.max(sx0 + 1, Math.ceil((x + 1) * ex));
      let r=0,g=0,b=0,a=0,n=0;
      for (let sy=sy0; sy<sy1 && sy<im.alt; sy++)
        for (let sx=sx0; sx<sx1 && sx<im.larg; sx++) {
          const i=(sy*im.larg+sx)*4, al=im.px[i+3]/255;
          r+=im.px[i]*al; g+=im.px[i+1]*al; b+=im.px[i+2]*al; a+=im.px[i+3]; n++;
        }
      if (!n) continue;
      const d=(y*L2+x)*4, am=a/n, peso=am/255;
      px[d]   = peso>0 ? Math.min(255,Math.round(r/n/peso)) : 0;
      px[d+1] = peso>0 ? Math.min(255,Math.round(g/n/peso)) : 0;
      px[d+2] = peso>0 ? Math.min(255,Math.round(b/n/peso)) : 0;
      px[d+3] = Math.round(am);
    }
  }
  return { larg:L2, alt:A2, px };
}

function tamanhoNaTela(w, h, im) {
  const razao = im.larg / im.alt;
  let dw = w * TILE, dh = dw / razao;
  const teto = h * TILE * ALTURA_MAX;
  if (dh > teto) { dh = teto; dw = dh * razao; }
  return { dw: Math.round(dw), dh: Math.round(dh) };
}

const LIMIAR_FUNDO = +(process.env.LIMIAR || 30);
const porChave = {};
const quadros = [];
CAIXAS.forEach((caixa, idx) => {
  const [x0,y0,x1,y1,chave,w,h] = caixa;
  const bruto = recortarCaixa(caixa);
  const semFundo = manterMaiorIlha(removerFundoLocal(bruto, LIMIAR_FUNDO));
  const rec = recortarAlfa(semFundo);
  const { dw, dh } = tamanhoNaTela(w, h, rec);
  const fL = Math.max(1, Math.round(dw * ESCALA)), fA = Math.max(1, Math.round(dh * ESCALA));
  const red = reduzir(rec, fL, fA);
  const vari = (porChave[chave] = (porChave[chave] || 0));
  porChave[chave]++;
  quadros.push({ chave, vari, dw, dh, im: red, origem: idx });
  console.log(String(idx).padStart(2) + ' ' + chave.padEnd(14) + ' orig ' + (x1-x0)+'x'+(y1-y0) +
    ' -> recorte ' + rec.larg+'x'+rec.alt + ' -> tela ' + dw+'x'+dh);
});

const LARG_FOLHA = 900;
const porAltura = quadros.slice().sort((a,b) => b.im.alt - a.im.alt);
let cx=0, cy=0, alturaLinha=0;
for (const q of porAltura) {
  if (cx + q.im.larg > LARG_FOLHA) { cx=0; cy+=alturaLinha; alturaLinha=0; }
  q.x=cx; q.y=cy; cx+=q.im.larg; alturaLinha=Math.max(alturaLinha,q.im.alt);
}
const ALT_FOLHA = cy + alturaLinha;
const folha = Buffer.alloc(LARG_FOLHA*ALT_FOLHA*4);
for (const q of quadros)
  for (let y=0;y<q.im.alt;y++)
    q.im.px.copy(folha, ((q.y+y)*LARG_FOLHA+q.x)*4, y*q.im.larg*4, (y+1)*q.im.larg*4);

const DEGRAU = +(process.env.DEGRAU || 1);
if (DEGRAU > 1) for (let i=0;i<folha.length;i+=4) { if (folha[i+3]===0) continue;
  for (let k=0;k<3;k++) folha[i+k]=Math.min(255,Math.round(folha[i+k]/DEGRAU)*DEGRAU); }

fs.writeFileSync('predios-montagem.png', codificar(LARG_FOLHA, ALT_FOLHA, folha));
const mapa = {};
for (const q of quadros) { if (!mapa[q.chave]) mapa[q.chave]=[]; mapa[q.chave].push([q.x,q.y,q.im.larg,q.im.alt,q.dw,q.dh]); }
fs.writeFileSync('predios-montagem.json', JSON.stringify(mapa));
console.log('\nfolha: '+LARG_FOLHA+'x'+ALT_FOLHA+'  '+(folha.length/1024/1024).toFixed(1)+'MB bruto');
console.log('por chave: ' + JSON.stringify(Object.fromEntries(Object.entries(porChave))));
