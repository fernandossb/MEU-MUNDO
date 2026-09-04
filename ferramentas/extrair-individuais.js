/*
   Terceira leva de arte: desta vez o usuário recortou cada prédio à mão, um
   arquivo por peça (1.PNG a 37.PNG) — muito mais confiável que eu medir uma
   montagem na régua. Os recortes têm dois fundos diferentes, dependendo de
   qual ferramenta gerou cada um (preto chapado nos primeiros, claro na
   maioria) — mas os dois removem do mesmo jeito, por proximidade com a cor
   do canto; qual delas é só decide o valor de referência.

   CORRIGIDO: uma segunda passada (removerAureola) chegou a existir aqui,
   pensada pra comer uma "auréola escura" que pareceria um resto de drop
   shadow da ferramenta de recorte do usuário. Era a sombra de contato de
   verdade que cada prédio já tinha na própria arte — a segunda passada
   comia ela inteira, silenciosamente, porque sombra grudada no prédio é
   exatamente tão escura quanto um artefato de recorte. Removida: só
   'removerFundo' já limpa o fundo sem sobra em nenhum dos 29 arquivos
   claros (conferido visualmente, folha de contato completa), e devolve a
   sombra que tinha sumido de bom número de casas.
*/
const fs = require('fs');
const { decodificar, codificar } = require('./png.js');

const DIR = 'C:/Users/PPCP/Downloads/IMAGENS JOGO/';
const TILE = 28, ESCALA = 2.2, ALTURA_MAX = 2.4;
const N = 37;

// [numero, chave, w, h]  — w,h são o lote do PREDIO correspondente.
const PECAS = [
  [1,  'fazendaGrande', 4,3],
  [2,  'prefeitura',    4,3],
  [3,  'predio',        3,2],
  [4,  'predio',        3,2],
  [5,  'mercado',       3,2],
  [6,  'mercado',       3,2],
  [7,  'centro',        3,3],
  [8,  'serraria',      3,2],
  [9,  'escola',        3,2],
  [10, 'serraria',      3,2],
  [11, 'serraria',      3,2],
  [12, 'estabulo',      3,2],
  [13, 'estabulo',      3,2],
  [14, 'deposito',      2,2],
  [15, 'sobrado',       2,2],
  [16, 'sobrado',       2,2],
  [17, 'sobrado',       2,2],
  [18, 'praca',         3,2],
  [19, 'sobrado',       2,2],
  [20, 'sobrado',       2,2],
  [21, 'praca',         3,2],
  [22, 'praca',         3,2],
  [23, 'sobrado',       2,2],
  [24, 'oficina',       2,2],
  [25, 'oficina',       2,2],
  [26, 'mercado',       3,2],
  [27, 'sobrado',       2,2],
  [28, 'mina',          2,2],
  [29, 'mina',          2,2],
  [30, 'casa',          2,2],
  [31, 'mercado',       3,2],
  [32, 'casa',          2,2],
  [33, 'cais',          2,2],
  [34, 'casa',          2,2],
  [35, 'casa',          2,2],
  [36, 'casa',          2,2],
  [37, 'oficina',       2,2],
];

function corCanto(im) {
  const cantos = [[0,0],[im.larg-1,0],[0,im.alt-1],[im.larg-1,im.alt-1]];
  let r=0,g=0,b=0;
  for (const [x,y] of cantos) { const i=(y*im.larg+x)*4; r+=im.px[i]; g+=im.px[i+1]; b+=im.px[i+2]; }
  return [r/4, g/4, b/4];
}

/* Passo 1: remove o fundo (claro ou escuro, o que estiver no canto) por
   flood-fill a partir da borda, comparando com a cor do canto. */
