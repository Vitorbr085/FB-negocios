# FB Negócios — novo site

Novo site da **FB Negócios**, promotora de crédito e correspondente bancário de Fortaleza-CE, com a nova identidade visual da marca (degradê vermelho → azul-marinho da logo).

Todo o conteúdo vem do site atual ([fbnegociosbr.com.br](https://www.fbnegociosbr.com.br)), do Instagram [@fbnegociosss](https://www.instagram.com/fbnegociosss/) e do [Linktree](https://linktr.ee/fbnegocioss).

![Tecnologias](https://img.shields.io/badge/HTML5-CSS3-JavaScript-e3123b) ![Node](https://img.shields.io/badge/Node.js-%3E%3D18-16154a) ![Dependências](https://img.shields.io/badge/depend%C3%AAncias-0-22c55e)

---

## ✨ O que o site tem

### 1. Microinterações
- Cursor personalizado que cresce sobre links e botões.
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
- Logo em 3D que gira acompanhando o mouse, com anéis em órbita.
- Cards flutuantes e fotos do "Quem somos" em camadas com velocidades diferentes.
- Faixa gigante com textos andando em sentidos opostos.

### Seções
Início · Bancos parceiros · Quem somos · Números · Por que a FB · Serviços · Assistente de crédito · **Para CORBANs + Digitais de Elite** · Seja parceiro (formulário) · Depoimentos · **Time de diretores (com LinkedIn)** · Portais dos bancos (com busca) · Trabalhe na FB · Perguntas frequentes · Rodapé com o aviso do BACEN · Política de Privacidade.

### Extras
- Tema escuro (padrão) e claro, lembrados no navegador.
- Funciona bem no celular; respeita quem ativa "reduzir movimento" no sistema.
- SEO: título, descrição, Open Graph e dados estruturados (schema.org).
- Botão flutuante do WhatsApp e links para Instagram, LinkedIn, TikTok, Portal FB e Comunidade do WhatsApp.
- Servidor Node.js **sem nenhuma dependência** que guarda as mensagens do formulário. Publicado sem servidor (GitHub Pages), o formulário envia pelo WhatsApp.

---

## 📁 Estrutura

```
fb-negocios/
├── index.html                  # página principal
├── politica-de-privacidade.html
├── server.js                   # servidor Node (site + API do formulário)
├── package.json
├── robots.txt
├── assets/
│   ├── css/style.css           # todo o visual
│   ├── js/data.js              # ⭐ TODO O CONTEÚDO DO SITE (edite aqui)
│   ├── js/main.js              # animações e interações
│   └── img/
│       ├── logo.svg            # logo vetorizada (círculo com degradê)
│       ├── fb-mark.svg         # só o "FB" branco
│       ├── favicon.svg
│       ├── time/               # fotos dos diretores
│       ├── fotos/              # fotos do escritório
│       └── bancos/             # logos dos bancos
├── scripts/baixar-imagens.js   # baixa as imagens do site atual
└── data/                       # mensagens do formulário (criado sozinho)
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

**Pontos para confirmar** (marcados com `// CONFIRMAR` no `data.js`): os e-mails. No site atual eles aparecem com erro de digitação (`contato@FB Negóciosbr.com.br`); usei `@fbnegociosbr.com.br`.

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
