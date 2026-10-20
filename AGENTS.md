# Instruções para o assistente de IA deste repositório

Este repositório é o portfólio de uma creator de UGC (conteúdo gerado por usuário, aqueles vídeos curtos que marcas usam em anúncio e nas redes). Ele foi feito para ser personalizado por conversa: ela pede em português e você faz.

## Com quem você está falando

- A usuária é uma creator de UGC, **não é programadora**. Fale em português simples, frases curtas, sem jargão. Se precisar de um termo técnico, explique em uma frase (ex.: "o *build* é quando o computador monta o site a partir dos seus textos e confere se está tudo certo").
- **Nunca peça para ela rodar comandos no terminal.** Você roda tudo, incluindo `git add`, `git commit` e `git push`. Ela só precisa agir no que é dela: arrastar arquivos para uma pasta, clicar no painel da Cloudflare, fazer login no navegador, digitar a senha do computador numa instalação.
- Antes de uma tarefa com vários passos, diga em uma linha o que vai fazer. No fim, diga o que mudou, em linguagem de gente ("troquei sua bio e escondi a seção de resultados").
- Depois de publicar, avise: **"Pronto! Em 1 a 2 minutos o site atualiza sozinho."** e passe o endereço do site, se souber (campo `endereco` em `src/data/creator.ts`).
- Uma pergunta por vez. Se o pedido estiver claro, não pergunte: faça.

## Regras que nunca quebram

1. **Para personalizar, edite só `src/data/creator.ts`.** Textos, links, vídeos, cores, tema e seções ligadas/desligadas estão todos lá, com comentários explicando cada campo. Só mexa em componentes (`src/components/`), no layout ou nos temas se ela pedir uma mudança visual que o arquivo de conteúdo não cobre. Nesse caso, explique antes o que vai mudar.
2. **Nunca invente marca, número, resultado, depoimento ou trabalho.** Só coloque o que ela disser. Se faltar informação, pergunte. Na dúvida, deixe de fora.
3. **Vídeo gravado sem contrato com a marca sempre leva `autoral: true`.** Isso mostra o selo "Conteúdo autoral" e evita que pareça trabalho pago. Se ela não disser se foi pago, pergunte.
4. **Sempre rode `npm run build` antes de publicar** e corrija qualquer erro antes do push. Nunca publique com o build quebrado.
5. Nunca coloque no GitHub os vídeos originais (pasta `videos-originais/`, já está no `.gitignore`) nem arquivos com mais de 24 MB.
6. Antes de apagar algo dela (vídeo, foto, seção inteira), confirme.
7. Não mude o `modoExemplo` para `false` enquanto ainda houver conteúdo de exemplo (Bia Exemplo, marcas e números "fictícios"). Quando tudo for dela, mude e avise.

## Mapa do projeto

| O quê | Onde |
|---|---|
| Todo o conteúdo editável | `src/data/creator.ts` |
| Foto, logos de marcas, prints de resultado | `src/imagens/` (o nome do arquivo vai no `creator.ts`) |
| Vídeos originais que ela grava | `videos-originais/` (fica só no computador dela) |
| Vídeos prontos no modo `local` | `public/videos/` (vão junto com o site) |
| Vídeos prontos no modo `r2` | `videos-prontos/` (ela arrasta para o bucket na Cloudflare) |
| Mídia kit em PDF (opcional) | `public/` (ex.: `public/midia-kit.pdf` → `midiaKit: 'midia-kit.pdf'`) |
| Regras e mensagens de erro do conteúdo | `src/lib/schema.ts` |
| Os 4 temas (cores, fontes) | `src/lib/temas.ts` |
| Seções do site | `src/components/` (ordem das seções em `src/pages/index.astro`) |
| Script de compressão de vídeo | `scripts/comprimir.mjs` (`npm run comprimir`) |

## Primeiro uso: checagem rápida

Na primeira conversa (ou se algo não funcionar), confira em silêncio e só fale do que faltar:

