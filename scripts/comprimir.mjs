// npm run comprimir
// Pega os vídeos de videos-originais/ e gera, para cada um:
//   • nome-do-video.mp4 → H.264, vertical 720x1280, até 30 fps, pronto para web, sem metadados
//   • nome-do-video.jpg → capa: o primeiro quadro, para a prévia começar sem dar salto na tela
// Onde salva depende de `modoDosVideos` em src/data/creator.ts:
//   • 'local' → public/videos/ (vai junto com o site; cada arquivo fica abaixo de 24 MB)
//   • 'r2'    → videos-prontos/ (para arrastar para o bucket no Cloudflare R2)
// Vídeo que já foi comprimido (e não mudou) é pulado.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync } from 'node:fs';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const conteudo = existsSync('src/data/creator.ts') ? readFileSync('src/data/creator.ts', 'utf8') : '';
const MODO = /^\s*modoDosVideos:\s*['"]r2['"]/m.test(conteudo) ? 'r2' : 'local';
const ORIGEM = 'videos-originais';
const DESTINO = MODO === 'local' ? 'public/videos' : 'videos-prontos';
// A Cloudflare Pages não publica arquivo acima de 25 MB. O build barra acima de 24 MB;
// aqui miramos em 22 MB para sobrar folga.
const LIMITE = 24 * 1024 * 1024;
const ALVO = 22 * 1024 * 1024;
const EXTENSOES = /\.(mp4|mov|m4v|webm|mkv|avi|3gp)$/i;

const roda = (programa, args) => spawnSync(programa, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

if (roda('ffmpeg', ['-version']).status !== 0 || roda('ffprobe', ['-version']).status !== 0) {
  console.error(`
❌ Não encontrei o ffmpeg, o programa que comprime os vídeos.

Como instalar:

  • Windows: abra o "Terminal" (ou PowerShell) e rode:
        winget install --id Gyan.FFmpeg -e
    Depois feche e abra o Claude Code de novo.

  • Mac: no Terminal, rode:
        brew install ffmpeg
    Se aparecer "brew: command not found", instale o Homebrew antes, seguindo as instruções em https://brew.sh
    Depois feche e abra o Claude Code de novo.
`);
  process.exit(1);
}

mkdirSync(DESTINO, { recursive: true });
const originais = existsSync(ORIGEM) ? readdirSync(ORIGEM).filter((f) => EXTENSOES.test(f)).sort() : [];
if (!originais.length) {
  console.log(`\nNão achei nenhum vídeo na pasta ${ORIGEM}/. Coloque os arquivos lá (MP4, MOV...) e rode de novo.\n`);
  process.exit(0);
}

// "Rotina Manhã (final).MOV" → "rotina-manha-final": sem espaço nem acento, que quebram links.
const limparNome = (nome) =>
  nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'video';

const minutos = (segundos) => `${Math.floor(segundos / 60)}:${String(Math.round(segundos % 60)).padStart(2, '0')}`;
const tamanho = (arquivo) => {
  const kb = statSync(arquivo).size / 1024;
  return kb < 1024 ? `${Math.round(kb)} KB` : `${(kb / 1024).toFixed(1).replace('.', ',')} MB`;
};

function medir(arquivo) {
  const r = roda('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:stream_side_data=rotation:format=duration', '-of', 'json', arquivo]);
  if (r.status !== 0) return undefined;
  const dados = JSON.parse(r.stdout);
  const v = dados.streams?.[0];
  if (!v) return undefined;
  const deitado = Math.abs(v.side_data_list?.find((s) => 'rotation' in s)?.rotation ?? 0) === 90;
  return { largura: deitado ? v.height : v.width, altura: deitado ? v.width : v.height, duracao: Number(dados.format?.duration ?? 0) };
}

const usados = new Set();
const prontos = [];
const avisos = [];

for (const original of originais) {
  let nome = limparNome(parse(original).name);
  for (let n = 2; usados.has(nome); n++) nome = `${limparNome(parse(original).name)}-${n}`;
  usados.add(nome);

  const entrada = join(ORIGEM, original);
  const mp4 = join(DESTINO, `${nome}.mp4`);
  const jpg = join(DESTINO, `${nome}.jpg`);

  const jaPronto =
    existsSync(mp4) && existsSync(jpg) && statSync(mp4).mtimeMs >= statSync(entrada).mtimeMs && (MODO === 'r2' || statSync(mp4).size <= LIMITE);
  if (jaPronto) {
    console.log(`⏭️  ${original}: já estava pronto.`);
    prontos.push({ original, nome, duracao: medir(mp4)?.duracao ?? 0 });
    continue;
  }

  const medidas = medir(entrada);
  if (!medidas) {
    avisos.push(`${original}: não consegui ler este arquivo. Ele pode estar corrompido ou não ser um vídeo.`);
    continue;
  }
  if (medidas.largura / medidas.altura > (9 / 16) * 1.1)
    avisos.push(`${original}: o vídeo não é vertical. Cortei as laterais para ficar em 9:16; confira se nada importante ficou de fora.`);

  // Teto de qualidade em kbit/s. No modo local, baixa o teto para o arquivo caber no limite da Cloudflare.
  let kbps = 2500;
  if (MODO === 'local' && medidas.duracao > 0) kbps = Math.min(kbps, Math.floor((ALVO * 8) / 1000 / medidas.duracao - 128));
  if (kbps < 400) {
    avisos.push(`${original}: tem ${minutos(medidas.duracao)} e é longo demais para o modo local (a imagem ia ficar ruim para caber em 24 MB). Corte o vídeo ou use o modo "r2".`);
    continue;
  }

  console.log(`🎬 Comprimindo ${original}...`);
  // Grava num arquivo temporário e só renomeia no fim: se der erro no meio, nada pela metade vai para o site.
  const temporario = join(DESTINO, `${nome}.tmp.mp4`);
  let pronto = false;
  for (let tentativa = 1; tentativa <= 3 && !pronto; tentativa++, kbps = Math.floor(kbps * 0.8)) {
    const video = roda('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y', '-i', entrada,
      '-map', '0:v:0', '-map', '0:a:0?',
      '-vf', 'scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,setsar=1',
      '-fpsmax', '30',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-maxrate', `${kbps}k`, '-bufsize', `${kbps * 2}k`,
      '-profile:v', 'high', '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '128k', '-ac', '2',
      '-map_metadata', '-1', '-map_chapters', '-1',
      '-fflags', '+bitexact', '-flags:v', '+bitexact', '-flags:a', '+bitexact',
      '-movflags', '+faststart',
      temporario,
    ]);
    if (video.status !== 0) {
      avisos.push(`${original}: o ffmpeg deu erro ao comprimir.\n     ${video.stderr.trim().split('\n').slice(-3).join('\n     ')}`);
      break;
    }
    pronto = MODO === 'r2' || statSync(temporario).size <= LIMITE;
  }
  if (!pronto) {
    if (existsSync(temporario) && !avisos.some((a) => a.startsWith(`${original}:`)))
      avisos.push(`${original}: mesmo comprimido passou de 24 MB, o limite do modo local. Corte o vídeo ou use o modo "r2".`);
    rmSync(temporario, { force: true });
    continue;
  }
  renameSync(temporario, mp4);

  const gerarCapa = (segundo) =>
    roda('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y', '-ss', String(segundo), '-i', mp4,
      '-frames:v', '1', '-vf', 'scale=540:960', '-q:v', '4', '-map_metadata', '-1', jpg,
    ]).status === 0;
  if (!gerarCapa(0)) avisos.push(`${original}: o vídeo ficou pronto, mas não consegui gerar a capa.`);
  else {
    // Primeiro quadro quase preto (vídeo que começa com fade) vira uma capa feia: usa o de 1 segundo.
    const { channels } = await sharp(jpg).stats();
    if (channels.slice(0, 3).every((canal) => canal.mean < 25) && gerarCapa(Math.min(1, medidas.duracao / 2)))
      avisos.push(`${original}: o primeiro quadro é quase preto, então usei o quadro de 1 segundo como capa.`);
  }

  prontos.push({ original, nome, duracao: medir(mp4)?.duracao ?? medidas.duracao });
}

