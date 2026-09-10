/* Troca a folha do chão (FOLHA_CHAO) e o MAPA_CHAO no index.html pelos
   recém-gerados por montar-chao.js. */
const fs = require('fs');
const ALVO = 'C:/Users/PPCP/Documents/PROJETOS/reino-infinito/index.html';
const FERR = 'C:/Users/PPCP/Documents/PROJETOS/reino-infinito/ferramentas/';

let t = fs.readFileSync(ALVO, 'utf8');
const b64 = fs.readFileSync(FERR + 'chao.b64.txt', 'utf8').trim();
const mapa = fs.readFileSync(FERR + 'chao.mapa.txt', 'utf8').trim();

const ini = 'const FOLHA_CHAO = "data:image/png;base64,';
const i0 = t.indexOf(ini);
if (i0 < 0) { console.error('FOLHA_CHAO não encontrada'); process.exit(1); }
const i1 = t.indexOf('";', i0 + ini.length);
const antes = i1 - (i0 + ini.length);
t = t.slice(0, i0) + ini + b64 + t.slice(i1);

const re = /const MAPA_CHAO = \{[^}]*\};/;
if (!re.test(t)) { console.error('MAPA_CHAO não encontrado'); process.exit(1); }
t = t.replace(re, 'const MAPA_CHAO = ' + mapa + ';');

fs.writeFileSync(ALVO, t);
console.log('FOLHA_CHAO: ' + (antes / 1024).toFixed(0) + ' KB -> ' + (b64.length / 1024).toFixed(0) + ' KB de base64');
console.log('MAPA_CHAO = ' + mapa);
console.log('index.html: ' + (fs.statSync(ALVO).size / 1024).toFixed(0) + ' KB');
