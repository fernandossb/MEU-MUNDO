/*
   Sprites de ROCHA pra substituir o desenho vetorial (spritePedra) — mesma
   ideia da leva de árvores, só que a foto de origem tem fundo cinza-claro
   de estúdio (não preto).

   Mesmo motor validado da primeira tentativa (o usuário confirmou: "o
   motor de limpeza da pedra de antes tinha funcionado mto bem") — só o
   das ÁRVORES que precisou ser trocado por completo. 'removerFundo'
   compara cada pixel candidato contra o VIZINHO que acabou de virar
   fundo (não contra uma referência fixa) — assim o preenchimento anda
   degrau a degrau por um degradê longo (a sombra projetada da pedra no
   chão do estúdio, ~280px do cinza-claro até o pé da pedra), mas ainda
   para na hora numa borda de verdade. Depois, a faixa que ainda encosta
   no fundo ganha alfa suave + descontaminação de cor.
*/
const fs = require('fs');
const { decodificar, codificar } = require('./png.js');

const DIR = 'C:/Users/PPCP/Downloads/aldeoes2/';
const ALTURA_ALVO = 44; // px de altura na tela — perto do 40x34 do sprite vetorial que substitui

const ROCHAS = ['rocha1.png', 'rocha2.png'];

function removerFundo(im, tolLocal, feather) {
  const { larg: w, alt: h, px } = im;
  const n = w * h;
  const estado = new Uint8Array(n); // 0 = objeto (no fim), 1 = fundo confirmado
  const corFundo = new Float32Array(n * 3);
  const dist = (r1,g1,b1,r2,g2,b2) => Math.sqrt((r1-r2)**2+(g1-g2)**2+(b1-b2)**2);
  const claramenteFundo = (r,g,b) => Math.min(r,g,b) > 205 && (Math.max(r,g,b) - Math.min(r,g,b)) < 12;

  const fila = [];
  const semear = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = y * w + x;
    if (estado[i]) return;
    estado[i] = 1;
    corFundo[i*3] = px[i*4]; corFundo[i*3+1] = px[i*4+1]; corFundo[i*3+2] = px[i*4+2];
    fila.push(i);
  };
  for (let x = 0; x < w; x++) { semear(x, 0); semear(x, h - 1); }
  for (let y = 0; y < h; y++) { semear(0, y); semear(w - 1, y); }

  while (fila.length) {
    const i = fila.pop();
    const x = i % w, y = (i / w) | 0;
    const cr = corFundo[i*3], cg = corFundo[i*3+1], cb = corFundo[i*3+2];
    for (const [nx, ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]) {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const ni = ny * w + nx;
      if (estado[ni]) continue;
      const nr = px[ni*4], ng = px[ni*4+1], nb = px[ni*4+2];
      if (dist(cr,cg,cb, nr,ng,nb) <= tolLocal || claramenteFundo(nr,ng,nb)) {
        estado[ni] = 1;
        corFundo[ni*3] = nr; corFundo[ni*3+1] = ng; corFundo[ni*3+2] = nb;
        fila.push(ni);
      }
    }
  }

  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    if (estado[i] === 1) { px[i*4+3] = 0; continue; }
    let ref = null;
    for (const [nx, ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1],[x+1,y+1],[x-1,y-1],[x+1,y-1],[x-1,y+1]]) {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const ni = ny * w + nx;
      if (estado[ni] !== 1) continue;
      ref = [corFundo[ni*3], corFundo[ni*3+1], corFundo[ni*3+2]];
      break;
    }
    if (!ref) continue;
    const d = dist(px[i*4],px[i*4+1],px[i*4+2], ref[0],ref[1],ref[2]);
    if (d >= feather) continue;
    const a = Math.max(0, Math.min(1, d / feather));
    if (a < 1) {
      for (let c = 0; c < 3; c++) {
        const obs = px[i*4+c];
        const puro = a > 0.02 ? (obs - (1-a)*ref[c]) / a : obs;
        px[i*4+c] = Math.max(0, Math.min(255, Math.round(puro)));
      }
    }
    px[i*4+3] = Math.round(255 * a);
  }
  return im;
}
function manterMaiorIlha(im) {
  const { larg, alt, px } = im;
  const visitado = new Uint8Array(larg*alt);
  const opaco = i => px[i*4+3] > 8;
  let melhor = null;
  for (let ini=0; ini<larg*alt; ini++) {
    if (visitado[ini] || !opaco(ini)) continue;
    const pixels=[ini]; visitado[ini]=1;
    for (let c=0;c<pixels.length;c++) {
      const i=pixels[c], x=i%larg, y=(i/larg)|0;
      for (const [nx,ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]) {
        if (nx<0||ny<0||nx>=larg||ny>=alt) continue;
        const ni=ny*larg+nx;
        if (visitado[ni] || !opaco(ni)) continue;
        visitado[ni]=1; pixels.push(ni);
      }
    }
    if (!melhor || pixels.length>melhor.length) melhor=pixels;
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

const TOL_LOCAL = +(process.env.TOL || 14);
const FEATHER = +(process.env.FEATHER || 60);
const quadros = [];
for (const arq of ROCHAS) {
  const chave = 'rocha' + (quadros.length + 1);
  const bruto = decodificar(DIR + arq);
  const rec = recortarAlfa(manterMaiorIlha(removerFundo(bruto, TOL_LOCAL, FEATHER)));
  const razao = rec.larg / rec.alt;
  const dh = ALTURA_ALVO, dw = Math.round(dh * razao);
  const cabe = dw <= rec.larg && dh <= rec.alt;
  const im = cabe ? reduzir(rec, dw, Math.round(dh)) : rec;
  quadros.push({ chave, im, dw: cabe ? dw : im.larg, dh: cabe ? Math.round(dh) : im.alt });
  console.log(chave.padEnd(10) + arq.padEnd(14) + 'orig ' + bruto.larg+'x'+bruto.alt +
    ' -> recorte ' + rec.larg+'x'+rec.alt + ' -> tela ' + im.larg+'x'+im.alt);
}

const LARG_FOLHA = Math.max(...quadros.map(q => q.im.larg));
let cy = 0;
for (const q of quadros) { q.x = 0; q.y = cy; cy += q.im.alt; }
const ALT_FOLHA = cy;
const folha = Buffer.alloc(LARG_FOLHA*ALT_FOLHA*4);
for (const q of quadros)
  for (let y=0;y<q.im.alt;y++)
    q.im.px.copy(folha, ((q.y+y)*LARG_FOLHA+q.x)*4, y*q.im.larg*4, (y+1)*q.im.larg*4);

const png = codificar(LARG_FOLHA, ALT_FOLHA, folha);
fs.writeFileSync('rochas.png', png);
fs.writeFileSync('rochas.b64.txt', png.toString('base64'));
const mapa = {};
for (const q of quadros) mapa[q.chave] = [q.x, q.y, q.im.larg, q.im.alt, q.dw, q.dh];
fs.writeFileSync('rochas.json', JSON.stringify(mapa));
console.log('\nfolha: '+LARG_FOLHA+'x'+ALT_FOLHA+'  '+(png.length/1024).toFixed(0)+' KB');
console.log('MAPA_PEDRAS = ' + JSON.stringify(mapa));