if (prontos.length) {
  console.log(
    MODO === 'local'
      ? `\n✅ Prontos em ${DESTINO}/ (modo local: já fazem parte do site, falta colocar no creator.ts e publicar):\n`
      : `\n✅ Prontos em ${DESTINO}/ (modo r2: arraste estes arquivos para o bucket no painel da Cloudflare):\n`,
  );
  const largura = Math.max(...prontos.map((p) => p.nome.length)) + 4;
  for (const p of prontos) {
    const mp4 = join(DESTINO, `${p.nome}.mp4`);
    const jpg = join(DESTINO, `${p.nome}.jpg`);
    console.log(`   ${(p.nome + '.mp4').padEnd(largura)} ${tamanho(mp4).padStart(8)}   ${minutos(p.duracao)}`);
    if (existsSync(jpg)) console.log(`   ${(p.nome + '.jpg').padEnd(largura)} ${tamanho(jpg).padStart(8)}`);
    if (statSync(mp4).size > 20 * 1024 * 1024) avisos.push(`${p.nome}.mp4 ficou com mais de 20 MB. Vídeos mais curtos carregam mais rápido no celular.`);
  }
  console.log('\nPara colocar no src/data/creator.ts (preencha marca, formato e autoral):\n');
  for (const p of prontos)
    console.log(`   { arquivo: '${p.nome}.mp4', capa: '${p.nome}.jpg', marca: '', formato: '', duracao: '${minutos(p.duracao)}', autoral: true },`);
}
if (avisos.length) console.log(`\n⚠️  Atenção:\n${avisos.map((a) => `   • ${a}`).join('\n')}`);
console.log('');
if (avisos.some((a) => /erro|não consegui ler|longo demais|passou de 24 MB/.test(a))) process.exitCode = 1;
