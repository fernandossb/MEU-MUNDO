/*
   Segunda leva de árvores: 6 fotos com fundo branco chapado de estúdio (não
   transparente de verdade, ao contrário do que a prévia com xadrez sugeria —
   conferido pixel a pixel: alfa 255 em tudo, sem exceção).

   PRIMEIRA TENTATIVA (flood-fill contra a cor fixa do canto, sem alfa
   suave) deixava um contorno branco bem visível ao redor de toda árvore.
   SEGUNDA TENTATIVA (gradiente local, ver 'extrair-rochas.js') melhorou a
   borda EXTERNA mas ainda sobrava branco: a copa de uma árvore tem vãos
   entre folha e folha por onde o fundo aparece, e boa parte desses vãos
   não tem caminho de passo pequeno até a borda da foto (ficam cercados de
   folha escura por todo lado, com um salto e não um degradê) — o
   flood-fill nunca alcançava, e esses pixels claros ficavam presos dentro
   do "objeto", sobrevivendo pra sombra do 'reduzir()' puxar um halo.

   Terceira: além do passo pequeno (segue gradiente), 'removerFundo' aceita
   um salto grande direto pra qualquer vizinho que já é claramente fundo por
   conta própria (bem claro E pouco saturado — cinza/branco de estúdio, sem
   o verde de folha nem o marrom de galho) — isso alcança os vãos cercados
   sem precisar de um degradê guiando o caminho. Descontamina a cor da
   faixa que sobra encostada no fundo, senão o anti-serrilhado da foto
   original continua puxando um resto de branco pro pixel de borda.

   'zonaProtegida' desliga esse salto numa caixa da imagem — a magnólia
   protege a copa inteira (flor pode nascer em qualquer parte dela) e a
   bétula só o terço de baixo (onde fica o tronco), deixando a copa
   continuar pegando o salto contra o halo.

   O TRONCO DA BÉTULA foi tentativa atrás de tentativa (proteger do salto,
   depois borrar só a zona do tronco com raio proporcional ao fator de
   redução) e mesmo assim o usuário achou o resultado ruim — casca clara
   com listra escura é conteúdo de alta frequência, comprimido numa faixa
   de só ~12px de largura no sprite final, e nenhum tratamento testado
   deixou aquilo com cara de árvore de verdade. Pedido do usuário:
   remover a espécie do jogo, em vez de insistir num quarto ajuste. A
   entrada fica FORA de 'ESPECIES' (não é mais assada na folha) — o
   arquivo 'arvore5.png' e a função 'borrarZona' continuam aqui, sem uso,
   caso uma foto de bétula melhor apareça um dia.

   Substitui o time inteiro de espécies "folhosas" (a conífera e os nomes
   fantasiosos de antes saem; NÃO existe foto de neve nesta leva — falta a
   chave '_neve' em MAPA_ARVORES, e cai de volta pro sprite vetorial daquela
   espécie, que continua servindo de respaldo em 'desenharNo'). IMPORTANTE:
   isso NÃO é o mês do calendário — 'n.neve' vem de `b === B.NEVE` (o nó
   nasceu num tile do BIOMA de neve, lá no alto da montanha), não da estação
   do ano. Uma árvore no meio da vila, em pleno inverno no calendário,
   continua usando a foto normalmente; só quem nasce na linha de neve cai
   pro vetorial o ano inteiro.
*/
const fs = require('fs');
const { decodificar, codificar } = require('./png.js');

const DIR = 'C:/Users/PPCP/Downloads/aldeoes2/';
const ALTURA_ALVO = 50; // mesmo alvo da leva anterior — casa com MAPA_ARVORES já existente

const ESPECIES = [
  ['carvalho',  'arvore1.png', 20, 60, null,                        0],   // carvalho grande, galhos nodosos
  ['conifera',  'arvore2.png', 20, 60, null,                        0],   // pinheiro
  ['bordo',     'arvore3.png', 20, 60, null,                        0],   // bordo japonês, folhas avermelhadas
  ['magnolia',  'arvore4.png', 20, 45, {x0:0,y0:0,x1:1,y1:1},       0],   // magnólia florida — flor branca em qualquer parte da copa, protege tudo (sem borrar: a flor tem que ficar nítida)
  // bétula (arvore5.png) removida do jogo — pedido do usuário, tronco nunca ficou bom
  ['nogueira',  'arvore6.png', 20, 60, null,                        0],   // copa larga e densa
];

