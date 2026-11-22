# FB Negócios — novo site

Novo site da **FB Negócios**, promotora de crédito e correspondente bancário de Fortaleza-CE, com a nova identidade visual da marca em **preto e azul**: preto profundo (#05070C), azul-marinho da fachada e um azul vivo nos botões e destaques (#2D5BD8 / #7AA7FF).

Todo o conteúdo vem do site atual ([fbnegociosbr.com.br](https://www.fbnegociosbr.com.br)), do Instagram [@fbnegociosss](https://www.instagram.com/fbnegociosss/) e do [Linktree](https://linktr.ee/fbnegocioss).

![Tecnologias](https://img.shields.io/badge/HTML5-CSS3-JavaScript-e3123b) ![Node](https://img.shields.io/badge/Node.js-%3E%3D18-16154a) ![Dependências](https://img.shields.io/badge/depend%C3%AAncias-0-22c55e)

---

## ✨ O que o site tem

### 1. Microinterações
- Botões "magnéticos", que vão um pouco na direção do mouse.
- Efeito de onda (ripple) ao clicar em qualquer botão.
- Cards de serviço com inclinação 3D e uma luz que segue o mouse.
- Formulário com rótulos flutuantes, máscara de WhatsApp, campo inválido que treme e botão que passa por *carregando → ✓*.
- Caixa de consentimento LGPD animada; ícone do LinkedIn que surge sobre a foto de cada diretor.

### 2. Transições
- Tela de abertura com a logo e um anel que se desenha.
- Título que entra letra por letra, com uma palavra que vai trocando (consignado, portabilidade, FGTS...).
- Seções que aparecem ao rolar, números que contam até o valor e linha do "passo a passo" que se preenche.
- Cabeçalho que some ao descer a página e volta ao subir, com barra de progresso de leitura.
- Menu do celular que abre em círculo.
- Perguntas frequentes que abrem e fecham suavemente.
- Troca de tema claro/escuro que se espalha em círculo a partir do botão.
- Assistente "Qual crédito é ideal pra você?" com etapas que deslizam.

### 3. Parallax
- Manchas de cor do topo que se movem com a rolagem e com o mouse.
- Fotos reais da equipe no topo, trocando a cada 6 s com zoom suave (sala de reunião, Comercial, Atendimento, Operacional e RH).
- Logo em 3D no canto do topo, que gira acompanhando o mouse, com anéis em órbita e os cartões de Produção, Crescimento e Crédito em volta.
- Cards flutuantes e fotos do "Quem somos" em camadas com velocidades diferentes.
- Faixa gigante com textos andando em sentidos opostos.

### Seções
Início (com fotos da equipe) · Bancos parceiros · Quem somos · Números · Por que a FB (no estilo do Portal FB) · Serviços · Assistente de crédito · É golpe ou não? · **Para CORBANs + Digitais de Elite** · Seja parceiro (formulário) · Depoimentos + **Feedbacks de parceiros** (conversas reais do WhatsApp) · **Time de diretores (com LinkedIn)** · Portais dos bancos (com busca) · **FB Informa** (conteúdos para CORBANs + Portal FB) · Perguntas frequentes · Rodapé com o aviso do BACEN · Política de Privacidade.

### Extras
- Tema escuro (padrão) e claro, lembrados no navegador.
- Funciona bem no celular; respeita quem ativa "reduzir movimento" no sistema.
- SEO: título, descrição, Open Graph e dados estruturados (schema.org).
- Links para WhatsApp, Instagram, LinkedIn, TikTok, Portal FB e Comunidade do WhatsApp.
- Botão **FB Informa** no menu, com selo "novo".
- Servidor Node.js **sem nenhuma dependência** que guarda as mensagens do formulário. Publicado sem servidor (GitHub Pages), o formulário envia pelo WhatsApp.

---

## 📁 Estrutura

```
fb-negocios/
├── index.html                  # página principal
├── politica-de-privacidade.html
├── admin.html                  # painel administrativo (endereço secreto)
├── server.js                   # servidor Node (site, painel, login e API)
├── package.json
├── robots.txt
├── assets/
│   ├── css/style.css           # todo o visual do site
│   ├── css/admin.css           # visual do painel
│   ├── js/data.js              # ⭐ TODO O CONTEÚDO DO SITE (edite aqui)
│   ├── js/main.js              # animações e interações
│   ├── js/config.js            # carrega a configuração salva pelo painel
│   ├── js/themes.js            # temas sazonais e efeitos
│   ├── js/admin.js             # lógica do painel
│   └── img/
│       ├── logo.svg            # logo vetorizada (FB branco em círculo azul-marinho)
│       ├── fb-mark.svg         # só o "FB" branco
│       ├── favicon.svg
│       ├── topo/               # fotos do topo e do Quem somos (sala de reunião, equipe, Comercial, Atendimento)
│       ├── bastidores/         # cenas do vídeo institucional usadas no topo (Operacional e RH)
│       ├── time/               # fotos dos diretores
│       ├── fotos/              # fotos do escritório
│       └── bancos/             # logos dos bancos
├── scripts/baixar-imagens.js   # baixa as imagens do site atual
└── data/                       # mensagens, config do painel e senha (criado sozinho, fora do Git)
```

---

## 🚀 Como rodar no VS Code

**Pré-requisito:** [Node.js](https://nodejs.org) 18 ou mais novo. Não precisa instalar mais nada.

1. Descompacte o zip e abra a pasta `fb-negocios` no VS Code (*Arquivo → Abrir pasta*).
2. Abra o terminal (*Terminal → Novo terminal*) e rode:

   ```bash
   npm run imagens   # baixa fotos e logos dos bancos do site atual (só uma vez)
   npm start
   ```

3. Acesse **http://localhost:3000**.

> Use `npm run dev` para o servidor reiniciar sozinho quando você salvar o `server.js`.

### 📸 Foto do José Guilherme
A foto do José Guilherme já está em `assets/img/time/jose-guilherme.png` e aparece no card do diretor.

### Imagens
- O site funciona mesmo sem rodar `npm run imagens`: ele busca as fotos no site atual como reserva.
- As fotos originais têm até 4000 px e deixam o site pesado. Para otimizar, redimensione para ~1200 px (fotos) e ~600 px (diretores), por exemplo em [squoosh.app](https://squoosh.app), mantendo os mesmos nomes de arquivo.

---

## ✏️ Como editar o conteúdo

Tudo fica em **`assets/js/data.js`**: telefones, WhatsApp, serviços, números, depoimentos, diretores, bancos, perguntas frequentes. O layout se ajusta sozinho.

**Adicionar um diretor:**
```js
{
  nome: "Nome Sobrenome", cargo: "COO",
  linkedin: "https://www.linkedin.com/in/perfil/",
  foto: { local: "assets/img/time/nome.jpg", remota: "" },
},
```

**Contato:** o e-mail oficial é `contato@finanbankbr.com.br`. O SAC fica oculto enquanto não houver e-mail definido.

**Fotos do topo:** ficam na lista `topo` do `data.js`, na ordem em que aparecem. O campo `pos` ajusta o enquadramento (ex.: `pos: "50% 40%"`).

> **Atenção:** o que for salvo pelo painel administrativo (números, e-mails, telefones) vale por cima do `data.js`. Se um número ou e-mail antigo continuar aparecendo, confira o que está salvo no painel.

---

## 📬 Mensagens do formulário

Com `npm start`, cada envio fica salvo em `data/mensagens.json` e aparece no terminal.

Para ver as mensagens pelo navegador, inicie com uma senha:

```bash
# Windows (PowerShell)
$env:ADMIN_TOKEN="senha-forte"; npm start
# macOS / Linux
ADMIN_TOKEN=senha-forte npm start
```

e acesse `http://localhost:3000/api/contatos?token=senha-forte`.

O servidor valida os campos, limita 5 envios por minuto por IP, tem um campo-armadilha contra robôs e só expõe os arquivos públicos do site.

---

## 🛠 Painel administrativo (`/admin`)

Com o servidor ligado (`npm start`), o terminal mostra o endereço do painel e o login inicial:

```
  Painel: http://localhost:3000/admin
  Login do painel: admin / ••••••••  (temporária: troque no painel em Segurança)
```

Por segurança, o site **não tem link para o painel**: só entra quem conhece o endereço.

**Primeiro acesso (faça nesta ordem):**
1. Entre com o login mostrado no terminal.
2. Em **Segurança e backup**, troque a senha temporária (o painel avisa até você trocar).
3. No mesmo lugar, troque o **endereço secreto do painel** (ex.: `/gestao-fb-k7`). A partir daí, `/admin` mostra "não encontrado" e só você sabe onde fica a entrada. Guarde o endereço nos favoritos.

A senha (criptografada) e o endereço ficam em `data/admin.json`, que não vai para o GitHub. A opção **Manter conectado** guarda o login por 30 dias naquele computador.

Para fixar usuário, senha e endereço pelo servidor (útil ao hospedar):

```bash
# Windows (PowerShell)
$env:ADMIN_USER="fulano"; $env:ADMIN_PASSWORD="minha-senha-forte"; $env:ADMIN_PATH="/gestao-fb-k7"; npm start
# macOS / Linux
ADMIN_USER=fulano ADMIN_PASSWORD=minha-senha-forte ADMIN_PATH=/gestao-fb-k7 npm start
```

### Abrir o painel pelo Go Live (Live Server)
Sem rodar o servidor, clique em **Go Live** no VS Code e abra `admin.html` (ex.: `http://127.0.0.1:5500/admin.html`). O painel entra em **modo local**:
- o login é conferido no próprio navegador (usuário `admin` e a senha temporária mostrada no terminal ao rodar `npm start`, ou a que você definiu no modo local);
- temas, agendamento, avisos e contatos ficam salvos **neste navegador**, e o site aberto pelo Go Live já aparece com as mudanças;
- para publicar de verdade, use **Segurança e backup → Baixar config.json** e coloque o arquivo em `assets/config.json`;
- mensagens do formulário e o endereço secreto só funcionam com o servidor (`npm start`).

> O modo local é para trabalhar no seu computador. Online, use o servidor (`npm start`), onde a senha fica protegida no servidor.

### O que dá para fazer no painel
| Área | Recursos |
|---|---|
| **Visão geral** | Tema no ar hoje, mensagens novas, próximas datas comemorativas e últimas mensagens |
| **Temas** | 6 temas com **prévia ao vivo** (computador e celular): Oficial, Clássico, Natal, Carnaval, São João e Halloween. Liga/desliga efeitos, intensidade e modo lanterna |
| **Agendamento** | Troca o tema sozinho nas datas comemorativas, com linha do tempo do ano |
| **Conteúdo** | Faixa de aviso no topo, telefones e WhatsApp, e-mails, endereço, "FB em números" e mostrar/esconder seções |
| **Mensagens** | Contatos do formulário, com filtro, busca, status (nova, em atendimento, concluída), WhatsApp em um clique e exportação para CSV |
| **Segurança e backup** | Troca de senha, endereço secreto do painel e download/importação do `config.json` |

Tudo é salvo em `data/config.json` e o site aplica na hora. `Ctrl + S` salva.

### Temas sazonais
| Tema | Efeitos |
|---|---|
| 🎄 **Natal** | Neve caindo no topo e na chamada final, pisca-pisca no menu, neve acumulada nos cards, gorro na logo, **bonecos de neve, pinheiros e presentes** nas seções e uma cena de neve com estrelas no rodapé |
| 🎉 **Carnaval** | Confete caindo, serpentinas, explosão de confete a cada clique, confete em volta da logo e **máscaras de colombina** nas seções e no rodapé |
| 🌽 **São João** | Bandeirinhas no menu e nas seções, faíscas de fogueira subindo, xadrez na faixa de números, chapéu de palha na logo e **espantalhos, milhos e fogueira acesa** nas seções e no rodapé |
| 🎃 **Halloween** | Morcegos voando, lua, neblina, aranha descendo, chapéu de bruxa, **abóboras que brilham, fantasminhas flutuando e lápides** nas seções e no rodapé, e **modo lanterna** opcional (o cursor ilumina o topo) |
| **Clássico** | A identidade antiga (vermelho e azul) |

Em todos os temas sazonais, os títulos ganham a cor e um ícone do tema, os cards e botões ganham brilho na cor do tema e o rodapé fica temático. Os chapéus da logo têm o tamanho certo para encaixar sobre o "FB". Os personagens dão um pulinho quando o mouse passa e aparecem nas laterais em telas a partir de 1300 px.

Os efeitos usam canvas leve: pausam fora da tela e com a aba escondida, são reduzidos no celular e desligados para quem ativa "reduzir movimento" no sistema. O visitante também pode pausá-los pelo botão ✨.

Para ver um tema sem mudar nada no ar, abra o site com `?tema=natal` (ou `carnaval`, `saojoao`, `halloween`, `classico`).

### Site sem servidor (GitHub Pages)
O painel precisa do `npm start` para salvar. Para publicar no GitHub Pages: configure no painel rodando no seu computador, clique em **Baixar config.json** e coloque o arquivo em `assets/config.json` antes de subir. O site lê esse arquivo automaticamente.

---

## 🐙 Subir para o GitHub

```bash
git init
git add .
git commit -m "Novo site FB Negócios"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/fb-negocios.git
git push -u origin main
```

(Crie antes o repositório vazio `fb-negocios` em github.com → *New repository*.)

### Publicar de graça no GitHub Pages
1. No repositório: *Settings → Pages*.
2. Em *Source*, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)` → *Save*.
3. Em 1 ou 2 minutos o site fica em `https://SEU-USUARIO.github.io/fb-negocios/`.

No GitHub Pages não há servidor, então o formulário abre o WhatsApp com a mensagem pronta.
Para guardar as mensagens no servidor, publique em um serviço que roda Node.js (Render, Railway, Fly.io...) com o comando `npm start`.

---

## 🧱 Tecnologias

- HTML5 semântico, CSS3 (variáveis, grid, `color-mix`, View Transitions) e JavaScript puro, sem frameworks.
- `IntersectionObserver` para as animações de rolagem e `requestAnimationFrame` para o parallax.
- Node.js (módulos nativos `http`, `fs`, `path`) no servidor.
- Fontes Sora e Inter (Google Fonts).

---

© FB Negócios — Grupo FB Negócios, CNPJ 54.540.530/0001-26. Correspondente bancário conforme a Resolução nº 3.954 do BACEN.
