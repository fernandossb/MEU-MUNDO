/*
   Terceira leva de árvores: duas fotos geradas com fundo JÁ transparente de
   verdade (confirmado pixel a pixel — alfa varia 0..255, não é fundo
   chapado disfarçado de xadrez como a leva anterior). Não precisa de
   flood-fill nenhum aqui: só recorta pela própria caixa do alfa e reduz
   (nunca amplia) pro tamanho de tela — o mesmo `recortarAlfa`/`reduzir` de
   sempre.

   A conífera não tem foto nova nesta leva — preservada da folha atual
   (extraída de dentro do próprio index.html) pra não perder a única
   variedade "de agulha" que já funcionava bem.
*/
const fs = require('fs');
const { decodificar, codificar } = require('./png.js');

const DIR = 'C:/Users/PPCP/Downloads/';
const ALTURA_ALVO = 50;

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

const quadros = [];

// conífera preservada da folha atual
{
  const folhaAtual = decodificar('_folha_arvores_atual.png.tmp');
  const [x,y,w,h] = [58,0,27,50];
  const px = Buffer.alloc(w*h*4);
  for (let yy=0;yy<h;yy++) folhaAtual.px.copy(px, yy*w*4, ((y+yy)*folhaAtual.larg+x)*4, ((y+yy)*folhaAtual.larg+x+w)*4);
  quadros.push({ chave: 'conifera', im: {larg:w,alt:h,px}, dw: w, dh: h });
  console.log('conifera'.padEnd(12) + '(preservada)'.padEnd(30) + 'tela ' + w+'x'+h);
}

for (const [chave, arq] of [['carvalho', 'ChatGPT Image 11 de set. de 2026, 14_44_24.png'], ['nogueira', 'ChatGPT Image 11 de set. de 2026, 14_56_20.png']]) {
  const bruto = decodificar(DIR + arq);
  const rec = recortarAlfa(bruto);
  const razao = rec.larg / rec.alt;
  const dh = ALTURA_ALVO, dw = Math.round(dh * razao);
  const cabe = dw <= rec.larg && dh <= rec.alt;
  const im = cabe ? reduzir(rec, dw, Math.round(dh)) : rec;
  quadros.push({ chave, im, dw: cabe ? dw : im.larg, dh: cabe ? Math.round(dh) : im.alt });
  console.log(chave.padEnd(12) + arq.padEnd(40) + 'orig ' + bruto.larg+'x'+bruto.alt +
    ' -> recorte ' + rec.larg+'x'+rec.alt + ' -> tela ' + im.larg+'x'+im.alt);
}

const LARG_FOLHA = 512;
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

const png = codificar(LARG_FOLHA, ALT_FOLHA, folha);
fs.writeFileSync('arvores.png', png);
fs.writeFileSync('arvores.b64.txt', png.toString('base64'));
const mapa = {};
for (const q of quadros) mapa[q.chave] = [q.x, q.y, q.im.larg, q.im.alt, q.dw, q.dh];
fs.writeFileSync('arvores.json', JSON.stringify(mapa));
console.log('\nfolha: '+LARG_FOLHA+'x'+ALT_FOLHA+'  '+(png.length/1024).toFixed(0)+' KB');
