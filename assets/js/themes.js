/* =====================================================================
   FB NEGÓCIOS — TEMAS E EFEITOS SAZONAIS
   ---------------------------------------------------------------------
   Cada tema troca a paleta (variáveis CSS), a logo, a faixa de aviso e
   liga efeitos leves (canvas) só em áreas estratégicas: topo do site e
   chamada final. Os efeitos pausam fora da tela, com a aba escondida e
   para quem ativou "reduzir movimento" no sistema.
   ===================================================================== */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------------------------------------------------------------
     Catálogo de temas
     --------------------------------------------------------------- */
  const TEMAS = {
    oficial: {
      nome: "Oficial", descricao: "Azul-marinho da fachada e preto da farda.",
      amostra: ["#1c2a4b", "#0a0a0c", "#8ea6da"],
      logo: ["#34497D", "#141E38"], extra: null, efeito: null,
      aviso: "", cores: null, claro: null,
    },
    classico: {
      nome: "Clássico", descricao: "A identidade anterior, em vermelho e azul.",
      amostra: ["#e3123b", "#24236b", "#ff7a1a"],
      logo: ["#E3123B", "#16154A"], extra: null, efeito: null, aviso: "",
      cores: {
        "--red": "#e3123b", "--red-2": "#ff2d55", "--magenta": "#b0175f", "--navy": "#16154a", "--navy-2": "#24236b", "--orange": "#ff7a1a",
        "--grad": "linear-gradient(135deg, #e3123b 0%, #b0175f 50%, #24236b 100%)",
        "--grad-text": "linear-gradient(100deg, #ff3b62 0%, #ff7a1a 45%, #e3123b 100%)",
        "--bg": "#0b0a24", "--bg-2": "#11103a", "--muted": "#a7a5c9",
      },
      claro: { "--red-2": "#e3123b", "--grad-text": "linear-gradient(100deg, #e3123b 0%, #b0175f 100%)" },
    },
    natal: {
      nome: "Natal", descricao: "Neve caindo, pisca-pisca no menu e gorro na logo.",
      amostra: ["#c8102e", "#0f3d2e", "#f2c14e"],
      logo: ["#C8102E", "#0F3D2E"], extra: "gorro", efeito: "neve", enfeites: ["luzes", "neve-acumulada"],
      clique: ["#ffffff", "#f2c14e", "#ff5a5f"],
      aviso: "🎄 Boas festas! A FB Negócios deseja um Natal cheio de conquistas para você e sua família.",
      cores: {
        "--red": "#c8102e", "--red-2": "#f2c14e", "--magenta": "#8b0a1f", "--navy": "#0f3d2e", "--navy-2": "#145a41", "--orange": "#f2c14e",
        "--grad": "linear-gradient(135deg, #c8102e 0%, #8b0a1f 45%, #0f3d2e 100%)",
        "--grad-text": "linear-gradient(100deg, #fff6d8 0%, #f2c14e 50%, #ff5a5f 100%)",
        "--bg": "#07140f", "--bg-2": "#0c1f17", "--muted": "#a9bdb2",
      },
      claro: { "--red-2": "#c8102e", "--grad-text": "linear-gradient(100deg, #c8102e 0%, #0f3d2e 100%)" },
    },
    carnaval: {
      nome: "Carnaval", descricao: "Confete e serpentina caindo, explosão de cor a cada clique.",
      amostra: ["#f72585", "#7b2ff7", "#ffd23f"],
      logo: ["#F72585", "#3A0CA3"], extra: "confete", efeito: "confete", enfeites: ["serpentinas"],
      clique: ["#f72585", "#7b2ff7", "#ffd23f", "#06d6a0", "#4cc9f0"],
      aviso: "🎉 É Carnaval! Aproveite a folia com segurança — e conte com a FB quando precisar.",
      cores: {
        "--red": "#7b2ff7", "--red-2": "#ffd23f", "--magenta": "#f72585", "--navy": "#3a0ca3", "--navy-2": "#4361ee", "--orange": "#06d6a0",
        "--grad": "linear-gradient(135deg, #f72585 0%, #7b2ff7 50%, #3a0ca3 100%)",
        "--grad-text": "linear-gradient(100deg, #ffd23f 0%, #06d6a0 35%, #f72585 70%, #b388ff 100%)",
        "--bg": "#0d0718", "--bg-2": "#160b2b", "--muted": "#b3a6cf",
      },
      claro: { "--red-2": "#7b2ff7", "--grad-text": "linear-gradient(100deg, #f72585 0%, #7b2ff7 100%)" },
    },
    saojoao: {
      nome: "São João", descricao: "Bandeirinhas no menu, faíscas de fogueira e chapéu de palha.",
      amostra: ["#e85d04", "#ffba08", "#1d3557"],
      logo: ["#F48C06", "#9D0208"], extra: "chapeu-palha", efeito: "brasas", enfeites: ["bandeirinhas", "xadrez"],
      clique: ["#ffba08", "#f48c06", "#e85d04", "#fff1c1"],
      aviso: "🌽 Arraiá da FB! Um São João de muita alegria, forró e bons negócios.",
      cores: {
        "--red": "#e85d04", "--red-2": "#ffba08", "--magenta": "#d00000", "--navy": "#1d3557", "--navy-2": "#264b7a", "--orange": "#ffba08",
        "--grad": "linear-gradient(135deg, #ffba08 0%, #e85d04 45%, #9d0208 100%)",
        "--grad-text": "linear-gradient(100deg, #fff1c1 0%, #ffba08 45%, #f48c06 100%)",
        "--bg": "#120b06", "--bg-2": "#1d120a", "--muted": "#c7b39f",
      },
      claro: { "--red-2": "#c2410c", "--grad-text": "linear-gradient(100deg, #e85d04 0%, #9d0208 100%)" },
    },
    halloween: {
      nome: "Halloween", descricao: "Morcegos, neblina, aranha e modo lanterna opcional.",
      amostra: ["#ff7518", "#4b1782", "#a3e635"],
      logo: ["#FF7518", "#2D0A4E"], extra: "chapeu-bruxa", efeito: "morcegos", enfeites: ["neblina", "aranha", "lua"],
      clique: ["#ff7518", "#a3e635", "#b57bff"],
      aviso: "🎃 Halloween na FB: o único susto aqui é o tamanho das oportunidades!",
      cores: {
        "--red": "#ff7518", "--red-2": "#ff9a3c", "--magenta": "#6a0dad", "--navy": "#2d0a4e", "--navy-2": "#4b1782", "--orange": "#a3e635",
        "--grad": "linear-gradient(135deg, #ff7518 0%, #b8420f 40%, #2d0a4e 100%)",
        "--grad-text": "linear-gradient(100deg, #ffd6a5 0%, #ff9a3c 45%, #ff7518 100%)",
        "--bg": "#0a0710", "--bg-2": "#150d22", "--muted": "#b2a5c4",
      },
      claro: { "--red-2": "#c2410c", "--grad-text": "linear-gradient(100deg, #ff7518 0%, #6a0dad 100%)" },
    },
  };

  /* ---------------------------------------------------------------
     Paleta (variáveis CSS)
     --------------------------------------------------------------- */
  function aplicarCores(t) {
    let st = document.getElementById("fb-tema-vars");
    if (!st) { st = document.createElement("style"); st.id = "fb-tema-vars"; document.head.append(st); }
    const bloco = (obj) => Object.entries(obj || {}).map(([k, v]) => `${k}: ${v};`).join(" ");
    st.textContent = t.cores
      ? `html[data-theme="dark"] { ${bloco(t.cores)} } html[data-theme="light"] { ${bloco(Object.assign({ "--red": t.cores["--red"], "--magenta": t.cores["--magenta"], "--navy": t.cores["--navy"], "--navy-2": t.cores["--navy-2"], "--orange": t.cores["--orange"], "--grad": t.cores["--grad"] }, t.claro))} }`
      : "";
  }

  /* ---------------------------------------------------------------
     Logo dinâmica (gera o SVG com as cores e o enfeite do tema)
     --------------------------------------------------------------- */
  let markPath = null;
  async function pegarMarca() {
    if (markPath) return markPath;
    try {
      const txt = await fetch("assets/img/fb-mark.svg").then((r) => r.text());
      markPath = (txt.match(/ d="([^"]+)"/) || [])[1] || null;
    } catch (_) { markPath = null; }
    return markPath;
  }

  const EXTRAS = {
    gorro: `<g transform="rotate(-14 160 40)">
        <path d="M70 52 C95 -10 185 -48 262 -22 C300 -8 318 20 322 46 C300 30 280 26 262 30 C236 6 190 4 150 22 Z" fill="#d21f3c"/>
        <path d="M262 -22 C300 -8 318 20 322 46" fill="none" stroke="#a5122b" stroke-width="6"/>
        <circle cx="322" cy="50" r="24" fill="#fff"/>
        <rect x="52" y="40" width="226" height="40" rx="20" fill="#fff"/>
      </g>`,
    "chapeu-palha": `<g>
        <ellipse cx="160" cy="44" rx="176" ry="34" fill="#e9c46a" stroke="#b5892f" stroke-width="5"/>
        <path d="M88 44 C88 -40 232 -40 232 44 Z" fill="#f4d58d" stroke="#b5892f" stroke-width="5"/>
        <path d="M90 30 C130 40 190 40 230 30 L232 44 C190 54 130 54 88 44 Z" fill="#d00000"/>
        <rect x="186" y="-14" width="22" height="18" rx="3" fill="#3a86ff" transform="rotate(12 197 -5)"/>
      </g>`,
    "chapeu-bruxa": `<g transform="rotate(-10 160 40)">
        <ellipse cx="160" cy="48" rx="170" ry="30" fill="#2b1740" stroke="#ff7518" stroke-width="4"/>
        <path d="M84 48 C120 10 150 -40 178 -96 C196 -70 206 -30 236 48 Z" fill="#3a1d57"/>
        <path d="M104 32 C140 44 200 44 226 32 L236 48 C196 60 126 60 84 48 Z" fill="#ff7518"/>
        <rect x="146" y="30" width="26" height="22" rx="4" fill="none" stroke="#a3e635" stroke-width="5"/>
      </g>`,
    confete: [...Array(14)].map((_, k) => {
      const a = (k / 14) * Math.PI * 2, r = 182, x = 160 + Math.cos(a) * r, y = 160 + Math.sin(a) * r;
      const c = ["#f72585", "#ffd23f", "#06d6a0", "#4cc9f0", "#b388ff"][k % 5];
      return k % 2 ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="${c}"/>`
        : `<rect x="${(x - 9).toFixed(1)}" y="${(y - 5).toFixed(1)}" width="18" height="10" rx="2" fill="${c}" transform="rotate(${k * 37} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }).join(""),
  };

  function svgLogo(t, d) {
    const vb = t.extra ? "-40 -80 400 400" : "0 0 320 320";
    const marca = d ? `<g transform="translate(160 160) scale(.78) translate(-160 -160)"><path fill="#fff" fill-rule="evenodd" d="${d}"/></g>` : "";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.logo[0]}"/><stop offset="1" stop-color="${t.logo[1]}"/></linearGradient></defs><circle cx="160" cy="160" r="160" fill="url(#g)"/>${marca}${t.extra ? EXTRAS[t.extra] : ""}</svg>`;
  }

  async function aplicarLogo(t) {
    const imgs = [...document.querySelectorAll("img[data-logo], img[src$='logo.svg']")];
    imgs.forEach((i) => i.setAttribute("data-logo", ""));
    const d = await pegarMarca();
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgLogo(t, d));
    imgs.forEach((i) => (i.src = url));
    let fav = document.querySelector("link[rel='icon']");
    if (fav) fav.href = url;
  }

  /* ---------------------------------------------------------------
     Faixa de aviso no topo
     --------------------------------------------------------------- */
  function aplicarAviso(t, cfg) {
    document.querySelectorAll(".announce").forEach((e) => e.remove());
    document.documentElement.classList.remove("has-announce");
    const a = cfg.aviso || {};
    if (!a.ativo) return;
    const texto = (a.usarMensagemDoTema && t.aviso) ? t.aviso : a.texto;
    if (!texto) return;
    try { if (sessionStorage.getItem("fb-aviso-fechado") === texto) return; } catch (_) {}
    const bar = document.createElement("div");
    bar.className = "announce"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", "Aviso");
    const conteudo = document.createElement(a.link ? "a" : "span");
    conteudo.className = "announce__txt"; conteudo.textContent = texto;
    if (a.link) { conteudo.href = a.link; if (/^https?:/.test(a.link)) { conteudo.target = "_blank"; conteudo.rel = "noopener"; } }
    const x = document.createElement("button");
    x.type = "button"; x.className = "announce__x"; x.setAttribute("aria-label", "Fechar aviso"); x.textContent = "✕";
    x.addEventListener("click", () => {
      bar.classList.add("is-closing");
      try { sessionStorage.setItem("fb-aviso-fechado", texto); } catch (_) {}
      setTimeout(() => { bar.remove(); document.documentElement.classList.remove("has-announce"); }, 350);
    });
    bar.append(conteudo, x);
    document.body.prepend(bar);
    document.documentElement.classList.add("has-announce");
  }

  /* ---------------------------------------------------------------
     Enfeites em DOM (luzes, bandeirinhas, serpentinas, neblina...)
     --------------------------------------------------------------- */
  function aplicarEnfeites(t, cfg) {
    document.querySelectorAll(".fx-deco").forEach((e) => e.remove());
    const header = document.getElementById("header"), hero = document.querySelector(".hero");
    const enf = t.enfeites || [];
    if (enf.includes("luzes") && header) {
      const l = document.createElement("div"); l.className = "fx-deco fx-lights"; l.setAttribute("aria-hidden", "true");
      const cores = ["#ff3b3b", "#ffd23f", "#2ee66b", "#3ba7ff", "#ff7ad9"];
      l.innerHTML = [...Array(42)].map((_, k) => `<i style="--c:${cores[k % 5]};--d:${(k % 7) * 0.23}s"></i>`).join("");
      header.append(l);
    }
    if (enf.includes("bandeirinhas") && header) {
      const b = document.createElement("div"); b.className = "fx-deco fx-bunting"; b.setAttribute("aria-hidden", "true");
      const cores = ["#e63946", "#ffba08", "#2a9d8f", "#3a86ff", "#f72585", "#06d6a0"];
      b.innerHTML = [...Array(40)].map((_, k) => `<i style="--c:${cores[k % 6]};--d:${(k % 5) * 0.3}s"></i>`).join("");
      header.append(b);
    }
    if (enf.includes("serpentinas") && hero) {
      const s = document.createElement("div"); s.className = "fx-deco fx-streamers"; s.setAttribute("aria-hidden", "true");
      s.innerHTML = `<svg viewBox="0 0 200 400" class="fx-streamer fx-streamer--l"><path d="M100 0 C40 40 160 80 100 120 C40 160 160 200 100 240 C40 280 160 320 100 360" stroke="#f72585"/></svg>
        <svg viewBox="0 0 200 400" class="fx-streamer fx-streamer--r"><path d="M100 0 C160 40 40 80 100 120 C160 160 40 200 100 240 C160 280 40 320 100 360" stroke="#ffd23f"/></svg>
        <svg viewBox="0 0 200 400" class="fx-streamer fx-streamer--m"><path d="M100 0 C40 40 160 80 100 120 C40 160 160 200 100 240" stroke="#06d6a0"/></svg>`;
      hero.append(s);
    }
    if (enf.includes("neblina") && hero) {
      const f = document.createElement("div"); f.className = "fx-deco fx-fog"; f.setAttribute("aria-hidden", "true");
      f.innerHTML = "<i></i><i></i>"; hero.append(f);
    }
    if (enf.includes("lua") && hero) {
      const m = document.createElement("div"); m.className = "fx-deco fx-moon"; m.setAttribute("aria-hidden", "true"); hero.append(m);
    }
    if (enf.includes("aranha") && hero) {
      const a = document.createElement("div"); a.className = "fx-deco fx-spider"; a.setAttribute("aria-hidden", "true");
      a.innerHTML = `<span class="fx-spider__fio"></span><svg viewBox="0 0 64 64"><g stroke="#1b1028" stroke-width="3" stroke-linecap="round" fill="none"><path d="M24 30 L6 18 M24 34 L4 34 M24 38 L6 50 M26 42 L14 60 M40 30 L58 18 M40 34 L60 34 M40 38 L58 50 M38 42 L50 60"/></g><ellipse cx="32" cy="36" rx="11" ry="13" fill="#1b1028"/><circle cx="32" cy="22" r="7" fill="#1b1028"/><circle cx="29" cy="21" r="1.8" fill="#ff7518"/><circle cx="35" cy="21" r="1.8" fill="#ff7518"/></svg>`;
      hero.append(a);
    }
    if (cfg.tema && cfg.tema.lanterna && t.efeito === "morcegos" && hero && finePointer && !reduceMotion) {
      const lt = document.createElement("div"); lt.className = "fx-deco fx-flashlight"; lt.setAttribute("aria-hidden", "true");
      hero.append(lt);
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        lt.style.setProperty("--x", `${e.clientX - r.left}px`); lt.style.setProperty("--y", `${e.clientY - r.top}px`);
      });
    }
  }

  /* ---------------------------------------------------------------
     Efeitos em canvas (neve, confete, brasas, morcegos)
     --------------------------------------------------------------- */
  const campos = [];
  let fxLigado = true;

  class Campo {
    constructor(el, tipo, mult) {
      this.el = el; this.tipo = tipo; this.mult = mult; this.visivel = false; this.p = [];
      this.cv = document.createElement("canvas"); this.cv.className = "fx-deco fx-canvas"; this.cv.setAttribute("aria-hidden", "true");
      el.append(this.cv); this.ctx = this.cv.getContext("2d");
      this.vento = 0; this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.redim = this.redim.bind(this); this.passo = this.passo.bind(this);
      this.redim(); addEventListener("resize", this.redim);
      this.io = new IntersectionObserver(([e]) => { this.visivel = e.isIntersecting; if (this.visivel) this.iniciar(); }, { threshold: 0 });
      this.io.observe(el);
      if (finePointer) {
        this.onMove = (e) => { this.vento = (e.clientX / innerWidth - 0.5) * 1.6; };
        addEventListener("pointermove", this.onMove, { passive: true });
      }
    }
    redim() {
      const r = this.el.getBoundingClientRect();
      this.w = r.width; this.h = r.height;
      this.cv.width = this.w * this.dpr; this.cv.height = this.h * this.dpr;
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      const base = { neve: 90, confete: 70, brasas: 70, morcegos: 7 }[this.tipo];
      const area = (this.w * this.h) / (1280 * 720);
      const alvo = Math.round(base * this.mult * Math.max(0.35, Math.min(area, 1.4)) * (innerWidth < 700 ? 0.55 : 1));
      while (this.p.length < alvo) this.p.push(this.nova(true));
      this.p.length = alvo;
    }
    nova(inicio) {
      const R = Math.random, w = this.w, h = this.h;
      switch (this.tipo) {
        case "neve": return { x: R() * w, y: inicio ? R() * h : -10, r: 0.8 + R() * 2.8, vy: 0.35 + R() * 0.9, ph: R() * 6.28, sw: 0.3 + R() * 0.8, estrela: R() < 0.16, a: 0.45 + R() * 0.5 };
        case "confete": {
          const c = ["#f72585", "#ffd23f", "#06d6a0", "#4cc9f0", "#b388ff", "#ff7b00"];
          return { x: R() * w, y: inicio ? R() * h : -12, cw: 6 + R() * 6, ch: 3 + R() * 4, vy: 0.9 + R() * 1.7, rot: R() * 6.28, vr: (R() - 0.5) * 0.18, ph: R() * 6.28, c: c[(R() * c.length) | 0], circ: R() < 0.25 };
        }
        case "brasas": {
          const c = ["255,186,8", "244,140,6", "232,93,4", "255,241,193"];
          return { x: w * (0.15 + R() * 0.7), y: inicio ? R() * h : h + 10, r: 0.7 + R() * 2, vy: -(0.35 + R() * 1.2), ph: R() * 6.28, c: c[(R() * c.length) | 0], vida: 0.5 + R() * 0.5 };
        }
        case "morcegos": {
          const dir = R() < 0.5 ? 1 : -1;
          return { x: inicio ? R() * w : (dir > 0 ? -40 : w + 40), y: h * (0.08 + R() * 0.5), s: 10 + R() * 14, vx: dir * (0.7 + R() * 1.3), ph: R() * 6.28, fl: 0.18 + R() * 0.14, amp: 8 + R() * 22, y0: 0 };
        }
      }
    }
    iniciar() { if (!this.rodando && fxLigado) { this.rodando = true; requestAnimationFrame(this.passo); } }
    passo() {
      if (!this.visivel || document.hidden || !fxLigado) { this.rodando = false; this.ctx.clearRect(0, 0, this.w, this.h); return; }
      const { ctx, w, h } = this;
      ctx.clearRect(0, 0, w, h);
      for (let k = 0; k < this.p.length; k++) {
        const p = this.p[k];
        if (this.tipo === "neve") {
          p.ph += 0.012; p.y += p.vy; p.x += Math.sin(p.ph) * p.sw * 0.5 + this.vento * p.r * 0.25;
          if (p.y > h + 8) this.p[k] = this.nova(false);
          if (p.x > w + 8) p.x = -8; else if (p.x < -8) p.x = w + 8;
          ctx.globalAlpha = p.a;
          if (p.estrela) {
            ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.1; const s = p.r * 2.4;
            ctx.beginPath();
            for (let i = 0; i < 3; i++) { const a = p.ph + (i * Math.PI) / 3; ctx.moveTo(p.x - Math.cos(a) * s, p.y - Math.sin(a) * s); ctx.lineTo(p.x + Math.cos(a) * s, p.y + Math.sin(a) * s); }
            ctx.stroke();
          } else { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); }
        } else if (this.tipo === "confete") {
          p.ph += 0.05; p.rot += p.vr; p.y += p.vy; p.x += Math.sin(p.ph) * 0.8 + this.vento * 0.6;
          if (p.y > h + 12) this.p[k] = this.nova(false);
          ctx.globalAlpha = 0.9; ctx.fillStyle = p.c;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          if (p.circ) { ctx.beginPath(); ctx.arc(0, 0, p.ch * 0.8, 0, 6.283); ctx.fill(); }
          else { ctx.scale(Math.cos(p.ph * 1.6), 1); ctx.fillRect(-p.cw / 2, -p.ch / 2, p.cw, p.ch); }
          ctx.restore();
        } else if (this.tipo === "brasas") {
          p.ph += 0.06; p.y += p.vy; p.x += Math.sin(p.ph) * 0.6 + this.vento * 0.3;
          const vidaY = Math.max(0, p.y / h);
          if (p.y < h * 0.15 || vidaY < 0.05) this.p[k] = this.nova(false);
          const a = Math.min(1, vidaY * 1.4) * (0.55 + Math.sin(p.ph * 3) * 0.3) * p.vida;
          ctx.globalCompositeOperation = "lighter";
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          g.addColorStop(0, `rgba(${p.c},${a})`); g.addColorStop(1, `rgba(${p.c},0)`);
          ctx.fillStyle = g; ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.283); ctx.fill();
          ctx.globalCompositeOperation = "source-over";
        } else if (this.tipo === "morcegos") {
          p.ph += p.fl; p.x += p.vx; const y = p.y + Math.sin(p.x / 60) * p.amp;
          if ((p.vx > 0 && p.x > w + 50) || (p.vx < 0 && p.x < -50)) this.p[k] = this.nova(false);
          const s = p.s, bat = Math.sin(p.ph) * s * 0.55;
          ctx.globalAlpha = 0.92; ctx.fillStyle = "#1b1028"; ctx.strokeStyle = "rgba(255,154,60,.55)"; ctx.lineWidth = 1;
          ctx.save(); ctx.translate(p.x, y); if (p.vx < 0) ctx.scale(-1, 1);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-s * 0.5, -s * 0.2 - bat, -s * 1.2, -bat * 1.1);
          ctx.quadraticCurveTo(-s * 0.8, s * 0.1, -s * 0.55, s * 0.18);
          ctx.quadraticCurveTo(-s * 0.3, s * 0.05, 0, s * 0.3);
          ctx.quadraticCurveTo(s * 0.3, s * 0.05, s * 0.55, s * 0.18);
          ctx.quadraticCurveTo(s * 0.8, s * 0.1, s * 1.2, -bat * 1.1);
          ctx.quadraticCurveTo(s * 0.5, -s * 0.2 - bat, 0, 0);
          ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.arc(0, -s * 0.05, s * 0.2, 0, 6.283); ctx.fill();
          ctx.fillStyle = "#ff7518"; ctx.fillRect(s * 0.05, -s * 0.12, 1.6, 1.6); ctx.fillRect(-s * 0.1, -s * 0.12, 1.6, 1.6);
          ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(this.passo);
    }
    destruir() {
      this.io.disconnect(); removeEventListener("resize", this.redim);
      if (this.onMove) removeEventListener("pointermove", this.onMove);
      this.cv.remove(); this.rodando = false; this.visivel = false;
    }
  }

  /* Explosão de partículas no clique (microinteração do tema) */
  let cliqueCores = null;
  function explodir(e) {
    if (!cliqueCores || !fxLigado || reduceMotion) return;
    if (e.target.closest("input, textarea, select, .qcard")) return;
    const box = document.createElement("div"); box.className = "fx-burst"; box.setAttribute("aria-hidden", "true");
    box.style.left = e.clientX + "px"; box.style.top = e.clientY + "px";
    for (let k = 0; k < 14; k++) {
      const i = document.createElement("i"), a = (k / 14) * 6.283 + Math.random() * 0.4, d = 30 + Math.random() * 45;
      i.style.cssText = `--x:${Math.cos(a) * d}px;--y:${Math.sin(a) * d}px;background:${cliqueCores[k % cliqueCores.length]}`;
      box.append(i);
    }
    document.body.append(box); setTimeout(() => box.remove(), 900);
  }
  document.addEventListener("pointerdown", explodir);

  /* Botão para o visitante pausar os efeitos */
  function botaoEfeitos(ativo) {
    document.querySelectorAll(".fx-toggle").forEach((b) => b.remove());
    if (!ativo) return;
    const b = document.createElement("button");
    b.type = "button"; b.className = "fx-toggle";
    const rotulo = () => { b.innerHTML = `<span aria-hidden="true">${fxLigado ? "✨" : "⏸"}</span> ${fxLigado ? "Efeitos ligados" : "Efeitos pausados"}`; b.setAttribute("aria-pressed", String(fxLigado)); };
    rotulo();
    b.addEventListener("click", () => {
      fxLigado = !fxLigado;
      try { localStorage.setItem("fb-fx-off", fxLigado ? "0" : "1"); } catch (_) {}
      document.documentElement.classList.toggle("fx-off", !fxLigado);
      campos.forEach((c) => (fxLigado ? c.iniciar() : null));
      rotulo();
    });
    document.body.append(b);
  }

  /* ---------------------------------------------------------------
     API pública
     --------------------------------------------------------------- */
  let atual = null;
  function limpar() {
    campos.splice(0).forEach((c) => c.destruir());
    document.querySelectorAll(".fx-deco, .fx-toggle, .announce").forEach((e) => e.remove());
    document.documentElement.classList.remove("has-announce", "fx-off", "fx-on");
    cliqueCores = null;
  }

  async function aplicar(chave, cfg) {
    const t = TEMAS[chave] || TEMAS.oficial;
    const tc = (cfg && cfg.tema) || {};
    limpar();
    atual = TEMAS[chave] ? chave : "oficial";
    document.documentElement.dataset.skin = atual;
    aplicarCores(t);
    aplicarAviso(t, cfg || {});
    await aplicarLogo(t);

    const querEfeitos = tc.efeitos !== false && !!t.efeito;
    try { fxLigado = localStorage.getItem("fb-fx-off") !== "1"; } catch (_) { fxLigado = true; }
    document.documentElement.classList.toggle("fx-off", !fxLigado);
    document.documentElement.classList.toggle("fx-on", querEfeitos);
    if (querEfeitos) {
      aplicarEnfeites(t, cfg || {});
      if (!reduceMotion) {
        const mult = { baixa: 0.5, media: 1, alta: 1.8 }[tc.intensidade] || 1;
        document.querySelectorAll(".hero, .cta-final__inner").forEach((el) => campos.push(new Campo(el, t.efeito, el.classList.contains("hero") ? mult : mult * 0.6)));
        cliqueCores = t.clique || null;
      }
      botaoEfeitos(tc.permitirDesligar !== false);
    }
    document.dispatchEvent(new CustomEvent("fb:tema", { detail: { tema: atual } }));
  }

  window.FBThemes = { TEMAS, aplicar, svgLogo, pegarMarca, get atual() { return atual; } };
})();
