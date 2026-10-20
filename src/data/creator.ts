// ════════════════════════════════════════════════════════════════════════════
//  SEU PORTFÓLIO
//  Este é o único arquivo que você precisa mudar para personalizar o site.
//
//  Regrinhas para não quebrar nada:
//  • Texto fica sempre entre aspas: 'assim'. Se o texto tiver aspas simples
//    dentro (ex.: d'água), use aspas duplas por fora: "pão d'água".
//  • Toda linha de campo termina com vírgula.
//  • true = sim, false = não (sem aspas).
//  • Para esconder uma seção inteira, mude `mostrar` para false.
//  • Seção opcional com a lista vazia [] some sozinha do site.
//
//  Se algo estiver errado, o build mostra uma mensagem em português dizendo
//  onde está o problema (ex.: "Faltou o nome do arquivo do vídeo 3").
// ════════════════════════════════════════════════════════════════════════════
import { defineCreator } from '../lib/schema';

export default defineCreator({
  // ── AJUSTES GERAIS ─────────────────────────────────────────────────────────

  // true mostra uma faixa no topo avisando que o portfólio é de demonstração,
  // com pessoa, marcas e números fictícios. Mude para false quando todo o
  // conteúdo de exemplo tiver sido trocado pelo seu.
  modoExemplo: true,

  // Endereço do site. Pode deixar vazio: na Cloudflare o site descobre sozinho
  // (fica algo como https://nome-do-projeto.pages.dev). Só preencha se tiver
  // domínio próprio, ex.: 'https://www.seunome.com.br'.
  endereco: '',

  // Onde ficam os vídeos e as capas:
  //   'local' → na pasta public/videos, junto com o site. Não precisa de cartão nem de
  //             bucket. Limite: cada vídeo com até 24 MB (o "npm run comprimir" já cuida disso).
  //   'r2'    → num bucket do Cloudflare R2. Sem limite de tamanho por vídeo e o site fica
  //             mais leve no GitHub. Precisa ativar o R2 (pede cartão) e preencher urlDosVideos.
  modoDosVideos: 'local',

  // Só no modo 'r2': endereço público do seu bucket no Cloudflare R2.
  // Aparece no painel da Cloudflare em R2 > seu bucket > Settings > Public Development URL.
  // Ex.: 'https://pub-1234567890abcdef.r2.dev'
  urlDosVideos: 'https://pub-SEU-BUCKET.r2.dev',

  // Visual do site. Para comparar, a faixa de demonstração no topo do site tem links para os 4.
  // Opções:
  //   'revista' → creme e preto, ar de revista impressa
  //   'noite'   → quase preto com rosa-blush, ar de revista de moda
  //   'rosa'    → tons de rosa com ameixa
  //   'terra'   → linho, marrom e verde-oliva, ar natural
  tema: 'revista',

  // Opcional: troca as cores do tema. Use o formato '#RRGGBB'.
  // O build confere se o texto continua fácil de ler (contraste) e avisa se não estiver.
  // Ex.: cores: { destaque: '#8A2BE2' },
  cores: {},

  // ── TOPO ───────────────────────────────────────────────────────────────────
  topo: {
    nome: 'Bia Exemplo',
    // Nome do arquivo da sua foto. A foto vai na pasta src/imagens.
    // Uma foto vertical (em pé) fica melhor. JPG, PNG ou WEBP.
    foto: 'foto.jpg',
    // Descreva a foto em poucas palavras. É lido em voz alta para pessoas cegas.
    fotoDescricao: 'Ilustração no lugar da foto da creator fictícia Bia Exemplo',
    // Seu nicho em uma linha. Aparece em letras pequenas acima do nome.
    nicho: 'Skincare, casa e pets',
    // Bio curta: 2 ou 3 frases sobre o que você cria.
    bio: 'Crio vídeos curtos que mostram o produto na vida real: na pia do banheiro, na bancada da cozinha, no passeio com o cachorro. Sou uma creator fictícia, inventada para este modelo de portfólio.',
    botao: {
      // Texto do botão principal.
      texto: 'Quero um orçamento',
      // Para onde o botão leva: 'whatsapp', 'email' ou 'instagram'.
      // Precisa estar preenchido lá embaixo, em CONTATO.
      abre: 'whatsapp',
    },
  },

  // ── VÍDEOS ─────────────────────────────────────────────────────────────────
  // Para adicionar um vídeo: coloque o arquivo original na pasta videos-originais e rode
  // "npm run comprimir". No modo 'local' ele já salva em public/videos; no modo 'r2', envie
  // os arquivos de videos-prontos para o bucket. Depois copie um bloco { ... } abaixo.
  // A ordem aqui é a ordem no site.
  videos: {
    mostrar: true,
    titulo: 'Vídeos',
    // Opcional: uma frase antes dos vídeos.
    texto: 'Vídeos curtos para anúncio e redes sociais, separados por nicho.',
    // true: os vídeos tocam sem som enquanto aparecem na tela (a marca toca para ouvir).
    // false: ficam parados mostrando a capa até alguém tocar.
    previaAutomatica: true,
    lista: [
      {
        // Nome do arquivo do vídeo (o que o "npm run comprimir" gerou).
        arquivo: 'exemplo-01-unboxing.mp4',
        // Capa (imagem mostrada antes de tocar). Se não preencher, usa o mesmo
        // nome do vídeo terminando em .jpg, que é o que o "npm run comprimir" gera.
        capa: 'exemplo-01-unboxing.jpg',
        // Marca ou produto do vídeo.
        marca: 'Lumi Cosméticos (marca fictícia)',
        // Formato. Sugestões: 'Unboxing', 'Review', 'Tutorial', 'Antes e depois',
        // 'Rotina', 'Depoimento', 'Receita', 'Look do dia', 'Comparativo'.
        formato: 'Unboxing',
        // Opcional: nicho do vídeo (ex.: 'Skincare', 'Pets', 'Casa e organização').
        // Com 2 nichos ou mais, os vídeos aparecem separados por nicho, cada um com
        // seu título, e com atalhos no alto da seção. Escreva o nome sempre igual
        // nos vídeos do mesmo nicho. Os nichos aparecem na ordem desta lista.
        nicho: 'Skincare',
        // Duração em minutos:segundos.
        duracao: '0:12',
        // true = conteúdo autoral: gravado por conta própria, SEM contrato com a marca.
        //        Mostra o selo "Conteúdo autoral" para nunca parecer trabalho pago.
        // false = trabalho feito para a marca.
        autoral: false,
        // Opcional: nome da campanha (igual ao da seção CAMPANHA lá embaixo).
        // O vídeo passa a aparecer no bloco da campanha em vez da grade.
        campanha: 'Black Friday',
      },
      {
        arquivo: 'exemplo-03-review.mp4',
        capa: 'exemplo-03-review.jpg',
        marca: 'Sérum de vitamina C (comprado por mim)',
        formato: 'Review',
        nicho: 'Skincare',
        duracao: '0:10',
        autoral: true,
      },
      {
        arquivo: 'exemplo-07-rotina-noturna.mp4',
        capa: 'exemplo-07-rotina-noturna.jpg',
        marca: 'Lumi Cosméticos (marca fictícia)',
        formato: 'Rotina',
        nicho: 'Skincare',
        duracao: '0:13',
        autoral: false,
      },
      {
        arquivo: 'exemplo-10-antes-e-depois.mp4',
        capa: 'exemplo-10-antes-e-depois.jpg',
        marca: 'Protetor solar (comprado por mim)',
        formato: 'Antes e depois',
        nicho: 'Skincare',
        duracao: '0:09',
        autoral: true,
      },
      {
        arquivo: 'exemplo-11-tutorial.mp4',
        capa: 'exemplo-11-tutorial.jpg',
        marca: 'Lumi Cosméticos (marca fictícia)',
        formato: 'Tutorial',
        nicho: 'Skincare',
        duracao: '0:12',
        autoral: false,
      },
      {
        arquivo: 'exemplo-02-rotina.mp4',
        capa: 'exemplo-02-rotina.jpg',
        marca: 'Casa Brisa (marca fictícia)',
        formato: 'Rotina',
        nicho: 'Casa e organização',
        duracao: '0:15',
        autoral: false,
      },
      {
        arquivo: 'exemplo-05-antes-e-depois.mp4',
        capa: 'exemplo-05-antes-e-depois.jpg',
        marca: 'Organizadores de gaveta',
        formato: 'Antes e depois',
        nicho: 'Casa e organização',
        duracao: '0:09',
        autoral: true,
      },
      {
        arquivo: 'exemplo-12-unboxing.mp4',
        capa: 'exemplo-12-unboxing.jpg',
        marca: 'Casa Brisa (marca fictícia)',
        formato: 'Unboxing',
        nicho: 'Casa e organização',
        duracao: '0:11',
        autoral: false,
      },
      {
        arquivo: 'exemplo-13-review.mp4',
        capa: 'exemplo-13-review.jpg',
        marca: 'Aromatizador de ambiente (comprado por mim)',
        formato: 'Review',
        nicho: 'Casa e organização',
        duracao: '0:10',
        autoral: true,
      },
      {
        arquivo: 'exemplo-06-depoimento.mp4',
        capa: 'exemplo-06-depoimento.jpg',
        marca: 'Café Aurora (marca fictícia)',
        formato: 'Depoimento',
        nicho: 'Café e cozinha',
        duracao: '0:11',
        autoral: false,
      },
      {
        arquivo: 'exemplo-09-receita.mp4',
        capa: 'exemplo-09-receita.jpg',
        marca: 'Café Aurora (marca fictícia)',
        formato: 'Receita',
        nicho: 'Café e cozinha',
        duracao: '0:14',
        autoral: false,
      },
      {
        arquivo: 'exemplo-14-unboxing.mp4',
        capa: 'exemplo-14-unboxing.jpg',
        marca: 'Verde Vivo (marca fictícia)',
        formato: 'Unboxing',
        nicho: 'Café e cozinha',
        duracao: '0:13',
        autoral: false,
      },
      {
        arquivo: 'exemplo-15-review.mp4',
        capa: 'exemplo-15-review.jpg',
        marca: 'Cafeteira (comprada por mim)',
        formato: 'Review',
        nicho: 'Café e cozinha',
        duracao: '0:09',
        autoral: true,
      },
      {
        arquivo: 'exemplo-04-tutorial.mp4',
        capa: 'exemplo-04-tutorial.jpg',
        marca: 'Pet Feliz (marca fictícia)',
        formato: 'Tutorial',
        nicho: 'Pets',
        duracao: '0:14',
        autoral: false,
        campanha: 'Black Friday',
      },
      {
        arquivo: 'exemplo-08-review.mp4',
        capa: 'exemplo-08-review.jpg',
        marca: 'Pet Feliz (marca fictícia)',
        formato: 'Review',
        nicho: 'Pets',
        duracao: '0:10',
        autoral: false,
      },
      {
        arquivo: 'exemplo-16-unboxing.mp4',
        capa: 'exemplo-16-unboxing.jpg',
        marca: 'Pet Feliz (marca fictícia)',
        formato: 'Unboxing',
        nicho: 'Pets',
        duracao: '0:12',
        autoral: false,
      },
      {
        arquivo: 'exemplo-17-rotina.mp4',
        capa: 'exemplo-17-rotina.jpg',
        marca: 'Nuvem Kids (marca fictícia)',
        formato: 'Rotina',
        nicho: 'Pets',
        duracao: '0:14',
        autoral: false,
      },
      {
        arquivo: 'exemplo-18-antes-e-depois.mp4',
        capa: 'exemplo-18-antes-e-depois.jpg',
        marca: 'Caminha para gatos (comprada por mim)',
        formato: 'Antes e depois',
        nicho: 'Pets',
        duracao: '0:10',
        autoral: true,
      },
    ],
  },

  // ── CAMPANHA SAZONAL ───────────────────────────────────────────────────────
  // Bloco de destaque logo abaixo do topo, com os vídeos marcados com
  // `campanha: 'Black Friday'` (ou o nome que estiver em `nome`).
  // Troque o nome para 'Natal', 'Dia das Mães' etc. Para esconder: mostrar: false.
  // Enquanto estiver ligada, aparece uma faixa no alto do site; no tema 'revista', o topo
  // inteiro também fica na cor da campanha (preto, ou a cor escolhida em `cor`).
  campanha: {
    mostrar: true,
    nome: 'Black Friday',
    chamada: 'Agenda aberta para Black Friday',
    texto: 'Ainda tenho datas para gravar conteúdos de Black Friday. Feche agora e receba os vídeos antes da semana da oferta.',
    // Texto do botão (abre o WhatsApp já falando da campanha).
    botao: 'Reservar minha data',
    // Opcional: mensagem que já vem escrita no WhatsApp quando a marca toca no botão.
    // Se não preencher: "Oi! Vi seu portfólio e quero falar sobre Black Friday."
    // mensagemWhatsapp: '',
    // Opcional: cor de fundo do bloco, no formato '#RRGGBB'. Se não preencher, fica preto
    // (combina com Black Friday). Ex.: Natal → cor: '#1F4D36', Dia das Mães → cor: '#7A2E4D'.
    // cor: '',
  },

  // ── DIFERENCIAIS ───────────────────────────────────────────────────────────
  // De 3 a 5 itens curtos.
  diferenciais: {
    mostrar: true,
    titulo: 'Por que trabalhar comigo',
    lista: [
      { titulo: 'Roteiro antes de gravar', texto: 'Mando o roteiro com gancho, demonstração e chamada para a marca aprovar.' },
      { titulo: 'Luz e som caprichados', texto: 'Gravo com luz natural e microfone de lapela. Nada de áudio abafado.' },
      { titulo: 'Duas rodadas de ajuste', texto: 'Ajusto corte, legenda e texto até ficar com a cara da marca.' },
      { titulo: 'Entrega no prazo', texto: 'Combinou, cumpriu. Aviso na hora se algo atrasar do lado de cá.' },
    ],
  },

  // ── MARCAS COM QUEM JÁ TRABALHEI ───────────────────────────────────────────
  // Opcional. Só coloque marcas com quem você realmente trabalhou.
  // Logo é opcional: coloque o arquivo (PNG com fundo transparente fica melhor) em
  // src/imagens e escreva o nome, ex.: logo: 'logo-lumi.png'. Com logo, as marcas aparecem
  // em cartões brancos; sem logo, aparece o nome.
  marcas: {
    mostrar: true,
    titulo: 'Marcas com quem já trabalhei',
    lista: [
      { nome: 'Lumi Cosméticos (marca fictícia)', logo: 'logo-lumi.png' },
      { nome: 'Casa Brisa (marca fictícia)', logo: 'logo-casa-brisa.png' },
      { nome: 'Pet Feliz (marca fictícia)', logo: 'logo-pet-feliz.png' },
      { nome: 'Café Aurora (marca fictícia)', logo: 'logo-cafe-aurora.png' },
      { nome: 'Verde Vivo (marca fictícia)', logo: 'logo-verde-vivo.png' },
      { nome: 'Nuvem Kids (marca fictícia)', logo: 'logo-nuvem-kids.png' },
    ],
  },

  // ── RESULTADOS ─────────────────────────────────────────────────────────────
  // Opcional. Use só números e depoimentos reais, que você consegue provar.
  // Cada lista pode ficar vazia [] e aquela parte some.
  resultados: {
    mostrar: true,
    titulo: 'O que os vídeos entregaram',
    numeros: [
      { valor: '1,2 mi', legenda: 'visualizações somadas (número de exemplo)' },
      { valor: '4,8%', legenda: 'taxa média de cliques nos anúncios (número de exemplo)' },
      { valor: '38', legenda: 'vídeos entregues (número de exemplo)' },
    ],
    // Prints de métricas: o arquivo vai em src/imagens.
    prints: [{ imagem: 'print-exemplo.png', legenda: 'Print de exemplo: alcance de um vídeo nos primeiros 7 dias' }],
    depoimentos: [
      {
        texto: 'Depoimento de exemplo: entregou antes do prazo e o vídeo virou nosso anúncio principal do mês.',
        autor: 'Pessoa fictícia',
        marca: 'Lumi Cosméticos (fictícia)',
      },
    ],
  },

  // ── COMO EU TRABALHO ───────────────────────────────────────────────────────
  comoTrabalho: {
    mostrar: true,
    titulo: 'Como eu trabalho',
    prazo: '5 a 7 dias úteis depois de receber o produto',
    incluso: [
      'Roteiro aprovado antes da gravação',
      'Vídeo vertical 9:16 editado, com legenda',
      'Duas rodadas de ajuste',
      'Arquivo sem legenda, se a marca pedir',
    ],
    direitosDeUso: 'Uso orgânico vitalício nas redes da marca. Uso em anúncios pagos por até 4 meses, sem custo extra.',
    // Opcional: uma observação no fim da seção.
    observacao: 'Exclusividade, arquivos brutos e urgência são combinados à parte.',
  },

  // ── VALORES ────────────────────────────────────────────────────────────────
  // Pacotes com preço: a marca decide mais rápido quando já sabe quanto custa.
  // Cada pacote tem um botão que abre o WhatsApp já falando daquele pacote.
  valores: {
    mostrar: true,
    titulo: 'Pacotes e valores',
    // Opcional: uma frase antes dos pacotes.
    texto: 'Escolha o pacote que combina com a sua campanha. Valores de exemplo: troque pelos seus.',
    pacotes: [
      // nome: o que a marca recebe. detalhe: um complemento curto (opcional).
      // preco: se ficar vazio, aparece "Sob consulta".
      // etiqueta (opcional): destaca o pacote, ex.: 'Mais pedido'.
      { nome: '1 vídeo', detalhe: '+ 2 fotos', preco: 'R$ 400', descricao: 'Para conhecer meu trabalho e testar o formato UGC.' },
      {
        nome: '3 vídeos',
        detalhe: '+ 5 fotos',
        preco: 'R$ 1.050',
        descricao: 'Três ganchos diferentes para a marca descobrir qual funciona melhor nos anúncios.',
        etiqueta: 'Mais pedido',
      },
      { nome: '5 vídeos', detalhe: '+ 8 fotos', preco: 'R$ 1.600', descricao: 'Uma sequência pensada para a campanha inteira.' },
    ],
    // Opcional: itens vendidos separados.
    avulsos: [
      { nome: 'Foto de produto', preco: 'R$ 60' },
      { nome: 'Variação de gancho ou chamada', preco: 'R$ 80' },
      { nome: 'Cada mês extra de uso em anúncios', preco: 'R$ 60' },
    ],
    // Texto do botão de cada pacote.
    botao: 'Quero este pacote',
    // Opcional: uma observação no fim da seção.
    observacao: 'Todos os pacotes incluem roteiro, gravação, edição e duas rodadas de ajuste.',
  },

  // ── CONTATO ────────────────────────────────────────────────────────────────
  // Deixe vazio ('') o que você não quiser mostrar.
  contato: {
    titulo: 'Vamos criar juntos?',
    texto: 'Me conte o produto, o prazo e onde o vídeo vai rodar. Respondo em até um dia útil.',
    whatsapp: {
      // 55 + DDD + número. Pode escrever com espaço ou traço.
      numero: '55 11 90000-0000',
      // Mensagem que já aparece escrita quando a marca abre o WhatsApp.
      mensagem: 'Oi, Bia! Vi seu portfólio e quero conversar sobre um conteúdo UGC.',
    },
    email: 'bia@example.com',
    // Só o perfil, com ou sem @.
    instagram: '@instagram',
    tiktok: '@tiktok',
    // Opcional: link do mídia kit (https://...) ou um PDF colocado na pasta public (ex.: 'midia-kit.pdf').
    midiaKit: '',
  },

  // ── GOOGLE E COMPARTILHAMENTO ──────────────────────────────────────────────
  // Opcional. Se ficar vazio, o título vira "Nome · Creator UGC de nicho" e a descrição usa a bio.
  seo: {
    titulo: '',
    descricao: '',
  },
});
