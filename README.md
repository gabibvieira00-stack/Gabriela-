# Portfólio UGC

Modelo de portfólio para creators de UGC, feito para a mentoria **Destrava UGC**. Você não precisa saber programar: tudo é feito conversando em português com o Claude Code, que faz as mudanças e publica o site para você.

O site já vem pronto com uma creator fictícia (a "Bia Exemplo"), todas as seções funcionando e 4 visuais para escolher: **Revista**, **Noite**, **Rosa** e **Terra**. Enquanto o site estiver em modo de demonstração, a faixa no topo tem links para ver o mesmo portfólio em cada visual. Você troca o conteúdo pelo seu e pronto.

**O que tem no site:** topo com sua foto e bio, vídeos verticais separados por nicho, bloco de campanha (Black Friday, Natal...), diferenciais, marcas, resultados, como você trabalha, pacotes com valores (cada um com botão direto para o seu WhatsApp) e contato. Abre rápido no celular, que é onde as marcas olham.

---

## Antes de começar

Você vai precisar de:

- Uma conta no **GitHub** (gratuita): https://github.com/signup. É onde fica guardada a "receita" do seu site.
- Uma conta na **Cloudflare** (gratuita): https://dash.cloudflare.com/sign-up. É quem deixa o site no ar.
- O **Claude Code** instalado no computador (o app para Mac ou Windows): https://claude.com/download.

Reserve uns 30 minutos para a primeira vez.

---

## Passo 1: criar o seu repositório a partir do modelo

1. Entre no GitHub com a sua conta.
2. Abra a página deste modelo (o link que a mentoria passou).
3. Clique no botão verde **Use this template** e depois em **Create a new repository**.
4. Em **Repository name**, escreva um nome sem espaço, por exemplo `portfolio`.
5. Escolha **Public** ou **Private** (os dois funcionam).
6. Clique em **Create repository**.

Pronto: agora você tem uma cópia só sua. Copie o endereço da página que abriu (algo como `https://github.com/seu-usuario/portfolio`).

## Passo 2: baixar para o computador com o Claude Code

1. Abra o Claude Code e escolha uma pasta para trabalhar (por exemplo, **Documentos**).
2. Cole este pedido, trocando o endereço pelo seu:
   > Clona o repositório https://github.com/seu-usuario/portfolio aqui nesta pasta.
3. Quando terminar, abra uma **nova conversa** no Claude Code escolhendo a pasta `portfolio` que foi criada. Isso é importante: é assim que ele lê as instruções do projeto.
4. Cole este pedido:
   > É a primeira vez que uso este projeto. Faz a checagem inicial e me diz se falta alguma coisa no meu computador.

Ele confere se está tudo instalado (Node, git, ffmpeg, login no GitHub) e resolve com você o que faltar.

## Passo 3: colocar o site no ar com a Cloudflare Pages

1. Entre em https://dash.cloudflare.com.
2. No menu da esquerda, abra **Workers & Pages**.
3. Clique em **Create application**, escolha **Pages** e depois **Connect to Git**. Em algumas telas o botão aparece como **Import an existing Git repository**.
   - A Cloudflare pode sugerir usar "Workers" em vez de Pages. Para este modelo, escolha **Pages**.
4. Escolha **GitHub** e clique em **Install & Authorize**. Você pode liberar o acesso só ao repositório `portfolio`.
5. Selecione o repositório e clique em **Begin setup**.
6. Na tela **Set up builds and deployments**:
   - **Project name**: vira o endereço do site. Se escolher `bia-ugc`, o site fica em `https://bia-ugc.pages.dev`.
   - **Production branch**: `main`.
   - **Framework preset**: escolha **Astro**. Ele preenche sozinho o **Build command** (`npm run build`) e o **Build output directory** (`dist`). Confira se ficou assim.
