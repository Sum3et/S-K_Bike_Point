import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.join(__dirname, 'svg', '06_gantt.svg');
const pngPath = path.join(__dirname, 'png', '06_gantt.png');

// 8 Timeline Columns: Week 1 to Week 8
const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'];

const stages = [
  {
    name: 'Strategy & Architecture',
    tasks: [
      { name: '1. Requirements & Workflows', start: 0.1, len: 1.8 },
      { name: '2. Database Schema & API Specs', start: 0.8, len: 1.8 },
    ],
  },
  {
    name: 'Core Backend & Security',
    tasks: [
      { name: '3. Spring Boot REST & JPA Repos', start: 1.8, len: 1.9 },
      { name: '4. JWT Auth & Role Permissions', start: 2.6, len: 1.8 },
    ],
  },
  {
    name: 'Workshop Floor & UI',
    tasks: [
      { name: '5. Public Estimator & Tracker UI', start: 3.4, len: 1.9 },
      { name: '6. Service Job Cards & Mechanics', start: 4.1, len: 1.9 },
      { name: '7. Spares Inventory & Alerts', start: 4.8, len: 1.8 },
    ],
  },
  {
    name: 'Billing & Launch',
    tasks: [
      { name: '8. GST 18% Invoices & WhatsApp', start: 5.5, len: 1.8 },
      { name: '9. QA Testing & Deployment', start: 6.2, len: 1.6 },
    ],
  },
];

const width = 1400;
const rowHeight = 48;
const totalTasks = stages.reduce((acc, s) => acc + s.tasks.length, 0);
const topMargin = 85;
const leftStageWidth = 240;
const gridLeft = 265;
const gridWidth = width - gridLeft - 35;
const colWidth = gridWidth / weeks.length;
const height = topMargin + totalTasks * rowHeight + 35;

let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <style>
      text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
      .header-title { font-size: 13px; font-weight: 900; fill: #0f172a; text-anchor: middle; text-transform: uppercase; letter-spacing: 0.5px; }
      .week-text { font-size: 13px; font-weight: 800; fill: #1e293b; text-anchor: middle; }
      .stage-title { font-size: 13px; font-weight: 800; fill: #0f172a; text-anchor: middle; }
      .bar-text { font-size: 11px; font-weight: 700; fill: #ffffff; letter-spacing: 0.2px; }
    </style>
    <filter id="cardShadow" x="-1%" y="-1%" width="102%" height="104%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.05" />
    </filter>
  </defs>

  <!-- Clean Pure White Background -->
  <rect width="${width}" height="${height}" fill="#ffffff" />

  <!-- Outer Card Frame -->
  <rect x="15" y="15" width="${width - 30}" height="${height - 30}" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" filter="url(#cardShadow)" />

  <!-- Top Header: Stage Box -->
  <rect x="30" y="28" width="${leftStageWidth - 10}" height="42" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
  <text x="${30 + (leftStageWidth - 10)/2}" y="54" class="header-title">Stage</text>

  <!-- Top Header: Week Column Pills -->
`;

weeks.forEach((w, i) => {
  const x = gridLeft + i * colWidth + 4;
  const pillW = colWidth - 8;
  svg += `  <rect x="${x}" y="28" width="${pillW}" height="42" rx="10" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />\n`;
  svg += `  <text x="${x + pillW / 2}" y="54" class="week-text">${w}</text>\n`;
});

// Render Rows and Stages
let currentTaskIndex = 0;

stages.forEach((stage) => {
  const stageStartIndex = currentTaskIndex;
  const stageTaskCount = stage.tasks.length;
  const stageTop = topMargin + stageStartIndex * rowHeight;
  const stageHeight = stageTaskCount * rowHeight - 6;

  // Stage Group Card on the Left
  svg += `\n  <!-- Stage Group: ${stage.name} -->\n`;
  svg += `  <rect x="30" y="${stageTop}" width="${leftStageWidth - 10}" height="${stageHeight}" rx="12" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" />\n`;
  
  const nameParts = stage.name.split('&');
  if (nameParts.length > 1) {
    svg += `  <text x="${30 + (leftStageWidth - 10)/2}" y="${stageTop + stageHeight/2 - 6}" class="stage-title">${nameParts[0].trim()} &amp;</text>\n`;
    svg += `  <text x="${30 + (leftStageWidth - 10)/2}" y="${stageTop + stageHeight/2 + 14}" class="stage-title">${nameParts[1].trim()}</text>\n`;
  } else {
    svg += `  <text x="${30 + (leftStageWidth - 10)/2}" y="${stageTop + stageHeight/2 + 5}" class="stage-title">${stage.name}</text>\n`;
  }

  // Render each task row in this stage
  stage.tasks.forEach((task) => {
    const y = topMargin + currentTaskIndex * rowHeight;
    const laneHeight = rowHeight - 8;

    // Background track lane
    svg += `  <rect x="${gridLeft}" y="${y}" width="${gridWidth}" height="${laneHeight}" rx="${laneHeight/2}" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1" />\n`;

    // Timeline Progress Bar (Navy Pill)
    const barX = gridLeft + task.start * colWidth;
    const barW = Math.min(task.len * colWidth, gridLeft + gridWidth - barX - 6);
    const barR = laneHeight / 2;

    svg += `  <g>\n`;
    svg += `    <rect x="${barX}" y="${y}" width="${barW}" height="${laneHeight}" rx="${barR}" fill="#0f2744" stroke="#09182a" stroke-width="1.2" />\n`;
    
    // Inner light accent line
    const innerW = Math.max(barW * 0.35, 30);
    const innerX = barX + (barW - innerW) / 2;
    svg += `    <rect x="${innerX}" y="${y + laneHeight/2 - 1.5}" width="${innerW}" height="3" rx="1.5" fill="#38bdf8" opacity="0.8" />\n`;

    // Task label inside the bar
    svg += `    <text x="${barX + 14}" y="${y + laneHeight/2 + 4}" class="bar-text">${task.name}</text>\n`;
    svg += `  </g>\n`;

    currentTaskIndex++;
  });
});

svg += `</svg>`;

fs.writeFileSync(svgPath, svg);
console.log(`✅ [Gantt SVG Created with Weeks] ${svgPath}`);

// Headless screenshot to PNG
const edgeCandidates = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];

const browserExe = edgeCandidates.find((exe) => fs.existsSync(exe));

if (browserExe) {
  const tempHtml = path.join(__dirname, 'temp_gantt.html');
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 0; background: #ffffff; display: flex; align-items: center; justify-content: center; }
  </style>
</head>
<body>
  ${svg}
</body>
</html>`;
  fs.writeFileSync(tempHtml, htmlContent);

  const cmd = `"${browserExe}" --headless --disable-gpu --window-size=1450,${height + 80} --screenshot="${pngPath}" "file:///${tempHtml.replace(/\\/g, '/')}"`;
  try {
    execSync(cmd, { stdio: 'ignore' });
    if (fs.existsSync(tempHtml)) fs.unlinkSync(tempHtml);
    console.log(`✅ [Gantt PNG Rendered with Weeks] ${pngPath}`);
  } catch (e) {
    console.error('Failed to screenshot gantt:', e.message);
  }
}
