/* Troca a folha da gente que já está no index.html pela recém-gerada. */
const fs = require('fs');
const ALVO = 'C:/Users/PPCP/Documents/PROJETOS/reino-infinito/index.html';
const FERR = 'C:/Users/PPCP/Documents/PROJETOS/reino-infinito/ferramentas/';

let t = fs.readFileSync(ALVO, 'utf8');
const b64 = fs.readFileSync(FERR + 'pessoas.b64.txt', 'utf8').trim();

const marcaIni = 'const FOLHA_PESSOAS = "data:image/png;base64,';
const i0 = t.indexOf(marcaIni);
if (i0 < 0) { console.error('FOLHA_PESSOAS não encontrada'); process.exit(1); }
const i1 = t.indexOf('";', i0 + marcaIni.length);
if (i1 < 0) { console.error('fim da folha não encontrado'); process.exit(1); }
const antes = i1 - (i0 + marcaIni.length);
t = t.slice(0, i0) + marcaIni + b64 + t.slice(i1);

fs.writeFileSync(ALVO, t);
console.log('folha da gente trocada: ' + (antes / 1024).toFixed(0) + ' KB -> ' + (b64.length / 1024).toFixed(0) + ' KB de base64');
console.log('index.html: ' + (fs.statSync(ALVO).size / 1024).toFixed(0) + ' KB');