1. **Node.js** (`node -v`, precisa ser 22.22 ou mais novo; o projeto usa a versão do `.nvmrc`). Se faltar:
   - Windows: `winget install --id OpenJS.NodeJS.LTS -e` (pode abrir uma janela pedindo permissão: ela clica em "Sim").
   - Mac: peça para ela baixar o instalador "LTS" em https://nodejs.org e clicar duas vezes nele, ou use `brew install node` se o Homebrew existir.
   - Depois de instalar, ela precisa fechar e abrir o Claude Code (ou o app que estiver usando) de novo.
2. **Dependências**: se não existir a pasta `node_modules`, rode `npm install`.
3. **git** (`git --version`). No Mac, se faltar, rode `xcode-select --install` e peça para ela clicar em "Instalar" na janela que abrir.
4. **ffmpeg** (`ffmpeg -version`), usado para comprimir vídeos. Se faltar:
   - Windows: `winget install --id Gyan.FFmpeg -e`, e depois ela fecha e abre o app de novo.
   - Mac com Homebrew: `brew install ffmpeg`.
   - Mac sem Homebrew: instalar o Homebrew pede a senha do computador, então é o único caso em que ela mesma precisa colar um comando. Explique devagar: abrir o app "Terminal", colar o comando de https://brew.sh, apertar Enter, digitar a senha do Mac (as letras não aparecem, é normal) e esperar. Depois disso, você roda `brew install ffmpeg`.
5. **Repositório no GitHub**: `git remote -v` precisa mostrar um endereço do GitHub. Se não tiver, descubra com ela qual é o repositório (ela criou pelo botão "Use this template") e configure.
6. **Login no GitHub para publicar**: teste com `git push --dry-run`. Se pedir login, use o GitHub CLI (`gh`; instale com `winget install --id GitHub.cli -e` ou `brew install gh`): rode `gh auth login --web --hostname github.com --git-protocol https` em segundo plano, mostre a ela o código de 8 letras e o link https://github.com/login/device para ela autorizar no navegador, e depois rode `gh auth setup-git`.
7. **Build**: rode `npm run build` uma vez para ver se está tudo certo.

Resuma em uma ou duas frases ("Está tudo pronto" ou "Instalei o ffmpeg; feche e abra o app de novo para eu continuar").

## Como publicar uma mudança

1. Faça a mudança (normalmente só em `src/data/creator.ts`).
2. Rode `npm run build`. Se der erro, leia a mensagem (ela vem em português e diz o lugar exato), corrija e rode de novo.
3. Se ela quiser ver antes de publicar: rode `npm run dev` e passe o link `http://localhost:4321`. Fora de um terminal interativo, o Astro já sobe o servidor em segundo plano. Quando terminar, pare com `npx astro dev stop`. Se o servidor continuar mostrando um erro de vídeo que já foi resolvido (ex.: o arquivo chegou depois em `public/videos`), pare e suba de novo.
4. `git add -A`, depois `git status` para conferir que não entrou nada estranho (vídeo original, arquivo gigante). Faça o commit com uma mensagem curta em português dizendo o que mudou (ex.: "Troca a bio e adiciona vídeo da Lumi").
5. `git push`.
6. Avise: "Pronto! Em 1 a 2 minutos o site atualiza sozinho." A Cloudflare Pages monta e publica o site sozinha a cada push.

## Vídeos

### Os dois modos (`modoDosVideos` em `src/data/creator.ts`)

- **`'local'`** (padrão): os vídeos e as capas ficam em `public/videos/` e são publicados junto com o site. Não precisa de bucket nem de cartão de crédito. Limite: **24 MB por arquivo** (a Cloudflare Pages recusa arquivos acima de 25 MB). O build barra qualquer arquivo em `public/` acima de 24 MB, e o `npm run comprimir` já mira abaixo disso.
- **`'r2'`**: os vídeos e as capas ficam num bucket do Cloudflare R2 (um "HD na nuvem" da Cloudflare). Sem limite prático de tamanho e o repositório fica leve. Precisa ativar o R2 (a Cloudflare pede um cartão, mesmo no plano gratuito) e preencher `urlDosVideos`. O build confere no bucket se cada vídeo e cada capa existem.

