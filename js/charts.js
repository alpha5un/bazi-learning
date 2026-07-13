/* SVG 图表工具：五行雷达、强弱仪表盘、关系连线图、大运时间轴 */

import { ELEMENTS, ELEMENT_COLOR } from './engine.js';

export function elementRadar(counts) {
  const size = 200;
  const center = size / 2;
  const radius = 80;
  const max = Math.max(1, ...ELEMENTS.map(e => counts[e] || 0));
  const angleFor = i => (Math.PI * 2 * i / 5) - Math.PI / 2;
  const points = ELEMENTS.map((e, i) => {
    const r = ((counts[e] || 0) / max) * radius;
    const a = angleFor(i);
    return [center + r * Math.cos(a), center + r * Math.sin(a)];
  });
  const labels = ELEMENTS.map((e, i) => {
    const a = angleFor(i);
    const x = center + (radius + 18) * Math.cos(a);
    const y = center + (radius + 18) * Math.sin(a);
    return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="13" fill="#333">${e} ${counts[e] || 0}</text>`;
  }).join('');
  const grid = [0.2, 0.4, 0.6, 0.8, 1].map(scale => {
    const pts = ELEMENTS.map((_, i) => {
      const a = angleFor(i);
      return `${center + radius * scale * Math.cos(a)},${center + radius * scale * Math.sin(a)}`;
    }).join(' ');
    return `<polygon points="${pts}" fill="none" stroke="#ddd" stroke-width="1"/>`;
  }).join('');
  const polyPoints = points.map(p => p.join(',')).join(' ');
  return `
    <svg viewBox="0 0 ${size} ${size}" class="chart-radar">
      ${grid}
      ${ELEMENTS.map((_, i) => {
        const a = angleFor(i);
        const x2 = center + radius * Math.cos(a);
        const y2 = center + radius * Math.sin(a);
        return `<line x1="${center}" y1="${center}" x2="${x2}" y2="${y2}" stroke="#ddd" stroke-width="1"/>`;
      }).join('')}
      <polygon points="${polyPoints}" fill="rgba(192,57,43,0.15)" stroke="#b22222" stroke-width="2"/>
      ${points.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${ELEMENT_COLOR[ELEMENTS[i]]}" stroke="#fff" stroke-width="1"/>`).join('')}
      ${labels}
    </svg>
  `;
}

export function elementBars(counts) {
  const max = Math.max(1, ...ELEMENTS.map(e => counts[e] || 0));
  return `
    <div class="bar-chart">
      ${ELEMENTS.map(e => {
        const v = counts[e] || 0;
        const pct = (v / max) * 100;
        return `<div class="bar-item">
          <div class="bar-label">${e}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${ELEMENT_COLOR[e]}"></div></div>
          <div class="bar-value">${v}</div>
        </div>`;
      }).join('')}
    </div>
  `;
}

export function strengthGauge(score) {
  const width = 280, height = 30;
  const markers = [15, 25, 45];
  return `
    <svg viewBox="0 0 ${width} ${height + 20}" class="chart-gauge">
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#2e6da4"/>
          <stop offset="50%" stop-color="#b08d57"/>
          <stop offset="100%" stop-color="#c0392b"/>
        </linearGradient>
      </defs>
      <rect x="0" y="10" width="${width}" height="${height}" rx="6" fill="url(#gaugeGrad)" opacity="0.25"/>
      <rect x="0" y="10" width="${Math.min(score, 60) / 60 * width}" height="${height}" rx="6" fill="url(#gaugeGrad)"/>
      ${markers.map(m => `<line x1="${m / 60 * width}" y1="5" x2="${m / 60 * width}" y2="${height + 15}" stroke="#555" stroke-dasharray="2,2"/>`).join('')}
      <text x="${15 / 60 * width}" y="${height + 30}" text-anchor="middle" font-size="10" fill="#666">身弱</text>
      <text x="${25 / 60 * width}" y="${height + 30}" text-anchor="middle" font-size="10" fill="#666">中和</text>
      <text x="${45 / 60 * width}" y="${height + 30}" text-anchor="middle" font-size="10" fill="#666">身强</text>
      <g transform="translate(${Math.min(score, 60) / 60 * width}, 10)">
        <polygon points="0,0 -6,-8 6,-8" fill="#333"/>
        <text x="0" y="-12" text-anchor="middle" font-size="12" fill="#333" font-weight="bold">${score}</text>
      </g>
    </svg>
  `;
}

export function relationshipGraph(heavenly, earthly, pillars) {
  // 天干节点在上，地支节点在下，用二次贝塞尔曲线连接，同组关系垂直错开，避免重叠。
  const w = 360, h = 300;
  const top = 80, bottom = 200;
  const left = 50, right = 290;
  const stems = [pillars.year.heavenly, pillars.month.heavenly, pillars.day.heavenly, pillars.hour.heavenly];
  const branches = [pillars.year.earthly, pillars.month.earthly, pillars.day.earthly, pillars.hour.earthly];
  const positions = [left, left + 80, left + 160, left + 240];
  const idxNames = ['year', 'month', 'day', 'hour'];

  const colorMap = { 合: '#4a7c59', 冲: '#c0392b', 害: '#888', 刑: '#e67e22', 三合: '#4a7c59', 三会: '#4a7c59', '三合(缺)': '#7fb28a', '三会(缺)': '#7fb28a', 三刑: '#e67e22' };
  const dashMap = { 合: '0', 冲: '4,4', 害: '2,2', 刑: '4,2', 三合: '0', 三会: '0', '三合(缺)': '2,2', '三会(缺)': '2,2', 三刑: '4,4' };
  const typeLabels = { 合: '合', 冲: '冲', 害: '害', 刑: '刑', 三合: '三合', 三会: '三会', '三合(缺)': '三合缺', '三会(缺)': '三会缺', 三刑: '三刑' };

  function groupRelations(list, isBranch) {
    const groups = {};
    list.forEach(r => {
      let i = -1, j = -1, k = '';
      if (r.branches && r.branches.length > 2) {
        const presentIndices = r.branches.map(b => branches.indexOf(b)).filter(idx => idx >= 0);
        i = Math.min(...presentIndices);
        j = Math.max(...presentIndices);
        k = r.branches.slice().sort().join('');
      } else {
        const i1 = r.fromIdx ? idxNames.indexOf(r.fromIdx) : (isBranch ? branches.indexOf(r.from) : stems.indexOf(r.from));
        const j1 = r.toIdx ? idxNames.indexOf(r.toIdx) : (isBranch ? branches.indexOf(r.to) : stems.indexOf(r.to));
        i = Math.min(i1, j1);
        j = Math.max(i1, j1);
        k = `${i}-${j}`;
      }
      if (i < 0 || j < 0 || i === j) return;
      if (!groups[k]) groups[k] = [];
      groups[k].push({ r, i, j });
    });
    return groups;
  }

  function labelBg(x, y, text) {
    const width = Math.max(32, text.length * 10 + 6);
    return `<rect x="${x - width / 2}" y="${y - 8}" width="${width}" height="16" rx="4" fill="rgba(255,255,255,0.9)" stroke="none"/>`;
  }

  let paths = '';

  const hGroups = groupRelations(heavenly, false);
  Object.values(hGroups).forEach(group => {
    const i = group[0].i, j = group[0].j;
    const x1 = positions[i], x2 = positions[j];
    const mx = (x1 + x2) / 2;
    group.forEach((item, idx) => {
      const r = item.r;
      const offset = (idx - (group.length - 1) / 2) * 20;
      const cy = top - 28 - idx * 14;
      const path = `M ${x1} ${top} Q ${mx + offset} ${cy} ${x2} ${top}`;
      const labelY = cy - 10;
      const color = colorMap[r.type] || '#888';
      const dash = dashMap[r.type] || '0';
      const label = `${typeLabels[r.type] || r.type}${r.element ? '→' + r.element : ''}`;
      paths += `<path d="${path}" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="${dash}"/>`;
      paths += labelBg(mx + offset, labelY, label);
      paths += `<text x="${mx + offset}" y="${labelY}" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="${color}">${label}</text>`;
    });
  });

  const eGroups = groupRelations(earthly, true);
  Object.values(eGroups).forEach(group => {
    const i = group[0].i, j = group[0].j;
    const x1 = positions[i], x2 = positions[j];
    const mx = (x1 + x2) / 2;
    group.forEach((item, idx) => {
      const r = item.r;
      const offset = (idx - (group.length - 1) / 2) * 20;
      const cy = bottom + 28 + idx * 14;
      const path = `M ${x1} ${bottom} Q ${mx + offset} ${cy} ${x2} ${bottom}`;
      const labelY = cy + 12;
      const color = colorMap[r.type] || '#888';
      const dash = dashMap[r.type] || '0';
      const label = `${typeLabels[r.type] || r.type}${r.element ? '→' + r.element : ''}`;
      paths += `<path d="${path}" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="${dash}"/>`;
      paths += labelBg(mx + offset, labelY, label);
      paths += `<text x="${mx + offset}" y="${labelY}" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="${color}">${label}</text>`;
    });
  });

  const stemNodes = stems.map((s, i) => `
    <g transform="translate(${positions[i]}, ${top})">
      <circle r="16" fill="#fff" stroke="#333" stroke-width="1.5"/>
      <text text-anchor="middle" dominant-baseline="middle" font-size="16" fill="#333">${s}</text>
      <text y="28" text-anchor="middle" font-size="10" fill="#888">${['年','月','日','时'][i]}干</text>
    </g>
  `).join('');
  const branchNodes = branches.map((b, i) => `
    <g transform="translate(${positions[i]}, ${bottom})">
      <circle r="16" fill="#fff" stroke="#333" stroke-width="1.5"/>
      <text text-anchor="middle" dominant-baseline="middle" font-size="16" fill="#333">${b}</text>
      <text y="28" text-anchor="middle" font-size="10" fill="#888">${['年','月','日','时'][i]}支</text>
    </g>
  `).join('');

  return `
    <svg viewBox="0 0 ${w} ${h}" class="chart-relationship">
      ${paths}
      ${stemNodes}
      ${branchNodes}
    </svg>
  `;
}

export function luckTimeline(luck) {
  const items = luck.sequence;
  const current = luck.currentPillar;
  return `
    <div class="luck-timeline">
      ${items.map(p => {
        const isCurrent = p.ageRange === current.ageRange;
        return `<div class="luck-step ${isCurrent ? 'current' : ''}">
          <div class="luck-age">${p.ageRange}岁</div>
          <div class="luck-pillar">${p.heavenly}${p.earthly}</div>
        </div>`;
      }).join('')}
    </div>
  `;
}

export function hiddenStemChart(hiddenStems, dayStem) {
  return `
    <div class="hidden-grid">
      ${hiddenStems.map(p => `
        <div class="hidden-card">
          <div class="hidden-title">${p.label} · ${p.branch}</div>
          ${p.hidden.map(h => `
            <div class="hidden-row">
              <span class="hidden-stem">${h.stem}</span>
              <span class="hidden-role">${h.role} ${Math.round(h.weight * 100)}%</span>
              <span class="hidden-tengod">${h.tenGod}</span>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;
}
