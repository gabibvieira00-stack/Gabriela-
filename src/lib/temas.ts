// Os 4 temas prontos. A aluna escolhe um pelo campo `tema` em src/data/creator.ts
// e pode trocar fundo, texto e destaque pelo campo `cores`.
// Para criar um tema novo: copie um bloco de TEMAS, mude o nome e as cores, e adicione
// as fontes em FONTES (o pacote @fontsource precisa estar instalado).

export const FONTES = {
  fraunces: { nome: 'Fraunces', pesos: [400, 600], italico: true, generica: 'serif' },
  dmSerif: { nome: 'DM Serif Display', pesos: [400], italico: true, generica: 'serif' },
  youngSerif: { nome: 'Young Serif', pesos: [400], italico: false, generica: 'serif' },
  bodoni: { nome: 'Bodoni Moda', pesos: [500], italico: true, generica: 'serif' },
  instrumentSans: { nome: 'Instrument Sans', pesos: [400, 600], italico: false, generica: 'sans-serif' },
  inter: { nome: 'Inter', pesos: [400, 600], italico: false, generica: 'sans-serif' },
  figtree: { nome: 'Figtree', pesos: [400, 600], italico: false, generica: 'sans-serif' },
  dmSans: { nome: 'DM Sans', pesos: [400, 600], italico: false, generica: 'sans-serif' },
} as const;

export type ChaveFonte = keyof typeof FONTES;

// peso/caixa/espacamento: como os títulos aparecem. raio: arredondamento dos cantos.
// escala: tamanho dos títulos (fontes largas pedem menos de 1, fontes estreitas mais).
// letra: largura média de uma letra do título (em "em"), usada para o nome nunca sair da tela.
// topoNaCampanha: com a campanha ligada, o cabeçalho e o topo ganham a cor da campanha (preto
// por padrão), emendando com a faixa e o bloco da Black Friday.
export const TEMAS = {
  // Creme e preto, sem cor de destaque: elegante e neutro, deixa os vídeos aparecerem.
  revista: {
    fundo: '#F4EFE7', texto: '#161412', destaque: '#161412', titulo: 'fraunces', corpo: 'instrumentSans',
    peso: 400, caixa: 'none', espacamento: '-0.02em', raio: '2px', escala: 1, letra: 0.6, topoNaCampanha: true,
  },
  // Quase preto com rosa-blush e serifa de revista de moda. Beleza de luxo, moda, noite.
  noite: {
    fundo: '#141113', texto: '#F5EDE8', destaque: '#F1B5C1', titulo: 'bodoni', corpo: 'inter',
    peso: 500, caixa: 'none', espacamento: '-0.015em', raio: '6px', escala: 1, letra: 0.63, topoNaCampanha: false,
  },
  // Tons de rosa: fundo rosa-claro, texto ameixa e destaque rosa antigo. Maquiagem, moda, infantil.
  rosa: {
    fundo: '#FBEFF1', texto: '#3D1F2B', destaque: '#9E4A68', titulo: 'youngSerif', corpo: 'figtree',
    peso: 400, caixa: 'none', espacamento: '-0.02em', raio: '20px', escala: 0.86, letra: 0.66, topoNaCampanha: false,
  },
  // Linho, marrom-oliva e verde-oliva. Natural e acolhedor: casa, bem-estar, comida, maternidade.
  terra: {
    fundo: '#F0EBE1', texto: '#2C2A1E', destaque: '#55653A', titulo: 'dmSerif', corpo: 'dmSans',
    peso: 400, caixa: 'none', espacamento: '-0.01em', raio: '14px', escala: 0.95, letra: 0.6, topoNaCampanha: false,
  },
} as const satisfies Record<
  string,
  {
    fundo: string; texto: string; destaque: string; titulo: ChaveFonte; corpo: ChaveFonte;
    peso: number; caixa: 'none' | 'uppercase'; espacamento: string; raio: string; escala: number; letra: number; topoNaCampanha: boolean;
  }
>;

export type NomeTema = keyof typeof TEMAS;

export const variavelDaFonte = (chave: ChaveFonte) => `--fonte-${chave}` as const;
