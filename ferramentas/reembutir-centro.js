/* Troca a arte do castelo (FOLHA_CENTRO) e a entrada 'centro' de
   MAPA_PREDIOS no index.html pela recém-gerada por montar-centro.js. */
const fs = require('fs');
const ALVO = 'C:/Users/PPCP/Documents/PROJETOS/reino-infinito/index.html';
const FERR = 'C:/Users/PPCP/Documents/PROJETOS/reino-infinito/ferramentas/';

let t = fs.readFileSync(ALVO, 'utf8');
const b64 = fs.readFileSync(FERR + 'centro.b64.txt', 'utf8').trim();
const mapa = fs.readFileSync(FERR + 'centro.mapa.txt', 'utf8').trim();   // "[[0, 0, W, H, dw, dh]]"

// --- 1. FOLHA_CENTRO ---
const ini = 'const FOLHA_CENTRO = "data:image/png;base64,';
const i0 = t.indexOf(ini);
if (i0 < 0) { console.error('FOLHA_CENTRO não encontrada'); process.exit(1); }
const i1 = t.indexOf('";', i0 + ini.length);
if (i1 < 0) { console.error('fim da FOLHA_CENTRO não encontrado'); process.exit(1); }
const antes = i1 - (i0 + ini.length);
t = t.slice(0, i0) + ini + b64 + t.slice(i1);

// --- 2. MAPA_PREDIOS.centro ---
const re = /(\n\s*centro:\s*)\[\[[^\]]*\]\](,)/;
if (!re.test(t)) { console.error('linha centro: de MAPA_PREDIOS não encontrada'); process.exit(1); }
t = t.replace(re, `$1${mapa}$2`);

fs.writeFileSync(ALVO, t);
console.log('FOLHA_CENTRO: ' + (antes / 1024).toFixed(0) + ' KB -> ' + (b64.length / 1024).toFixed(0) + ' KB de base64');
console.log('MAPA_PREDIOS.centro = ' + mapa);
console.log('index.html: ' + (fs.statSync(ALVO).size / 1024).toFixed(0) + ' KB');
