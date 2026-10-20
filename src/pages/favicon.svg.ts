// Ícone da aba do navegador: a inicial do nome nas cores do tema.
import type { APIRoute } from 'astro';
import { icone } from '../lib/imagens-geradas';

export const GET: APIRoute = async () => new Response(await icone(64, true), { headers: { 'Content-Type': 'image/svg+xml' } });