7. Clique em **Save and Deploy** e espere de 1 a 2 minutos. Quando aparecer **Success**, o site está no ar.
8. Conte o endereço para o Claude Code:
   > Meu site ficou no ar em https://bia-ugc.pages.dev. Guarda esse endereço.

A partir daí, cada vez que o Claude Code publica uma mudança, a Cloudflare atualiza o site sozinha.

## Passo 4: personalizar

Agora é só pedir. O arquivo [PEDIDOS-PRONTOS.md](PEDIDOS-PRONTOS.md) tem uma lista de pedidos para copiar e colar, por exemplo:

> Troca minha bio por esta: ...

> Coloca meu WhatsApp 11 98765-4321.

> Muda o tema para um mais escuro.

Cada vez que o Claude Code publica, o site atualiza sozinho em 1 a 2 minutos.

Quando todo o conteúdo de exemplo tiver sido trocado pelo seu, peça:

> Tira todo o conteúdo de exemplo que ainda sobrou e desliga a faixa de "portfólio de demonstração".

---

## Onde ficam os vídeos: modo local ou modo R2

O site funciona de dois jeitos. Você escolhe no arquivo de conteúdo (o Claude Code faz a troca).

| | **Modo local** (o padrão) | **Modo R2** |
|---|---|---|
| Onde ficam os vídeos | Junto com o site | Num "HD na nuvem" da Cloudflare (o R2) |
| Precisa de cartão de crédito | Não | Sim, para ativar o R2 (o plano gratuito cobre um portfólio) |
| Tamanho de cada vídeo | Até 24 MB (o Claude Code comprime para caber) | Sem limite prático |
| Para quem é | Quem está começando ou não tem cartão | Quem tem muitos vídeos ou vídeos longos |

Em qualquer modo, o caminho de um vídeo novo é o mesmo: você coloca o arquivo original na pasta `videos-originais` e pede ao Claude Code:

> Coloquei um vídeo novo na pasta videos-originais. É um unboxing para a marca X, foi trabalho pago. Comprime e coloca no portfólio.

No modo R2, ele também explica como arrastar o vídeo para o bucket no painel da Cloudflare.

---

## Modo R2 (opcional): guardar os vídeos na Cloudflare

No modo local você não precisa disto. Use o R2 se quiser guardar vídeos maiores ou muitos vídeos.

**1. Ativar o R2**

1. No painel da Cloudflare, abra **Storage & databases** > **R2** > **Overview**.
2. Na primeira vez, a Cloudflare pede para concluir a assinatura do R2, com uma forma de pagamento, mesmo no plano gratuito. Um portfólio fica bem dentro do gratuito: 10 GB de armazenamento por mês, e quem assiste aos vídeos não gera custo de tráfego.

**2. Criar o bucket** (o "bucket" é a pasta na nuvem onde ficam os vídeos)

1. Clique em **Create bucket**.
2. Dê um nome só com letras minúsculas, números e hífen, por exemplo `portfolio-videos`.
3. Deixe a localização automática e a classe de armazenamento em **Standard** (o gratuito só vale para Standard).
4. Clique em **Create bucket**.

**3. Ligar o acesso público**

1. Dentro do bucket, abra **Settings**.
2. Em **Public Development URL**, clique em **Enable**.
3. Na janela **Allow Public Access?**, digite `allow` e clique em **Allow**.
4. Vai aparecer a **Public Bucket URL**, algo como `https://pub-1234abcd....r2.dev`. Copie esse endereço.

**4. Configurar o site**

Cole este pedido no Claude Code:

> Ativei o R2. A URL pública do meu bucket é https://pub-....r2.dev. Passa meus vídeos para lá.

Ele troca o modo para R2, coloca a URL no arquivo de conteúdo e explica como enviar os vídeos.

**5. Enviar vídeos para o bucket**

Sempre que o Claude Code pedir:

1. No painel, abra **R2** e clique no seu bucket.
2. Clique em **Upload**.
3. Arraste os arquivos `.mp4` e `.jpg` da pasta `videos-prontos` (ele abre a pasta para você). Se a tela aceitar um arquivo por vez, repita para cada um.
4. Espere terminar e avise o Claude Code. Antes de publicar, ele confere se os vídeos chegaram.

