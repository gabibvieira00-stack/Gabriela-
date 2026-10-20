// Imagem que aparece ao colar o link do portfólio no WhatsApp, Instagram etc.
import type { APIRoute } from 'astro';
import { imagemDeCompartilhamento } from '../lib/imagens-geradas';

export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await imagemDeCompartilhamento()), { headers: { 'Content-Type': 'image/png' } });