### Adicionar um vídeo novo

1. Peça para ela colocar o arquivo original na pasta `videos-originais/`. Você pode abrir a pasta para ela: `open videos-originais` (Mac) ou `explorer videos-originais` (Windows).
2. Rode `npm run comprimir`. Ele gera o `.mp4` (vertical 720x1280) e a capa `.jpg` com nomes limpos, sem espaço nem acento, e mostra no fim o tamanho, a duração e um bloco pronto para colar. A capa é o primeiro quadro do vídeo, para a prévia começar sem dar salto na tela. Se o primeiro quadro for quase preto, ele usa o de 1 segundo e avisa.
3. Só no modo `'r2'`: explique como enviar os arquivos para o bucket:
   1. Entrar em https://dash.cloudflare.com e abrir **Storage & databases** > **R2**.
   2. Clicar no bucket do portfólio.
   3. Clicar em **Upload** e arrastar os arquivos `.mp4` e `.jpg` novos da pasta `videos-prontos/`. Você pode abrir a pasta com `open videos-prontos` ou `explorer videos-prontos`.
   4. Esperar terminar e avisar você.
4. Pergunte o que faltar: marca ou produto, formato (unboxing, review, tutorial...), nicho (skincare, pets, casa...), se foi pago ou autoral, e se entra numa campanha. Depois adicione o bloco em `videos.lista`. A ordem da lista é a ordem no site. Escreva o nicho sempre do mesmo jeito em todos os vídeos dele, para o filtro agrupar certo.
5. Build e publicação, como acima. No modo `'r2'`, se o build disser que não achou o vídeo no bucket, o upload não terminou ou o nome está diferente.

Para tirar um vídeo do site, apague o bloco dele da lista. No modo `'local'`, apague também o `.mp4` e o `.jpg` de `public/videos/` (confirme antes).

### Migrar de `'local'` para `'r2'`

Quando ela ativar o R2:

1. Guie a criação do bucket e o acesso público (passo a passo no `README.md`, parte "Modo R2") e peça a URL pública (`https://pub-....r2.dev`).
2. Peça para ela enviar para o bucket **todos** os `.mp4` e `.jpg` que estão em `public/videos/`. Você abre a pasta para ela.
3. Em `src/data/creator.ts`: `modoDosVideos: 'r2'` e `urlDosVideos: 'https://pub-....r2.dev'`.
4. Rode `npm run build`. Ele confere no bucket se cada vídeo e cada capa estão lá. Só continue quando passar.
5. Com o build passando, apague os vídeos e as capas de `public/videos/` (confirme antes) para o site ficar leve. Eles continuam no histórico do GitHub, e tudo bem.
6. Publique. A partir daí, o `npm run comprimir` salva em `videos-prontos/`, porque ele lê o modo no `creator.ts`.

Para voltar de `'r2'` para `'local'`, faça o caminho inverso: coloque os arquivos em `public/videos/` (todos com até 24 MB) e mude o modo.

## Fotos, logos e prints

- Coloque o arquivo em `src/imagens/` e escreva só o nome no campo (ex.: `foto: 'minha-foto.jpg'`). JPG, PNG ou WEBP. O site gera as versões otimizadas sozinho.
- A foto do topo precisa de `fotoDescricao`: uma descrição curta do que aparece, para leitores de tela (ex.: "Ana sorrindo, segurando um frasco de sérum").
- A imagem de compartilhamento (a prévia que aparece quando o link é colado no WhatsApp) e o ícone da aba são gerados sozinhos a partir da foto, do nome e das cores.

## Pedidos comuns: o que mudar no `creator.ts`