function removerFundo(im, tolLocal, feather, zonaProtegida) {
  const { larg: w, alt: h, px } = im;
  const n = w * h;
  const estado = new Uint8Array(n); // 0 = objeto (no fim), 1 = fundo confirmado
  const corFundo = new Float32Array(n * 3);
  const dist = (r1,g1,b1,r2,g2,b2) => Math.sqrt((r1-r2)**2+(g1-g2)**2+(b1-b2)**2);
  // Bem claro E pouco saturado (cinza/branco de estúdio) — nem o verde da
  // folha nem o marrom do galho passam aqui. Mas casca de bétula e pétala
  // de flor são BRANCAS também — indistinguíveis do fundo pela cor sozinha
  // — por isso 'zonaProtegida' desliga o salto numa caixa (em fração da
  // imagem) onde esse pedaço de árvore normalmente aparece.
  const zp = zonaProtegida;
  const protegido = (x, y) => zp && x >= zp.x0*w && x <= zp.x1*w && y >= zp.y0*h && y <= zp.y1*h;
  const claramenteFundo = (x, y, r, g, b) =>
    !protegido(x, y) && Math.min(r,g,b) > 190 && (Math.max(r,g,b) - Math.min(r,g,b)) < 20;

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
      const passa = dist(cr,cg,cb, nr,ng,nb) <= tolLocal || claramenteFundo(nx,ny, nr,ng,nb);
      if (passa) {
        estado[ni] = 1;
        corFundo[ni*3] = nr; corFundo[ni*3+1] = ng; corFundo[ni*3+2] = nb;
        fila.push(ni);
      }
    }
  }

  // Pixels de objeto que encostam no fundo: alfa suave + descontaminação.
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
// Borra só dentro de 'zona' (mesmo formato de 'zonaProtegida' — fração da
// imagem), em dois passes separáveis (horizontal depois vertical, mais
// barato que um kernel 2D cheio). Média ponderada por alfa, pra não puxar
// preto de pixel já transparente pra dentro do resultado.
function borrarZona(im, zona, raio) {
  const { larg: w, alt: h, px } = im;
  if (!zona || !raio) return im;
  const dentro = (x, y) => x >= zona.x0*w && x <= zona.x1*w && y >= zona.y0*h && y <= zona.y1*h;
  const passe = (origem, horizontal) => {
    const out = Buffer.from(origem);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y*w+x)*4;
      if (!dentro(x,y) || origem[i+3] === 0) continue;
      let r=0,g=0,b=0,a=0,pesoA=0,n=0;
      for (let k=-raio;k<=raio;k++) {
        const nx = horizontal ? x+k : x, ny = horizontal ? y : y+k;
        if (nx<0||ny<0||nx>=w||ny>=h) continue;
        const ni=(ny*w+nx)*4, al=origem[ni+3]/255;
        r+=origem[ni]*al; g+=origem[ni+1]*al; b+=origem[ni+2]*al; pesoA+=al; a+=origem[ni+3]; n++;
      }
      if (pesoA>0.01) { out[i]=Math.round(r/pesoA); out[i+1]=Math.round(g/pesoA); out[i+2]=Math.round(b/pesoA); }
      out[i+3]=Math.round(a/n);
    }
    return out;
  };
  im.px = passe(passe(px, true), false);
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
for (const [especie, arq, tolLocal, feather, zonaProtegida, raioBorraZona] of ESPECIES) {
  const bruto = decodificar(DIR + arq);
  let rec = recortarAlfa(manterMaiorIlha(removerFundo(bruto, tolLocal, feather, zonaProtegida)));
  rec = borrarZona(rec, zonaProtegida, raioBorraZona);
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
