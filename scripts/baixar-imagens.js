/**
 * Baixa as fotos e logos dos bancos do site atual (fbnegociosbr.com.br)
 * para dentro do projeto, em assets/img/. Rode uma vez:
 *
 *    npm run imagens
 *
 * Depois disso o site não depende mais do servidor antigo.
 * (O site funciona mesmo sem rodar: ele usa as imagens do site atual como reserva.)
 */
const fs = require("fs");
const path = require("path");
const https = require("https");

const BASE = "https://www.fbnegociosbr.com.br/img/";
const ROOT = path.join(__dirname, "..", "assets", "img");

const arquivos = {
  time: ["herison.jpg", "caio.jpg", "lucas.jpg"],
  fotos: ["about.jpg", "sala.jpg", "call.jpg"],
  bancos: ["facta.JPG", "itau.JPG", "ole.JPG", "paulista.JPG", "queromais.JPG", "master.JPG", "daycoval.jpg", "bradesco.JPG",
    "pan.jpg", "crefaz.JPG", "safra.JPG", "banrisul.JPG", "bmg.JPG", "c6.JPG", "crefisa.JPG"],
};

function baixar(url, destino) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode}`)); }
      const out = fs.createWriteStream(destino);
      res.pipe(out);
      out.on("finish", () => out.close(resolve));
    }).on("error", reject);
  });
}

(async () => {
  let ok = 0, falhas = 0;
  for (const [pasta, lista] of Object.entries(arquivos)) {
    fs.mkdirSync(path.join(ROOT, pasta), { recursive: true });
    for (const nome of lista) {
      const destino = path.join(ROOT, pasta, nome);
      if (fs.existsSync(destino)) { console.log(`= já existe  ${pasta}/${nome}`); ok++; continue; }
      try { await baixar(BASE + nome, destino); console.log(`✓ baixado    ${pasta}/${nome}`); ok++; }
      catch (e) { console.log(`✗ falhou     ${pasta}/${nome} (${e.message})`); falhas++; }
    }
  }
  console.log(`\n${ok} imagens prontas, ${falhas} falhas.`);
  const jg = path.join(ROOT, "time", "jose-guilherme.png");
  if (!fs.existsSync(jg)) console.log("Lembrete: adicione a foto do José Guilherme em assets/img/time/jose-guilherme.png");
  console.log("Dica: fotos grandes (4000px) deixam o site lento. Veja a seção \"Otimizar imagens\" no README.");
})();
