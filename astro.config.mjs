// Configuração do Astro. A aluna não precisa mexer aqui: tudo o que é personalizável
// fica em src/data/creator.ts.
import { defineConfig, fontProviders } from 'astro/config';
import { FONTES, variavelDaFonte } from './src/lib/temas.ts';

const pacote = (nome) => nome.toLowerCase().replaceAll(' ', '-');

export default defineConfig({
  // Site de uma página só: o CSS vai dentro do HTML e a página não espera outro arquivo para aparecer.
  build: { inlineStylesheets: 'always' },
  // Sem a barra de ferramentas do Astro no "npm run dev": ela confunde quem não programa.
  devToolbar: { enabled: false },
  // Fontes servidas pelo próprio site, a partir dos pacotes @fontsource (só o alfabeto latino,
  // que cobre o português). Só as do tema escolhido entram na página.
  fonts: Object.entries(FONTES).map(([chave, fonte]) => ({
    provider: fontProviders.local(),
    name: fonte.nome,
    cssVariable: variavelDaFonte(chave),
    fallbacks: [fonte.generica],
    options: {
      variants: fonte.pesos.flatMap((peso) =>
        (fonte.italico ? ['normal', 'italic'] : ['normal']).map((estilo) => ({
          weight: peso,
          style: estilo,
          src: [`./node_modules/@fontsource/${pacote(fonte.nome)}/files/${pacote(fonte.nome)}-latin-${peso}-${estilo}.woff2`],
        })),
      ),
    },
  })),
});
