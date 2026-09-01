/* PNG puro em Node: só zlib. Decodifica RGBA8 não entrelaçado e codifica de volta. */
const zlib = require('zlib');

function crc32(buf) {
  let tabela = crc32.tabela;
  if (!tabela) {
    tabela = crc32.tabela = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      tabela[n] = c;
    }
  }
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = tabela[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function decodificar(arquivo) {
  const fs = require('fs');
  const b = fs.readFileSync(arquivo);
  const larg = b.readUInt32BE(16), alt = b.readUInt32BE(20);
  const bits = b[24], tipoCor = b[25], entrelace = b[28];
  if (bits !== 8 || tipoCor !== 6 || entrelace !== 0) throw new Error('esperado RGBA8 simples: ' + arquivo);

  const pedacos = [];
  let off = 8;
  while (off < b.length) {
    const len = b.readUInt32BE(off);
    const tipo = b.toString('ascii', off + 4, off + 8);
    if (tipo === 'IDAT') pedacos.push(b.subarray(off + 8, off + 8 + len));
    if (tipo === 'IEND') break;
    off += 12 + len;
  }
  const cru = zlib.inflateSync(Buffer.concat(pedacos));

  const bpp = 4, passo = larg * bpp;
  const px = Buffer.alloc(alt * passo);
  let p = 0;
  for (let y = 0; y < alt; y++) {
    const filtro = cru[p++];
    const linha = cru.subarray(p, p + passo); p += passo;
    const dest = px.subarray(y * passo, (y + 1) * passo);
    const acima = y > 0 ? px.subarray((y - 1) * passo, y * passo) : null;
    for (let x = 0; x < passo; x++) {
      const a = x >= bpp ? dest[x - bpp] : 0;
      const c = acima ? acima[x] : 0;
      const d = acima && x >= bpp ? acima[x - bpp] : 0;
      let v = linha[x];
      if (filtro === 1) v += a;
      else if (filtro === 2) v += c;
      else if (filtro === 3) v += (a + c) >> 1;
      else if (filtro === 4) {
        const pp = a + c - d, pa = Math.abs(pp - a), pb = Math.abs(pp - c), pc = Math.abs(pp - d);
        v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? c : d);
      }
      dest[x] = v & 0xff;
    }
  }
  return { larg, alt, px };
}

function codificar(larg, alt, px) {
  const passo = larg * 4, bpp = 4;
  const cru = Buffer.alloc(alt * (passo + 1));
  // Filtro adaptativo: para cada linha testa os cinco filtros do PNG e fica com
  // o de menor soma absoluta. Sem isto (filtro 0 em tudo) a folha dos prédios
  // saía quase o dobro do tamanho — é a maior economia que existe aqui.
  const tent = [Buffer.alloc(passo), Buffer.alloc(passo), Buffer.alloc(passo),
                Buffer.alloc(passo), Buffer.alloc(passo)];
  for (let y = 0; y < alt; y++) {
    const lin = px.subarray(y * passo, (y + 1) * passo);
    const cima = y > 0 ? px.subarray((y - 1) * passo, y * passo) : null;
    for (let x = 0; x < passo; x++) {
      const a = x >= bpp ? lin[x - bpp] : 0;
      const c = cima ? cima[x] : 0;
      const d = cima && x >= bpp ? cima[x - bpp] : 0;
      const v = lin[x];
      tent[0][x] = v;
      tent[1][x] = (v - a) & 255;
      tent[2][x] = (v - c) & 255;
      tent[3][x] = (v - ((a + c) >> 1)) & 255;
      const p = a + c - d, pa = Math.abs(p - a), pb = Math.abs(p - c), pc = Math.abs(p - d);
      const pred = (pa <= pb && pa <= pc) ? a : (pb <= pc ? c : d);
      tent[4][x] = (v - pred) & 255;
    }
    let melhor = 0, menor = Infinity;
    for (let f = 0; f < 5; f++) {
      let soma = 0;
      for (let x = 0; x < passo; x++) { const b = tent[f][x]; soma += b < 128 ? b : 256 - b; }
      if (soma < menor) { menor = soma; melhor = f; }
    }
    cru[y * (passo + 1)] = melhor;
    tent[melhor].copy(cru, y * (passo + 1) + 1);
  }
  const pedaco = (tipo, dados) => {
    const c = Buffer.alloc(8 + dados.length + 4);
    c.writeUInt32BE(dados.length, 0);
    c.write(tipo, 4, 'ascii');
    dados.copy(c, 8);
    c.writeUInt32BE(crc32(Buffer.concat([Buffer.from(tipo, 'ascii'), dados])), 8 + dados.length);
    return c;
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(larg, 0); ihdr.writeUInt32BE(alt, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pedaco('IHDR', ihdr),
    pedaco('IDAT', zlib.deflateSync(cru, { level: 9 })),
    pedaco('IEND', Buffer.alloc(0)),
  ]);
}

module.exports = { decodificar, codificar };
