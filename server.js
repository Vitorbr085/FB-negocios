/**
 * FB Negócios — servidor (Node.js puro, sem dependências)
 *
 *  Site
 *   GET  /                      → site
 *   GET  /<endereço secreto>    → painel administrativo (padrão: /admin; troque no painel)
 *   GET  /api/config            → configuração pública (tema, avisos, contatos...)
 *   POST /api/contato           → formulário do site (salva em data/mensagens.json)
 *
 *  Painel (exige login)
 *   POST  /api/login            → { usuario, senha, lembrar } → token (8 h ou 30 dias)
 *   POST  /api/logout
 *   GET   /api/sessao           → confirma se o token ainda vale
 *   PUT   /api/config           → salva a configuração (data/config.json)
 *   GET   /api/contatos         → lista as mensagens do formulário
 *   PATCH /api/contatos/:id     → { status } (novo | em-atendimento | concluido)
 *   POST  /api/senha            → { atual, nova } troca a senha do painel
 *
 * Acesso: usuário "admin" e senha temporária "admin123" (troque pelo painel em
 * Segurança). A senha fica guardada criptografada em data/admin.json.
 * Para definir outros dados ao iniciar:
 *   ADMIN_USER=fulano ADMIN_PASSWORD=minha-senha npm start
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const DB = path.join(DATA_DIR, "mensagens.json");
const CONFIG = path.join(DATA_DIR, "config.json");
const ADMIN = path.join(DATA_DIR, "admin.json");
const SESSAO_MS = 8 * 60 * 60 * 1000;
const SESSAO_LONGA_MS = 30 * 24 * 60 * 60 * 1000; // "manter conectado"
const USUARIO_PADRAO = "admin";
const SENHA_TEMPORARIA = "admin123";

fs.mkdirSync(DATA_DIR, { recursive: true });

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8",
};
// Só estes caminhos são públicos (não expõe server.js, data/, etc.)
const PUBLIC = [/^\/$/, /^\/index\.html$/, /^\/politica-de-privacidade\.html$/, /^\/assets\//, /^\/robots\.txt$/];

/* Endereço do painel: ADMIN_PATH > data/admin.json > /admin */
const reCaminho = /^\/[a-z0-9][a-z0-9-]{3,39}$/;
const RESERVADOS = ["/api", "/assets", "/data", "/index", "/robots"];
function caminhoPainel() {
  const env = (process.env.ADMIN_PATH || "").toLowerCase();
  if (reCaminho.test(env)) return env;
  const reg = lerJSON(ADMIN, {});
  return reCaminho.test(reg.caminho || "") ? reg.caminho : "/admin";
}

/* ---------------- utilidades ---------------- */
const lerJSON = (f, padrao) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return padrao; } };
const gravarJSON = (f, v) => { const tmp = f + ".tmp"; fs.writeFileSync(tmp, JSON.stringify(v, null, 2)); fs.renameSync(tmp, f); };
const clean = (v, max = 500) => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);

function send(res, code, body, type = "application/json; charset=utf-8") {
  res.writeHead(code, {
    "Content-Type": type, "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin", "X-Frame-Options": "SAMEORIGIN", "Cache-Control": "no-store",
  });
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

function readBody(req, limit = 200_000) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on("data", (c) => { size += c.length; if (size > limit) { reject(new Error("too big")); req.destroy(); } else chunks.push(c); });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}
async function lerCorpo(req, res, limit) {
  try { return JSON.parse((await readBody(req, limit)) || "{}"); }
  catch { send(res, 400, { ok: false, erro: "JSON inválido." }); return null; }
}

const ipDe = (req) => req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress;
const janelas = new Map(); // limite de tentativas: chave -> timestamps
function limitado(chave, max, ms) {
  const now = Date.now();
  const list = (janelas.get(chave) || []).filter((t) => now - t < ms);
  list.push(now); janelas.set(chave, list);
  return list.length > max;
}

