// Lista de páginas para os buscadores (o portfólio tem uma só).
import type { APIRoute } from 'astro';
import { endereco } from '../lib/site';

export const GET: APIRoute = ({ url }) =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${endereco || url.origin}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>
</urlset>
`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
