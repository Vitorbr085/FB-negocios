/**
 * FB Negócios — servidor simples (Node.js puro, sem dependências)
 *
 *  - Serve o site estático
 *  - POST /api/contato  → valida e salva o formulário em data/mensagens.json
 *  - GET  /api/contatos → lista as mensagens (protegido por ADMIN_TOKEN)
 *
 * Uso:  npm start   (ou: node server.js)
 * Variáveis opcionais: PORT=3000  ADMIN_TOKEN=uma-senha-forte
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const DB = path.join(DATA_DIR, "mensagens.json");

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8",
};
// Só estes caminhos são públicos (não expõe server.js, data/, etc.)
const PUBLIC = [/^\/$/, /^\/index\.html$/, /^\/politica-de-privacidade\.html$/, /^\/assets\//, /^\/robots\.txt$/];

const hits = new Map(); // limite simples: 5 envios por minuto por IP
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  list.push(now); hits.set(ip, list);
  return list.length > 5;
}

function send(res, code, body, type = "application/json; charset=utf-8") {
  res.writeHead(code, {
    "Content-Type": type,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "SAMEORIGIN",
  });
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

function readBody(req, limit = 20_000) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on("data", (c) => { size += c.length; if (size > limit) { reject(new Error("too big")); req.destroy(); } else chunks.push(c); });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const clean = (v, max = 500) => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);

function loadDb() {
  try { return JSON.parse(fs.readFileSync(DB, "utf8")); } catch { return []; }
}

async function handleContato(req, res) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress;
  if (rateLimited(ip)) return send(res, 429, { ok: false, erro: "Muitas tentativas. Aguarde um minuto." });
  let data;
  try { data = JSON.parse(await readBody(req)); } catch { return send(res, 400, { ok: false, erro: "JSON inválido." }); }
  if (data.empresa_site) return send(res, 200, { ok: true }); // honeypot: finge sucesso para robôs

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
  };
  const erros = [];
  if (msg.nome.length < 3) erros.push("nome");
  if (msg.telefone.replace(/\D/g, "").length < 10) erros.push("telefone");
  if (msg.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(msg.email)) erros.push("email");
  if (!msg.lgpd) erros.push("lgpd");
  if (erros.length) return send(res, 422, { ok: false, erro: "Campos inválidos.", campos: erros });

  fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = loadDb(); db.push(msg);
  fs.writeFileSync(DB, JSON.stringify(db, null, 2));
  console.log(`📩 Novo contato (${msg.tipo}): ${msg.nome} — ${msg.telefone}`);
  send(res, 201, { ok: true, id: msg.id });
}

function serveStatic(req, res, pathname) {
  if (!PUBLIC.some((r) => r.test(pathname))) return send(res, 404, "Não encontrado", "text/plain; charset=utf-8");
  const file = path.normalize(path.join(ROOT, pathname === "/" ? "index.html" : decodeURIComponent(pathname)));
  if (!file.startsWith(ROOT)) return send(res, 403, "Proibido", "text/plain; charset=utf-8");
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, "Não encontrado", "text/plain; charset=utf-8");
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(buf);
  });
}

const server = http.createServer(async (req, res) => {
  const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  try {
    if (pathname === "/api/contato" && req.method === "POST") return await handleContato(req, res);
    if (pathname === "/api/contatos" && req.method === "GET") {
      const token = req.headers.authorization?.replace("Bearer ", "") || searchParams.get("token");
      if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) return send(res, 401, { ok: false, erro: "Não autorizado." });
      return send(res, 200, loadDb());
    }
    if (pathname.startsWith("/api/")) return send(res, 404, { ok: false, erro: "Rota não encontrada." });
    if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, "Método não permitido", "text/plain; charset=utf-8");
    serveStatic(req, res, pathname);
  } catch (e) {
    console.error(e);
    send(res, 500, { ok: false, erro: "Erro interno." });
  }
});

server.listen(PORT, () => console.log(`\n  FB Negócios rodando em http://localhost:${PORT}\n`));
