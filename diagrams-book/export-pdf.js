import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.join(__dirname, 'print-book.html');
const pdfPath = path.join(__dirname, 'SK_Bike_Point_Architecture_Diagrams.pdf');

const edgeCandidates = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];

const browserExe = edgeCandidates.find((exe) => fs.existsSync(exe));

if (!browserExe) {
  console.error('❌ No Edge or Chrome browser executable found on system.');
  process.exit(1);
}

console.log(`Generating High-Resolution Print PDF using ${path.basename(browserExe)}...`);

const htmlUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
const cmd = `"${browserExe}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf-no-header --print-to-pdf="${pdfPath}" "${htmlUrl}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  const stats = fs.statSync(pdfPath);
  console.log(`\n🎉 PDF Successfully Generated!`);
  console.log(`📄 File: ${pdfPath} (${(stats.size / 1024).toFixed(1)} KB)`);
} catch (err) {
  console.error('❌ Failed to generate PDF:', err.message);
}
