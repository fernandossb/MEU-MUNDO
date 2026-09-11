/*
   Segunda leva de árvores: 6 fotos com fundo branco chapado de estúdio (não
   transparente de verdade, ao contrário do que a prévia com xadrez sugeria —
   conferido pixel a pixel: alfa 255 em tudo). Mesmo flood-fill de
   'extrair-rochas.js' pra tirar o fundo, adaptado pra cor clara.

   Substitui o time inteiro de espécies "folhosas" (a conífera e os nomes
   fantasiosos de antes saem; NÃO existe foto de neve nesta leva — o inverno
   cai de volta pro sprite vetorial daquela espécie, que continua servindo de
   respaldo em 'desenharNo' quando a chave '_neve' não existe na folha).
*/
const fs = require('fs');
const { decodificar, codificar } = require('./png.js');

const DIR = 'C:/Users/PPCP/Downloads/aldeoes2/';
const ALTURA_ALVO = 50; // mesmo alvo da leva anterior — casa com MAPA_ARVORES já existente

const ESPECIES = [
  ['carvalho',  'arvore1.png', 24],   // carvalho grande, galhos nodosos
  ['conifera',  'arvore2.png', 24],   // pinheiro
  ['bordo',     'arvore3.png', 24],   // bordo japonês, folhas avermelhadas
  ['magnolia',  'arvore4.png', 40],   // magnólia florida — tolerância maior derrubava as flores brancas; reduzida pra preservá-las
  ['bidoeiro',  'arvore5.png', 24],   // bétula
  ['nogueira',  'arvore6.png', 24],   // copa larga e densa
];

function removerFundoClaro(im, tolerancia) {
  const { larg: w, alt: h, px } = im;
  const ref = [px[0], px[1], px[2]];
  const visitado = new Uint8Array(w * h);
  const perto = i => {
    const dr = px[i*4] - ref[0], dg = px[i*4+1] - ref[1], db = px[i*4+2] - ref[2];
    return Math.sqrt(dr*dr + dg*dg + db*db) <= tolerancia;
  };
  const fila = [];
  const semear = (x, y) => {
    if (x<0||y<0||x>=w||y>=h) return;
    const i=y*w+x;
    if (visitado[i]) return;
    visitado[i]=1;
    if (perto(i)) fila.push(i);
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

const quadros = [];
for (const [especie, arq, tol] of ESPECIES) {
  const bruto = decodificar(DIR + arq);
  const rec = recortarAlfa(manterMaiorIlha(removerFundoClaro(bruto, tol)));
  const razao = rec.larg / rec.alt;
  const dh = ALTURA_ALVO, dw = Math.round(dh * razao);
  const cabe = dw <= rec.larg && dh <= rec.alt;
  const im = cabe ? reduzir(rec, dw, Math.round(dh)) : rec;
  quadros.push({ chave: especie, im, dw: cabe ? dw : im.larg, dh: cabe ? Math.round(dh) : im.alt });
  console.log(especie.padEnd(12) + arq.padEnd(14) + 'orig ' + bruto.larg+'x'+bruto.alt +
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
