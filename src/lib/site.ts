// Lê src/data/creator.ts, confere tudo e prepara os dados que os componentes usam.
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import creator from '../data/creator';
import { esquema, explicar, mensagemPadrao } from './schema';
import { FONTES, TEMAS, variavelDaFonte, type NomeTema } from './temas';
import { contraste, misturar, montarPaleta } from './cores';

class ProblemasNoConteudo extends Error {
  constructor(problemas: string[], onde = 'em src/data/creator.ts') {
    const lista = problemas.map((p, i) => `  ${i + 1}. ${p}`).join('\n');
    super(`\n\nEncontrei ${problemas.length} problema(s) ${onde}:\n\n${lista}\n\nCorrija e rode o build de novo.\n`);
    this.name = 'ProblemasNoConteudo';
  }
}

function validar() {
  const resultado = esquema.safeParse(creator, { error: mensagemPadrao });
  if (!resultado.success) throw new ProblemasNoConteudo(resultado.error.issues.map((i) => explicar(i.path, i.message)));
  return resultado.data;
}

export const c = validar();

/** Tudo o que muda de um tema para outro: cores (já conferidas), fontes e estilo dos títulos. */
export function visualDoTema(nome: NomeTema, cores: Partial<Record<'fundo' | 'texto' | 'destaque', string>> = {}) {
  const tema = TEMAS[nome];
  const { paleta, problemas } = montarPaleta({ fundo: tema.fundo, texto: tema.texto, destaque: tema.destaque, ...cores });
  const escuro = contraste(paleta.fundo, '#000000') < contraste(paleta.fundo, '#FFFFFF');
  // Bloco da campanha: preto por padrão (combina com Black Friday), ou a cor escolhida em campanha.cor.
  // Num tema escuro, ganha um pouco da cor de destaque para se separar da página.
  const fundoDaCampanha = c.campanha?.cor ?? (escuro ? misturar(paleta.destaque, paleta.fundo, 0.14) : '#111111');
  const textoDaCampanha = [paleta.fundo, paleta.texto, '#FFFFFF', '#000000'].find((cor) => contraste(cor, fundoDaCampanha) >= 4.5)!;
  // Texto secundário sobre a cor da campanha: o mais suave que ainda passe em 4,5:1.
  const suaveDaCampanha =
    [0.65, 0.75, 0.85, 1].map((peso) => misturar(textoDaCampanha, fundoDaCampanha, peso)).find((cor) => contraste(cor, fundoDaCampanha) >= 4.5) ??
    textoDaCampanha;
  return {
    nome,
    tema,
    paleta,
    escuro,
    campanha: {
      fundo: fundoDaCampanha,
      texto: textoDaCampanha,
      suave: suaveDaCampanha,
      linha: misturar(textoDaCampanha, fundoDaCampanha, 0.25),
    },
    topoNaCampanha: tema.topoNaCampanha && !!c.campanha?.mostrar,
    fontes: {
      titulo: { ...FONTES[tema.titulo], variavel: variavelDaFonte(tema.titulo) },
      corpo: { ...FONTES[tema.corpo], variavel: variavelDaFonte(tema.corpo) },
    },
    problemas,
  };
}
export type Visual = ReturnType<typeof visualDoTema>;

export const visual = visualDoTema(c.tema, c.cores);
if (visual.problemas.length) throw new ProblemasNoConteudo(visual.problemas.map((p) => explicar(['cores', p.campo], p.mensagem)));
export const { paleta, tema, fontes } = visual;

/** Endereço público do site. Sem `endereco` no creator.ts, usa o da Cloudflare Pages. */
export const endereco = (() => {
  if (c.endereco) return c.endereco.replace(/\/+$/, '');
  if (!process.env.CF_PAGES_URL) return '';
  // A Cloudflare informa o endereço da versão (abc123.projeto.pages.dev); o site fica em projeto.pages.dev.
  const url = new URL(process.env.CF_PAGES_URL);
  const partes = url.hostname.split('.');
  if (url.hostname.endsWith('.pages.dev') && partes.length === 4) url.hostname = partes.slice(1).join('.');
  return url.origin;
})();

