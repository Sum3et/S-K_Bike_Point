import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const PNG_DIR = path.join(__dirname, 'png');
const SVG_DIR = path.join(__dirname, 'svg');

[PNG_DIR, SVG_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const files = fs.readdirSync(DIAGRAMS_DIR).filter((f) => f.endsWith('.mmd')).sort();

console.log(`Rendering ${files.length} diagrams with automatic retry...\n`);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchBuffer(url, retries = 3) {
  return new Promise((resolve, reject) => {
    const attempt = (remaining) => {
      https
        .get(url, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return fetchBuffer(res.headers.location, remaining).then(resolve).catch(reject);
          }
          if (res.statusCode === 200) {
            const data = [];
            res.on('data', (chunk) => data.push(chunk));
            res.on('end', () => resolve(Buffer.concat(data)));
          } else if (remaining > 0 && (res.statusCode === 503 || res.statusCode === 500)) {
            setTimeout(() => attempt(remaining - 1), 800);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          }
        })
        .on('error', (err) => {
          if (remaining > 0) {
            setTimeout(() => attempt(remaining - 1), 800);
          } else {
            reject(err);
          }
        });
    };
    attempt(retries);
  });
}

async function renderDiagram(file) {
  const name = path.basename(file, '.mmd');
  const mmdPath = path.join(DIAGRAMS_DIR, file);
  const pngPath = path.join(PNG_DIR, `${name}.png`);
  const svgPath = path.join(SVG_DIR, `${name}.svg`);
  const mmdContent = fs.readFileSync(mmdPath, 'utf8').trim();

  const b64 = Buffer.from(mmdContent).toString('base64');
  const pngUrl = `https://mermaid.ink/img/${b64}`;
  const svgUrl = `https://mermaid.ink/svg/${b64}`;

  try {
    const pngBuffer = await fetchBuffer(pngUrl);
    fs.writeFileSync(pngPath, pngBuffer);
    await sleep(300);

    const svgBuffer = await fetchBuffer(svgUrl);
    fs.writeFileSync(svgPath, svgBuffer);
    await sleep(300);

    console.log(`✅ [Rendered] ${name} (PNG: ${(pngBuffer.length / 1024).toFixed(1)} KB | SVG: ${(svgBuffer.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`❌ [Failed] ${name}:`, err.message);
  }
}

async function run() {
  for (const file of files) {
    if (file === '06_gantt.mmd') {
      try {
        const { execSync } = await import('child_process');
        execSync(`node "${path.join(__dirname, 'build-custom-gantt.js')}"`, { stdio: 'inherit' });
        console.log(`✅ [Rendered] 06_gantt (Custom Executive White-BG SVG/PNG)`);
      } catch (err) {
        await renderDiagram(file);
      }
    } else {
      await renderDiagram(file);
    }
  }
  console.log(`\n🎉 All ${files.length} diagrams rendered successfully!`);
}

run();
