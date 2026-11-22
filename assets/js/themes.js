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
      amostra: ["#1f3a8a", "#05070c", "#7aa7ff"],
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
    // Chapéus no tamanho da sigla: a aba se apoia no topo do "FB" (y ≈ 80)
    gorro: `<g>
        <path d="M100 82 C104 40 136 12 180 8 C214 5 240 20 252 46 C258 60 260 76 258 92 C250 76 240 64 226 58 C230 66 230 74 226 82 Z" fill="#000" opacity=".28"/>
        <path d="M100 76 C104 34 136 6 180 2 C214 -1 240 14 252 40 C258 54 260 70 258 86 C250 70 240 58 226 52 C230 60 230 68 226 76 Z" fill="#e3263f" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>
        <path d="M180 2 C214 -1 240 14 252 40 C258 54 260 70 258 86 C252 76 246 68 238 62" fill="none" stroke="#a5122b" stroke-width="4"/>
        <path d="M128 20 C150 6 172 2 190 4" fill="none" stroke="#ff6b7d" stroke-width="5" stroke-linecap="round" opacity=".7"/>
        <circle cx="258" cy="92" r="15" fill="#fff"/>
        <rect x="88" y="70" width="146" height="28" rx="14" fill="#000" opacity=".25"/><rect x="88" y="66" width="146" height="28" rx="14" fill="#fff"/>
        <path d="M96 74 h130" stroke="#e8e8e8" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 9"/>
      </g>`,
    "chapeu-palha": `<g>
        <ellipse cx="160" cy="84" rx="100" ry="18" fill="#e9c46a" stroke="#b5892f" stroke-width="4"/>
        <path d="M116 84 C114 30 206 30 204 84 Z" fill="#f4d58d" stroke="#b5892f" stroke-width="4"/>
        <path d="M117 70 C140 77 180 77 203 70 L204 84 C180 92 140 92 116 84 Z" fill="#d00000"/>
        <rect x="178" y="42" width="14" height="12" rx="2" fill="#3a86ff" transform="rotate(12 185 48)"/>
      </g>`,
    "chapeu-bruxa": `<g transform="rotate(-8 160 84)">
        <ellipse cx="160" cy="86" rx="104" ry="17" fill="#2b1740" stroke="#ff7518" stroke-width="3"/>
        <path d="M118 86 C134 56 150 24 168 -14 C176 0 184 8 200 4 C190 24 196 52 204 86 Z" fill="#3a1d57"/>
        <path d="M121 74 C144 82 180 82 202 74 L204 86 C180 96 140 96 118 86 Z" fill="#ff7518"/>
        <rect x="150" y="73" width="20" height="17" rx="3" fill="none" stroke="#a3e635" stroke-width="4"/>
      </g>`,
    confete: [...Array(14)].map((_, k) => {
      const a = (k / 14) * Math.PI * 2, r = 182, x = 160 + Math.cos(a) * r, y = 160 + Math.sin(a) * r;
      const c = ["#f72585", "#ffd23f", "#06d6a0", "#4cc9f0", "#b388ff"][k % 5];
      return k % 2 ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="${c}"/>`
        : `<rect x="${(x - 9).toFixed(1)}" y="${(y - 5).toFixed(1)}" width="18" height="10" rx="2" fill="${c}" transform="rotate(${k * 37} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }).join(""),
  };

  function svgLogo(t, d) {
    // chapéus ocupam só uma faixa acima do círculo (a logo quase não encolhe); o confete fica em volta
    const vb = !t.extra ? "0 0 320 320" : t.extra === "confete" ? "-40 -40 400 400" : "-6 -26 332 352";
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
     Personagens dos temas (bonecos de neve, abóboras, fantasminhas,
     espantalhos, milhos, fogueiras e máscaras) — SVG desenhado aqui
     --------------------------------------------------------------- */
  const P = {
    boneco: (c = "#d62839") => `<svg viewBox="0 0 120 150"><ellipse cx="60" cy="144" rx="42" ry="6" fill="#000" opacity=".18"/>
      <path d="M22 70 L4 52 M10 58 L4 66 M98 70 L116 50 M110 56 L118 62" stroke="#6b4423" stroke-width="4" stroke-linecap="round" fill="none"/>
      <circle cx="60" cy="112" r="32" fill="#f5f9ff" stroke="#c9d6ea" stroke-width="2"/><circle cx="60" cy="70" r="24" fill="#f5f9ff" stroke="#c9d6ea" stroke-width="2"/>
      <circle cx="60" cy="34" r="19" fill="#f5f9ff" stroke="#c9d6ea" stroke-width="2"/>
      <path d="M44 48 C52 56 68 56 76 48 L78 56 C68 64 52 64 42 56 Z" fill="${c}"/><path d="M68 56 L74 82 L64 80 L62 58 Z" fill="${c}"/>
      <rect x="42" y="2" width="36" height="22" rx="3" fill="#1d1d2b"/><rect x="34" y="21" width="52" height="6" rx="3" fill="#1d1d2b"/><rect x="42" y="16" width="36" height="5" fill="${c}"/>
      <circle cx="53" cy="31" r="2.8" fill="#1d1d2b"/><circle cx="67" cy="31" r="2.8" fill="#1d1d2b"/><path d="M60 36 L78 40 L60 41 Z" fill="#ff8c1a"/>
      <path d="M51 44 Q60 49 69 44" stroke="#1d1d2b" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-dasharray="1 4"/>
      <circle cx="60" cy="70" r="3" fill="#1d1d2b"/><circle cx="60" cy="84" r="3" fill="#1d1d2b"/><circle cx="60" cy="104" r="3" fill="#1d1d2b"/>
      <circle cx="48" cy="40" r="3" fill="#ff9aa2" opacity=".6"/><circle cx="72" cy="40" r="3" fill="#ff9aa2" opacity=".6"/></svg>`,
    pinheiro: () => `<svg viewBox="0 0 100 150"><rect x="44" y="118" width="12" height="22" fill="#6b4423"/>
      <path d="M50 6 L82 56 H64 L90 92 H68 L96 126 H4 L32 92 H10 L36 56 H18 Z" fill="#1f7a4c" stroke="#145a37" stroke-width="2" stroke-linejoin="round"/>
      <path d="M20 125 Q50 112 80 124 M28 90 Q50 80 72 90 M34 55 Q50 48 66 55" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"/>
      <circle cx="40" cy="74" r="4" fill="#ffd23f"/><circle cx="64" cy="106" r="4" fill="#e63946"/><circle cx="36" cy="110" r="4" fill="#3a86ff"/><circle cx="60" cy="68" r="4" fill="#e63946"/>
      <path d="M50 0 L53 8 L61 8 L55 13 L57 21 L50 16 L43 21 L45 13 L39 8 L47 8 Z" fill="#ffd23f"/></svg>`,
    presente: (a = "#e63946", b = "#ffd23f") => `<svg viewBox="0 0 80 80"><rect x="8" y="30" width="64" height="46" rx="4" fill="${a}"/><rect x="4" y="22" width="72" height="14" rx="3" fill="${a}" stroke="#0002"/>
      <rect x="35" y="22" width="10" height="54" fill="${b}"/><path d="M40 22 C26 4 14 14 26 22 M40 22 C54 4 66 14 54 22" stroke="${b}" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`,
    abobora: (olho = "#ffd43b") => `<svg viewBox="0 0 120 110"><ellipse cx="60" cy="104" rx="44" ry="5" fill="#000" opacity=".22"/>
      <path d="M58 18 C56 8 62 2 70 4 C66 8 64 14 66 20 Z" fill="#3f7d20"/>
      <ellipse cx="38" cy="62" rx="26" ry="38" fill="#e8590c"/><ellipse cx="82" cy="62" rx="26" ry="38" fill="#e8590c"/><ellipse cx="60" cy="62" rx="30" ry="42" fill="#ff7518"/>
      <path d="M60 22 C50 40 50 84 60 102 M60 22 C70 40 70 84 60 102" stroke="#d9480f" stroke-width="2" fill="none" opacity=".6"/>
      <g class="fx-char__glow" fill="${olho}"><path d="M36 50 L48 62 H30 Z"/><path d="M84 50 L90 62 H72 Z"/><path d="M58 64 L64 72 H52 Z"/>
      <path d="M30 78 L38 84 L44 78 L52 86 L60 78 L68 86 L76 78 L82 84 L90 78 C84 94 36 94 30 78 Z"/></g></svg>`,
    fantasma: () => `<svg viewBox="0 0 100 130"><ellipse cx="50" cy="126" rx="26" ry="4" fill="#000" opacity=".18"/>
      <path d="M14 112 V52 C14 22 30 6 50 6 C70 6 86 22 86 52 V112 L76 102 L66 112 L56 102 L46 112 L36 102 L26 112 L14 102 Z" fill="#f8f9ff" opacity=".95"/>
      <path d="M14 70 C2 66 0 54 6 50 M86 70 C98 64 100 52 94 48" stroke="#f8f9ff" stroke-width="8" stroke-linecap="round" fill="none"/>
      <ellipse cx="38" cy="50" rx="6" ry="9" fill="#2b1740"/><ellipse cx="62" cy="50" rx="6" ry="9" fill="#2b1740"/><circle cx="40" cy="47" r="2" fill="#fff"/><circle cx="64" cy="47" r="2" fill="#fff"/>
      <ellipse cx="50" cy="70" rx="6" ry="8" fill="#2b1740"/><circle cx="30" cy="62" r="4" fill="#ffadc6" opacity=".7"/><circle cx="70" cy="62" r="4" fill="#ffadc6" opacity=".7"/></svg>`,
    lapide: () => `<svg viewBox="0 0 80 90"><path d="M10 86 V36 C10 14 70 14 70 36 V86 Z" fill="#6c6a7e" stroke="#4a4858" stroke-width="3"/>
      <text x="40" y="52" font-size="16" font-weight="800" text-anchor="middle" fill="#3a3848" font-family="sans-serif">RIP</text><path d="M4 86 H76" stroke="#3f7d20" stroke-width="6" stroke-linecap="round"/></svg>`,
    espantalho: () => `<svg viewBox="0 0 130 170"><ellipse cx="65" cy="166" rx="30" ry="4" fill="#000" opacity=".2"/>
      <rect x="61" y="60" width="8" height="106" fill="#7a4e2a"/><rect x="10" y="66" width="110" height="8" rx="3" fill="#7a4e2a"/>
      <path d="M8 66 L0 58 M8 74 L0 80 M122 66 L130 58 M122 74 L130 80" stroke="#e9c46a" stroke-width="4" stroke-linecap="round"/>
      <path d="M30 64 H100 L106 80 L92 82 L90 128 H40 L38 82 L24 80 Z" fill="#3a86ff"/>
      <path d="M40 64 V128 M52 64 V128 M64 64 V128 M76 64 V128 M88 64 V128 M36 80 H94 M38 96 H92 M40 112 H90" stroke="#e63946" stroke-width="3" opacity=".75"/>
      <rect x="70" y="96" width="16" height="14" fill="#f4a261" stroke="#7a4e2a" stroke-dasharray="3 2"/>
      <path d="M44 128 L40 142 M54 128 L52 144 M76 128 L78 144 M86 128 L90 142" stroke="#e9c46a" stroke-width="4" stroke-linecap="round"/>
      <circle cx="65" cy="42" r="22" fill="#e9c46a" stroke="#b5892f" stroke-width="2"/>
      <path d="M56 38 L62 44 M62 38 L56 44 M68 38 L74 44 M74 38 L68 44" stroke="#3a2a1a" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M54 52 Q65 60 76 52" stroke="#3a2a1a" stroke-width="2.4" fill="none" stroke-dasharray="3 3"/>
      <ellipse cx="65" cy="24" rx="40" ry="8" fill="#d4a24c" stroke="#9c6f22" stroke-width="2"/><path d="M44 24 C44 2 86 2 86 24 Z" fill="#e9b85a" stroke="#9c6f22" stroke-width="2"/>
      <path d="M45 20 C56 24 74 24 85 20 L86 24 C74 28 56 28 44 24 Z" fill="#e63946"/></svg>`,
    milho: () => `<svg viewBox="0 0 70 140"><path d="M35 132 C10 110 4 70 18 40 C22 80 30 110 35 132 Z" fill="#52b043"/><path d="M35 132 C60 110 66 70 52 40 C48 80 40 110 35 132 Z" fill="#3f8f33"/>
      <ellipse cx="35" cy="62" rx="16" ry="46" fill="#ffd23f" stroke="#e0a800" stroke-width="2"/>
      <g fill="#ffe680" stroke="#e0a800" stroke-width=".8">${[...Array(9)].map((_, r) => [...Array(3)].map((_, k) => `<ellipse cx="${27 + k * 8}" cy="${26 + r * 9}" rx="3.6" ry="4"/>`).join("")).join("")}</g>
      <path d="M35 132 C24 120 22 100 26 86 C30 104 33 118 35 132 Z" fill="#6cc24a"/><path d="M33 16 C30 6 34 0 36 0 C38 6 38 12 36 16" stroke="#c98a2b" stroke-width="2" fill="none"/></svg>`,
    fogueira: () => `<svg viewBox="0 0 120 130"><ellipse cx="60" cy="124" rx="46" ry="6" fill="#000" opacity=".25"/>
      <g class="fx-char__chama"><path d="M60 8 C76 34 92 48 88 78 C86 100 72 110 60 110 C48 110 34 100 32 78 C30 56 46 46 50 26 C56 38 58 44 60 52 C62 36 60 22 60 8 Z" fill="#ff5400"/>
      <path d="M60 34 C70 52 80 62 76 84 C74 100 66 106 60 106 C54 106 46 100 44 86 C42 70 52 62 54 48 C58 58 60 62 60 68 C62 56 60 46 60 34 Z" fill="#ffa200"/>
      <path d="M60 62 C66 74 70 82 68 92 C66 102 62 104 60 104 C58 104 52 102 52 94 C52 84 58 80 60 62 Z" fill="#ffe066"/></g>
      <path d="M18 116 L102 98" stroke="#7a4e2a" stroke-width="12" stroke-linecap="round"/><path d="M18 98 L102 116" stroke="#5e3a1e" stroke-width="12" stroke-linecap="round"/>
      <circle cx="18" cy="116" r="6" fill="#c08552"/><circle cx="102" cy="98" r="6" fill="#c08552"/></svg>`,
    mascara: (a = "#7b2ff7", b = "#ffd23f", c = "#f72585") => `<svg viewBox="0 0 140 110">
      <path d="M96 30 C104 6 118 -2 128 4 C118 12 112 22 108 36 Z" fill="${c}"/><path d="M100 34 C116 18 132 18 138 26 C126 28 116 34 108 42 Z" fill="#06d6a0"/>
      <path d="M92 28 C94 10 102 0 110 0 C104 10 102 20 102 32 Z" fill="${b}"/>
      <path d="M10 44 C10 26 32 18 50 26 C58 30 62 34 70 34 C78 34 82 30 90 26 C108 18 130 26 130 44 C130 66 110 78 92 70 C82 66 78 58 70 58 C62 58 58 66 48 70 C30 78 10 66 10 44 Z" fill="${a}" stroke="${b}" stroke-width="3"/>
      <path d="M30 44 C34 36 46 36 52 44 C46 52 34 52 30 44 Z M88 44 C94 36 106 36 110 44 C106 52 94 52 88 44 Z" fill="#1b1030"/>
      <circle cx="22" cy="40" r="3" fill="${b}"/><circle cx="118" cy="40" r="3" fill="${b}"/><circle cx="70" cy="44" r="3.5" fill="${c}"/>
      <path d="M26 58 L22 104" stroke="${b}" stroke-width="4" stroke-linecap="round"/></svg>`,
  };

  function aplicarPersonagens(chave) {
    document.querySelector(".footer")?.classList.remove("has-scene");
    document.querySelectorAll(".fx-ancora").forEach((e) => e.classList.remove("fx-ancora"));
    const M = {
      natal: {
        secoes: [["boneco", P.boneco()], ["pinheiro", P.pinheiro()], ["boneco", P.boneco("#3a86ff")], ["presente", P.presente()], ["boneco", P.boneco("#2a9d8f")], ["pinheiro", P.pinheiro()]],
        rodape: [["pinheiro", P.pinheiro(), 120], ["presente", P.presente("#3a86ff", "#fff"), 46], ["boneco", P.boneco(), 112], ["pinheiro", P.pinheiro(), 92], ["presente", P.presente(), 52], ["boneco", P.boneco("#3a86ff"), 100], ["presente", P.presente("#2a9d8f", "#ffd23f"), 44], ["pinheiro", P.pinheiro(), 126]],
      },
      saojoao: {
        secoes: [["milho", P.milho()], ["espantalho", P.espantalho()], ["fogueira", P.fogueira()], ["espantalho", P.espantalho()], ["milho", P.milho()], ["fogueira", P.fogueira()]],
        rodape: [["milho", P.milho(), 84], ["espantalho", P.espantalho(), 124], ["milho", P.milho(), 70], ["fogueira", P.fogueira(), 104], ["milho", P.milho(), 80], ["espantalho", P.espantalho(), 116], ["milho", P.milho(), 74]],
      },
      halloween: {
        secoes: [["abobora", P.abobora()], ["fantasma", P.fantasma()], ["abobora", P.abobora("#a3e635")], ["fantasma", P.fantasma()], ["lapide", P.lapide()], ["abobora", P.abobora()]],
        rodape: [["lapide", P.lapide(), 70], ["abobora", P.abobora(), 64], ["fantasma", P.fantasma(), 104], ["abobora", P.abobora("#a3e635"), 54], ["lapide", P.lapide(), 62], ["fantasma", P.fantasma(), 90], ["abobora", P.abobora(), 70]],
      },
      carnaval: {
        secoes: [["mascara", P.mascara()], ["mascara", P.mascara("#06d6a0", "#ffd23f", "#3a86ff")], ["mascara", P.mascara("#f72585", "#ffd23f", "#7b2ff7")], ["mascara", P.mascara("#ffd23f", "#f72585", "#06d6a0")], ["mascara", P.mascara("#3a86ff", "#ffd23f", "#f72585")], ["mascara", P.mascara()]],
        rodape: [["mascara", P.mascara("#06d6a0", "#ffd23f", "#3a86ff"), 64], ["mascara", P.mascara(), 76], ["mascara", P.mascara("#f72585", "#ffd23f", "#7b2ff7"), 60], ["mascara", P.mascara("#ffd23f", "#f72585", "#06d6a0"), 82], ["mascara", P.mascara("#3a86ff", "#ffd23f", "#f72585"), 66], ["mascara", P.mascara(), 72]],
      },
    }[chave];
    if (!M) return;
    // personagens em poucos lugares escolhidos: sentado na faixa de números e emoldurando a chamada final
    const ANCORAS = [
      [".stats", "sentado", "dir"],
      [".cta-final__inner", "palco", "esq"],
      [".cta-final__inner", "palco", "dir"],
    ];
    ANCORAS.forEach(([sel, modo, lado], i) => {
      const alvo = document.querySelector(sel); if (!alvo || !M.secoes[i]) return;
      const [tipo, svg] = M.secoes[i];
      alvo.classList.add("fx-ancora");
      const el = document.createElement("div");
      el.className = `fx-deco fx-char fx-char--${tipo} fx-char--${modo} fx-char--${lado}`;
      el.setAttribute("aria-hidden", "true"); el.style.setProperty("--d", `${(i % 3) * 0.6}s`);
      el.innerHTML = svg; alvo.append(el);
    });
    // cena no rodapé, com chão temático
    const footer = document.querySelector(".footer");
    if (footer) {
      const cena = document.createElement("div");
      cena.className = `fx-deco fx-scene fx-scene--${chave}`; cena.setAttribute("aria-hidden", "true");
      cena.innerHTML = M.rodape.map(([tipo, svg, h], k) => `<i class="fx-char--${tipo}" style="--h:${h}px;--d:${(k % 4) * 0.5}s">${svg}</i>`).join("");
      footer.prepend(cena); footer.classList.add("has-scene");
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
      aplicarPersonagens(atual);
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
