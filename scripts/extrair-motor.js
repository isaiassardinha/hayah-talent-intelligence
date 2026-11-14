// Copia o motor de cálculo (primeiro <script> de prototipo/index.html) para prototipo/motor.js.
const fs = require("fs");
const path = require("path");

const raiz = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(raiz, "prototipo", "index.html"), "utf8");
const ini = html.indexOf("<script>");
const fim = html.indexOf("</script>", ini);
if (ini < 0 || fim < 0) {
  console.error("Não encontrei o primeiro <script> em prototipo/index.html.");
  process.exit(1);
}
const cabecalho = "/* Motor de cálculo extraído de prototipo/index.html (primeiro <script>). Gerado por npm run extrair: não edite este arquivo à mão. */\n";
fs.writeFileSync(path.join(raiz, "prototipo", "motor.js"), cabecalho + html.slice(ini + "<script>".length, fim));
console.log("prototipo/motor.js atualizado.");
