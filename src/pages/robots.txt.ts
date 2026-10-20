// Instruções para o Google e outros buscadores.
import type { APIRoute } from 'astro';
import { endereco } from '../lib/site';

export const GET: APIRoute = ({ url }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${endereco || url.origin}/sitemap.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
