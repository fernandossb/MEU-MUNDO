/*
   Sprites de árvore pra substituir o desenho vetorial (spriteArvore/
   spriteConifera). Fonte: 10 fotos .jpeg convertidas pra .png (mesma técnica
   da primeira leva de prédio — System.Drawing do .NET via PowerShell, só pra
   trocar de contêiner), fundo preto chapado, uma árvore por arquivo.

   Cada NORMAL tem uma NEVE irmã do mesmo "molde" (mesma espécie, com neve
   em cima) — e tem uma dupla FRUTIFERA/FRUTIFERANEVE à parte. O mapeamento
   pra espécie é pelo CONTEÚDO da imagem, não dá pra adivinhar por número:
     NORMAL1 bidoeiro   <-> NEVE3 bidoeiro com neve
     NORMAL2 conífera   <-> NEVE2 conífera com neve
     NORMAL3 carvalho   <-> NEVE4 carvalho com neve
     NORMAL4 morta/seca <-> NEVE1 morta/seca com neve
     FRUTIFERA1         <-> FRUTIFERANEVE1
*/
const fs = require('fs');
const { decodificar, codificar } = require('./png.js');

const DIR = 'C:/Users/PPCP/Downloads/ÁRVORES/';
const ALTURA_ALVO = 50; // px de altura na tela, por espécie — a largura segue a proporção da foto

const ESPECIES = [
  ['bidoeiro', 'NORMAL1.png', 'NEVE3.png'],
  ['conifera', 'NORMAL2.png', 'NEVE2.png'],
  ['carvalho', 'NORMAL3.png', 'NEVE4.png'],
  ['morta',    'NORMAL4.png', 'NEVE1.png'],
  ['fruta',    'FRUTIFERA1.png', 'FRUTIFERANEVE1.png'],
];

function removerFundoPreto(im, limiar) {
  const { larg: w, alt: h, px } = im;
  const visitado = new Uint8Array(w * h);
  const escuro = i => px[i*4] <= limiar && px[i*4+1] <= limiar && px[i*4+2] <= limiar;
  const fila = [];
  const semear = (x, y) => {
    if (x<0||y<0||x>=w||y>=h) return;
    const i=y*w+x;
    if (visitado[i]) return;
    visitado[i]=1;
    if (escuro(i)) fila.push(i);
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

const LIMIAR_FUNDO = +(process.env.LIMIAR || 40);
const quadros = [];
for (const [especie, arqNormal, arqNeve] of ESPECIES) {
  for (const [sufixo, arq] of [['', arqNormal], ['_neve', arqNeve]]) {
    const bruto = decodificar(DIR + arq);
    const rec = recortarAlfa(manterMaiorIlha(removerFundoPreto(bruto, LIMIAR_FUNDO)));
    const razao = rec.larg / rec.alt;
    const dh = ALTURA_ALVO, dw = Math.round(dh * razao);
    // Nunca amplia além da origem — mesmo cuidado da leva de prédios: fonte
    // pequena ampliada por filtro de caixa sai em blocos.
    const cabe = dw <= rec.larg && dh <= rec.alt;
    const im = cabe ? reduzir(rec, dw, Math.round(dh)) : rec;
    quadros.push({ chave: especie + sufixo, im, dw: cabe ? dw : im.larg, dh: cabe ? Math.round(dh) : im.alt });
    console.log((especie+sufixo).padEnd(14) + arq.padEnd(20) + 'orig ' + bruto.larg+'x'+bruto.alt +
      ' -> recorte ' + rec.larg+'x'+rec.alt + ' -> tela ' + im.larg+'x'+im.alt);
  }
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

const DEGRAU = +(process.env.DEGRAU || 1);
if (DEGRAU > 1) for (let i=0;i<folha.length;i+=4) { if (folha[i+3]===0) continue;
  for (let k=0;k<3;k++) folha[i+k]=Math.min(255,Math.round(folha[i+k]/DEGRAU)*DEGRAU); }

fs.writeFileSync('arvores.png', codificar(LARG_FOLHA, ALT_FOLHA, folha));
const mapa = {};
for (const q of quadros) mapa[q.chave] = [q.x, q.y, q.im.larg, q.im.alt, q.dw, q.dh];
fs.writeFileSync('arvores.json', JSON.stringify(mapa));
console.log('\nfolha: '+LARG_FOLHA+'x'+ALT_FOLHA+'  '+(folha.length/1024/1024).toFixed(1)+'MB bruto');