function removerFundo(im, limiar) {
  const { larg: w, alt: h, px } = im;
  const [mr,mg,mb] = corCanto(im);
  const visitado = new Uint8Array(w*h);
  const parece = i => Math.abs(px[i*4]-mr)+Math.abs(px[i*4+1]-mg)+Math.abs(px[i*4+2]-mb) <= limiar;
  const fila = [];
  const semear = (x,y) => {
    if (x<0||y<0||x>=w||y>=h) return;
    const i=y*w+x;
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
  return im;
}

function manterMaiorIlha(im) {
  const { larg, alt, px } = im;
  const visitado = new Uint8Array(larg * alt);
  const opaco = i => px[i * 4 + 3] > 8;
  let melhor = null;
  for (let ini = 0; ini < larg * alt; ini++) {
    if (visitado[ini] || !opaco(ini)) continue;
    const pixels = [ini]; visitado[ini] = 1;
    for (let c = 0; c < pixels.length; c++) {
      const i = pixels[c], x = i % larg, y = (i / larg) | 0;
      for (const [nx, ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]) {
        if (nx<0||ny<0||nx>=larg||ny>=alt) continue;
        const ni = ny*larg+nx;
        if (visitado[ni] || !opaco(ni)) continue;
        visitado[ni]=1; pixels.push(ni);
      }
    }
    if (!melhor || pixels.length > melhor.length) melhor = pixels;
  }
  const mantido = new Uint8Array(larg*alt);
  if (melhor) for (const i of melhor) mantido[i]=1;
  for (let i=0;i<larg*alt;i++) if (!mantido[i]) px[i*4+3]=0;
  return im;
}
function recortarAlfa(im) {
  let x0=im.larg,y0=im.alt,x1=-1,y1=-1;
  for (let y=0;y<im.alt;y++) for (let x=0;x<im.larg;x++)
    if (im.px[(y*im.larg+x)*4+3]>8) { if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; }
  const L=x1-x0+1, A=y1-y0+1;
  const px = Buffer.alloc(L*A*4);
  for (let y=0;y<A;y++) im.px.copy(px, y*L*4, ((y+y0)*im.larg+x0)*4, ((y+y0)*im.larg+x0+L)*4);
  return { larg:L, alt:A, px };
}
function reduzir(im, L, A) {
  const px = Buffer.alloc(L*A*4);
  const ex = im.larg/L, ey = im.alt/A;
  for (let y=0;y<A;y++) {
    const sy0=Math.floor(y*ey), sy1=Math.max(sy0+1,Math.ceil((y+1)*ey));
    for (let x=0;x<L;x++) {
      const sx0=Math.floor(x*ex), sx1=Math.max(sx0+1,Math.ceil((x+1)*ex));
      let r=0,g=0,b=0,a=0,n=0;
      for (let sy=sy0;sy<sy1&&sy<im.alt;sy++) for (let sx=sx0;sx<sx1&&sx<im.larg;sx++) {
        const i=(sy*im.larg+sx)*4, al=im.px[i+3]/255;
        r+=im.px[i]*al; g+=im.px[i+1]*al; b+=im.px[i+2]*al; a+=im.px[i+3]; n++;
      }
      if (!n) continue;
      const d=(y*L+x)*4, am=a/n, peso=am/255;
      px[d]=peso>0?Math.min(255,Math.round(r/n/peso)):0;
      px[d+1]=peso>0?Math.min(255,Math.round(g/n/peso)):0;
      px[d+2]=peso>0?Math.min(255,Math.round(b/n/peso)):0;
      px[d+3]=Math.round(am);
    }
  }
  return { larg:L, alt:A, px };
}
function tamanhoNaTela(w, h, im) {
  const razao = im.larg / im.alt;
  let dw = w * TILE, dh = dw / razao;
  const teto = h * TILE * ALTURA_MAX;
  if (dh > teto) { dh = teto; dw = dh * razao; }
  return { dw: Math.round(dw), dh: Math.round(dh) };
}

const LIMIAR_FUNDO = +(process.env.LIMIAR || 40);
const porChave = {};
const quadros = [];
let estiloClaroN = 0, estiloEscuroN = 0;

for (const [num, chave, w, h] of PECAS) {
  const bruto = decodificar(DIR + num + '.PNG');
  const [cr,cg,cb] = corCanto(bruto);
  const claro = (cr+cg+cb)/3 > 128;
  if (claro) estiloClaroN++; else estiloEscuroN++;

  let im = removerFundo(bruto, LIMIAR_FUNDO);
  im = manterMaiorIlha(im);
  const rec = recortarAlfa(im);

  const { dw, dh } = tamanhoNaTela(w, h, rec);
  /*
     NUNCA amplia além da resolução nativa do recorte. 'reduzir' é um filtro
     de caixa — ótimo para reduzir, péssimo para ampliar: sem pixel de sobra
     pra fazer média, ele degenera em vizinho-mais-próximo e o resultado sai
     em blocos. Estes 37 arquivos chegaram bem menores que a leva anterior
     (100 a 180px), e o multiplicador de folga (ESCALA) pedia guardar quase
     o DOBRO disso — cada prédio saía ampliado às pressas, e era exatamente
     essa a "resolução horrível" que apareceu no jogo.

     A correção: se a folga pedida já cabe dentro da origem, guarda reduzido
     como sempre (o filtro de caixa faz um bom trabalho reduzindo). Se a
     origem é pequena demais para a folga, guarda na resolução NATIVA, sem
     tocar — e deixa o próprio canvas do jogo suavizar na hora de desenhar
     ('ctx.imageSmoothingEnabled = true' já está ligado), que é um
     redimensionamento muito melhor do que este filtro de caixa faria.
  */
  // Decisão binária, não um corte por eixo: recortar cada eixo contra a
  // origem de forma independente distorceria a proporção sempre que só um
  // dos dois lados precisasse de mais espaço que a origem tem.
  const alvoL = Math.max(1, Math.round(dw*ESCALA)), alvoA = Math.max(1, Math.round(dh*ESCALA));
  const cabeSemAmpliar = alvoL <= rec.larg && alvoA <= rec.alt;
  const red = cabeSemAmpliar ? reduzir(rec, alvoL, alvoA) : rec;
  const vari = (porChave[chave] = (porChave[chave] || 0));
  porChave[chave]++;
  quadros.push({ chave, vari, dw, dh, im: red, origem: num });
  console.log(String(num).padStart(2) + ' ' + chave.padEnd(14) + (claro?'[claro]':'[escuro]') +
    ' orig ' + bruto.larg+'x'+bruto.alt + ' -> recorte ' + rec.larg+'x'+rec.alt + ' -> tela ' + dw+'x'+dh);
}

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

fs.writeFileSync('predios-individuais.png', codificar(LARG_FOLHA, ALT_FOLHA, folha));
const mapa = {};
for (const q of quadros) { if (!mapa[q.chave]) mapa[q.chave]=[]; mapa[q.chave].push([q.x,q.y,q.im.larg,q.im.alt,q.dw,q.dh]); }
fs.writeFileSync('predios-individuais.json', JSON.stringify(mapa));
console.log('\nestilo claro: ' + estiloClaroN + '  estilo escuro: ' + estiloEscuroN);
console.log('folha: '+LARG_FOLHA+'x'+ALT_FOLHA+'  '+(folha.length/1024/1024).toFixed(1)+'MB bruto');
console.log('por chave: ' + JSON.stringify(porChave));
