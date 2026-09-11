/* Troca a folha e o manifesto que já estão no index.html pelos recém-gerados. */
const fs = require('fs');
const ALVO = 'C:/Users/PPCP/Documents/PROJETOS/reino-infinito/index.html';
const FERR = 'C:/Users/PPCP/Documents/PROJETOS/reino-infinito/ferramentas/';

let t = fs.readFileSync(ALVO, 'utf8');
const b64 = fs.readFileSync(FERR + 'predios.b64.txt', 'utf8').trim();
const mapa = JSON.parse(fs.readFileSync(FERR + 'predios.json', 'utf8'));

/* --- a folha --- */
const marcaIni = 'const FOLHA_PREDIOS = "data:image/png;base64,';
const i0 = t.indexOf(marcaIni);
if (i0 < 0) { console.error('FOLHA_PREDIOS não encontrada'); process.exit(1); }
const i1 = t.indexOf('";', i0 + marcaIni.length);
if (i1 < 0) { console.error('fim da folha não encontrado'); process.exit(1); }
t = t.slice(0, i0) + marcaIni + b64 + t.slice(i1);

/* --- o manifesto --- */
// 'centro' tem folha PRÓPRIA (FOLHA_CENTRO/imgCentro — ver reembutir-centro.js)
// e não tem nada a ver com a folha grande daqui. O predios.json às vezes
// carrega uma entrada 'centro' vestigial (de antes do castelo ganhar folha
// separada); se ela entrasse na troca, sobrescrevia as coordenadas corretas
// com coordenadas da folha ERRADA — o castelo sumia (drawImage recortando
// fora dos limites de imgCentro). Preserva o que já está no arquivo.
const centroAtual = t.match(/\n(\s*centro:\s*\[\[[^\]]*\]\],)/);
const linhas = Object.keys(mapa)
  .filter(k => k !== 'centro')
  .map(k => '  ' + k + ': ' + JSON.stringify(mapa[k]) + ',').join('\n');
const j0 = t.indexOf('const MAPA_PREDIOS = {');
const j1 = t.indexOf('\n};', j0);
if (j0 < 0 || j1 < 0) { console.error('MAPA_PREDIOS não encontrado'); process.exit(1); }
const linhaCentro = centroAtual ? centroAtual[1] : '';
if (!centroAtual) console.warn('aviso: linha "centro:" não encontrada no arquivo atual — MAPA_PREDIOS.centro vai ficar de fora');
t = t.slice(0, j0) + 'const MAPA_PREDIOS = {\n' + linhaCentro + '\n' + linhas + t.slice(j1);

fs.writeFileSync(ALVO, t);
console.log('folha e manifesto trocados (' + (b64.length / 1024).toFixed(0) + ' KB de base64)');
console.log('index.html: ' + (fs.statSync(ALVO).size / 1024).toFixed(0) + ' KB');
for (const k in mapa) console.log('  ' + k.padEnd(15) + mapa[k].map(q => q[4] + 'x' + q[5]).join('  '));
