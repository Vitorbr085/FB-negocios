/* =====================================================================
   FB NEGÓCIOS — CONFIGURAÇÃO EDITÁVEL PELO PAINEL
   ---------------------------------------------------------------------
   O painel (/admin) salva as alterações do owner em data/config.json.
   O site carrega, nesta ordem:
     1. /api/config            (quando roda com `npm start`)
     2. o que foi salvo pelo painel neste navegador (modo local / Go Live)
     3. assets/config.json     (para hospedagem estática, ex.: GitHub Pages)
     4. os padrões abaixo
   e aplica por cima do conteúdo de data.js.
   ===================================================================== */
(() => {
  "use strict";

  const PADRAO = {
    versao: 1,
    tema: {
      ativo: "oficial",          // tema escolhido manualmente
      efeitos: true,             // animações do tema (neve, confete...)
      intensidade: "media",      // baixa | media | alta
      permitirDesligar: true,    // mostra ao visitante o botão para pausar efeitos
      agendamento: {
        ativo: true,             // troca o tema sozinho nas datas abaixo
        regras: [
          { tema: "carnaval", inicio: "05-02", fim: "10-02", ativa: true },
          { tema: "saojoao", inicio: "01-06", fim: "30-06", ativa: true },
          { tema: "halloween", inicio: "24-10", fim: "31-10", ativa: true },
          { tema: "natal", inicio: "01-12", fim: "26-12", ativa: true },
        ],
      },
    },
    aviso: {
      ativo: true,               // faixa no topo do site
      usarMensagemDoTema: true,  // nas datas comemorativas usa a mensagem do tema
      texto: "",
      link: "",
    },
    empresa: {},                 // sobrescreve campos de data.js (telefone, WhatsApp, e-mails...)
    numeros: null,               // null = usa os números de data.js
    secoes: {
      assistente: true, seguranca: true, parceiros: true, depoimentos: true,
      time: true, bancos: true, faq: true,
    },
    atualizadoEm: null,
  };

  const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

  /* Mescla profunda: arrays e valores simples de `b` substituem os de `a` */
  function mesclar(a, b) {
    if (!isObj(b)) return b === undefined ? a : b;
    const out = isObj(a) ? { ...a } : {};
    for (const k of Object.keys(b)) out[k] = isObj(b[k]) ? mesclar(out[k], b[k]) : b[k];
    return out;
  }

  /* Aplica no objeto original (mantém as referências usadas pelo site) */
  function aplicarEm(alvo, fonte) {
    for (const k of Object.keys(fonte || {})) {
      const v = fonte[k];
      if (v === null || v === undefined || v === "") continue;
      if (isObj(v) && isObj(alvo[k])) aplicarEm(alvo[k], v);
      else alvo[k] = v;
    }
  }

  async function buscar(url, ms = 1800) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
      const r = await fetch(url, { cache: "no-store", signal: ctrl.signal });
      if (!r.ok) return null;
      return await r.json();
    } catch (_) {
      return null;
    } finally {
      clearTimeout(t);
    }
  }

  async function carregar() {
    let salvo = null, origem = "padrao";
    if (location.protocol.startsWith("http")) {
      salvo = await buscar("/api/config");
      if (salvo) origem = "servidor";
    }
    if (!salvo) {
      // salvo pelo painel em modo local (Go Live / Live Server), só neste navegador
      try { const l = localStorage.getItem("fb-config-local"); if (l) { salvo = JSON.parse(l); origem = "navegador"; } } catch (_) {}
    }
    if (!salvo) {
      salvo = await buscar("assets/config.json");
      if (salvo) origem = "arquivo";
    }
    const cfg = mesclar(PADRAO, salvo || {});
    cfg._origem = origem;
    return cfg;
  }

  /* Aplica empresa/números da config no FB_DATA */
  function aplicarConteudo(D, cfg) {
    if (cfg.empresa) aplicarEm(D.empresa, cfg.empresa);
    if (Array.isArray(cfg.numeros) && cfg.numeros.length) D.numeros = cfg.numeros;
  }

  /* "dd-mm" -> número comparável mmdd */
  const mmdd = (s) => { const [d, m] = String(s).split("-").map(Number); return m * 100 + d; };

  /* Qual tema vale hoje (agendamento > manual) */
  function temaDoDia(cfg, data = new Date()) {
    const ag = cfg.tema && cfg.tema.agendamento;
    if (ag && ag.ativo && Array.isArray(ag.regras)) {
      const hoje = (data.getMonth() + 1) * 100 + data.getDate();
      for (const r of ag.regras) {
        if (!r.ativa || !r.inicio || !r.fim) continue;
        const ini = mmdd(r.inicio), fim = mmdd(r.fim);
        const dentro = ini <= fim ? hoje >= ini && hoje <= fim : hoje >= ini || hoje <= fim; // período que vira o ano
        if (dentro) return { tema: r.tema, porAgendamento: true, regra: r };
      }
    }
    return { tema: (cfg.tema && cfg.tema.ativo) || "oficial", porAgendamento: false };
  }

  window.FBConfig = { PADRAO, mesclar, carregar, aplicarConteudo, temaDoDia };
})();
