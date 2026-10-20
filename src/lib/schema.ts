// Regras do arquivo src/data/creator.ts. Tudo o que estiver errado lá vira uma mensagem
// em português no build, dizendo onde está o problema e como resolver.
import { z } from 'astro/zod';
import type { ImageMetadata } from 'astro';
import { existsSync } from 'node:fs';
import { TEMAS } from './temas';

// ── Imagens da pasta src/imagens (procuradas pelo nome, sem diferenciar maiúsculas) ──
const arquivosDeImagem = import.meta.glob<{ default: ImageMetadata }>(
  '/src/imagens/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);
const imagens = new Map(
  Object.entries(arquivosDeImagem).map(([caminho, modulo]) => [caminho.replace('/src/imagens/', '').toLowerCase(), modulo.default]),
);
/** Caminho do arquivo no projeto (ex.: /src/imagens/foto.jpg), para quem precisa ler o arquivo. */
export const caminhoDaImagem = (nome: string) =>
  Object.keys(arquivosDeImagem).find((caminho) => caminho.replace('/src/imagens/', '').toLowerCase() === nome.toLowerCase());
const listaDeImagens = () =>
  imagens.size ? `Arquivos que estão lá: ${[...imagens.keys()].join(', ')}.` : 'A pasta está vazia.';

// ── Peças reutilizáveis ──
// As mensagens com {item} viram, por exemplo, "vídeo 3".
const erro = (faltou: string, errado = faltou) => ({
  error: (iss: { input?: unknown }) => (iss.input === undefined ? faltou : errado),
});
const texto = (faltou: string) =>
  z.string(erro(faltou, `${faltou.replace(/^faltou /, '')} precisa ser um texto entre aspas`)).trim().min(1, { error: faltou, abort: true });
const opcional = z.string(erro('', 'precisa ser um texto entre aspas')).trim().optional();
const sim = (padrao: boolean) => z.boolean(erro('', 'use true (sim) ou false (não), sem aspas')).default(padrao);
const nomeDeArquivo = /^[a-z0-9][a-z0-9._-]*$/i;

const imagem = (oQue: string) =>
  texto(`faltou o nome do arquivo ${oQue}`).transform((nome, ctx) => {
    const encontrada = imagens.get(nome.toLowerCase());
    if (!encontrada) {
      ctx.issues.push({ code: 'custom', input: nome, message: `não achei o arquivo "${nome}" na pasta src/imagens. ${listaDeImagens()}` });
      return z.NEVER;
    }
    return encontrada;
  });

const cor = z
  .string(erro('', 'a cor precisa estar entre aspas, ex.: "#C2361B"'))
  .trim()
  .regex(/^#[0-9a-f]{6}$/i, { error: 'use uma cor no formato #RRGGBB, por exemplo "#C2361B"' })
  .optional();

const perfil = (rede: string, exemplo: string) =>
  opcional.transform((valor, ctx) => {
    if (!valor) return undefined;
    const usuario = valor.replace(/^https?:\/\/[^/]+\//i, '').replace(/^@/, '').replace(/[/?#].*$/, '');
    if (!/^[\w.]+$/.test(usuario)) {
      ctx.issues.push({ code: 'custom', input: valor, message: `o ${rede} parece errado. Use só o perfil, ex.: "${exemplo}"` });
      return z.NEVER;
    }
    return usuario;
  });

const whatsapp = z.strictObject({
  numero: texto('faltou o número do WhatsApp').transform((valor, ctx) => {
    const digitos = valor.replace(/\D/g, '');
    if (digitos.length === 10 || digitos.length === 11)
      ctx.issues.push({ code: 'custom', input: valor, message: `faltou o 55 do Brasil no começo do WhatsApp. Ficaria assim: "55${digitos}"` });
    else if (digitos.length < 12 || digitos.length > 15)
      ctx.issues.push({ code: 'custom', input: valor, message: 'o WhatsApp precisa ter 55 + DDD + número, ex.: "5511987654321"' });
    return digitos;
  }),
  mensagem: z.string().trim().default('Oi! Vi seu portfólio e quero conversar sobre um conteúdo UGC.'),
});

const secao = <T extends z.ZodRawShape>(titulo: string, campos: T) =>
  z.strictObject({ mostrar: sim(true), titulo: z.string().trim().default(titulo), ...campos }).optional();

const video = z
  .strictObject({
    arquivo: texto('faltou o nome do arquivo do {item}').regex(/^[a-z0-9][a-z0-9._-]*\.mp4$/i, {
      error: 'o arquivo do {item} precisa terminar em .mp4 e não pode ter espaço nem acento (use o nome que o "npm run comprimir" gerou, ex.: "rotina-skincare.mp4")',
    }),
    capa: z
      .string()
      .trim()
      .regex(/^[a-z0-9][a-z0-9._-]*\.(jpg|jpeg|png|webp)$/i, { error: 'a capa do {item} precisa ser .jpg, sem espaço nem acento' })
      .optional(),
    marca: texto('faltou a marca ou o produto do {item}'),
    formato: texto('faltou o formato do {item} (ex.: "Unboxing", "Review", "Tutorial")'),
    duracao: texto('faltou a duração do {item} (ex.: "0:32")').regex(/^\d{1,2}:[0-5]\d$/, {
      error: 'a duração do {item} precisa ser minutos:segundos, ex.: "0:32"',
    }),
    autoral: z.boolean(
      erro(
        'faltou dizer se o {item} é autoral: true = gravado por conta própria, sem contrato; false = trabalho feito para a marca',
        'o campo "autoral" do {item} precisa ser true ou false, sem aspas',
      ),
    ),
    nicho: opcional,
    campanha: opcional,
  })
  .transform((v) => ({ ...v, capa: v.capa || v.arquivo.replace(/\.mp4$/i, '.jpg') }));

// ── O arquivo inteiro ──
export const esquema = z
  .strictObject({
    modoExemplo: sim(false),
    endereco: z
      .string()
      .trim()
      .regex(/^(https:\/\/[^\s/]+\.[^\s/]+\/?)?$/, { error: 'o endereço do site precisa começar com https://, ex.: "https://meuportfolio.pages.dev"' })
      .default(''),
    modoDosVideos: z.enum(['local', 'r2'], { error: 'o modo dos vídeos precisa ser "local" ou "r2"' }).default('local'),
    urlDosVideos: z.string(erro('', 'a URL dos vídeos precisa estar entre aspas')).trim().default(''),
    tema: z.enum(Object.keys(TEMAS) as [keyof typeof TEMAS], {
      error: `o tema precisa ser um destes: ${Object.keys(TEMAS).map((t) => `"${t}"`).join(', ')}`,
    }),
    cores: z.strictObject({ fundo: cor, texto: cor, destaque: cor }).default({}),

    topo: z.strictObject({
      nome: texto('faltou o seu nome'),
      foto: imagem('da foto'),
      fotoDescricao: texto('faltou descrever a foto em poucas palavras (é lida em voz alta para pessoas cegas)'),
      nicho: texto('faltou o nicho em uma linha (ex.: "Skincare, casa e rotina")'),
      bio: texto('faltou a bio curta'),
      botao: z
        .strictObject({
          texto: z.string().trim().default('Quero um orçamento'),
          abre: z.enum(['whatsapp', 'email', 'instagram'], { error: 'o botão pode abrir "whatsapp", "email" ou "instagram"' }).default('whatsapp'),
        })
        .prefault({}),
    }),

    videos: secao('Vídeos', {
      texto: opcional,
      previaAutomatica: sim(true),
      lista: z.array(video, erro('', 'a lista de vídeos precisa estar entre colchetes [ ]')).default([]),
    }),

    campanha: z
      .strictObject({
        mostrar: sim(true),
        nome: texto('faltou o nome da campanha (ex.: "Black Friday")'),
        chamada: texto('faltou a chamada da campanha (ex.: "Agenda aberta para Black Friday")'),
        texto: opcional,
        botao: z.string().trim().default('Reservar minha data'),
        mensagemWhatsapp: opcional,
        cor,
      })
      .optional(),

    diferenciais: secao('Por que trabalhar comigo', {
      lista: z
        .array(z.strictObject({ titulo: texto('faltou o título do {item}'), texto: texto('faltou o texto do {item}') }))
        .max(5, { error: 'coloque no máximo 5 diferenciais' })
        .refine((l) => l.length === 0 || l.length >= 3, { error: 'coloque de 3 a 5 diferenciais' })
        .default([]),
    }),

    marcas: secao('Marcas com quem já trabalhei', {
      lista: z.array(z.strictObject({ nome: texto('faltou o nome da {item}'), logo: imagem('do logo').optional() })).default([]),
    }),

    resultados: secao('Resultados', {
      numeros: z.array(z.strictObject({ valor: texto('faltou o valor do {item} (ex.: "1,2 mi")'), legenda: texto('faltou a legenda do {item}') })).default([]),
      prints: z.array(z.strictObject({ imagem: imagem('do print'), legenda: texto('faltou a legenda do {item}') })).default([]),
      depoimentos: z
        .array(z.strictObject({ texto: texto('faltou o texto do {item}'), autor: texto('faltou quem disse o {item}'), marca: opcional }))
        .default([]),
    }),

    comoTrabalho: secao('Como eu trabalho', {
      prazo: opcional,
      incluso: z.array(texto('o {item} está vazio')).default([]),
      direitosDeUso: opcional,
      observacao: opcional,
    }),

    valores: secao('Pacotes e valores', {
      texto: opcional,
      pacotes: z
        .array(
          z.strictObject({
            nome: texto('faltou o nome do {item}'),
            detalhe: opcional,
            preco: opcional,
            descricao: opcional,
            etiqueta: opcional,
          }),
        )
        .default([]),
      avulsos: z
        .array(z.strictObject({ nome: texto('faltou o nome do {item}'), preco: texto('faltou o preço do {item}') }))
        .default([]),
      botao: z.string().trim().default('Quero este pacote'),
      observacao: opcional,
    }),

    contato: z.strictObject({
      titulo: z.string().trim().default('Vamos criar juntos?'),
      texto: opcional,
      whatsapp: whatsapp.optional(),
      email: z
        .union([z.literal(''), z.email({ error: 'o e-mail parece errado (ex.: "nome@gmail.com")' })], erro('', 'o e-mail parece errado'))
        .optional(),
      instagram: perfil('Instagram', '@seuperfil'),
      tiktok: perfil('TikTok', '@seuperfil'),
      midiaKit: opcional.refine((v) => !v || /^https:\/\//.test(v) || existsSync(`public/${v}`), {
        error: 'o mídia kit precisa ser um link https:// ou um arquivo que esteja na pasta public (ex.: "midia-kit.pdf")',
      }),
    }),

    seo: z.strictObject({ titulo: opcional, descricao: opcional }).default({}),
  })
  .superRefine((c, ctx) => {
    if (c.modoDosVideos === 'r2' && !/^https:\/\/\S+$/.test(c.urlDosVideos))
      ctx.addIssue({
        code: 'custom',
        path: ['urlDosVideos'],
        message: c.urlDosVideos
          ? 'a URL dos vídeos precisa começar com https://, ex.: "https://pub-1234abcd.r2.dev"'
          : 'no modo "r2" é preciso preencher a URL do bucket, ex.: "https://pub-1234abcd.r2.dev"',
      });
    const destino = c.topo.botao.abre;
    if (!c.contato[destino])
      ctx.addIssue({ code: 'custom', path: ['topo', 'botao', 'abre'], message: `o botão abre o ${destino}, mas ele não foi preenchido em Contato` });
    if (!c.contato.whatsapp && !c.contato.email && !c.contato.instagram && !c.contato.tiktok)
      ctx.addIssue({ code: 'custom', path: ['contato'], message: 'preencha pelo menos uma forma de contato (WhatsApp, e-mail, Instagram ou TikTok)' });
  });

/** Usado em src/data/creator.ts: só dá o autocompletar e a checagem de tipos. */
export const defineCreator = (conteudo: z.input<typeof esquema>) => conteudo;
export type Conteudo = z.output<typeof esquema>;

// ── Mensagens de erro em português ──
const SECOES: Record<string, string> = {
  modoExemplo: 'Modo exemplo', endereco: 'Endereço do site', modoDosVideos: 'Modo dos vídeos', urlDosVideos: 'URL dos vídeos',
  tema: 'Tema', cores: 'Cores',
  topo: 'Topo', videos: 'Vídeos', campanha: 'Campanha', diferenciais: 'Diferenciais', marcas: 'Marcas',
  resultados: 'Resultados', comoTrabalho: 'Como trabalho', valores: 'Valores', contato: 'Contato', seo: 'SEO',
};
const ITENS: Record<string, string> = {
  'videos.lista': 'vídeo', 'diferenciais.lista': 'diferencial', 'marcas.lista': 'marca',
  'resultados.numeros': 'número', 'resultados.prints': 'print', 'resultados.depoimentos': 'depoimento',
  'comoTrabalho.incluso': 'item do "incluso"', 'valores.pacotes': 'pacote', 'valores.avulsos': 'item avulso',
};
const TIPOS: Record<string, string> = {
  string: 'um texto entre aspas', boolean: 'true ou false, sem aspas', array: 'uma lista entre colchetes [ ]',
  object: 'um bloco entre chaves { }', number: 'um número',
};

/** Mensagem genérica para o que não tem mensagem própria no esquema. */
export function mensagemPadrao(iss: z.core.$ZodRawIssue): string | undefined {
  switch (iss.code) {
    case 'invalid_type':
      return iss.input === undefined ? 'faltou preencher' : `está no formato errado (esperava ${TIPOS[iss.expected] ?? iss.expected})`;
    case 'unrecognized_keys':
      return `não conheço o campo ${iss.keys.map((k) => `"${k}"`).join(', ')}. Confira se o nome está escrito certo`;
    case 'too_small':
      return iss.origin === 'array' ? `precisa ter pelo menos ${iss.minimum} item(ns)` : 'não pode ficar vazio';
    case 'too_big':
      return iss.origin === 'array' ? `pode ter no máximo ${iss.maximum} itens` : 'está grande demais';
    case 'invalid_value':
      return `precisa ser um destes: ${iss.values.map((v) => JSON.stringify(v)).join(', ')}`;
    case 'invalid_format':
      return 'está no formato errado';
  }
}

const maiuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Transforma o caminho do erro (ex.: videos.lista[2].arquivo) num lugar legível ("Vídeo 3"). */
export function explicar(caminho: PropertyKey[], mensagem: string) {
  const indice = caminho.findIndex((parte) => typeof parte === 'number');
  const item = indice > 0 ? `${ITENS[caminho.slice(0, indice).join('.')] ?? 'item'} ${(caminho[indice] as number) + 1}` : undefined;
  if (mensagem.includes('{item}')) return maiuscula(mensagem.replaceAll('{item}', item ?? 'item')) + '.';
  const secaoNome = SECOES[String(caminho[0])] ?? 'Arquivo';
  const campo = caminho.slice(indice > 0 ? indice + 1 : 1).filter((p) => typeof p === 'string').join('.');
  const lugar = item ? `${secaoNome} › ${maiuscula(item)}` : secaoNome;
  return `${lugar}${campo ? ` (campo "${campo}")` : ''}: ${mensagem.replace(/\.$/, '')}.`;
}
