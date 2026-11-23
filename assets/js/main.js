/* =====================================================================
   FB NEGÓCIOS — INTERAÇÕES
   1. Renderização do conteúdo (data.js)
   2. Microinterações: botões magnéticos, ripple, tilt 3D, form
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
    if ($("#sobreTexto2")) $("#sobreTexto2").textContent = D.sobre.texto2 || "";
    $("#missao").textContent = E.missao;
    $("#valores").innerHTML = D.sobre.valores.map((v) => `<li>${esc(v)}</li>`).join("");
    // Foto principal do "Quem somos": duas fotos alternando, como no topo
    const altFotos = D.sobre.fotos.principalAlterna, altBox = $(".about__img--main");
    if (altBox && altFotos && altFotos.length > 1) {
      altBox.classList.add("about__img--alterna");
      altBox.innerHTML = altFotos.map((src, i) => `<img src="${esc(src)}" alt="" class="${i === 0 ? "is-on" : ""}" />`).join("");
      if (!reduceMotion) {
        let k = 0;
        setInterval(() => {
          const f = $$("img", altBox); if (f.length < 2 || document.hidden) return;
          f[k].classList.remove("is-on"); k = (k + 1) % f.length; f[k].classList.add("is-on");
        }, 6000);
      }
    }
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
    const chips = D.bancos.filter((b) => b.logo).map(chip).join("");
    $("#banksMarquee").innerHTML = chips + chips;

    // portais + telefones de atendimento
    const sigla = (n) => n.split(/\s+/).filter((w) => w.length > 2 || /^[A-Z0-9]+$/.test(w)).map((w) => /^[A-Z0-9]{2,}$/.test(w) ? w : w[0]).join("").toUpperCase().slice(0, 4).padEnd(2, n.replace(/\W/g, "")[1]?.toUpperCase() || "");
    const telLink = (t) => {
      const [rotulo, numero] = t.includes(":") ? t.split(/:\s*/) : ["", t];
      const digitos = numero.replace(/\D/g, "");
      return `<li class="portal__tel">
          <a href="tel:${digitos}" aria-label="Ligar para ${esc(rotulo || numero)} ${esc(numero)}">${icon("phone")}<span>${rotulo ? `<small>${esc(rotulo)}</small>` : ""}${esc(numero)}</span></a>
          <button type="button" class="portal__copy" data-copy="${esc(numero)}" aria-label="Copiar ${esc(numero)}" title="Copiar número">${icon("copy")}</button>
        </li>`;
    };
    $("#portais").innerHTML = D.bancos.map((b) => `
      <article class="portal reveal${b.portal ? "" : " portal--contato"}" data-name="${esc((b.nome + " " + b.telefones.join(" ")).toLowerCase())}">
        <div class="portal__logo">${b.logo ? `<img data-bank="${esc(b.logo)}" alt="${esc(b.nome)}" loading="lazy" />` : `<span class="portal__sigla" aria-hidden="true">${esc(sigla(b.nome))}</span>`}</div>
        <h3 class="portal__name">${esc(b.nome)}</h3>
        ${b.telefones.length
          ? `<ul class="portal__tels">${b.telefones.map(telLink).join("")}</ul>`
          : `<p class="portal__semtel">Atendimento pelo seu gerente FB</p>`}
        ${b.portal
          ? `<a class="portal__go" href="${esc(b.portal)}" target="_blank" rel="noopener">Acessar portal ${icon("arrow")}</a>`
          : `<span class="portal__go portal__go--off">Sem portal online</span>`}
      </article>`).join("");
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

    // feedbacks de parceiros (estilo conversa de WhatsApp)
    const FP = D.feedbacksParceiros;
    if (FP && $("#feedbacksParceiros")) {
      $("#feedVideo").href = FP.video;
      $("#feedbacksParceiros").innerHTML = FP.lista.map((f, i) => `
        <article class="chat reveal" style="--d:${i}">
          <header class="chat__head"><span class="chat__avatar">${initials(f.nome)}</span><div><b>${esc(f.nome)}</b><small>${esc(f.empresa)} · ${esc(f.cidade)}</small></div><span class="chat__badge">✓ Parceiro FB</span></header>
          <p class="chat__destaque">“${esc(f.destaque)}”</p>
          <div class="chat__body">
            ${f.mensagens.map((m, k) => `<div class="bubble bubble--in" style="--k:${k}">${esc(m)}<time>${esc(f.hora)}</time></div>`).join("")}
            ${f.resposta ? `<div class="bubble bubble--out" style="--k:${f.mensagens.length}"><small>${esc(f.resposta.nome)} · ${esc(f.resposta.cargo)}</small>${esc(f.resposta.texto)}<time>${esc(f.hora)} ✓✓</time></div>` : ""}
          </div>
        </article>`).join("");
    }

    // FB Informa
    if (D.fbInforma && $("#infoLista")) {
      $("#infoLista").innerHTML = D.fbInforma.destaques.map((n, i) => `
        <li class="reveal" style="--d:${i}"><a href="${esc(n.link)}" target="_blank" rel="noopener" class="info-item">
          <span class="info-item__tag">${esc(n.tag)}</span>
          <b>${esc(n.titulo)}</b>
          <small>${esc(n.data)} · ver no Instagram ↗</small>
        </a></li>`).join("");
    }

    // fotos do topo
    if (D.topo && $("#heroFotos")) {
      $("#heroFotos").innerHTML = D.topo.map((f, i) => `<img src="${esc(f.src)}" alt="" class="${i === 0 ? "is-on" : ""}" ${f.pos ? `style="object-position:${esc(f.pos)}"` : ""} ${i ? 'loading="lazy"' : ""} />`).join("");
      $$("#heroFotos img").forEach((img) => img.addEventListener("error", () => img.remove(), { once: true }));
    }

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
      ${E.emails.sac ? `<li>${icon("mail")}<span>SAC: <a href="mailto:${esc(E.emails.sac)}">${esc(E.emails.sac)}</a></span></li>` : ""}
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
      wa?.classList.toggle("is-visible", y > 500);
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

  // Copiar telefone do banco
  function copyPhones() {
    $("#portais").addEventListener("click", async (e) => {
      const b = e.target.closest(".portal__copy"); if (!b) return;
      const n = b.dataset.copy;
      try { await navigator.clipboard.writeText(n); }
      catch (_) {
        const t = document.createElement("textarea"); t.value = n; document.body.append(t); t.select();
        try { document.execCommand("copy"); } catch (__) {} t.remove();
      }
      b.classList.add("is-copied"); setTimeout(() => b.classList.remove("is-copied"), 1600);
      toast(`Número ${n} copiado!`);
    });
  }

  // Quiz "É golpe ou não?"
  function quizGolpe() {
    const Q = D.quizGolpe, root = $("#quiz"); if (!Q || !root) return;
    const stage = $("#quizStage"), actions = $("#quizActions");
    const bar = $("#quizBar"), count = $("#quizCount"), score = $("#quizScore"), top = $("#quizTop");
    let ordem = [], i = 0, acertos = 0, travado = false;

    const embaralhar = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((v) => v[1]);
    const placar = () => {
      count.textContent = `${Math.min(i + 1, Q.length)} / ${Q.length}`;
      score.textContent = `${acertos} ${acertos === 1 ? "acerto" : "acertos"}`;
      bar.style.width = `${(i / Q.length) * 100}%`;
    };

    function telaInicial() {
      travado = true; root.classList.add("is-idle"); top.hidden = true; actions.hidden = true;
      stage.innerHTML = `
        <div class="qstart">
          <div class="qstart__icon" aria-hidden="true">${icon("shield")}</div>
          <h3 class="qstart__title">Você sabe reconhecer um golpe?</h3>
          <p class="qstart__txt">${Q.length} situações do dia a dia do consignado. Leva menos de 1 minuto e você pode sair quando quiser.</p>
          <button type="button" class="btn btn--primary btn--lg magnetic" data-start>Começar o teste →</button>
        </div>`;
    }

    function carta() {
      travado = false; root.classList.remove("is-idle"); top.hidden = false; actions.hidden = false; placar();
      const q = ordem[i];
      stage.innerHTML = `
        <div class="qcard" tabindex="0" role="group" aria-label="Situação ${i + 1} de ${Q.length}">
          <span class="qcard__stamp qcard__stamp--golpe" aria-hidden="true">GOLPE</span>
          <span class="qcard__stamp qcard__stamp--seguro" aria-hidden="true">SEGURO</span>
          <span class="qcard__n">Situação ${i + 1}</span>
          <p class="qcard__txt">${esc(q.texto)}</p>
          <span class="qcard__hint" aria-hidden="true">← arraste →</span>
        </div>
        <div class="qcard qcard--back" aria-hidden="true"></div>`;
      arrastar($(".qcard", stage));
    }

    function responder(ans, dir) {
      if (travado) return; travado = true;
      const q = ordem[i], ok = ans === q.resposta, card = $(".qcard", stage);
      if (ok) acertos++;
      card.style.transition = "transform .5s cubic-bezier(.22,1,.36,1), opacity .5s";
      card.style.transform = `translateX(${(dir || (ans === "golpe" ? -1 : 1)) * 140}%) rotate(${(dir || (ans === "golpe" ? -1 : 1)) * 18}deg)`;
      card.style.opacity = "0";
      actions.hidden = true;
      setTimeout(() => {
        score.textContent = `${acertos} ${acertos === 1 ? "acerto" : "acertos"}`;
        stage.innerHTML = `
          <div class="qfeed ${ok ? "is-ok" : "is-err"}">
            <div class="qfeed__icon" aria-hidden="true">${ok ? "✓" : "✕"}</div>
            <h3 class="qfeed__title">${ok ? "Acertou!" : "Quase!"} Isso é <b>${q.resposta === "golpe" ? "golpe" : "seguro"}</b>.</h3>
            <p class="qfeed__txt">${esc(q.explicacao)}</p>
            <button type="button" class="btn btn--primary magnetic" data-next>${i + 1 < Q.length ? "Próxima situação →" : "Ver meu resultado"}</button>
          </div>`;
        $("[data-next]", stage).focus({ preventScroll: true });
      }, 380);
    }

    function resultado() {
      bar.style.width = "100%"; actions.hidden = true;
      count.textContent = `${Q.length} / ${Q.length}`;
      const pct = acertos / Q.length;
      const [titulo, txt] = pct === 1 ? ["Expert em segurança!", "Você reconheceu todos os sinais. Compartilhe com quem precisa ficar atento."]
        : pct >= 0.6 ? ["Mandou bem!", "Você está atento, mas alguns golpes são bem convincentes. Na dúvida, fale com quem é autorizado."]
        : ["Atenção redobrada!", "Os golpistas são criativos. Antes de contratar, sempre confira quem está do outro lado."];
      stage.innerHTML = `
        <div class="qres">
          <div class="qres__ring" style="--p:${pct}"><span><b>${acertos}</b>/${Q.length}</span></div>
          <h3 class="qres__title">${titulo}</h3>
          <p class="qres__txt">${txt}</p>
          <div class="qres__actions">
            <a class="btn btn--primary magnetic" href="${waLink(E.whatsapp.numero, "Olá FB Negócios! Fiz o teste de golpes no site e quero contratar com segurança.")}" target="_blank" rel="noopener">${icon("whatsapp")} Falar com a FB</a>
            <button type="button" class="btn btn--ghost" data-restart>Refazer o teste</button>
            <button type="button" class="link-btn" data-home>Voltar ao início</button>
          </div>
          <p class="qres__note">A FB Negócios é correspondente bancária (Res. 3.954 BACEN) e <b>nunca</b> pede depósito antecipado, senha ou pagamento para liberar crédito.</p>
        </div>`;
      if (acertos === Q.length) confete();
    }

    function confete() {
      if (reduceMotion) return;
      const cores = ["#1c2a4b", "#8ea6da", "#ffffff", "#4a6399", "#c3d0ec"];
      const wrap = document.createElement("div"); wrap.className = "confetti"; wrap.setAttribute("aria-hidden", "true");
      for (let k = 0; k < 60; k++) {
        const c = document.createElement("i");
        c.style.cssText = `left:${Math.random() * 100}%;background:${cores[k % cores.length]};animation-delay:${Math.random() * 0.4}s;--x:${(Math.random() - 0.5) * 200}px;--r:${Math.random() * 720}deg`;
        wrap.append(c);
      }
      root.append(wrap); setTimeout(() => wrap.remove(), 2600);
    }

    function arrastar(card) {
      let x0 = 0, y0 = 0, dx = 0, ativo = false;
      const golpe = $(".qcard__stamp--golpe", card), seguro = $(".qcard__stamp--seguro", card);
      const pintar = () => {
        card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
        golpe.style.opacity = Math.min(1, Math.max(0, -dx / 110));
        seguro.style.opacity = Math.min(1, Math.max(0, dx / 110));
      };
      card.addEventListener("pointerdown", (e) => {
        if (travado) return;
        ativo = true; x0 = e.clientX; y0 = e.clientY; dx = 0;
        card.setPointerCapture(e.pointerId); card.style.transition = "none"; card.classList.add("is-drag");
      });
      card.addEventListener("pointermove", (e) => {
        if (!ativo) return;
        dx = e.clientX - x0;
        if (Math.abs(e.clientY - y0) > Math.abs(dx) * 1.5 && Math.abs(dx) < 10) return;
        pintar();
      });
      const soltar = () => {
        if (!ativo) return; ativo = false; card.classList.remove("is-drag");
        if (Math.abs(dx) > 110) responder(dx < 0 ? "golpe" : "seguro", dx < 0 ? -1 : 1);
        else { card.style.transition = "transform .5s cubic-bezier(.34,1.56,.64,1)"; dx = 0; pintar(); }
      };
      card.addEventListener("pointerup", soltar);
      card.addEventListener("pointercancel", soltar);
      card.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); responder("golpe", -1); }
        if (e.key === "ArrowRight") { e.preventDefault(); responder("seguro", 1); }
      });
    }

    actions.addEventListener("click", (e) => { const b = e.target.closest("[data-ans]"); if (b) responder(b.dataset.ans); });
    stage.addEventListener("click", (e) => {
      if (e.target.closest("[data-next]")) { i++; i < Q.length ? carta() : resultado(); }
      if (e.target.closest("[data-restart]") || e.target.closest("[data-start]")) iniciar();
      if (e.target.closest("[data-home]")) telaInicial();
    });
    $("#quizExit").addEventListener("click", () => {
      const meio = i < Q.length;
      telaInicial();
      if (meio) toast("Teste encerrado. Você pode recomeçar quando quiser.");
      $("[data-start]", stage).focus({ preventScroll: true });
    });
    root.addEventListener("keydown", (e) => { if (e.key === "Escape" && !root.classList.contains("is-idle")) $("#quizExit").click(); });
    function iniciar() { ordem = embaralhar(Q); i = 0; acertos = 0; carta(); $(".qcard", stage).focus({ preventScroll: true }); }
    telaInicial();
  }

  // Fotos do topo trocando suavemente (efeito Ken Burns)
  function heroSlides() {
    const box = $("#heroFotos"); if (!box || reduceMotion) return;
    let i = 0;
    setInterval(() => {
      const fotos = $$("img", box); if (fotos.length < 2 || document.hidden) return;
      fotos[i % fotos.length].classList.remove("is-on");
      i = (i + 1) % fotos.length;
      fotos[i].classList.add("is-on");
    }, 6000);
  }

  // Busca de bancos
  function bankSearch() {
    const input = $("#bankSearch"), empty = $("#portaisVazio");
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      let n = 0;
      $$(".portal").forEach((p) => {
        const nome = p.dataset.name.normalize("NFD").replace(/[̀-ͯ]/g, "");
        const qd = q.replace(/\D/g, "");
        const ok = nome.includes(q) || (qd.length >= 3 && nome.replace(/\D/g, "").includes(qd));
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

  /* ================= PAINEL: seções e pré-visualização ================= */
  const SECOES = { assistente: "#assistente", seguranca: "#seguranca", parceiros: "#parceiros", depoimentos: "#depoimentos", time: "#time", bancos: "#bancos", fbinforma: "#fbinforma", faq: "#faq" };
  function aplicarSecoes(cfg) {
    const sec = (cfg && cfg.secoes) || {};
    Object.entries(SECOES).forEach(([k, sel]) => {
      const on = sec[k] !== false, el = $(sel);
      if (el) el.hidden = !on;
      $$(`a[href="${sel}"]`).forEach((a) => { const li = a.closest("li"); (li || a).hidden = !on; });
    });
  }
  function temaInicial(cfg) {
    const pedido = new URLSearchParams(location.search).get("tema");
    if (pedido && window.FBThemes && window.FBThemes.TEMAS[pedido]) return pedido;
    return window.FBConfig.temaDoDia(cfg).tema;
  }
  function escutarPainel() {
    addEventListener("message", (e) => {
      if (e.origin !== location.origin || !e.data || e.data.type !== "fb-preview") return;
      const cfg = window.FBConfig.mesclar(window.FBConfig.PADRAO, e.data.cfg || {});
      aplicarSecoes(cfg);
      if (window.FBThemes) window.FBThemes.aplicar(e.data.tema || window.FBConfig.temaDoDia(cfg).tema, cfg);
    });
  }

  /* ================= INÍCIO ================= */
  async function boot() {
    let cfg = null;
    if (window.FBConfig) {
      try { cfg = await window.FBConfig.carregar(); window.FBConfig.aplicarConteudo(D, cfg); } catch (_) { cfg = null; }
    }
    window.FB_CFG = cfg;
    render();
    aplicarSecoes(cfg);
    splitPrepare();
    preloader();
    observers();
    header();
    theme();
    accordion();
    bankSearch();
    heroSlides();
    quizGolpe();
    copyPhones();
    wizard();
    form();
    microInteractions();
    parallax();
    if (cfg && window.FBThemes) window.FBThemes.aplicar(temaInicial(cfg), cfg);
    escutarPainel();
  }
  boot();
})();
