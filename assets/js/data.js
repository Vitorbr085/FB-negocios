/* =====================================================================
   FB NEGÓCIOS — CONTEÚDO DO SITE
   ---------------------------------------------------------------------
   Todo o texto do site mora aqui. Para alterar um telefone, um serviço
   ou um diretor, edite este arquivo — o layout se ajusta sozinho.
   Fontes: www.fbnegociosbr.com.br, instagram.com/fbnegociosss e
   linktr.ee/fbnegocioss (levantados em 14/11/2026).
   ===================================================================== */

const SITE_ATUAL = "https://www.fbnegociosbr.com.br/img/";

window.FB_DATA = {
  empresa: {
    nome: "FB Negócios",
    tipo: "Promotora de Crédito",
    slogan: "As melhores soluções para os nossos parceiros",
    bioInstagram: "O Parceiro dos CORBANs que te ensina a produzir R$ 1 milhão em 6 meses.",
    missao:
      "Nossa Missão é Garantir a Excelência na entrega de serviços financeiros, facilitando o acesso ao crédito de aposentados, pensionistas e servidores.",
    telefone: "0800 878 0163",
    telefoneLink: "08008780163",
    whatsapp: { numero: "5585996732850", exibicao: "(85) 99673-2850" },
    whatsappContato: { numero: "5585997108063", exibicao: "(85) 99710-8063" },
    whatsappParceiro: { numero: "558598168392", exibicao: "(85) 9816-8392" },
    mensagemWhatsapp: "Olá FB Negócios",
    endereco: "R. 111, N 11 Altos, Conjunto Ceará, Fortaleza-CE",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=R.+111%2C+11+Conjunto+Cear%C3%A1%2C+Fortaleza+-+CE",
    // No site atual os e-mails aparecem como "contato@FB Negóciosbr.com.br" (erro de digitação).
    emails: {
      contato: "contato@fbnegociosbr.com.br", // CONFIRMAR
      sac: "sac@fbnegociosbr.com.br",         // CONFIRMAR
      dpo: "lucasbessa@fbnegociosbr.com.br",  // CONFIRMAR
    },
    cnpj: "46.373.165/0001-00",
    grupo: { nome: "Grupo FB Negócios", cnpj: "54.540.530/0001-26" },
    portal: "https://portalfb.base44.app/",
    comunidadeWhatsapp: "https://chat.whatsapp.com/EZOZi9XEFrF7rpmH6v7fB7",
    redes: {
      instagram: "https://www.instagram.com/fbnegociosss/",
      instagramUser: "@fbnegociosss",
      linkedin: "https://www.linkedin.com/company/79660235",
      tiktok: "https://www.tiktok.com/@fbnegocioss",
      facebook: "https://www.facebook.com/FB",
    },
  },

  heroPalavras: ["consignado", "portabilidade", "refinanciamento", "Saque FGTS", "crédito CLT"],

  numeros: [
    { valor: 3000, prefixo: "", sufixo: "", rotulo: "Parceiros felizes" },
    { valor: 70, prefixo: "R$ ", sufixo: " mi", rotulo: "Produção mensal" },
    { valor: 180, prefixo: "", sufixo: "", rotulo: "Funcionários" },
    { valor: 300, prefixo: "", sufixo: "%", rotulo: "De crescimento nos últimos anos" },
  ],

  sobre: {
    titulo: "O melhor e mais preparado time de suporte",
    texto:
      "Diferentemente das demais, a FB Negócios possui um ambiente descontraído e receptivo, com o intuito de motivar o time e promover o melhor atendimento para com nossos parceiros.",
    valores: ["Respeito", "Transparência", "Foco no Cliente", "Trabalho em Equipe"],
    fotos: {
      principal: { local: "assets/img/fotos/about.jpg", remota: SITE_ATUAL + "about.jpg" },
      sala: { local: "assets/img/fotos/sala.jpg", remota: SITE_ATUAL + "sala.jpg" },
      call: { local: "assets/img/fotos/call.jpg", remota: SITE_ATUAL + "call.jpg" },
    },
  },

  diferenciais: [
    { icone: "team", titulo: "Equipe Qualificada", texto: "Equipe altamente treinada pelos melhores gerentes do setor de consignado do Brasil." },
    { icone: "home", titulo: "Ambiente adequado", texto: "Estamos constantemente melhorando o nosso ambiente de trabalho, visando o melhor para com os nossos funcionários e clientes." },
    { icone: "percent", titulo: "Melhores Taxas", texto: "Com ajuda de nossos profissionais, disponibilizamos a você a melhor taxa para a realização de seu empréstimo." },
    { icone: "support", titulo: "Suporte FB Negócios", texto: "Equipe de suporte disponível a tirar todas as dúvidas de nossos clientes." },
  ],

  servicos: [
    {
      id: "loas", icone: "shield", titulo: "LOAS Espécie 87 e 88",
      texto: "Com a regulamentação da Lei Orgânica da Assistência Social – LOAS, foi determinada a concessão dos amparos assistenciais. São duas as espécies: a 87, para portadores de deficiência, e a 88, para idosos com 65 anos ou mais.",
    },
    {
      id: "refin", icone: "refresh", titulo: "Refinanciamento",
      texto: "Refinanciamento de empréstimo consignado é uma forma de obter crédito, a partir do empréstimo atual, sem a necessidade de assumir uma nova parcela, ou seja, um novo empréstimo.",
    },
    {
      id: "port", icone: "swap", titulo: "Portabilidade",
      texto: "Portabilidade de crédito é a transferência de um contrato de crédito de uma instituição financeira para outra instituição financeira, mediante a solicitação do cliente.",
    },
    {
      id: "energia", icone: "bolt", titulo: "Empréstimo na conta de energia",
      texto: "Com o empréstimo na conta de luz você pode ser aprovado entre R$ 500,00 até R$ 2.200,00, mesmo negativado, sem comprovar renda e paga as parcelas direto na sua conta de energia!",
    },
    {
      id: "fgts", icone: "wallet", titulo: "Saque FGTS",
      texto: "Com a publicação da Lei 13.932 de 2019, o trabalhador que possui conta vinculada do FGTS pode optar pela sistemática do Saque Aniversário, que permite a retirada de parte do saldo, anualmente, no mês do seu aniversário.",
    },
    {
      id: "clt", icone: "briefcase", titulo: "Crédito CLT",
      texto: "Crédito para trabalhadores com carteira assinada, com simulação multibanco feita pelo nosso time. Fale com a gente e simule o seu crédito CLT.",
    },
  ],

  /* Assistente "Qual crédito é ideal pra você?" — só indica o serviço,
     não promete taxa nem valor. */
  assistente: {
    perfis: [
      { id: "inss", rotulo: "Aposentado ou pensionista do INSS", emoji: "👵" },
      { id: "servidor", rotulo: "Servidor público", emoji: "🏛️" },
      { id: "loas", rotulo: "Recebo LOAS / BPC", emoji: "🤝" },
      { id: "clt", rotulo: "Trabalho de carteira assinada", emoji: "💼" },
      { id: "outro", rotulo: "Nenhum desses", emoji: "🙋" },
    ],
    objetivos: [
      { id: "novo", rotulo: "Quero dinheiro novo" },
      { id: "parcela", rotulo: "Já tenho empréstimo e quero mais crédito" },
      { id: "taxa", rotulo: "Quero uma taxa melhor no meu empréstimo" },
    ],
    // regra: perfil + objetivo -> ids de serviços recomendados
    regras: {
      inss: { novo: ["port", "refin"], parcela: ["refin"], taxa: ["port"] },
      servidor: { novo: ["refin"], parcela: ["refin"], taxa: ["port"] },
      loas: { novo: ["loas"], parcela: ["refin", "loas"], taxa: ["port"] },
      clt: { novo: ["clt", "fgts"], parcela: ["clt"], taxa: ["port", "clt"] },
      outro: { novo: ["energia", "fgts"], parcela: ["energia"], taxa: ["energia"] },
    },
  },

  /* Sistema para parceiros, divulgado no Instagram */
  digitaisDeElite: {
    titulo: "Digitais de Elite",
    subtitulo: "O sistema que simplifica a operação do CORBAN.",
    recursos: [
      { titulo: "Simulação multibanco", texto: "Simule CLT em vários bancos de uma vez, sem abrir dezenas de portais." },
      { titulo: "Crefaz e Bolsa Família", texto: "Simulação Bolsa Família em menos de 1 minuto e simulação Crefaz no mesmo lugar." },
      { titulo: "Digitação simplificada", texto: "Menos burocracia e mais agilidade na rotina de digitação das propostas." },
      { titulo: "Acompanhamento de propostas", texto: "Todas as propostas acompanhadas em um só painel." },
    ],
    cta: "Ainda não tem acesso? Fale com seu Gerente Comercial.",
  },

  parceria: {
    titulo: "Seja nosso parceiro!",
    texto: "Preencha o formulário e nosso gerente comercial irá entrar em contato com você.",
    destaque: "+2 mil CORBANs já estão produzindo conosco. E você?",
    passos: [
      { titulo: "Cadastro", texto: "Envie seus dados pelo formulário ou WhatsApp." },
      { titulo: "Gerente dedicado", texto: "Um gerente comercial entra em contato com você." },
      { titulo: "Treinamento", texto: "Capacitação com quem é referência no consignado." },
      { titulo: "Produção", texto: "Acesso ao portfólio, aos bancos e ao Digitais de Elite." },
    ],
  },

  depoimentos: [
    { nome: "Ivoneide Barbosa", perfil: "Pensionista", texto: "Tive o melhor atendimento e a menor taxa para meu empréstimo" },
    { nome: "Marcelo Calvalcante", perfil: "Servidor", texto: "Excelente atendimento, nota 10!" },
    { nome: "João da Costa", perfil: "Aposentado", texto: "Gostei muito do atendimento" },
    { nome: "Silvia Maria", perfil: "Aposentada", texto: "O dinheiro caiu muito rapido na minha conta" },
  ],

  /* Time de diretores. "foto.local" é a cópia dentro do projeto
     (baixe com `npm run imagens`); "foto.remota" é usada se a local faltar. */
  diretores: [
    {
      nome: "Herison Bessa", cargo: "CEO",
      linkedin: "https://www.linkedin.com/in/herison-bessa-6949b31a5/",
      foto: { local: "assets/img/time/herison.jpg", remota: SITE_ATUAL + "herison.jpg" },
    },
    {
      nome: "Caio Fonseca", cargo: "CFO",
      linkedin: "https://www.linkedin.com/in/caio-fonseca-760474182/",
      foto: { local: "assets/img/time/caio.jpg", remota: SITE_ATUAL + "caio.jpg" },
    },
    {
      nome: "Lucas Bessa", cargo: "CTO",
      linkedin: "https://www.linkedin.com/in/lucasbessaaraujo/",
      foto: { local: "assets/img/time/lucas.jpg", remota: SITE_ATUAL + "lucas.jpg" },
    },
    {
      nome: "José Guilherme", cargo: "Superintendente",
      linkedin: "https://www.linkedin.com/in/jos%C3%A9-guilherme-8a159124a/",
      // Salve a foto do LinkedIn dele com este nome dentro de assets/img/time/
      foto: { local: "assets/img/time/jose-guilherme.jpg", remota: "" },
    },
  ],

  /* Bancos e portais de acesso (lista "Contatos dos bancos que operamos") */
  bancos: [
    { nome: "Facta", logo: "facta.JPG", portal: "http://desenv.facta.com.br/sistemaNovo/login.php" },
    { nome: "Itaú", logo: "itau.JPG", portal: "https://www.ibconsigweb.com.br/principal/fsconsignataria.jsp" },
    { nome: "Olé Consignado", logo: "ole.JPG", portal: "https://ola.oleconsignado.com.br/Usuario/Index" },
    { nome: "Banco Paulista", logo: "paulista.JPG", portal: "https://consignado.bancopaulista.com.br/WEBFIMENUMVC/LOGIN/AC.UI.LOGIN.ASPX" },
    { nome: "Quero+ Crédito", logo: "queromais.JPG", portal: "" },
    { nome: "Banco Master", logo: "master.JPG", portal: "" },
    { nome: "Daycoval", logo: "daycoval.jpg", portal: "https://consignado.daycoval.com.br/AUTORIZADOR/LOGIN/AC.UI.LOGIN.ASPX" },
    { nome: "Bradesco", logo: "bradesco.JPG", portal: "https://www.bradescopromotoranet.com.br/Login.aspx" },
    { nome: "PAN", logo: "pan.jpg", portal: "https://panconsig.pansolucoes.com.br/FIMENU/Login/AC.UI.LOGIN.aspx" },
    { nome: "Crefaz", logo: "crefaz.JPG", portal: "https://crefaz.com.br/webagente+/" },
    { nome: "Safra", logo: "safra.JPG", portal: "https://epfweb.safra.com.br/Home/Login" },
    { nome: "Banrisul", logo: "banrisul.JPG", portal: "https://bemweb.bempromotora.com.br/autenticacao/login" },
    { nome: "BMG", logo: "bmg.JPG", portal: "https://www.bmgconsig.com.br/principal/fsconsignataria.jsp" },
    { nome: "C6 Consig", logo: "c6.JPG", portal: "https://c6.c6consig.com.br/WebAutorizador/Login/AC.UI.LOGIN.aspx" },
    { nome: "Crefisa", logo: "crefisa.JPG", portal: "https://sfc.sistemascr.com.br/autorizador/Login/AC.UI.LOGIN.aspx" },
  ],
  bancosPastaLocal: "assets/img/bancos/",
  bancosPastaRemota: SITE_ATUAL,

  vagas: {
    titulo: "Trabalhe na FB",
    texto: "Vem fazer parte do time! Abrimos vagas com frequência para Consultores de Vendas e para a equipe de Cadastros e Senhas.",
  },

  faq: [
    { p: "A FB Negócios é um banco?", r: "Não. A FB Negócios é uma promotora de crédito e correspondente bancário, de acordo com a Resolução nº 3.954 do Banco Central do Brasil. Intermediamos as operações com os bancos parceiros." },
    { p: "Quem pode contratar o crédito consignado?", r: "Aposentados e pensionistas do INSS, servidores públicos e beneficiários do LOAS, além das opções de crédito CLT, Saque-Aniversário FGTS e empréstimo na conta de energia." },
    { p: "O que é a portabilidade?", r: "É levar o seu contrato de empréstimo de um banco para outro, a seu pedido, em busca de condições melhores." },
    { p: "Posso contratar o empréstimo na conta de luz estando negativado?", r: "Sim. Nessa modalidade você pode ser aprovado entre R$ 500,00 e R$ 2.200,00, mesmo negativado e sem comprovar renda, pagando as parcelas na própria conta de energia." },
    { p: "Sou CORBAN. Como me torno parceiro FB?", r: "Preencha o formulário “Seja nosso parceiro” ou chame no WhatsApp. Um gerente comercial entra em contato para apresentar o portfólio, os bancos, o treinamento e o sistema Digitais de Elite." },
    { p: "A FB pede depósito antecipado?", r: "Não. Como correspondente bancário, a FB Negócios não está autorizada a receber depósitos ou pagamentos de qualquer natureza. Desconfie de quem pedir." },
  ],

  bacen: {
    titulo: "ATENÇÃO!",
    texto: "Essa empresa é uma correspondente bancária, de acordo com a resolução nº 3954 do Banco Central do Brasil, BACEN, de 24/02/2011.",
    naoAutorizada: [
      "Efetuar a abertura de contas correntes;",
      "Receber pagamentos de contas;",
      "Receber depósitos de qualquer outra natureza (para conta corrente, poupança e etc).",
    ],
  },
};
