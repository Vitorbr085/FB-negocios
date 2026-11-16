/* =====================================================================
   FB NEGÓCIOS — PAINEL ADMINISTRATIVO
   ===================================================================== */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const { PADRAO, mesclar, temaDoDia } = window.FBConfig;
  const TEMAS = window.FBThemes.TEMAS;
  const D = window.FB_DATA;

  const SECOES = [
    ["assistente", "Assistente “Qual crédito é ideal?”"], ["seguranca", "Quiz “É golpe ou não?”"], ["parceiros", "Para CORBANs / Digitais de Elite"],
    ["depoimentos", "Depoimentos"], ["time", "Time de diretores"], ["bancos", "Contatos dos bancos"], ["faq", "Perguntas frequentes"],
  ];
  const STATUS = { novo: "Nova", "em-atendimento": "Em atendimento", concluido: "Concluída" };
  const TITULOS = { visao: "Visão geral", temas: "Temas", agenda: "Agendamento", conteudo: "Conteúdo", mensagens: "Mensagens", seguranca: "Segurança e backup" };

  let token = null, salvo = null, cfg = null, leads = [], temaPrevia = null, temSevidor = location.protocol.startsWith("http");
  /* Modo local: painel aberto pelo Live Server (Go Live) ou sem o servidor Node.
     O login é conferido no navegador e as alterações ficam salvas neste navegador
     (localStorage), que o site aberto no mesmo endereço também lê. */
  let modoLocal = false;
  const LOCAL_CFG = "fb-config-local", LOCAL_CRED = "fb-admin-local";
  const SENHA_PADRAO_HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"; // admin123
  async function sha256(txt) {
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(txt));
      return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    return "plain:" + txt;
  }
  const credLocal = () => { try { return JSON.parse(localStorage.getItem(LOCAL_CRED)) || null; } catch (_) { return null; } };
  const senhaLocalTemporaria = () => { const c = credLocal(); return !c || c.hash === SENHA_PADRAO_HASH; };
  async function detectarServidor() {
    if (!temSevidor) return false;
    try {
      const r = await fetch("/api/sessao", { cache: "no-store" });
      return r.status === 401 || r.ok; // o servidor do projeto responde 401 sem login
    } catch (_) { return false; }
  }
  try { token = localStorage.getItem("fb-admin-token") || sessionStorage.getItem("fb-admin-token"); } catch (_) {}
  const guardarToken = (t, lembrar) => {
    try {
      localStorage.removeItem("fb-admin-token"); sessionStorage.removeItem("fb-admin-token");
      if (t) (lembrar ? localStorage : sessionStorage).setItem("fb-admin-token", t);
    } catch (_) {}
  };
  const tokenLembrado = () => { try { return !!localStorage.getItem("fb-admin-token"); } catch (_) { return false; } };

  /* ---------------- utilidades ---------------- */
  let toastT;
  function toast(msg, tipo = "") {
    const t = $("#toast"); t.textContent = msg; t.className = `toast is-visible ${tipo}`;
    clearTimeout(toastT); toastT = setTimeout(() => (t.className = "toast"), 3600);
  }
  async function api(url, opts = {}) {
    const r = await fetch(url, { ...opts, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(opts.headers || {}) } });
    let body = null; try { body = await r.json(); } catch (_) {}
    if (r.status === 401 && url !== "/api/login") { sair(true); throw new Error((body && body.erro) || "Sessão expirada."); }
    if ((r.status === 404 || r.status === 405) && !(body && body.erro)) throw new Error("O painel precisa do servidor do projeto. No terminal, rode npm start e abra http://localhost:3000/admin");
    if (!r.ok) throw new Error((body && body.erro) || `Erro ${r.status}`);
    return body;
  }
  const fmtData = (iso) => iso ? new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
  const fmtTel = (n) => { const d = String(n || "").replace(/\D/g, "").replace(/^55/, ""); return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d.length === 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}` : n; };
  const logoURL = (chave) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(window.FBThemes.svgLogo(TEMAS[chave] || TEMAS.oficial, markD));
  let markD = null;

  /* ---------------- login ---------------- */
  async function entrar(e) {
    e.preventDefault();
    const usuario = $("#loginUsuario").value.trim(), senha = $("#loginSenha").value, lembrar = $("#loginLembrar").checked;
    const err = $("#loginErro"), btn = $("#loginBtn");
    err.textContent = "";
    if (!usuario) { err.textContent = "Digite o usuário."; $("#loginUsuario").focus(); return; }
    if (!senha) { err.textContent = "Digite a senha."; $("#loginSenha").focus(); return; }
    btn.disabled = true; btn.textContent = "Entrando…";
    if (modoLocal) {
      try {
        await new Promise((r) => setTimeout(r, 350));
        const c = credLocal() || { usuario: "admin", hash: SENHA_PADRAO_HASH };
        if (usuario.toLowerCase() !== String(c.usuario).toLowerCase() || (await sha256(senha)) !== c.hash) throw new Error("Usuário ou senha incorretos.");
        token = "local"; guardarToken(token, lembrar);
        $("#loginSenha").value = "";
        await abrirApp();
      } catch (x) {
        err.textContent = x.message; $(".login__card").classList.remove("shake"); void $(".login__card").offsetWidth; $(".login__card").classList.add("shake");
      } finally { btn.disabled = false; btn.textContent = "Entrar"; }
      return;
    }
    try {
      const r = await api("/api/login", { method: "POST", body: JSON.stringify({ usuario, senha, lembrar }) });
      token = r.token; guardarToken(token, lembrar);
      $("#loginSenha").value = "";
      $("#tempBanner").hidden = !r.temporaria;
      api("/api/sessao").then(preencherCaminho).catch(() => {});
      await abrirApp();
    } catch (x) {
      err.textContent = x.message; $(".login__card").classList.remove("shake"); void $(".login__card").offsetWidth; $(".login__card").classList.add("shake");
    } finally { btn.disabled = false; btn.textContent = "Entrar"; }
  }
  function sair(expirou) {
    if (token && !expirou && !modoLocal) fetch("/api/logout", { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    token = null; guardarToken(null);
    $("#app").hidden = true; $("#login").hidden = false; $("#savebar").classList.remove("is-visible");
    if (expirou) $("#loginErro").textContent = "Sua sessão expirou. Entre novamente.";
  }

  /* ---------------- carregar ---------------- */
  async function abrirApp() {
    const base = await window.FBConfig.carregar();
    delete base._origem;
    salvo = mesclar(PADRAO, base);
    // completa contatos e números com o que está em data.js
    salvo.empresa = mesclar({
      telefone: D.empresa.telefone, telefoneLink: D.empresa.telefoneLink, endereco: D.empresa.endereco,
      whatsapp: { ...D.empresa.whatsapp }, whatsappContato: { ...D.empresa.whatsappContato }, whatsappParceiro: { ...D.empresa.whatsappParceiro },
      emails: { ...D.empresa.emails },
    }, salvo.empresa || {});
    if (!Array.isArray(salvo.numeros) || !salvo.numeros.length) salvo.numeros = clone(D.numeros);
    cfg = clone(salvo);
    markD = await window.FBThemes.pegarMarca();
    $("#login").hidden = true; $("#app").hidden = false;
    if (modoLocal) $("#tempBanner").hidden = !senhaLocalTemporaria();
    $$("img[src$='logo.svg']").forEach((i) => (i.src = logoURL("oficial")));
    preencher();
    await carregarLeads();
    ir(location.hash.slice(1) in TITULOS ? location.hash.slice(1) : "visao");
  }

  /* ---------------- navegação ---------------- */
  function ir(view) {
    $$(".side__link").forEach((b) => b.classList.toggle("is-active", b.dataset.view === view));
    $$(".view").forEach((v) => v.classList.toggle("is-active", v.dataset.view === view));
    $("#viewTitle").textContent = TITULOS[view];
    history.replaceState(null, "", "#" + view);
    $("#side").classList.remove("is-open");
    if (view === "temas") enviarPrevia();
    if (view === "mensagens") carregarLeads();
  }

  /* ---------------- preencher formulários ---------------- */
  function preencher() {
    renderTemas(); renderOpcoes(); renderAgenda(); renderConteudo(); renderVisao(); marcarSujo();
  }

  function temaHoje() { return temaDoDia(cfg); }

  function renderVisao() {
    const h = temaDoDia(salvo), t = TEMAS[h.tema] || TEMAS.oficial;
    $("#kpiLogo").src = logoURL(h.tema);
    $("#kpiTema").textContent = t.nome;
    $("#kpiTemaMotivo").textContent = h.porAgendamento ? `Pelo agendamento (${h.regra.inicio.replace("-", "/")} a ${h.regra.fim.replace("-", "/")})` : "Escolhido manualmente";
    $("#statusTema").innerHTML = `<i style="background:${t.amostra[0]}"></i> No ar: ${esc(t.nome)}`;
    $("#kpiAtualizado").textContent = salvo.atualizadoEm ? fmtData(salvo.atualizadoEm) : "Nunca";
    $("#kpiOrigem").textContent = modoLocal ? "salvo neste navegador (modo local)" : "salvo no servidor";

    // próximas datas
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const proximas = (cfg.tema.agendamento.regras || []).filter((r) => r.ativa).map((r) => {
      const [d, m] = r.inicio.split("-").map(Number), [df, mf] = r.fim.split("-").map(Number);
      let ini = new Date(hoje.getFullYear(), m - 1, d), fim = new Date(hoje.getFullYear(), mf - 1, df);
      if (fim < ini) fim.setFullYear(fim.getFullYear() + 1);
      if (fim < hoje) { ini.setFullYear(ini.getFullYear() + 1); fim.setFullYear(fim.getFullYear() + 1); }
      return { r, ini, fim, dias: Math.round((ini - hoje) / 864e5) };
    }).sort((a, b) => a.ini - b.ini);
    $("#proximas").innerHTML = proximas.length ? proximas.map(({ r, ini, dias }) => {
      const t2 = TEMAS[r.tema];
      const quando = dias <= 0 ? "<b class='live'>No ar agora</b>" : dias === 1 ? "amanhã" : `em ${dias} dias`;
      return `<li><img src="${logoURL(r.tema)}" alt="" width="34" height="34"/><div><b>${esc(t2.nome)}</b><small>${ini.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}</small></div><span>${quando}</span></li>`;
    }).join("") : `<li class="muted">Nenhuma data ativa no agendamento.</li>`;
    if (!cfg.tema.agendamento.ativo) $("#proximas").insertAdjacentHTML("afterbegin", `<li class="warn">⚠ O agendamento automático está desligado.</li>`);

    const novas = leads.filter((l) => (l.status || "novo") === "novo").length;
    $("#kpiNovas").textContent = novas; $("#kpiTotal").textContent = leads.length;
    $("#kpiParceiros").textContent = `${leads.filter((l) => l.tipo === "parceiro").length} parceiros · ${leads.filter((l) => l.tipo === "cliente").length} clientes`;
    const badge = $("#badgeNovas"); badge.textContent = novas; badge.hidden = !novas;
    $("#ultimas").innerHTML = leads.slice(0, 5).map((l) => `<li><span class="dot dot--${l.status || "novo"}"></span><div><b>${esc(l.nome)}</b><small>${l.tipo === "parceiro" ? "Quer ser parceiro" : "Quer crédito"} · ${fmtData(l.data)}</small></div></li>`).join("") || `<li class="muted">Quando alguém preencher o formulário do site, aparece aqui.</li>`;
  }

  function renderTemas() {
    const hoje = temaHoje().tema, ativo = cfg.tema.ativo;
    $("#themes").innerHTML = Object.entries(TEMAS).map(([k, t]) => `
      <button type="button" class="theme ${k === ativo ? "is-selected" : ""} ${k === temaPrevia ? "is-preview" : ""}" data-tema="${k}" aria-pressed="${k === ativo}">
        <span class="theme__head"><img src="${logoURL(k)}" alt="" width="46" height="46"/>
          <span class="theme__sw">${t.amostra.map((c) => `<i style="background:${c}"></i>`).join("")}</span></span>
        <b>${esc(t.nome)}</b><small>${esc(t.descricao)}</small>
        <span class="theme__tags">${k === ativo ? `<em class="tag tag--on">Tema padrão</em>` : ""}${k === hoje && k !== ativo ? `<em class="tag tag--live">No ar pelo agendamento</em>` : ""}${t.efeito ? `<em class="tag">Animado</em>` : ""}</span>
      </button>`).join("");
  }

  function renderOpcoes() {
    $("#optEfeitos").checked = cfg.tema.efeitos !== false;
    $("#optDesligar").checked = cfg.tema.permitirDesligar !== false;
    $("#optLanterna").checked = !!cfg.tema.lanterna;
    $$("#optIntensidade button").forEach((b) => { const on = b.dataset.v === cfg.tema.intensidade; b.classList.toggle("is-on", on); b.setAttribute("aria-checked", on); });
  }

  /* agendamento */
  function renderAgenda() {
    const ag = cfg.tema.agendamento;
    $("#agAtivo").checked = !!ag.ativo;
    const opcoes = (sel) => Object.entries(TEMAS).filter(([k]) => k !== "oficial").map(([k, t]) => `<option value="${k}" ${k === sel ? "selected" : ""}>${t.nome}</option>`).join("");
    const paraInput = (dm) => { const [d, m] = dm.split("-"); return `${new Date().getFullYear()}-${m}-${d}`; };
    $("#regras").innerHTML = ag.regras.map((r, i) => `
      <div class="rule ${r.ativa ? "" : "is-off"}" data-i="${i}">
        <img src="${logoURL(r.tema)}" alt="" width="34" height="34"/>
        <label class="field field--inline"><span>Tema</span><select data-k="tema">${opcoes(r.tema)}</select></label>
        <label class="field field--inline"><span>De</span><input type="date" data-k="inicio" value="${paraInput(r.inicio)}"/></label>
        <label class="field field--inline"><span>Até</span><input type="date" data-k="fim" value="${paraInput(r.fim)}"/></label>
        <label class="switch switch--sm" title="Ativar/desativar"><input type="checkbox" data-k="ativa" ${r.ativa ? "checked" : ""}/><span></span></label>
        <button type="button" class="icon-btn" data-del aria-label="Remover período">🗑</button>
      </div>`).join("") || `<p class="muted">Nenhum período cadastrado.</p>`;
    renderTimeline();
  }
  function renderTimeline() {
    const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
    const dia = (dm) => { const [d, m] = dm.split("-").map(Number); return (new Date(2027, m - 1, d) - new Date(2027, 0, 1)) / 864e5; };
    const hoje = (new Date() - new Date(new Date().getFullYear(), 0, 1)) / 864e5;
    const blocos = cfg.tema.agendamento.regras.filter((r) => r.ativa).flatMap((r) => {
      const a = dia(r.inicio), b = dia(r.fim) + 1, cor = TEMAS[r.tema].amostra[0], nome = TEMAS[r.tema].nome;
      const seg = (x, y) => `<span class="tl__blk" style="left:${(x / 365) * 100}%;width:${Math.max(((y - x) / 365) * 100, 0.8)}%;background:${cor}" title="${nome}"></span>`;
      return a <= b ? [seg(a, b)] : [seg(a, 365), seg(0, b)];
    }).join("");
    $("#timeline").innerHTML = `<div class="tl__bar">${blocos}<span class="tl__hoje" style="left:${(hoje / 365) * 100}%"><em>hoje</em></span></div><div class="tl__meses">${meses.map((m) => `<span>${m}</span>`).join("")}</div>`;
  }

  /* conteúdo */
  function renderConteudo() {
    const a = cfg.aviso, e = cfg.empresa;
    $("#avAtivo").checked = !!a.ativo; $("#avTema").checked = a.usarMensagemDoTema !== false;
    $("#avTexto").value = a.texto || ""; $("#avLink").value = a.link || "";
    $("#ctTelefone").value = e.telefone || ""; $("#ctWpp").value = (e.whatsapp && e.whatsapp.numero) || "";
    $("#ctWppContato").value = (e.whatsappContato && e.whatsappContato.numero) || ""; $("#ctWppParceiro").value = (e.whatsappParceiro && e.whatsappParceiro.numero) || "";
    $("#ctEmail").value = (e.emails && e.emails.contato) || ""; $("#ctSac").value = (e.emails && e.emails.sac) || "";
    $("#ctEndereco").value = e.endereco || "";
    $("#secoes").innerHTML = SECOES.map(([k, nome]) => `<label class="switch"><input type="checkbox" data-secao="${k}" ${cfg.secoes[k] !== false ? "checked" : ""}/><span></span> ${esc(nome)}</label>`).join("");
    $("#numeros").innerHTML = cfg.numeros.map((n, i) => `
      <div class="num" data-i="${i}">
        <input data-k="prefixo" value="${esc(n.prefixo)}" placeholder="R$" aria-label="Prefixo" class="num__fix"/>
        <input data-k="valor" type="number" min="0" value="${n.valor}" aria-label="Valor" class="num__val"/>
        <input data-k="sufixo" value="${esc(n.sufixo)}" placeholder="mi" aria-label="Sufixo" class="num__fix"/>
        <input data-k="rotulo" value="${esc(n.rotulo)}" aria-label="Rótulo" class="num__lbl"/>
      </div>`).join("");
    previaAviso();
  }
  function previaAviso() {
    const t = TEMAS[temaHoje().tema], a = cfg.aviso;
    const txt = a.usarMensagemDoTema && t.aviso ? t.aviso : a.texto;
    const p = $("#avPreview");
    p.innerHTML = a.ativo && txt ? `<span>Prévia:</span><div class="announce-preview__bar">${esc(txt)}</div>` : `<span class="muted small">A faixa está desligada ou sem mensagem.</span>`;
    $$(".count").forEach((c) => { const el = $("#" + c.dataset.countFor); c.textContent = `${el.value.length}/${el.maxLength}`; });
  }

  /* ---------------- leitura dos campos ---------------- */
  const dmDe = (iso) => { const [, m, d] = iso.split("-"); return `${d}-${m}`; };
  function ligarEventos() {
    $("#loginForm").addEventListener("submit", entrar);
    $$("[data-eye]").forEach((b) => b.addEventListener("click", () => { const i = $("#" + b.dataset.eye); i.type = i.type === "password" ? "text" : "password"; }));
    $("#logout").addEventListener("click", () => sair(false));
    $$(".side__link").forEach((b) => b.addEventListener("click", () => ir(b.dataset.view)));
    document.addEventListener("click", (e) => { const g = e.target.closest("[data-goto]"); if (g) ir(g.dataset.goto); });
    $("#menuBtn").addEventListener("click", () => $("#side").classList.toggle("is-open"));

    // temas
    $("#themes").addEventListener("click", (e) => {
      const b = e.target.closest(".theme"); if (!b) return;
      cfg.tema.ativo = b.dataset.tema; temaPrevia = b.dataset.tema;
      renderTemas(); mudou(); enviarPrevia();
    });
    $("#optEfeitos").addEventListener("change", (e) => { cfg.tema.efeitos = e.target.checked; mudou(); enviarPrevia(); });
    $("#optDesligar").addEventListener("change", (e) => { cfg.tema.permitirDesligar = e.target.checked; mudou(); enviarPrevia(); });
    $("#optLanterna").addEventListener("change", (e) => { cfg.tema.lanterna = e.target.checked; mudou(); if (e.target.checked) { temaPrevia = "halloween"; renderTemas(); } enviarPrevia(); });
    $("#optIntensidade").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; cfg.tema.intensidade = b.dataset.v; renderOpcoes(); mudou(); enviarPrevia(); });
    $("#previewDevice").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      $$("#previewDevice button").forEach((x) => x.classList.toggle("is-on", x === b));
      $("#previewWrap").classList.toggle("is-mobile", b.dataset.v === "mobile");
    });
    $("#preview").addEventListener("load", () => setTimeout(enviarPrevia, 600));

    // agendamento
    $("#agAtivo").addEventListener("change", (e) => { cfg.tema.agendamento.ativo = e.target.checked; mudou(); renderTemas(); });
    $("#regras").addEventListener("change", (e) => {
      const row = e.target.closest(".rule"); if (!row) return;
      const r = cfg.tema.agendamento.regras[+row.dataset.i], k = e.target.dataset.k;
      if (k === "ativa") r.ativa = e.target.checked;
      else if (k === "tema") r.tema = e.target.value;
      else if (e.target.value) r[k] = dmDe(e.target.value);
      renderAgenda(); renderTemas(); mudou();
    });
    $("#regras").addEventListener("click", (e) => {
      const d = e.target.closest("[data-del]"); if (!d) return;
      cfg.tema.agendamento.regras.splice(+d.closest(".rule").dataset.i, 1); renderAgenda(); renderTemas(); mudou();
    });
    $("#addRegra").addEventListener("click", () => { cfg.tema.agendamento.regras.push({ tema: "natal", inicio: "01-12", fim: "26-12", ativa: true }); renderAgenda(); mudou(); });

    // conteúdo
    const liga = (id, fn, ev = "input") => $(id).addEventListener(ev, (e) => { fn(e.target); mudou(); previaAviso(); });
    liga("#avAtivo", (el) => (cfg.aviso.ativo = el.checked), "change");
    liga("#avTema", (el) => (cfg.aviso.usarMensagemDoTema = el.checked), "change");
    liga("#avTexto", (el) => (cfg.aviso.texto = el.value));
    liga("#avLink", (el) => (cfg.aviso.link = el.value.trim()));
    const wpp = (campo) => (el) => { const n = el.value.replace(/\D/g, ""); cfg.empresa[campo] = { numero: n, exibicao: fmtTel(n) }; };
    liga("#ctTelefone", (el) => { cfg.empresa.telefone = el.value; cfg.empresa.telefoneLink = el.value.replace(/\D/g, ""); });
    liga("#ctWpp", wpp("whatsapp")); liga("#ctWppContato", wpp("whatsappContato")); liga("#ctWppParceiro", wpp("whatsappParceiro"));
    liga("#ctEmail", (el) => (cfg.empresa.emails = { ...cfg.empresa.emails, contato: el.value.trim() }));
    liga("#ctSac", (el) => (cfg.empresa.emails = { ...cfg.empresa.emails, sac: el.value.trim() }));
    liga("#ctEndereco", (el) => (cfg.empresa.endereco = el.value));
    $("#secoes").addEventListener("change", (e) => { const k = e.target.dataset.secao; if (k) { cfg.secoes[k] = e.target.checked; mudou(); enviarPrevia(); } });
    $("#numeros").addEventListener("input", (e) => {
      const row = e.target.closest(".num"); if (!row) return;
      const n = cfg.numeros[+row.dataset.i], k = e.target.dataset.k;
      n[k] = k === "valor" ? Number(e.target.value) || 0 : e.target.value; mudou();
    });

    // mensagens
    $("#leadFiltro").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; $$("#leadFiltro button").forEach((x) => x.classList.toggle("is-on", x === b)); renderLeads(); });
    $("#leadBusca").addEventListener("input", renderLeads);
    $("#leadRefresh").addEventListener("click", () => carregarLeads().then(() => toast("Mensagens atualizadas.")));
    $("#leadCsv").addEventListener("click", exportarCSV);
    $("#leads").addEventListener("change", async (e) => {
      const s = e.target.closest("select[data-id]"); if (!s) return;
      try {
        await api(`/api/contatos/${s.dataset.id}`, { method: "PATCH", body: JSON.stringify({ status: s.value }) });
        const l = leads.find((x) => x.id === s.dataset.id); if (l) l.status = s.value;
        s.className = `st st--${s.value}`; renderVisao(); toast("Status atualizado.");
      } catch (x) { toast(x.message, "is-err"); }
    });

    // segurança
    $("#sNova").addEventListener("input", (e) => {
      const v = e.target.value; let f = 0;
      if (v.length >= 8) f++; if (v.length >= 12) f++; if (/[A-Z]/.test(v) && /[a-z]/.test(v)) f++; if (/\d/.test(v)) f++; if (/[^\w]/.test(v)) f++;
      const m = $("#sMeter"); m.style.width = `${(f / 5) * 100}%`; m.dataset.f = f;
    });
    $("#senhaForm").addEventListener("submit", trocarSenha);
    $("#caminhoForm").addEventListener("submit", salvarCaminho);
    $("#caminhoSugerir").addEventListener("click", () => {
      const p = ["gestao", "painel", "controle", "central", "operacao"][Math.floor(Math.random() * 5)];
      const r = Math.random().toString(36).slice(2, 6);
      $("#caminhoNovo").value = `${p}-fb-${r}`; $("#caminhoNovo").focus();
    });
    $("#exportar").addEventListener("click", exportarConfig);
    $("#importar").addEventListener("change", importarConfig);

    // salvar
    $("#salvar").addEventListener("click", salvar);
    $("#descartar").addEventListener("click", () => { cfg = clone(salvo); temaPrevia = null; preencher(); enviarPrevia(); toast("Alterações descartadas."); });
    addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s" && !$("#app").hidden) { e.preventDefault(); if (sujo()) salvar(); } });
    addEventListener("beforeunload", (e) => { if (cfg && sujo()) { e.preventDefault(); e.returnValue = ""; } });
  }

  /* ---------------- sujo / salvar ---------------- */
  const semData = (o) => { const c = clone(o); delete c.atualizadoEm; return JSON.stringify(c); };
  const sujo = () => salvo && cfg && semData(salvo) !== semData(cfg);
  function marcarSujo() {
    const s = sujo();
    $("#savebar").classList.toggle("is-visible", !!s);
    if (s) {
      const partes = [];
      if (JSON.stringify(salvo.tema) !== JSON.stringify(cfg.tema)) partes.push("temas");
      if (JSON.stringify(salvo.aviso) !== JSON.stringify(cfg.aviso)) partes.push("aviso");
      if (JSON.stringify(salvo.empresa) !== JSON.stringify(cfg.empresa)) partes.push("contatos");
      if (JSON.stringify(salvo.numeros) !== JSON.stringify(cfg.numeros)) partes.push("números");
      if (JSON.stringify(salvo.secoes) !== JSON.stringify(cfg.secoes)) partes.push("seções");
      $("#saveResumo").textContent = partes.length ? `(${partes.join(", ")})` : "";
    }
  }
  function mudou() { marcarSujo(); }

  async function salvar() {
    const btn = $("#salvar");
    if (modoLocal) {
      salvo = mesclar(salvo, { ...clone(cfg), atualizadoEm: new Date().toISOString() }); cfg = clone(salvo); temaPrevia = null;
      try { localStorage.setItem(LOCAL_CFG, JSON.stringify(salvo)); } catch (_) { toast("Não consegui salvar neste navegador.", "is-err"); return; }
      preencher(); $("#preview").contentWindow?.location.reload();
      toast("Salvo! O site aberto pelo Go Live já mostra as mudanças. Para publicar, baixe o config.json em Segurança e backup.", "is-ok");
      return;
    }
    btn.disabled = true; btn.textContent = "Salvando…";
    try {
      const r = await api("/api/config", { method: "PUT", body: JSON.stringify(cfg) });
      salvo = mesclar(salvo, r.config); cfg = clone(salvo); temaPrevia = null;
      preencher(); enviarPrevia(); $("#preview").contentWindow?.location.reload();
      toast("Publicado! O site já está com as novas configurações. ✓", "is-ok");
    } catch (x) { toast(x.message, "is-err"); }
    finally { btn.disabled = false; btn.textContent = "Salvar e publicar"; }
  }

  /* ---------------- prévia ---------------- */
  function enviarPrevia() {
    const f = $("#preview"); if (!f || !f.contentWindow || !cfg) return;
    const tema = temaPrevia || temaDoDia(cfg).tema;
    try { f.contentWindow.postMessage({ type: "fb-preview", cfg, tema }, location.origin); } catch (_) {}
  }

  /* ---------------- mensagens ---------------- */
  async function carregarLeads() {
    if (modoLocal || !token) { leads = []; renderLeads(); if (cfg) renderVisao(); return; }
    try { leads = await api("/api/contatos"); } catch (_) { leads = []; }
    renderLeads(); if (cfg) renderVisao();
  }
  function filtrados() {
    const f = $("#leadFiltro .is-on").dataset.v, q = $("#leadBusca").value.trim().toLowerCase();
    return leads.filter((l) => (f === "todos" || (l.status || "novo") === f) && (!q || [l.nome, l.cidade, l.telefone, l.email].join(" ").toLowerCase().includes(q)));
  }
  function renderLeads() {
    const lista = filtrados();
    $("#leads").innerHTML = lista.map((l) => {
      const n = String(l.telefone || "").replace(/\D/g, ""), wa = n ? `https://wa.me/55${n.replace(/^55/, "")}` : "";
      const st = l.status || "novo";
      return `<tr>
        <td data-l="Data">${fmtData(l.data)}</td>
        <td data-l="Nome"><b>${esc(l.nome)}</b>${l.servico ? `<small>${esc(l.servico)}</small>` : ""}</td>
        <td data-l="Tipo"><em class="tag ${l.tipo === "parceiro" ? "tag--on" : ""}">${l.tipo === "parceiro" ? "Parceiro" : "Cliente"}</em></td>
        <td data-l="Contato">${wa ? `<a href="${wa}" target="_blank" rel="noopener" class="wa">${esc(l.telefone)} ↗</a>` : esc(l.telefone)}${l.email ? `<small>${esc(l.email)}</small>` : ""}</td>
        <td data-l="Cidade">${esc(l.cidade || "—")}</td>
        <td data-l="Mensagem" class="msg">${esc(l.mensagem || "—")}</td>
        <td data-l="Status"><select class="st st--${st}" data-id="${esc(l.id)}" aria-label="Status de ${esc(l.nome)}">${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${k === st ? "selected" : ""}>${v}</option>`).join("")}</select></td>
      </tr>`;
    }).join("");
    $("#leadsVazio").hidden = lista.length > 0;
  }
  function exportarCSV() {
    const cab = ["Data", "Nome", "Tipo", "Telefone", "E-mail", "Cidade", "Serviço", "Mensagem", "Status"];
    const linhas = filtrados().map((l) => [fmtData(l.data), l.nome, l.tipo, l.telefone, l.email, l.cidade, l.servico, l.mensagem, STATUS[l.status || "novo"]]);
    const csv = "﻿" + [cab, ...linhas].map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(";")).join("\n");
    baixar(csv, `mensagens-fb-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv;charset=utf-8");
  }

  /* ---------------- segurança / backup ---------------- */
  async function trocarSenha(e) {
    e.preventDefault();
    const err = $("#senhaErro"), atual = $("#sAtual").value, nova = $("#sNova").value, nova2 = $("#sNova2").value;
    err.textContent = "";
    if (!atual) return (err.textContent = "Digite a senha atual.");
    if (nova.length < 8) return (err.textContent = "A nova senha precisa ter pelo menos 8 caracteres.");
    if (nova !== nova2) return (err.textContent = "As duas senhas novas não são iguais.");
    if (modoLocal) {
      const c = credLocal() || { usuario: "admin", hash: SENHA_PADRAO_HASH };
      if ((await sha256(atual)) !== c.hash) return (err.textContent = "Senha atual incorreta.");
      if (nova === "admin123") return (err.textContent = "Escolha uma senha diferente da temporária.");
      try { localStorage.setItem(LOCAL_CRED, JSON.stringify({ usuario: c.usuario, hash: await sha256(nova) })); } catch (_) { return (err.textContent = "Não consegui salvar neste navegador."); }
      e.target.reset(); $("#sMeter").style.width = "0"; $("#tempBanner").hidden = true; toast("Senha alterada neste navegador. ✓", "is-ok");
      return;
    }
    try {
      const r = await api("/api/senha", { method: "POST", body: JSON.stringify({ atual, nova }) });
      token = r.token; guardarToken(token, tokenLembrado() || true);
      e.target.reset(); $("#sMeter").style.width = "0"; $("#tempBanner").hidden = true; toast("Senha alterada. ✓", "is-ok");
    } catch (x) { err.textContent = x.message; }
  }
  function preencherCaminho(info) {
    $("#caminhoHost").textContent = location.host + "/";
    $("#caminhoNovo").value = (info.caminho || location.pathname).replace(/^\//, "");
    if (info.caminhoFixo) { $("#caminhoNovo").disabled = true; $("#caminhoErro").textContent = "Endereço fixado pela variável ADMIN_PATH no servidor."; }
  }
  async function salvarCaminho(e) {
    e.preventDefault();
    const err = $("#caminhoErro"), v = $("#caminhoNovo").value.trim().toLowerCase();
    err.textContent = "";
    if (!/^[a-z0-9][a-z0-9-]{3,39}$/.test(v)) return (err.textContent = "Use de 4 a 40 caracteres: letras minúsculas, números e hífen.");
    if (sujo()) return (err.textContent = "Salve ou descarte as outras alterações antes de trocar o endereço.");
    try {
      const r = await api("/api/caminho", { method: "POST", body: JSON.stringify({ caminho: v }) });
      toast(`Endereço salvo: ${location.host}${r.caminho}. Abrindo…`, "is-ok");
      setTimeout(() => location.replace(r.caminho + "#seguranca"), 1400);
    } catch (x) { err.textContent = x.message; }
  }

  function baixar(conteudo, nome, tipo) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([conteudo], { type: tipo })); a.download = nome;
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function exportarConfig() { baixar(JSON.stringify({ ...cfg, atualizadoEm: new Date().toISOString() }, null, 2), "config.json", "application/json"); }
  function importarConfig(e) {
    const f = e.target.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const dados = JSON.parse(rd.result);
        if (!dados || typeof dados !== "object" || !dados.tema) throw new Error();
        cfg = mesclar(cfg, dados); preencher(); enviarPrevia();
        toast("Arquivo importado. Revise e clique em Salvar e publicar.", "is-warn");
      } catch (_) { toast("Arquivo inválido: escolha um config.json do painel.", "is-err"); }
      e.target.value = "";
    };
    rd.readAsText(f);
  }

  /* ---------------- início ---------------- */
  async function iniciar() {
    ligarEventos();
    markD = await window.FBThemes.pegarMarca();
    $$("img[src$='logo.svg']").forEach((i) => (i.src = logoURL("oficial")));
    modoLocal = !(await detectarServidor());
    document.documentElement.classList.toggle("modo-local", modoLocal);
    if (modoLocal) {
      $("#localBanner").hidden = false;
      $("#caminhoForm").hidden = true;
      if (token === "local") { await abrirApp(); return; }
      token = null; $("#loginUsuario").focus(); return;
    }
    if (token === "local") token = null;
    if (token) {
      try { const s = await api("/api/sessao"); await abrirApp(); $("#tempBanner").hidden = !s.temporaria; preencherCaminho(s); return; } catch (_) { token = null; }
    }
    $("#loginSenha").focus();
  }
  iniciar();
})();