> **Sobre o endereço r2.dev:** a Cloudflare avisa que ele tem limite de velocidade e é pensado para testes. Para um portfólio com poucas visitas por dia, funciona bem. Se um dia o portfólio tiver muito acesso, dá para ligar um domínio próprio ao bucket (**Settings** > **Custom Domains** > **Add**) e pedir ao Claude Code para trocar a URL dos vídeos.

## Ativar o aviso de cobrança da Cloudflare

Se você usa só o modo local, não existe cobrança nenhuma e pode pular esta parte.

Com o R2 ativado, a conta passa a ter cobrança por uso, mas só se passar do gratuito, o que um portfólio dificilmente faz. Mesmo assim, deixe um aviso por e-mail ligado:

1. No painel da Cloudflare, abra **Manage Account** > **Billing** > **Billable Usage**. Na página do R2 também aparece um botão **Create budget alert** na lateral.
2. Clique em **Create budget alert**.
3. Preencha:
   - **Alert name**: `Aviso do portfólio`.
   - **Budget threshold (USD)**: `1` (US$ 1).
   - **Email recipients**: o seu e-mail.
4. Clique em **Save**.

O aviso não bloqueia nada, só manda um e-mail (no dia seguinte) se a conta passar desse valor. A Cloudflare também cria sozinha um aviso de US$ 10 em contas que ainda não têm nenhum.

---

## Domínio próprio (opcional)

Se quiser um endereço como `www.seunome.com.br`:

1. No painel da Cloudflare, abra o seu projeto em **Workers & Pages**.
2. Vá em **Custom domains** e clique em **Set up a custom domain**.
3. Siga os passos da tela. Se o domínio foi comprado em outro lugar (Registro.br, por exemplo), a Cloudflare mostra o que precisa ser configurado lá.
4. Depois, peça ao Claude Code:
   > Meu site agora tem o domínio https://www.seunome.com.br. Atualiza o endereço do site.

---

## Problemas comuns

**O site não atualizou.** Espere 2 minutos e recarregue a página. Se ainda não mudou, peça:
> O site não atualizou depois da última mudança. Confere o que aconteceu.

**A Cloudflare mostra "Failed" no deploy.** Peça ao Claude Code:
> A Cloudflare deu erro ao publicar. Roda o build, descobre o problema e corrige.

**A prévia do link no WhatsApp não mostra a foto.** O WhatsApp guarda a prévia antiga por um tempo. Teste mandando o link com `?v=2` no final (ex.: `https://seu-site.pages.dev/?v=2`).

**Um vídeo não aparece.** Peça:
> O vídeo da marca X não aparece no site. Confere o que houve.

**Mensagem de erro em vermelho no Claude Code.** É normal durante as mudanças: ele mesmo lê, corrige e tenta de novo. O site só é publicado quando está tudo certo.

---

## Para curiosos: como o projeto é organizado

- `src/data/creator.ts`: **todo o conteúdo do site** (textos, vídeos, cores, seções). É o único arquivo que você precisa mudar.
- `src/imagens/`: sua foto, logos e prints.
- `videos-originais/`: onde você coloca os vídeos do jeito que gravou (não vão para o GitHub).
- `public/videos/`: os vídeos já comprimidos, no modo local.
- `videos-prontos/`: os vídeos já comprimidos, no modo R2 (você arrasta para o bucket).
- `AGENTS.md` e `CLAUDE.md`: instruções para o assistente de IA. O `AGENTS.md` também é lido por outros assistentes de IA (como o Codex e o Cursor), então você não fica presa a um só.
- `PEDIDOS-PRONTOS.md`: pedidos prontos para colar.

Feito com [Astro](https://astro.build). Site 100% estático: sem servidor, sem banco de dados, sem mensalidade.
