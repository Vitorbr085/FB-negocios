/* =====================================================================
   FB NEGÓCIOS — INTERAÇÕES
   1. Renderização do conteúdo (data.js)
   2. Microinterações: cursor, botões magnéticos, ripple, tilt 3D, form
   3. Transições: preloader, texto letra a letra, reveal, contadores,
      menu, acordeão, troca de tema em círculo, assistente
   4. Parallax: blobs, cards, imagens, faixa gigante, orbe da logo
   ===================================================================== */
(() => {
  "use strict";

  const D = window.FB_DATA;
  const E = D.empresa;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const get = (path, obj = D) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (id, cls = "i") => `<svg viewBox="0 0 24 24" class="${cls}"><use href="#i-${id}"/></svg>`;
  const initials = (n) => n.split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const waLink = (num, text = E.mensagemWhatsapp) => `https://wa.me/${num}?text=${encodeURIComponent(text)}`;

  /* Imagem com fallback: tenta a cópia local, depois a remota, depois esconde */
  function setImg(img, foto, onFail) {
    const fontes = [foto.local, foto.remota].filter(Boolean);
    let i = 0;
    const next = () => {
      if (i < fontes.length) img.src = fontes[i++];
      else { const parent = img.parentElement; img.remove(); onFail && onFail(parent); }
    };
    img.addEventListener("error", next);
    img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
    next();
  }

  /* ================= 1. RENDERIZAÇÃO ================= */
  function render() {
    // textos simples: data-text="caminho"
    $$("[data-text]").forEach((el) => {
      const k = el.dataset.text;
      const v = get(k) ?? get(k, E);
      if (v != null) el.textContent = v;
    });
    // links
    $$("[data-wa]").forEach((a) => { const w = E[a.dataset.wa]; if (w) a.href = waLink(w.numero); });
    $$("[data-tel]").forEach((a) => (a.href = `tel:${E.telefoneLink}`));
    $$("[data-href]").forEach((a) => { const v = get(a.dataset.href, E); if (v) a.href = v; });

    $("#sobreTitulo").textContent = D.sobre.titulo;
    $("#sobreTexto").textContent = D.sobre.texto;
    $("#missao").textContent = E.missao;
    $("#valores").innerHTML = D.sobre.valores.map((v) => `<li>${esc(v)}</li>`).join("");
    $$("[data-foto]").forEach((img) => setImg(img, D.sobre.fotos[img.dataset.foto]));

    $("#heroAvatars").innerHTML = D.depoimentos.map((d) => `<span>${initials(d.nome)}</span>`).join("") + `<span>+</span>`;

    // números
    $("#stats").innerHTML = D.numeros.map((n) => `
      <div class="stat reveal">
        <div class="stat__value" data-count="${n.valor}" data-prefix="${esc(n.prefixo)}" data-suffix="${esc(n.sufixo)}">${esc(n.prefixo)}0${esc(n.sufixo)}</div>
        <div class="stat__label">${esc(n.rotulo)}</div>
      </div>`).join("");

    // diferenciais
    $("#diferenciais").innerHTML = D.diferenciais.map((d, i) => `
      <article class="why-card reveal" style="--d:${i}">
        <span class="why-card__num">0${i + 1}</span>
        <div class="why-card__icon">${icon(d.icone)}</div>
        <h3>${esc(d.titulo)}</h3><p>${esc(d.texto)}</p>
      </article>`).join("");

    // serviços
    $("#servicosGrid").innerHTML = D.servicos.map((s, i) => `
      <article class="service reveal" id="servico-${s.id}" style="--d:${i % 3}">
        <div class="service__icon">${icon(s.icone)}</div>
        <h3>${esc(s.titulo)}</h3>
        <p>${esc(s.texto)}</p>
        <a class="service__more" href="${waLink(E.whatsapp.numero, `Olá FB Negócios! Quero saber mais sobre ${s.titulo}.`)}" target="_blank" rel="noopener">Quero simular ${icon("arrow")}</a>
      </article>`).join("");
    $("#f-servico").insertAdjacentHTML("beforeend", D.servicos.map((s) => `<option>${esc(s.titulo)}</option>`).join(""));

    // bancos (faixa) — duplicada para o loop infinito
    const chip = (b) => `<div class="bank-chip" title="${esc(b.nome)}"><img data-bank="${esc(b.logo)}" alt="${esc(b.nome)}" loading="lazy" /></div>`;
    const chips = D.bancos.map(chip).join("");
    $("#banksMarquee").innerHTML = chips + chips;

    // portais
    $("#portais").innerHTML = D.bancos.map((b) => {
      const tag = b.portal ? "a" : "div";
      const attrs = b.portal ? `href="${esc(b.portal)}" target="_blank" rel="noopener"` : "";
      return `<${tag} class="portal reveal" data-name="${esc(b.nome.toLowerCase())}" ${attrs}>
        <div class="portal__logo"><img data-bank="${esc(b.logo)}" alt="${esc(b.nome)}" loading="lazy" /></div>
        <div class="portal__foot"><span>${esc(b.nome)}<br><small>${b.portal ? "Acessar portal" : "Fale com seu gerente"}</small></span>${b.portal ? icon("arrow") : ""}</div>
      </${tag}>`;
    }).join("");
    $$("img[data-bank]").forEach((img) => {
      const nome = img.alt;
      setImg(img, { local: D.bancosPastaLocal + img.dataset.bank, remota: D.bancosPastaRemota + img.dataset.bank },
        (parent) => parent && parent.insertAdjacentHTML("beforeend", `<span>${esc(nome)}</span>`));
    });

    // Digitais de Elite
    $("#eliteList").innerHTML = D.digitaisDeElite.recursos.map((r, i) => `
      <li class="reveal" style="--d:${i}"><i>${i + 1}</i><div><b>${esc(r.titulo)}</b><span>${esc(r.texto)}</span></div></li>`).join("");
    const bancosTela = ["Banco A", "Banco B", "Banco C", "Banco D"];
    $("#screenBars").innerHTML = bancosTela.map((b, i) => `
      <div class="bar-row"><span>${b}</span><div class="bar-row__track"><div class="bar-row__fill" data-w="${[92, 78, 64, 51][i]}"></div></div><b>${["1º", "2º", "3º", "4º"][i]}</b></div>`).join("");

    $("#passos").innerHTML = D.parceria.passos.map((p, i) => `
      <li class="step" style="--d:${i}"><div class="step__n">${i + 1}</div><h4>${esc(p.titulo)}</h4><p>${esc(p.texto)}</p></li>`).join("");

    // depoimentos
    const q = (d) => `<figure class="quote">
        <div class="quote__stars" aria-label="5 estrelas">★★★★★</div>
        <p>“${esc(d.texto)}”</p>
        <figcaption class="quote__who"><span class="quote__avatar">${initials(d.nome)}</span><span><b>${esc(d.nome)}</b><small>${esc(d.perfil)}</small></span></figcaption>
      </figure>`;
    const qs = D.depoimentos.map(q).join("");
    $("#depoimentos-track").innerHTML = qs + qs + qs;

    // time de diretores
    $("#diretores").innerHTML = D.diretores.map((p, i) => `
      <article class="member reveal" style="--d:${i}">
        <div class="member__initials" aria-hidden="true">${initials(p.nome)}</div>
        <img class="member__photo" data-member="${i}" alt="Foto de ${esc(p.nome)}" loading="lazy" />
        <div class="member__info">
          <div><span class="member__role">${esc(p.cargo)}</span><h3>${esc(p.nome)}</h3></div>
          ${p.linkedin ? `<a class="member__in" href="${esc(p.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn de ${esc(p.nome)}"><svg viewBox="0 0 24 24"><use href="#i-linkedin"/></svg></a>` : ""}
        </div>
      </article>`).join("");
    $$("img[data-member]").forEach((img) => setImg(img, D.diretores[img.dataset.member].foto));

    // FAQ
    $("#faqList").innerHTML = D.faq.map((f, i) => `
      <div class="acc reveal" style="--d:${i}">
        <button class="acc__btn" aria-expanded="false" aria-controls="acc-${i}" id="accb-${i}">${esc(f.p)}<span class="acc__icon" aria-hidden="true"></span></button>
        <div class="acc__panel" id="acc-${i}" role="region" aria-labelledby="accb-${i}"><div><p>${esc(f.r)}</p></div></div>
      </div>`).join("");

    // rodapé
    const R = E.redes;
    $("#socials").innerHTML = [
      ["instagram", R.instagram, "Instagram"], ["linkedin", R.linkedin, "LinkedIn"], ["tiktok", R.tiktok, "TikTok"], ["whatsapp", waLink(E.whatsapp.numero), "WhatsApp"],
    ].map(([ic, url, lb]) => `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${lb}"><svg viewBox="0 0 24 24"><use href="#i-${ic}"/></svg></a>`).join("");
    $("#footerContato").innerHTML = `
      <li>${icon("pin")}<a href="${esc(E.mapsLink)}" target="_blank" rel="noopener">${esc(E.endereco)}</a></li>
      <li>${icon("phone")}<a href="tel:${E.telefoneLink}">${esc(E.telefone)}</a></li>
      <li>${icon("mail")}<a href="mailto:${esc(E.emails.contato)}">${esc(E.emails.contato)}</a></li>
      <li>${icon("mail")}<span>SAC: <a href="mailto:${esc(E.emails.sac)}">${esc(E.emails.sac)}</a></span></li>
      <li>${icon("shield")}<span>DPO: <a href="mailto:${esc(E.emails.dpo)}">${esc(E.emails.dpo)}</a></span></li>
      <li>${icon("doc")}<span>CNPJ: ${esc(E.cnpj)}</span></li>`;
    $("#bacen").innerHTML = `<h4>⚠ ${esc(D.bacen.titulo)}</h4><p>${esc(D.bacen.texto)}</p><p><b>NÃO ESTÁ AUTORIZADA A:</b></p><ul>${D.bacen.naoAutorizada.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
    $("#copyright").textContent = `© ${E.nome} ${new Date().getFullYear()}. A ${E.nome} pertence ao ${E.grupo.nome} — CNPJ: ${E.grupo.cnpj}.`;
  }

  /* ================= 2/3. TRANSIÇÕES ================= */

  // Preloader
  function preloader() {
    const el = $("#preloader");
    document.body.classList.add("is-loading");
    const done = () => {
      el.classList.add("is-done");
      document.body.classList.remove("is-loading");
      setTimeout(splitIntro, 350);
    };
    const wait = reduceMotion ? 0 : 1300;
    const start = performance.now();
    const finish = () => setTimeout(done, Math.max(0, wait - (performance.now() - start)));
    if (document.readyState === "complete") finish(); else window.addEventListener("load", finish, { once: true });
    setTimeout(done, 4000); // segurança
  }

  // Título letra por letra
  let introDone = false;
  function splitPrepare() {
    $$("[data-split]").forEach((line) => {
      const walk = (node) => {
        [...node.childNodes].forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach((word) => {
              if (!word) return;
              if (/^\s+$/.test(word)) { frag.append(" "); return; }
              const w = document.createElement("span");
              w.style.whiteSpace = "nowrap"; w.style.display = "inline-block";
              [...word].forEach((c) => { const s = document.createElement("span"); s.className = "ch"; s.textContent = c; w.append(s); });
              frag.append(w);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1 && !n.classList.contains("rotator")) walk(n);
          else if (n.classList && n.classList.contains("rotator")) n.classList.add("ch");
        });
      };
      walk(line);
    });
  }
  function splitIntro() {
    if (introDone) return; introDone = true;
    let k = 0;
    $$("[data-split]").forEach((line) => {
      $$(".ch", line).forEach((c) => { c.style.transitionDelay = `${k++ * 22}ms`; });
      line.classList.add("is-in");
    });
    setTimeout(rotator, 1800);
  }

  // Palavra que troca
  function rotator() {
    const el = $("#rotator"); const words = D.heroPalavras; let i = 0;
    if (!el || reduceMotion) return;
    setInterval(() => {
      el.classList.add("is-out");
      setTimeout(() => {
        i = (i + 1) % words.length;
        el.textContent = words[i];
        el.classList.remove("is-out"); el.classList.add("is-pre");
        void el.offsetWidth;
        el.classList.remove("is-pre");
      }, 450);
    }, 2600);
  }

  // Reveal + contadores + barras + passos
  function observers() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    $$(".reveal, .step").forEach((el) => {
      if (el.dataset.delay) el.style.setProperty("--d", el.dataset.delay);
      io.observe(el);
    });

    const countIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        countUp(e.target); countIO.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    $$("[data-count]").forEach((el) => countIO.observe(el));

    const once = (sel, fn, th = 0.4) => {
      const el = $(sel); if (!el) return;
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { fn(el); o.disconnect(); } }, { threshold: th });
      o.observe(el);
    };
    once("#eliteScreen", () => $$(".bar-row__fill").forEach((b, i) => setTimeout(() => (b.style.width = b.dataset.w + "%"), i * 150)));
    once("#passos", (el) => el.style.setProperty("--progress", 1), 0.5);
  }
  function countUp(el) {
    const end = +el.dataset.count, pre = el.dataset.prefix, suf = el.dataset.suffix;
    const fmt = (n) => pre + Math.round(n).toLocaleString("pt-BR") + suf;
    if (reduceMotion) { el.textContent = fmt(end); return; }
    const dur = 1800, t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = fmt(end * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Header: some ao descer, volta ao subir; link ativo; barra de progresso
  function header() {
    const h = $("#header"), bar = $(".scroll-progress"), wa = $(".wa-float");
    let last = 0;
    const links = $$(".nav__link[href^='#']");
    const sections = links.map((l) => $(l.getAttribute("href"))).filter(Boolean);
    const onScroll = () => {
      const y = window.scrollY;
      h.classList.toggle("is-scrolled", y > 30);
      h.classList.toggle("is-hidden", y > 400 && y > last && !$("#nav").classList.contains("is-open"));
      last = y;
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      wa.classList.toggle("is-visible", y > 500);
      let cur = null;
      sections.forEach((s) => { if (s.getBoundingClientRect().top < innerHeight * 0.4) cur = s; });
      links.forEach((l) => l.classList.toggle("is-active", cur && l.getAttribute("href") === "#" + cur.id));
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // menu mobile
    const burger = $("#burger"), nav = $("#nav");
    const toggle = (open) => {
      nav.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open);
      burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", () => toggle(!nav.classList.contains("is-open")));
    $$(".nav__link", nav).forEach((a) => a.addEventListener("click", () => toggle(false)));
    addEventListener("keydown", (e) => e.key === "Escape" && toggle(false));
  }

  // Tema claro/escuro com transição circular a partir do botão
  function theme() {
    const root = document.documentElement, btn = $("#themeToggle");
    let saved = null;
    try { saved = localStorage.getItem("fb-theme"); } catch (_) {}
    if (saved) root.dataset.theme = saved;
    btn.addEventListener("click", (e) => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      const apply = () => { root.dataset.theme = next; try { localStorage.setItem("fb-theme", next); } catch (_) {} };
      if (!document.startViewTransition || reduceMotion) return apply();
      const r = btn.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      document.startViewTransition(apply).ready.then(() => {
        root.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
          { duration: 700, easing: "cubic-bezier(.22,1,.36,1)", pseudoElement: "::view-transition-new(root)" });
      });
    });
  }

  // Acordeão
  function accordion() {
    $("#faqList").addEventListener("click", (e) => {
      const btn = e.target.closest(".acc__btn"); if (!btn) return;
      const item = btn.parentElement, open = !item.classList.contains("is-open");
      $$(".acc.is-open").forEach((a) => { a.classList.remove("is-open"); $(".acc__btn", a).setAttribute("aria-expanded", "false"); });
      item.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", open);
    });
  }

  // Busca de bancos
  function bankSearch() {
    const input = $("#bankSearch"), empty = $("#portaisVazio");
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      let n = 0;
      $$(".portal").forEach((p) => {
        const ok = p.dataset.name.normalize("NFD").replace(/[̀-ͯ]/g, "").includes(q);
        p.classList.toggle("is-hidden", !ok); if (ok) { n++; p.classList.add("is-in"); }
      });
      empty.hidden = n > 0;
    });
  }

  // Assistente
  function wizard() {
    const A = D.assistente, body = $("#wizardBody"), bar = $("#wizardBar");
    const st = { perfil: null, objetivo: null };
    const swap = (html, pct) => {
      bar.style.width = pct + "%";
      const old = $(".wizard__step", body);
      const show = () => { body.innerHTML = `<div class="wizard__step">${html}</div>`; };
      if (old && !reduceMotion) { old.classList.add("is-leaving"); setTimeout(show, 300); } else show();
    };
    const step1 = () => swap(`<p class="wizard__q">1. Qual é o seu perfil?</p>
      <div class="options">${A.perfis.map((p) => `<button class="option" data-perfil="${p.id}"><span class="option__emoji">${p.emoji}</span>${esc(p.rotulo)}</button>`).join("")}</div>`, 10);
    const step2 = () => swap(`<p class="wizard__q">2. O que você precisa?</p>
      <div class="options">${A.objetivos.map((o) => `<button class="option" data-obj="${o.id}">${esc(o.rotulo)}</button>`).join("")}</div>
      <p style="margin-top:18px"><button class="link-btn" data-back>← Voltar</button></p>`, 50);
    const result = () => {
      const ids = A.regras[st.perfil][st.objetivo];
      const svcs = ids.map((id) => D.servicos.find((s) => s.id === id));
      const perfil = A.perfis.find((p) => p.id === st.perfil).rotulo;
      const msg = `Olá FB Negócios! Sou: ${perfil}. Tenho interesse em: ${svcs.map((s) => s.titulo).join(" / ")}.`;
      swap(`<div class="result"><p class="wizard__q">Indicamos para você:</p>
        <div class="result__cards">${svcs.map((s) => `<div class="result__card"><h4>${icon(s.icone)} ${esc(s.titulo)}</h4><p>${esc(s.texto.slice(0, 130))}…</p></div>`).join("")}</div>
        <div class="result__actions">
          <a class="btn btn--primary magnetic" href="${waLink(E.whatsapp.numero, msg)}" target="_blank" rel="noopener">${icon("whatsapp")} Simular pelo WhatsApp</a>
          <button class="btn btn--ghost" data-see="${ids[0]}">Ver detalhes</button>
          <button class="link-btn" data-restart>Refazer</button>
        </div>
        <p class="muted" style="font-size:13px;margin:0">Indicação inicial. A proposta e a taxa são definidas pelo banco após análise.</p></div>`, 100);
    };
    body.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.perfil) { b.classList.add("is-selected"); st.perfil = b.dataset.perfil; setTimeout(step2, 250); }
      else if (b.dataset.obj) { b.classList.add("is-selected"); st.objetivo = b.dataset.obj; setTimeout(result, 250); }
      else if ("back" in b.dataset || "restart" in b.dataset) step1();
      else if (b.dataset.see) {
        const card = $("#servico-" + b.dataset.see);
        card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        card.classList.remove("is-highlight"); void card.offsetWidth; card.classList.add("is-highlight");
      }
    });
    step1();
  }

  // Formulário
  function form() {
    const f = $("#contactForm"), btn = $("#submitBtn"), tel = $("#f-tel");
    f.dataset.tipo = "parceiro";
    $$(".form__tab", f).forEach((t) => t.addEventListener("click", () => {
      $$(".form__tab", f).forEach((x) => { x.classList.toggle("is-active", x === t); x.setAttribute("aria-selected", x === t); });
      f.dataset.tipo = t.dataset.tipo;
      $$("[data-only]", f).forEach((el) => (el.hidden = el.dataset.only !== t.dataset.tipo));
    }));

    // máscara (85) 99999-9999
    tel.addEventListener("input", () => {
      const d = tel.value.replace(/\D/g, "").slice(0, 11);
      let v = d;
      if (d.length > 2) v = `(${d.slice(0, 2)}) ${d.slice(2)}`;
      if (d.length > 7) v = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
      tel.value = v;
    });

    const rules = {
      nome: (v) => v.trim().length >= 3,
      telefone: (v) => v.replace(/\D/g, "").length >= 10,
      email: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    };
    const check = (input) => {
      const rule = rules[input.name]; if (!rule) return true;
      const ok = rule(input.value), field = input.closest(".field");
      field.classList.toggle("is-error", !ok);
      field.classList.toggle("is-valid", ok && !!input.value);
      return ok;
    };
    $$("input", f).forEach((i) => i.addEventListener("blur", () => i.value && check(i)));
    $$("input", f).forEach((i) => i.addEventListener("input", () => i.closest(".field")?.classList.contains("is-error") && check(i)));

    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (btn.classList.contains("is-loading")) return;
      let ok = true;
      $$("input[name]", f).forEach((i) => { i.closest(".field")?.classList.remove("is-error"); void i.offsetWidth; if (!check(i)) ok = false; });
      const lgpd = $("#f-lgpd"), checkWrap = lgpd.closest(".check");
      checkWrap.classList.remove("is-error"); void checkWrap.offsetWidth;
      if (!lgpd.checked) { checkWrap.classList.add("is-error"); ok = false; }
      if (!ok) { toast("Confira os campos destacados."); $(".is-error input, .is-error", f)?.focus?.(); return; }

      const data = Object.fromEntries(new FormData(f));
      data.tipo = f.dataset.tipo;
      if (data.empresa_site) return; // robô
      btn.classList.add("is-loading");

      let sent = false;
      if (location.protocol.startsWith("http")) {
        try {
          const r = await fetch("/api/contato", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
          sent = r.ok;
        } catch (_) { sent = false; }
      }
      await new Promise((r) => setTimeout(r, 700));
      btn.classList.remove("is-loading"); btn.classList.add("is-done");

      if (sent) {
        toast("Recebemos seus dados! Nosso time vai falar com você em breve. 🚀");
      } else {
        // Sem servidor (ex.: GitHub Pages): envia pelo WhatsApp
        const alvo = data.tipo === "parceiro" ? E.whatsappParceiro.numero : E.whatsapp.numero;
        const txt = `Olá FB Negócios! ${data.tipo === "parceiro" ? "Quero ser parceiro FB." : "Quero um crédito" + (data.servico ? `: ${data.servico}.` : ".")}\nNome: ${data.nome}\nWhatsApp: ${data.telefone}` +
          (data.cidade ? `\nCidade: ${data.cidade}` : "") + (data.email ? `\nE-mail: ${data.email}` : "") + (data.mensagem ? `\nMensagem: ${data.mensagem}` : "");
        toast("Abrindo o WhatsApp para concluir o envio…");
        setTimeout(() => window.open(waLink(alvo, txt), "_blank", "noopener"), 600);
      }
      setTimeout(() => { btn.classList.remove("is-done"); f.reset(); $$(".field", f).forEach((x) => x.classList.remove("is-valid")); }, 3200);
    });
  }

  let toastT;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("is-visible");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("is-visible"), 3800);
  }

  /* ================= 2. MICROINTERAÇÕES ================= */
  function microInteractions() {
    // Ripple em todos os botões
    document.addEventListener("pointerdown", (e) => {
      const b = e.target.closest(".btn, .option"); if (!b) return;
      const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height);
      const rip = document.createElement("span");
      rip.className = "ripple";
      Object.assign(rip.style, { width: s + "px", height: s + "px", left: e.clientX - r.left - s / 2 + "px", top: e.clientY - r.top - s / 2 + "px" });
      b.style.position ||= "relative"; b.style.overflow = "hidden";
      b.append(rip); setTimeout(() => rip.remove(), 700);
    });

    if (!finePointer || reduceMotion) return;

    // Cursor
    const cur = $(".cursor"), dot = $(".cursor__dot"), ring = $(".cursor__ring");
    let mx = -100, my = -100, rx = -100, ry = -100;
    addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate3d(${mx}px,${my}px,0)`; }, { passive: true });
    const loop = () => { rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; ring.style.transform = `translate3d(${rx}px,${ry}px,0)`; requestAnimationFrame(loop); };
    loop();
    document.addEventListener("pointerover", (e) => cur.classList.toggle("is-hover", !!e.target.closest("a, button, input, textarea, select, label, .service")));
    addEventListener("pointerdown", () => cur.classList.add("is-down"));
    addEventListener("pointerup", () => cur.classList.remove("is-down"));
    document.addEventListener("mouseleave", () => (cur.style.opacity = 0));
    document.addEventListener("mouseenter", () => (cur.style.opacity = 1));

    // Botões magnéticos (delegação: funciona também nos criados depois)
    document.addEventListener("pointermove", (e) => {
      $$(".magnetic.is-mag").forEach((m) => { if (!m.contains(e.target)) { m.classList.remove("is-mag"); m.style.transform = ""; } });
      const m = e.target.closest(".magnetic"); if (!m) return;
      const r = m.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25, y = (e.clientY - r.top - r.height / 2) * 0.35;
      m.classList.add("is-mag");
      m.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });

    // Tilt 3D + luz nos cards de serviço
    $$(".service").forEach((c) => {
      c.addEventListener("pointermove", (e) => {
        c.style.transitionDelay = "0s";
        const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        c.style.setProperty("--ry", `${(px - 0.5) * 12}deg`); c.style.setProperty("--rx", `${(0.5 - py) * 12}deg`);
        c.style.setProperty("--mx", `${px * 100}%`); c.style.setProperty("--my", `${py * 100}%`);
      });
      c.addEventListener("pointerleave", () => { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); });
    });
  }

  /* ================= 4. PARALLAX ================= */
  function parallax() {
    if (reduceMotion) return;
    const items = $$("[data-parallax]");
    const bands = $$("[data-band]");
    const orb = $("#orb");
    let mx = 0, my = 0, ticking = false;

    const update = () => {
      const vh = innerHeight;
      items.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const center = r.top + r.height / 2 - vh / 2;
        const sp = +el.dataset.parallax;
        const isBlob = el.classList.contains("blob");
        const tx = isBlob ? mx * sp * 60 : 0, ty = -center * sp + (isBlob ? my * sp * 60 : 0);
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
      bands.forEach((b) => {
        const r = b.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = (vh - r.top) / (vh + r.height);
        b.style.transform = `translate3d(${(+b.dataset.band) * (p * -30 + (b.dataset.band === "1" ? 0 : -30))}%, 0, 0)`;
      });
      if (orb && finePointer) orb.style.transform = `rotateY(${mx * 18}deg) rotateX(${-my * 18}deg)`;
      ticking = false;
    };
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener("scroll", req, { passive: true });
    addEventListener("resize", req);
    if (finePointer) addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; req(); }, { passive: true });
    update();
  }

  /* ================= INÍCIO ================= */
  render();
  splitPrepare();
  preloader();
  observers();
  header();
  theme();
  accordion();
  bankSearch();
  wizard();
  form();
  microInteractions();
  parallax();
})();