/* ---------------- senha e sessões ---------------- */
function hashSenha(senha, salt = crypto.randomBytes(16).toString("hex")) {
  return { salt, hash: crypto.scryptSync(String(senha), salt, 64).toString("hex") };
}
function conferirSenha(senha, reg) {
  if (!reg || !reg.salt || !reg.hash) return false;
  const h = crypto.scryptSync(String(senha), reg.salt, 64);
  const esperado = Buffer.from(reg.hash, "hex");
  return esperado.length === h.length && crypto.timingSafeEqual(esperado, h);
}
function prepararSenha() {
  if (process.env.ADMIN_PASSWORD) {
    gravarJSON(ADMIN, { usuario: process.env.ADMIN_USER || USUARIO_PADRAO, ...hashSenha(process.env.ADMIN_PASSWORD), temporaria: false, definidaEm: new Date().toISOString(), origem: "ADMIN_PASSWORD" });
    return `  Login do painel: ${process.env.ADMIN_USER || USUARIO_PADRAO} / senha definida em ADMIN_PASSWORD`;
  }
  const atual = lerJSON(ADMIN, null);
  if (atual && atual.usuario && atual.origem !== "gerada") {
    return atual.temporaria ? `  Login do painel: ${atual.usuario} / ${SENHA_TEMPORARIA}  (temporária: troque no painel em Segurança)` : `  Login do painel: ${atual.usuario} / a senha que você definiu`;
  }
  gravarJSON(ADMIN, { usuario: USUARIO_PADRAO, ...hashSenha(SENHA_TEMPORARIA), temporaria: true, definidaEm: new Date().toISOString(), origem: "padrao" });
  return `  Login do painel: ${USUARIO_PADRAO} / ${SENHA_TEMPORARIA}  (temporária: troque no painel em Segurança)`;
}
const sessoes = new Map(); // token -> expira
function criarSessao(longa) {
  const token = crypto.randomBytes(32).toString("hex");
  sessoes.set(token, Date.now() + (longa ? SESSAO_LONGA_MS : SESSAO_MS));
  return token;
}
function autenticado(req) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const exp = token && sessoes.get(token);
  if (!exp) return false;
  if (exp < Date.now()) { sessoes.delete(token); return false; }
  return true;
}

/* ---------------- configuração ---------------- */
const TEMAS_VALIDOS = ["oficial", "classico", "natal", "carnaval", "saojoao", "halloween"];
const reData = /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])$/;

