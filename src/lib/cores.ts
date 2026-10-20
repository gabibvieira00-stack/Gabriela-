// Contas de cor: contraste (WCAG) e mistura de duas cores #RRGGBB.

const canais = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

function luminancia(hex: string) {
  const [r, g, b] = canais(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contraste(a: string, b: string) {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (escuro + 0.05);
}

/** `peso` = quanto de `a` entra na mistura (0 a 1). */
export function misturar(a: string, b: string, peso: number) {
  const [ca, cb] = [canais(a), canais(b)];
  return '#' + ca.map((v, i) => Math.round(v * peso + cb[i] * (1 - peso)).toString(16).padStart(2, '0')).join('').toUpperCase();
}

export type Paleta = ReturnType<typeof montarPaleta>['paleta'];

/** Completa a paleta a partir das 3 cores base e lista os problemas de contraste (mínimo AA). */
export function montarPaleta(base: { fundo: string; texto: string; destaque: string }) {
  const superficie = misturar(base.texto, base.fundo, 0.06);
  // Texto secundário: o mais suave possível que ainda passe em 4,5:1 no fundo e nos cartões.
  let suave = base.texto;
  for (let peso = 0.6; peso <= 1; peso += 0.05) {
    const tentativa = misturar(base.texto, base.fundo, peso);
    if (contraste(tentativa, base.fundo) >= 4.5 && contraste(tentativa, superficie) >= 4.5) {
      suave = tentativa;
      break;
    }
  }
  const candidatos = [base.fundo, base.texto, '#FFFFFF', '#000000'];
  const noDestaque =
    candidatos.find((c) => contraste(c, base.destaque) >= 4.5) ??
    candidatos.sort((x, y) => contraste(y, base.destaque) - contraste(x, base.destaque))[0];

  const problemas: { campo: 'texto' | 'destaque'; mensagem: string }[] = [];
  const conferir = (campo: 'texto' | 'destaque', valor: number, minimo: number, oQue: string, dica: string) => {
    if (valor < minimo)
      problemas.push({
        campo,
        mensagem: `${oQue} ficou com pouco contraste (${valor.toFixed(1).replace('.', ',')}:1, o mínimo é ${String(minimo).replace('.', ',')}:1). ${dica}`,
      });
  };
  conferir('texto', contraste(base.texto, base.fundo), 4.5, 'o texto sobre o fundo', 'Escureça o texto ou clareie o fundo (ou o contrário, num tema escuro).');
  conferir('destaque', contraste(base.destaque, base.fundo), 3, 'a cor de destaque sobre o fundo', 'Use um destaque mais escuro num fundo claro, ou mais claro num fundo escuro.');
  conferir('destaque', contraste(noDestaque, base.destaque), 4.5, 'o texto dos botões sobre a cor de destaque', 'Use um destaque bem mais escuro ou bem mais claro, não um tom médio.');

  return {
    paleta: { ...base, superficie, suave, linha: misturar(base.texto, base.fundo, 0.22), noDestaque },
    problemas,
  };
}
