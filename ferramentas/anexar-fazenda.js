/*
   A montagem nova não trouxe substituto para a Fazenda (lavoura pequena) —
   nenhuma das 39 peças é uma plantação. Em vez de inventar, reaproveita a
   arte antiga (já processada, já testada) e cola na folha nova como mais um
   quadro. É a fazenda de sempre; só as outras quinze categorias trocaram.
*/
const fs = require('fs');
const { decodificar, codificar } = require('./png.js');

const TILE = 28, ESCALA = 2.2, ALTURA_MAX = 2.4;

// A mesma remoção de fundo preto da leva anterior — este arquivo específico
// ainda é aquele JPEG convertido, com fundo chapado, não o gradiente da
// montagem nova.
const LIMIAR_FUNDO = 18;
function removerFundoPreto(im) {
  const { larg, alt, px } = im;
  const visitado = new Uint8Array(larg * alt);
  const escuro = i => px[i*4] <= LIMIAR_FUNDO && px[i*4+1] <= LIMIAR_FUNDO && px[i*4+2] <= LIMIAR_FUNDO;
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
    px[i*4+3] = 0;
    const x = i % larg, y = (i / larg) | 0;
    semear(x+1,y); semear(x-1,y); semear(x,y+1); semear(x,y-1);
  }
  return im;
}
function manterMaiorIlha(im) {
  const { larg, alt, px } = im;
  const visitado = new Uint8Array(larg * alt);
  const opaco = i => px[i*4+3] > 8;
  let melhor = null;
  for (let ini = 0; ini < larg*alt; ini++) {
    if (visitado[ini] || !opaco(ini)) continue;
    const pixels = [ini]; visitado[ini] = 1;
    for (let c = 0; c < pixels.length; c++) {
      const i = pixels[c], x = i % larg, y = (i/larg)|0;
      for (const [nx,ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]) {
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

const bruto = decodificar('C:/Users/PPCP/Downloads/PNG/fazendapequena1.png');
const rec = recortarAlfa(manterMaiorIlha(removerFundoPreto(bruto)));
const razao = rec.larg / rec.alt;
let dw = 3 * TILE, dh = dw / razao;
const teto = 3 * TILE * ALTURA_MAX;
if (dh > teto) { dh = teto; dw = dh * razao; }
dw = Math.round(dw); dh = Math.round(dh);
// Mesma decisão binária da terceira leva (extrair-individuais.js): esta fonte
// é só 128x128 — bem menor que a folga de ESCALA pedia — e 'reduzir' amplia
// mal (é filtro de caixa, feito pra encolher). Só reduz se a origem tiver
// pixel de sobra; senão guarda nativo e deixa o canvas suavizar ao desenhar.
const alvoL = Math.max(1, Math.round(dw*ESCALA)), alvoA = Math.max(1, Math.round(dh*ESCALA));
const cabeSemAmpliar = alvoL <= rec.larg && alvoA <= rec.alt;
const quadro = cabeSemAmpliar ? reduzir(rec, alvoL, alvoA) : rec;

const DEGRAU = +(process.env.DEGRAU || 1);
if (DEGRAU > 1) for (let i=0;i<quadro.px.length;i+=4) { if (quadro.px[i+3]===0) continue;
  for (let k=0;k<3;k++) quadro.px[i+k]=Math.min(255,Math.round(quadro.px[i+k]/DEGRAU)*DEGRAU); }

// Cola a folha existente ao lado (nova linha embaixo) e atualiza o manifesto.
const folha = decodificar('predios.png');
const mapa = JSON.parse(fs.readFileSync('predios.json','utf8'));
const novaAlt = folha.alt + quadro.alt;
const nova = Buffer.alloc(folha.larg * novaAlt * 4);
folha.px.copy(nova, 0, 0, folha.px.length);
for (let y=0;y<quadro.alt;y++) quadro.px.copy(nova, ((folha.alt+y)*folha.larg)*4, y*quadro.larg*4, (y+1)*quadro.larg*4);
mapa.fazenda = [[0, folha.alt, quadro.larg, quadro.alt, dw, dh]];

fs.writeFileSync('predios.png', codificar(folha.larg, novaAlt, nova));
fs.writeFileSync('predios.json', JSON.stringify(mapa));
console.log('fazenda anexada: ' + quadro.larg + 'x' + quadro.alt + ' -> tela ' + dw + 'x' + dh);
console.log('folha final: ' + folha.larg + 'x' + novaAlt);