/* Mantém só os campos conhecidos e com tipos certos */
function sanitizarConfig(c) {
  const t = c.tema || {}, ag = t.agendamento || {}, a = c.aviso || {}, e = c.empresa || {}, s = c.secoes || {};
  const tel = (o) => (o && typeof o === "object" ? { numero: clean(o.numero, 15).replace(/\D/g, ""), exibicao: clean(o.exibicao, 30) } : undefined);
  const out = {
    versao: 1,
    tema: {
      ativo: TEMAS_VALIDOS.includes(t.ativo) ? t.ativo : "oficial",
      efeitos: t.efeitos !== false,
      intensidade: ["baixa", "media", "alta"].includes(t.intensidade) ? t.intensidade : "media",
      permitirDesligar: t.permitirDesligar !== false,
      lanterna: t.lanterna === true,
      agendamento: {
        ativo: ag.ativo === true,
        regras: (Array.isArray(ag.regras) ? ag.regras : []).slice(0, 20)
          .filter((r) => r && TEMAS_VALIDOS.includes(r.tema) && reData.test(r.inicio) && reData.test(r.fim))
          .map((r) => ({ tema: r.tema, inicio: r.inicio, fim: r.fim, ativa: r.ativa !== false })),
      },
    },
    aviso: { ativo: a.ativo === true, usarMensagemDoTema: a.usarMensagemDoTema !== false, texto: clean(a.texto, 160), link: /^(https?:\/\/|#|\/)/.test(a.link || "") ? clean(a.link, 300) : "" },
    empresa: {
      telefone: clean(e.telefone, 30), telefoneLink: clean(e.telefoneLink, 20).replace(/\D/g, ""),
      whatsapp: tel(e.whatsapp), whatsappContato: tel(e.whatsappContato), whatsappParceiro: tel(e.whatsappParceiro),
      endereco: clean(e.endereco, 160),
      emails: e.emails ? { contato: clean(e.emails.contato, 120), sac: clean(e.emails.sac, 120), dpo: clean(e.emails.dpo, 120) } : undefined,
    },
    numeros: Array.isArray(c.numeros) ? c.numeros.slice(0, 6).map((n) => ({
      valor: Math.max(0, Math.min(1e9, Number(n.valor) || 0)), prefixo: clean(n.prefixo, 6), sufixo: clean(n.sufixo, 6), rotulo: clean(n.rotulo, 60),
    })) : null,
    secoes: Object.fromEntries(["assistente", "seguranca", "parceiros", "depoimentos", "time", "bancos", "fbinforma", "faq"].map((k) => [k, s[k] !== false])),
    atualizadoEm: new Date().toISOString(),
  };
  return out;
}

/* ---------------- rotas ---------------- */
async function handleContato(req, res) {
  if (limitado("form:" + ipDe(req), 5, 60_000)) return send(res, 429, { ok: false, erro: "Muitas tentativas. Aguarde um minuto." });
  const data = await lerCorpo(req, res, 20_000); if (!data) return;
  if (data.empresa_site) return send(res, 200, { ok: true }); // honeypot

  const msg = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    data: new Date().toISOString(),
    tipo: data.tipo === "cliente" ? "cliente" : "parceiro",
    nome: clean(data.nome, 120),
    telefone: clean(data.telefone, 20).replace(/[^\d()\s-]/g, ""),
    cidade: clean(data.cidade, 80),
    email: clean(data.email, 120),
    servico: clean(data.servico, 80),
    mensagem: clean(data.mensagem, 1000),
    lgpd: data.lgpd === "on" || data.lgpd === true,
    status: "novo",
  };
  const erros = [];
  if (msg.nome.length < 3) erros.push("nome");
  if (msg.telefone.replace(/\D/g, "").length < 10) erros.push("telefone");
  if (msg.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(msg.email)) erros.push("email");
  if (!msg.lgpd) erros.push("lgpd");
  if (erros.length) return send(res, 422, { ok: false, erro: "Campos inválidos.", campos: erros });

  const db = lerJSON(DB, []); db.push(msg); gravarJSON(DB, db);
  console.log(`📩 Novo contato (${msg.tipo}): ${msg.nome} — ${msg.telefone}`);
  send(res, 201, { ok: true, id: msg.id });
}

async function rotasPainel(req, res, pathname) {
  if (pathname === "/api/login" && req.method === "POST") {
    if (limitado("login:" + ipDe(req), 5, 5 * 60_000)) return send(res, 429, { ok: false, erro: "Muitas tentativas. Aguarde 5 minutos." });
    const b = await lerCorpo(req, res, 2_000); if (!b) return;
    await new Promise((r) => setTimeout(r, 400)); // dificulta força bruta
    const reg = lerJSON(ADMIN, null);
    const usuarioOk = reg && String(b.usuario || "").trim().toLowerCase() === String(reg.usuario || USUARIO_PADRAO).toLowerCase();
    const senhaOk = conferirSenha(b.senha || "", reg); // confere sempre, para não revelar qual campo errou
    if (!usuarioOk || !senhaOk) return send(res, 401, { ok: false, erro: "Usuário ou senha incorretos." });
    const longa = b.lembrar === true;
    return send(res, 200, { ok: true, token: criarSessao(longa), expiraEm: Date.now() + (longa ? SESSAO_LONGA_MS : SESSAO_MS), temporaria: !!reg.temporaria, usuario: reg.usuario });
  }

  if (!autenticado(req)) return send(res, 401, { ok: false, erro: "Sessão expirada. Entre novamente." });

  if (pathname === "/api/sessao" && req.method === "GET") { const reg = lerJSON(ADMIN, {}); return send(res, 200, { ok: true, temporaria: !!reg.temporaria, usuario: reg.usuario || USUARIO_PADRAO, caminho: caminhoPainel(), caminhoFixo: !!process.env.ADMIN_PATH }); }
  if (pathname === "/api/logout" && req.method === "POST") {
    sessoes.delete((req.headers.authorization || "").replace(/^Bearer\s+/i, ""));
    return send(res, 200, { ok: true });
  }
  if (pathname === "/api/config" && req.method === "PUT") {
    const b = await lerCorpo(req, res, 100_000); if (!b) return;
    const anterior = lerJSON(CONFIG, null);
    if (anterior) gravarJSON(path.join(DATA_DIR, "config.anterior.json"), anterior);
    const cfg = sanitizarConfig(b);
    gravarJSON(CONFIG, cfg);
    console.log(`🎨 Configuração salva (tema: ${cfg.tema.ativo})`);
    return send(res, 200, { ok: true, config: cfg });
  }
  if (pathname === "/api/contatos" && req.method === "GET") return send(res, 200, lerJSON(DB, []).reverse());
  const m = pathname.match(/^\/api\/contatos\/([\w-]+)$/);
  if (m && req.method === "PATCH") {
    const b = await lerCorpo(req, res, 2_000); if (!b) return;
    if (!["novo", "em-atendimento", "concluido"].includes(b.status)) return send(res, 422, { ok: false, erro: "Status inválido." });
    const db = lerJSON(DB, []); const item = db.find((x) => x.id === m[1]);
    if (!item) return send(res, 404, { ok: false, erro: "Mensagem não encontrada." });
    item.status = b.status; gravarJSON(DB, db);
    return send(res, 200, { ok: true });
  }
  if (pathname === "/api/caminho" && req.method === "POST") {
    const b = await lerCorpo(req, res, 2_000); if (!b) return;
    if (process.env.ADMIN_PATH) return send(res, 409, { ok: false, erro: "O endereço está fixado pela variável ADMIN_PATH no servidor." });
    const novo = "/" + String(b.caminho || "").trim().toLowerCase().replace(/^\/+/, "");
    if (!reCaminho.test(novo)) return send(res, 422, { ok: false, erro: "Use de 4 a 40 caracteres: letras minúsculas, números e hífen (ex.: gestao-fb-k7)." });
    if (RESERVADOS.includes(novo)) return send(res, 422, { ok: false, erro: "Esse endereço é reservado. Escolha outro." });
    const reg = lerJSON(ADMIN, {}); reg.caminho = novo; gravarJSON(ADMIN, reg);
    console.log(`🔐 Novo endereço do painel: ${novo}`);
    return send(res, 200, { ok: true, caminho: novo });
  }
  if (pathname === "/api/senha" && req.method === "POST") {
    const b = await lerCorpo(req, res, 2_000); if (!b) return;
    if (!conferirSenha(b.atual || "", lerJSON(ADMIN, null))) return send(res, 401, { ok: false, erro: "Senha atual incorreta." });
    if (String(b.nova || "").length < 8) return send(res, 422, { ok: false, erro: "A nova senha precisa ter pelo menos 8 caracteres." });
    if (b.nova === SENHA_TEMPORARIA) return send(res, 422, { ok: false, erro: "Escolha uma senha diferente da temporária." });
    const reg = lerJSON(ADMIN, {});
    gravarJSON(ADMIN, { usuario: reg.usuario || USUARIO_PADRAO, ...hashSenha(b.nova), temporaria: false, definidaEm: new Date().toISOString(), origem: "painel" });
    sessoes.clear();
    return send(res, 200, { ok: true, token: criarSessao() });
  }
  return send(res, 404, { ok: false, erro: "Rota não encontrada." });
}

function serveStatic(req, res, pathname) {
  if (!PUBLIC.some((r) => r.test(pathname))) return send(res, 404, "Não encontrado", "text/plain; charset=utf-8");
  let rel = pathname === "/" ? "index.html" : decodeURIComponent(pathname);
  const file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT)) return send(res, 403, "Proibido", "text/plain; charset=utf-8");
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, "Não encontrado", "text/plain; charset=utf-8");
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(buf);
  });
}

function servirPainel(res) {
  fs.readFile(path.join(ROOT, "admin.html"), (err, buf) => {
    if (err) return send(res, 500, "Painel não encontrado", "text/plain; charset=utf-8");
    res.writeHead(200, {
      "Content-Type": MIME[".html"], "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer",
    });
    res.end(buf);
  });
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  try {
    if (pathname === "/api/config" && req.method === "GET") return send(res, 200, lerJSON(CONFIG, {}));
    if (pathname === "/api/contato" && req.method === "POST") return await handleContato(req, res);
    if (pathname.startsWith("/api/")) return await rotasPainel(req, res, pathname);
    if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, "Método não permitido", "text/plain; charset=utf-8");
    if (pathname.toLowerCase() === caminhoPainel()) return servirPainel(res);
    serveStatic(req, res, pathname);
  } catch (e) {
    console.error(e);
    send(res, 500, { ok: false, erro: "Erro interno." });
  }
});

const avisoSenha = prepararSenha();
server.listen(PORT, () => console.log(`\n  FB Negócios rodando em http://localhost:${PORT}\n  Painel: http://localhost:${PORT}${caminhoPainel()}\n${avisoSenha}\n`));
