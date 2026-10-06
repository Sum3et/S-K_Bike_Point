import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { marked } from './frontend/node_modules/marked/lib/marked.esm.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mdPath = path.join(__dirname, 'PROJECT_DOCUMENTATION.md');
const htmlPath = path.join(__dirname, 'documentation.html');
const pdfPath = path.join(__dirname, 'SK_Bike_Point_Complete_Documentation.pdf');

const mdContent = fs.readFileSync(mdPath, 'utf8');

// Custom marked renderer for mermaid code blocks
const renderer = new marked.Renderer();
const originalCode = renderer.code.bind(renderer);

renderer.code = function({ text, lang }) {
  if (lang === 'mermaid') {
    return `<div class="mermaid-container"><pre class="mermaid">${text}</pre></div>`;
  }
  return `<pre><code class="language-${lang || 'text'}">${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
};

marked.use({ renderer });

const rawHtml = marked.parse(mdContent);

const completeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>S K Bike Point - Comprehensive System Documentation</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      themeVariables: {
        primaryColor: '#ffedd5',
        primaryTextColor: '#9a3412',
        primaryBorderColor: '#ea580c',
        lineColor: '#ea580c',
        secondaryColor: '#f1f5f9',
        tertiaryColor: '#fff'
      }
    });
  </script>
  <style>
    @page {
      size: A4;
      margin: 18mm 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      max-width: 950px;
      margin: 0 auto;
      padding: 30px;
      font-size: 13px;
      background: #ffffff;
    }
    h1 {
      color: #ea580c;
      font-size: 24px;
      font-weight: 800;
      border-bottom: 3px solid #ea580c;
      padding-bottom: 10px;
      margin-top: 10px;
      margin-bottom: 15px;
    }
    h2 {
      color: #0f172a;
      font-size: 17px;
      font-weight: 700;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 6px;
      margin-top: 30px;
      margin-bottom: 12px;
      page-break-after: avoid;
    }
    h3 {
      color: #334155;
      font-size: 14.5px;
      font-weight: 700;
      margin-top: 20px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }
    h4 {
      color: #475569;
      font-size: 13px;
      font-weight: 600;
      margin-top: 14px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }
    p {
      margin-top: 6px;
      margin-bottom: 10px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
      font-size: 11.5px;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      font-weight: bold;
      color: #0f172a;
    }
    tr:nth-child(even) {
      background: #f8fafc;
    }
    pre {
      background: #0f172a;
      color: #f8fafc;
      padding: 12px 14px;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 11px;
      line-height: 1.45;
      page-break-inside: avoid;
      margin: 12px 0;
    }
    code {
      font-family: Consolas, 'Courier New', monospace;
      background: #f1f5f9;
      padding: 1.5px 4px;
      border-radius: 3px;
      color: #ea580c;
      font-size: 11.5px;
    }
    pre code {
      background: none;
      color: inherit;
      padding: 0;
      font-size: 11px;
    }
    hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 24px 0;
    }
    ul, ol {
      padding-left: 22px;
      margin: 8px 0;
    }
    li {
      margin-bottom: 4px;
    }
    .mermaid-container {
      background: #fafaf9;
      border: 1px solid #e7e5e4;
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
      display: flex;
      justify-content: center;
      page-break-inside: avoid;
    }
    .mermaid {
      background: transparent !important;
      color: #1c1917 !important;
    }
  </style>
</head>
<body>
${rawHtml}
</body>
</html>`;

fs.writeFileSync(htmlPath, completeHtml);
console.log('✅ Generated HTML at:', htmlPath);

const edgeCandidates = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];

const browserExe = edgeCandidates.find((exe) => fs.existsSync(exe));

if (browserExe) {
  const htmlUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
  // Add 3 second virtual delay so mermaid diagrams finish rendering before PDF snapshot
  const cmd = `"${browserExe}" --headless --disable-gpu --run-all-compositor-stages-before-draw --virtual-time-budget=3000 --print-to-pdf-no-header --print-to-pdf="${pdfPath}" "${htmlUrl}"`;
  execSync(cmd, { stdio: 'inherit' });
  
  const stats = fs.statSync(pdfPath);
  console.log(`\n🎉 PDF Successfully Generated!`);
  console.log(`📄 File: ${pdfPath} (${(stats.size / 1024).toFixed(1)} KB)`);
}