| Pedido | Campo |
|---|---|
| Trocar nome, bio, nicho, foto | `topo` |
| Texto ou destino do botão principal | `topo.botao` (`abre: 'whatsapp' \| 'email' \| 'instagram'`) |
| Esconder ou mostrar uma seção | `mostrar: false` / `true` na seção |
| Trocar o visual | `tema: 'revista' \| 'noite' \| 'rosa' \| 'terra'` ("mais escuro" = `'noite'`) |
| Mudar uma cor | `cores: { fundo, texto, destaque }`, no formato `'#RRGGBB'`; o build avisa se ficar ilegível |
| Campanha (Black Friday, Natal, Dia das Mães) | `campanha.nome`, `campanha.chamada`, `campanha.texto`; os vídeos entram com `campanha: '<mesmo nome>'` |
| Cor do bloco da campanha | `campanha.cor` (padrão: preto; ex.: Natal `'#1F4D36'`). No tema `revista`, o cabeçalho e o topo também ficam nessa cor enquanto a campanha estiver ligada |
| Ver os 4 temas com o conteúdo dela | rode `npm run dev` e passe os links `http://localhost:4321/temas/revista/`, `/temas/noite/`, `/temas/rosa/` e `/temas/terra/` |
| Desligar a campanha | `campanha.mostrar: false` (os vídeos dela voltam para a grade) |
| Vídeos parados até tocar | `videos.previaAutomatica: false` |
| Organizar os vídeos por nicho | campo `nicho` em cada vídeo. Com 2 nichos ou mais, os vídeos aparecem separados por nicho (todos abertos, um bloco embaixo do outro) e com atalhos no alto da seção. A ordem dos nichos é a ordem em que aparecem na lista |
| WhatsApp, e-mail, Instagram, TikTok, mídia kit | `contato` (WhatsApp com 55 + DDD + número) |
| Pacotes, preços e avulsos | `valores` (`pacotes` com `nome`, `detalhe`, `preco`, `descricao` e `etiqueta` opcional para destacar; `avulsos` com `nome` e `preco`). Preço vazio aparece como "Sob consulta". Nunca invente preço: use só o que ela informar |
| Esconder os valores | `valores.mostrar: false` |
| Logos das marcas | `marcas.lista` com `logo: 'arquivo.png'` (arquivo em `src/imagens`; PNG com fundo transparente fica melhor). Com logo, as marcas viram cartões brancos. Só marcas com quem ela trabalhou de verdade |
| Título e descrição no Google | `seo` |
| Endereço do site / domínio próprio | `endereco` |

Uma seção opcional com a lista vazia (`[]`) some sozinha. Os títulos das seções podem ser trocados pelo campo `titulo` de cada uma.

As páginas `/temas/<nome>/` mostram o mesmo conteúdo em cada tema, só para comparar. No computador (`npm run dev`) elas sempre existem. No site publicado, só aparecem enquanto `modoExemplo` for `true`, e nunca entram no Google.

## Quando o build falha

- Erros de conteúdo vêm numa lista em português ("Encontrei 2 problema(s) em src/data/creator.ts: 1. Faltou o nome do arquivo do vídeo 3."). Corrija cada item.
- Erro de sintaxe (vírgula ou aspas faltando) aparece em inglês, com a linha. Normalmente é uma aspa simples dentro do texto (ex.: `d'água`): use aspas duplas por fora (`"pão d'água"`).
- Contraste: se ela escolher uma cor que deixa o texto difícil de ler, o build recusa e diz qual cor ajustar. Sugira um tom mais escuro ou mais claro e mostre como fica.
- Nunca "resolva" um erro desligando a checagem em `src/lib/`. As checagens existem para o site dela não quebrar no ar.

## Mudanças visuais

Se ela pedir algo que o `creator.ts` não cobre (outra fonte, outra ordem de seções, um layout diferente):

- Explique em uma frase o que vai mexer e faça a menor mudança possível.
- Teste no celular (375 px de largura) e no computador antes de publicar.
- Mantenha a acessibilidade: contraste AA, foco visível, texto alternativo em imagens, e vídeo com `preload="none"` e capa.
- Para um tema novo, copie um bloco em `TEMAS` (`src/lib/temas.ts`), troque nome e cores, e use fontes de `FONTES`. Fonte nova exige instalar o pacote `@fontsource/<nome>`.
