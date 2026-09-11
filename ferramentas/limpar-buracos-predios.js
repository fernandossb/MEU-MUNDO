/*
   "As manchas brancas de fundo que ainda estão nos prédios que têm áreas
   vazadas" — pedido do usuário. Achado: o recorte de fundo de uma leva
   anterior (não desta sessão) só andava a partir da BORDA de cada sprite
   pra dentro; um vão FECHADO — o vão embaixo da barraca de mercado, o vão
   embaixo do beiral de uma pousada — nunca tinha caminho até a borda pra
   ser alcançado, e sobrava com o fundo branco/cinza-claro original,
   opaco.

   Este script não parte de foto nenhuma: ele varre CADA sprite JÁ PRONTO
   (predios.png) e acha, dentro de cada recorte, qualquer ilha de pixel
   bem claro E pouco saturado (não é cor de parede/telha/madeira — é
   sobra de fundo de estúdio) que NÃO encosta na borda do próprio
   recorte — ou seja, um vão fechado. Só then: apaga (alfa 0) e
   descontamina a franja ao redor, mesma técnica de 'extrair-arvores.js'
   /'extrair-rochas.js' desta sessão.
*/
const fs = require('fs');
const { decodificar, codificar } = require('./png.js');

const ALVO_PNG = 'predios.png';
const ALVO_JSON = 'predios.json';

const im = decodificar(ALVO_PNG);
const mapa = JSON.parse(fs.readFileSync(ALVO_JSON, 'utf8'));

const claro = (r, g, b, a) => a > 200 && r > 225 && g > 225 && b > 225 && (Math.max(r, g, b) - Math.min(r, g, b)) < 12;
const dist = (r1,g1,b1,r2,g2,b2) => Math.sqrt((r1-r2)**2+(g1-g2)**2+(b1-b2)**2);

function limparRecorte(x0, y0, w, h) {
  const idx = (x, y) => ((y0 + y) * im.larg + (x0 + x)) * 4;
  const at = (x, y) => { const i = idx(x, y); return [im.px[i], im.px[i+1], im.px[i+2], im.px[i+3]]; };

  const visitado = new Uint8Array(w * h);
  const buraco = new Uint8Array(w * h); // 1 = vira transparente
  let nBuracos = 0, pxBuracos = 0;

  for (let ini = 0; ini < w * h; ini++) {
    if (visitado[ini]) continue;
    const ix = ini % w, iy = (ini / w) | 0;
    const [r, g, b, a] = at(ix, iy);
    if (!claro(r, g, b, a)) { visitado[ini] = 1; continue; }
    const fila = [ini]; visitado[ini] = 1;
    let tocaBorda = false; const pixels = [];
    for (let c = 0; c < fila.length; c++) {
      const i = fila[c], x = i % w, y = (i / w) | 0;
      pixels.push(i);
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) tocaBorda = true;
      for (const [nx, ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]) {
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const ni = ny * w + nx; if (visitado[ni]) continue;
        const [nr, ng, nb, na] = at(nx, ny);
        if (claro(nr, ng, nb, na)) { visitado[ni] = 1; fila.push(ni); }
        else visitado[ni] = 1;
      }
    }
    if (!tocaBorda && pixels.length >= 6) {
      for (const p of pixels) buraco[p] = 1;
      nBuracos++; pxBuracos += pixels.length;
    }
  }
  if (!nBuracos) return { nBuracos: 0, pxBuracos: 0 };

  // Referência de cor do fundo: a média dos pixels do maior buraco achado
  // (todos são a mesma foto de estúdio, a cor é praticamente igual).
  let sr=0,sg=0,sb=0,n=0;
  for (let i=0;i<w*h;i++) if (buraco[i]) { const x=i%w,y=(i/w)|0; const [r,g,b]=at(x,y); sr+=r;sg+=g;sb+=b;n++; }
  const ref = [sr/n, sg/n, sb/n];

  // Apaga os buracos.
  for (let i = 0; i < w*h; i++) {
    if (!buraco[i]) continue;
    const x = i%w, y=(i/w)|0, di = idx(x,y);
    im.px[di+3] = 0;
  }

  // Descontamina a franja: pixel opaco vizinho de um buraco, alfa suave +
  // remove a mistura com o branco que sobrava.
  const FEATHER = 40;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y*w+x;
    if (buraco[i]) continue;
    let vizinhoBuraco = false;
    for (const [nx,ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]) {
      if (nx<0||ny<0||nx>=w||ny>=h) continue;
      if (buraco[ny*w+nx]) { vizinhoBuraco = true; break; }
    }
    if (!vizinhoBuraco) continue;
    const di = idx(x,y);
    const d = dist(im.px[di],im.px[di+1],im.px[di+2], ref[0],ref[1],ref[2]);
    if (d >= FEATHER) continue;
    const a = Math.max(0, Math.min(1, d / FEATHER));
    if (a < 1) {
      for (let c = 0; c < 3; c++) {
        const obs = im.px[di+c];
        const puro = a > 0.02 ? (obs - (1-a)*ref[c]) / a : obs;
        im.px[di+c] = Math.max(0, Math.min(255, Math.round(puro)));
      }
    }
    im.px[di+3] = Math.round((im.px[di+3]/255) * a * 255);
  }

  return { nBuracos, pxBuracos };
}

let totalVariantes = 0, totalBuracos = 0, totalPx = 0;
for (const chave of Object.keys(mapa)) {
  mapa[chave].forEach(([x, y, w, h], i) => {
    const r = limparRecorte(x, y, w, h);
    if (r.nBuracos) {
      console.log(chave + '[' + i + ']: ' + r.nBuracos + ' buraco(s) limpo(s), ' + r.pxBuracos + 'px');
      totalVariantes++;
    }
    totalBuracos += r.nBuracos; totalPx += r.pxBuracos;
  });
}
console.log('\n' + totalVariantes + ' variantes corrigidas, ' + totalBuracos + ' buracos, ' + totalPx + 'px no total');

const png = codificar(im.larg, im.alt, im.px);
fs.writeFileSync(ALVO_PNG, png);
fs.writeFileSync('predios.b64.txt', png.toString('base64'));
console.log('predios.png: ' + (png.length/1024/1024).toFixed(1) + ' MB');
