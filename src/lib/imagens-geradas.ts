// Gera no build a imagem de compartilhamento (prévia do link no WhatsApp) e o ícone da aba,
// a partir da foto, do nome e das cores do tema.
import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import creator from '../data/creator';
import { caminhoDaImagem } from './schema';
import { c, fontes, paleta, tema } from './site';

type No = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (No | string)[]): No => ({
  type,
  props: { style, children },
});

const pacote = (nome: string) => nome.toLowerCase().replaceAll(' ', '-');
const arquivoDaFonte = (nome: string, peso: number, estilo: 'normal' | 'italic') =>
  readFile(join(process.cwd(), 'node_modules/@fontsource', pacote(nome), 'files', `${pacote(nome)}-latin-${peso}-${estilo}.woff`));

async function carregarFontes() {
  const { titulo, corpo } = fontes;
  const lista = [
    { name: 'Titulo', data: await arquivoDaFonte(titulo.nome, titulo.pesos[0], 'normal'), weight: 400, style: 'normal' },
    { name: 'Corpo', data: await arquivoDaFonte(corpo.nome, 400, 'normal'), weight: 400, style: 'normal' },
    { name: 'Corpo', data: await arquivoDaFonte(corpo.nome, 600, 'normal'), weight: 600, style: 'normal' },
  ];
  if (titulo.italico) lista.push({ name: 'Titulo', data: await arquivoDaFonte(titulo.nome, titulo.pesos[0], 'italic'), weight: 400, style: 'italic' });
  return lista as Parameters<typeof satori>[1]['fonts'];
}

const estiloDoTitulo = { fontFamily: 'Titulo', textTransform: tema.caixa, letterSpacing: tema.espacamento };

export async function imagemDeCompartilhamento() {
  const foto = await sharp(join(process.cwd(), caminhoDaImagem(creator.topo.foto)!.slice(1)))
    .resize(456, 570, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 85 })
    .toBuffer();
  const [primeiro, ...resto] = c.topo.nome.trim().split(/\s+/);
  const letras = Math.max(...c.topo.nome.split(/\s+/).map((p) => p.length), 4);
  const tamanho = Math.min(132 * Math.min(tema.escala, 1), Math.floor(600 / (letras * tema.letra)));

  const svg = await satori(
    h(
      'div',
      { width: 1200, height: 630, display: 'flex', background: paleta.fundo, color: paleta.texto },
      h(
        'div',
        { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 690, padding: '64px 0 64px 72px' },
        h('div', { fontFamily: 'Corpo', fontWeight: 600, fontSize: 22, letterSpacing: 4 }, 'PORTFÓLIO UGC'),
        h(
          'div',
          { display: 'flex', flexDirection: 'column', ...estiloDoTitulo, fontSize: tamanho, lineHeight: 0.92 },
          h('div', {}, primeiro),
          ...(resto.length
            ? [h('div', { color: paleta.destaque, fontStyle: fontes.titulo.italico ? 'italic' : 'normal' }, resto.join(' '))]
            : []),
        ),
        h('div', { fontFamily: 'Corpo', fontSize: 30, color: paleta.suave }, c.topo.nicho),
      ),
      h(
        'div',
        { display: 'flex', position: 'relative', width: 510, height: 630 },
        h('div', { position: 'absolute', top: 54, left: 30, width: 456, height: 570, background: paleta.destaque }),
        {
          type: 'img',
          props: {
            src: `data:image/jpeg;base64,${foto.toString('base64')}`,
            width: 456,
            height: 570,
            style: { position: 'absolute', top: 30, left: 6 },
          },
        },
      ),
    ),
    { width: 1200, height: 630, fonts: await carregarFontes() },
  );
  return sharp(Buffer.from(svg)).png().toBuffer();
}

export async function icone(tamanho: number, arredondado: boolean) {
  const inicial = c.topo.nome.trim().charAt(0).toUpperCase();
  return satori(
    h(
      'div',
      {
        width: tamanho,
        height: tamanho,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: paleta.destaque,
        color: paleta.noDestaque,
        borderRadius: arredondado ? tamanho * 0.22 : 0,
        ...estiloDoTitulo,
        fontSize: tamanho * 0.72,
        lineHeight: 1,
      },
      inicial,
    ),
    { width: tamanho, height: tamanho, fonts: await carregarFontes() },
  );
}
