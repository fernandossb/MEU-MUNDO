/* Troca a folha e o manifesto de rochas no index.html pelos recém-gerados
   por extrair-rochas.js (mesma ideia de reembutir-arvores.js). */
const fs = require('fs');
const ALVO = 'C:/Users/PPCP/Documents/PROJETOS/reino-infinito/index.html';
const FERR = 'C:/Users/PPCP/Documents/PROJETOS/reino-infinito/ferramentas/';

let t = fs.readFileSync(ALVO, 'utf8');
const b64 = fs.readFileSync(FERR + 'rochas.b64.txt', 'utf8').trim();
const mapa = fs.readFileSync(FERR + 'rochas.json', 'utf8').trim();

const marcaIni = 'const FOLHA_PEDRAS = "data:image/png;base64,';
const i0 = t.indexOf(marcaIni);
if (i0 < 0) { console.error('FOLHA_PEDRAS não encontrada'); process.exit(1); }
const i1 = t.indexOf('";', i0 + marcaIni.length);
if (i1 < 0) { console.error('fim da folha não encontrado'); process.exit(1); }
t = t.slice(0, i0) + marcaIni + b64 + t.slice(i1);

const re = /const MAPA_PEDRAS = \{[^}]*\};/;
if (!re.test(t)) { console.error('MAPA_PEDRAS não encontrado'); process.exit(1); }
t = t.replace(re, 'const MAPA_PEDRAS = ' + mapa + ';');

fs.writeFileSync(ALVO, t);
console.log('folha e manifesto de rochas trocados (' + (b64.length / 1024).toFixed(0) + ' KB de base64)');
console.log('MAPA_PEDRAS = ' + mapa);
console.log('index.html: ' + (fs.statSync(ALVO).size / 1024).toFixed(0) + ' KB');
