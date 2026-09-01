# Ferramentas da arte

Reconstroem a folha de sprites dos prédios a partir dos PNGs originais. Só
precisam do Node — nenhuma biblioteca, nenhuma instalação.

## Trocar ou acrescentar a arte de um prédio

1. Ponha o PNG novo na pasta dos originais (RGBA de 8 bits, não entrelaçado).
2. Aponte o nome dele em `LOTE`, dentro de `montar-predios.js`. Um prédio pode
   ter várias artes: é só passar uma lista, como a Casa.
3. Rode:

```bash
cd ferramentas && DEGRAU=8 node montar-predios.js
```

Saem três arquivos: `predios.png` (para conferir a olho), `predios.b64.txt` e
`predios.json`. Os dois últimos entram no `index.html`, no lugar de
`FOLHA_PREDIOS` e `MAPA_PREDIOS`.

## O que os números fazem

| Ajuste | Efeito |
|---|---|
| `ESCALA` | resolução guardada, em múltiplos do tamanho de tela. 2,2 aguenta o zoom máximo; abaixo de 2 começa a borrar |
| `DEGRAU` | arredonda a cor. 8 corta quase metade do arquivo sem diferença visível em arte chapada; 1 desliga |
| `ALTURA_MAX` | quantas vezes a profundidade do lote um prédio pode ter de altura |

A largura desenhada é sempre a largura do lote, cravada — é o que impede o
prédio de invadir a rua. Não mexa nisso sem querer.

## Sobre o `png.js`

Decodificador e codificador de PNG em Node puro, só com o `zlib`. Codifica com
filtro adaptativo (testa os cinco filtros por linha), que é de onde vem a maior
parte da compressão.
