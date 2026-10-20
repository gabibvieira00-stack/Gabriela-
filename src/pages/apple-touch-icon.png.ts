// Ícone usado quando alguém salva o site na tela inicial do iPhone.
import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { icone } from '../lib/imagens-geradas';

export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await sharp(Buffer.from(await icone(180, false))).png().toBuffer()), {
    headers: { 'Content-Type': 'image/png' },
  });