// Modo "local": vídeos e capas em public/videos (vão junto com o site).
// Modo "r2": vídeos e capas no bucket do Cloudflare R2.
const baseDosVideos = c.modoDosVideos === 'r2' ? c.urlDosVideos.replace(/\/+$/, '') : '/videos';
export const urlDoArquivo = (arquivo: string) => `${baseDosVideos}/${arquivo}`;

export type Destino = 'whatsapp' | 'email' | 'instagram' | 'tiktok';
export function linkDeContato(destino: Destino, mensagem?: string) {
  const { whatsapp, email, instagram, tiktok } = c.contato;
  if (destino === 'whatsapp' && whatsapp)
    return `https://wa.me/${whatsapp.numero}?text=${encodeURIComponent(mensagem ?? whatsapp.mensagem)}`;
  if (destino === 'email' && email) return `mailto:${email}?subject=${encodeURIComponent('Conteúdo UGC')}`;
  if (destino === 'instagram' && instagram) return `https://www.instagram.com/${instagram}/`;
  if (destino === 'tiktok' && tiktok) return `https://www.tiktok.com/@${tiktok}`;
  return undefined;
}

// Vídeos da campanha aparecem só no bloco da campanha; o resto vai para a grade.
const normalizar = (s = '') => s.normalize('NFD').replace(/\p{M}/gu, '').trim().toLowerCase();
const campanhaLigada = c.campanha?.mostrar ? c.campanha : undefined;
const todosOsVideos = c.videos?.mostrar ? c.videos.lista.map((v, i) => ({ ...v, numero: i + 1 })) : [];
const daCampanha = (v: (typeof todosOsVideos)[number]) =>
  !!campanhaLigada && !!v.campanha && normalizar(v.campanha) === normalizar(campanhaLigada.nome);
export const videosDaCampanha = todosOsVideos.filter(daCampanha);
export const videosDaGrade = todosOsVideos.filter((v) => !daCampanha(v));
export type Video = (typeof todosOsVideos)[number];
/** Nichos dos vídeos, sem repetir, na ordem em que aparecem (ignora maiúsculas e acentos). */
const nichosUnicos = (videos: Video[]) => {
  const vistos = new Map<string, string>();
  for (const v of videos) if (v.nicho && !vistos.has(normalizar(v.nicho))) vistos.set(normalizar(v.nicho), v.nicho);
  return [...vistos.values()];
};
export const nichosDosVideos = nichosUnicos(todosOsVideos);
export const chaveDoNicho = (nicho = '') => normalizar(nicho).replace(/[^a-z0-9]+/g, '-');

const arquivosDosVideos = todosOsVideos.flatMap((v) => [
  { nome: v.arquivo, oQue: `o arquivo do vídeo ${v.numero}` },
  { nome: v.capa, oQue: `a capa do vídeo ${v.numero}` },
]);

// A Cloudflare Pages não publica arquivo com mais de 25 MB. Usamos 24 MB para ter folga.
const LIMITE_POR_ARQUIVO = 24 * 1024 * 1024;
const emMegas = (bytes: number) => (bytes / 1024 / 1024).toFixed(1).replace('.', ',');

function conferirPastaPublic() {
  if (!existsSync('public')) return;
  const grandes = readdirSync('public', { recursive: true, withFileTypes: true })
    .filter((f) => f.isFile())
    .map((f) => join(f.parentPath, f.name))
    .filter((caminho) => statSync(caminho).size > LIMITE_POR_ARQUIVO);
  if (grandes.length)
    throw new ProblemasNoConteudo(
      grandes.map((caminho) =>
        caminho.endsWith('.mp4')
          ? `Vídeos: "${caminho}" tem ${emMegas(statSync(caminho).size)} MB e passa do limite de 24 MB por arquivo da Cloudflare Pages. Rode "npm run comprimir" de novo (no modo local ele comprime para caber) ou corte o vídeo.`
          : `Arquivos: "${caminho}" tem ${emMegas(statSync(caminho).size)} MB e passa do limite de 24 MB por arquivo da Cloudflare Pages. Diminua o arquivo ou coloque um link para ele.`,
      ),
      'nos arquivos da pasta public',
    );
}

