const http = require('http'), fs = require('fs'), path = require('path');
const raiz = __dirname;
const tipos = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.json':'application/json' };
http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]);
  const arq = path.join(raiz, rel === '/' ? 'index.html' : rel);
  if (!arq.startsWith(path.normalize(raiz))) { res.writeHead(403).end(); return; }
  fs.readFile(arq, (e, d) => {
    if (e) { res.writeHead(404).end('nao encontrado'); return; }
    res.writeHead(200, { 'Content-Type': tipos[path.extname(arq)] || 'application/octet-stream' });
    res.end(d);
  });
}).listen(8123, () => console.log('servindo em http://localhost:8123'));