// Confere se cada vídeo e cada capa existem, para nunca publicar vídeo quebrado.
function conferirNaPasta() {
  const pasta = 'public/videos';
  const existentes = existsSync(pasta) ? readdirSync(pasta) : [];
  const problemas = arquivosDosVideos
    .filter((a) => !existentes.includes(a.nome))
    .map((a) => {
      // No Mac e no Windows "Video.mp4" e "video.mp4" são o mesmo arquivo; na Cloudflare, não.
      const parecido = existentes.find((e) => e.toLowerCase() === a.nome.toLowerCase());
      return parecido
        ? `Vídeos: ${a.oQue} está escrito "${a.nome}", mas o arquivo se chama "${parecido}". Deixe igual, com as mesmas maiúsculas e minúsculas.`
        : `Vídeos: não achei ${a.oQue} ("${a.nome}") na pasta public/videos. Coloque o original em videos-originais e rode "npm run comprimir", ou confira se o nome está igual.`;
    });
  if (problemas.length) throw new ProblemasNoConteudo(problemas);
}

async function conferirNoR2() {
  if (/SEU-BUCKET/i.test(baseDosVideos)) {
    console.warn('\n⚠️  A URL dos vídeos ainda é a de exemplo (urlDosVideos em src/data/creator.ts). Os vídeos não vão aparecer.\n');
    return;
  }
  let status: number[];
  try {
    status = await Promise.all(
      arquivosDosVideos.map((a) =>
        fetch(urlDoArquivo(a.nome), { method: 'HEAD', signal: AbortSignal.timeout(10_000) }).then((r) => r.status),
      ),
    );
  } catch {
    console.warn('\n⚠️  Não consegui conferir os vídeos no bucket R2 (sem internet ou URL errada). O site foi gerado mesmo assim.\n');
    return;
  }
  if (status.some((s) => s === 401 || s === 403))
    throw new ProblemasNoConteudo([
      'URL dos vídeos: o bucket respondeu "acesso negado". Confira se a URL está igual à do painel da Cloudflare e se o acesso público (Public Development URL) está ligado.',
    ]);
  const faltando = arquivosDosVideos.filter((_, i) => status[i] === 404);
  if (faltando.length)
    throw new ProblemasNoConteudo(
      faltando.map(
        (a) =>
          `Vídeos: não achei ${a.oQue} ("${a.nome}") no bucket R2. Arraste o arquivo da pasta videos-prontos para o bucket no painel da Cloudflare, ou confira se o nome está igual.`,
      ),
    );
}

conferirPastaPublic();
if (c.modoDosVideos === 'local') conferirNaPasta();
else await conferirNoR2();

export const linkPrincipal = linkDeContato(c.topo.botao.abre)!;

const resumir = (texto: string, limite: number) =>
  texto.length <= limite ? texto : texto.slice(0, texto.lastIndexOf(' ', limite - 1)).replace(/[,.;:]$/, '') + '…';
export const tituloDaPagina = c.seo.titulo || `${c.topo.nome} · Creator UGC · ${c.topo.nicho}`;
export const descricaoDaPagina = resumir(c.seo.descricao || c.topo.bio, 160);

/** 5511987654321 → +55 11 98765-4321 */
export function telefoneLegivel(digitos: string) {
  const br = digitos.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
  return br ? `+55 ${br[1]} ${br[2]}-${br[3]}` : `+${digitos}`;
}
