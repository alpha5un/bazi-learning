/* UI 渲染：将计算结果渲染到页面 */

import {
  ELEMENTS, STEM_ELEMENT, BRANCH_ELEMENT, isYang, getTenGod, getHiddenStems,
  getPolarity, GENERATES, OVERCOMES, hourStemFor, STEMS, BRANCHES, JIE_NAMES,
  EARTHLY_TRIPLE, EARTHLY_TRIPLE_MEET
} from './engine.js';
import {
  elementBars, strengthGauge, relationshipGraph, luckTimeline, hiddenStemChart
} from './charts.js';
import { lookupKnowledge } from './knowledge.js';

const knowledgeTitle = document.getElementById('knowledge-title');
const knowledgeContent = document.getElementById('knowledge-content');

function t(name) {
  return `<span class="term" data-term="${name}">${name}</span>`;
}

function fmtPercent(v) { return (v * 100).toFixed(1) + '%'; }

function elementTag(el) {
  return `<span class="element-tag" style="background:${elementColor(el)}">${el}</span>`;
}

function elementColor(el) {
  const map = { 木: 'rgba(74,124,89,0.15)', 火: 'rgba(192,57,43,0.15)', 土: 'rgba(176,141,87,0.15)', 金: 'rgba(212,175,55,0.15)', 水: 'rgba(46,109,164,0.15)' };
  return map[el] || '#eee';
}

function tenGodTag(name) {
  return `<span class="tengod-tag">${name}</span>`;
}

export function renderPillars(chart) {
  const p = chart.pillars;
  const list = ['year', 'month', 'day', 'hour'];
  const labels = ['年柱', '月柱', '日柱', '时柱'];
  return list.map((k, i) => {
    const hidden = getHiddenStems(p[k].earthly).map(h => `<span class="hidden-mini">${h.stem}</span>`).join('');
    const isDay = k === 'day';
    return `
      <div class="pillar-card ${isDay ? 'day' : ''}">
        <div class="pillar-label">${labels[i]}</div>
        <div class="pillar-heavenly">${p[k].heavenly}</div>
        <div class="pillar-earthly">${p[k].earthly}</div>
        <div class="pillar-hidden">${hidden}</div>
        <div class="pillar-element">${elementTag(STEM_ELEMENT[p[k].heavenly])}${elementTag(BRANCH_ELEMENT[p[k].earthly])}</div>
      </div>
    `;
  }).join('');
}

export function renderLayers(chart) {
  return [
    renderL1(chart),
    renderL2(chart),
    renderL3(chart),
    renderL3b(chart),
    renderL4(chart),
    renderL5(chart),
    renderL6(chart),
    renderL7(chart)
  ].join('');
}

function pillarLabel(idx) {
  const map = { year: '年', month: '月', day: '日', hour: '时' };
  return map[idx] || idx;
}

function explainTenGod(dayStem, targetStem) {
  const e1 = STEM_ELEMENT[dayStem], e2 = STEM_ELEMENT[targetStem];
  const same = e1 === e2;
  const targetGeneratesDay = e2 === GENERATES[e1];
  const dayGeneratesTarget = e1 === GENERATES[e2];
  const targetOvercomesDay = e2 === OVERCOMES[e1];
  const dayOvercomesTarget = e1 === OVERCOMES[e2];
  let relation = '';
  if (same) relation = '同五行';
  else if (targetGeneratesDay) relation = '生我';
  else if (dayGeneratesTarget) relation = '我生';
  else if (targetOvercomesDay) relation = '克我';
  else if (dayOvercomesTarget) relation = '我克';
  const samePolarity = isYang(dayStem) === isYang(targetStem) ? '同性' : '异性';
  return `${relation}（${samePolarity}）`;
}

function renderL1(chart) {
  const p = chart.pillars;
  const inp = chart.input;
  const corr = chart.correction;
  const corrSign = corr >= 0 ? '+' : '';
  const direction = corr >= 0 ? '提前' : '延后';
  const l = p.lunar;
  const jieTable = l.getJieQiTable ? l.getJieQiTable() : {};
  const liChun = jieTable['立春'];
  const liChunStr = liChun ? liChun.toString() : '';
  const isBeforeLiChun = liChun && p.solar.getJulianDay() < liChun.getJulianDay();
  const yearNote = liChun
    ? (isBeforeLiChun ? `出生日在当年${t('立春')}（${liChunStr}）之前，年柱仍按上一年计算` : `出生日在当年${t('立春')}（${liChunStr}）之后，年柱按本年计算`)
    : `以${t('立春')}换年`;
  const prevJie = l.getPrevJieQi ? l.getPrevJieQi() : null;
  const nextJie = l.getNextJieQi ? l.getNextJieQi() : null;
  const monthJie = prevJie ? `${prevJie.getName()} ${prevJie.getSolar().toString()}` : (nextJie ? `${nextJie.getName()} ${nextJie.getSolar().toString()}` : '');
  const hourGanCheck = hourStemFor(p.day.heavenly, p.hour.earthly);

  return card('L1', '排盘', '出生时间 → 四柱干支', `
    <div class="conclusion">
      <div class="l1-meta">
        <p>输入：${inp.date} ${inp.time}，性别${inp.gender === 'male' ? '男' : '女'}，出生地经度 ${inp.longitude}°E</p>
        <p>真太阳时：${p.trueSolarTime}，校正量 ${corrSign}${corr.toFixed(1)} 分钟</p>
      </div>
    </div>
  `, [
    `输入：阳历 <span class="param">${inp.date} ${inp.time}</span>，性别${inp.gender === 'male' ? '男' : '女'}，出生地经度 <span class="param">${inp.longitude}°E</span>。`,
    `真太阳时校正：地方经度 ${inp.longitude}°E 与 120°E 相差 ${(inp.longitude - 120).toFixed(1)}°，每度 4 分钟，校正量 = (${inp.longitude} - 120) × 4 = <span class="param">${corrSign}${corr.toFixed(1)} 分钟</span>。本地时间 ${direction} ${Math.abs(corr).toFixed(1)} 分钟后，真太阳时为 <span class="param">${p.trueSolarTime}</span>。`,
    `年柱：以${t('立春')}换年。${yearNote}，年柱 = <span class="param">${p.year.ganZhi}</span>（年干${p.year.heavenly}、年支${p.year.earthly}）。`,
    `月柱：以${t('节气')}换月。出生日最近的节气为 <span class="param">${monthJie}</span>，月柱 = <span class="param">${p.month.ganZhi}</span>（月干${p.month.heavenly}、月支${p.month.earthly}）。`,
    `日柱：按太阳日计算，日柱 = <span class="param">${p.day.ganZhi}</span>（日干${p.day.heavenly}、日支${p.day.earthly}）。`,
    `时柱：时支由出生时辰确定；时干由日干起时。日干${p.day.heavenly}，时支${p.hour.earthly}，按五鼠遁推得时干为${hourGanCheck}，时柱 = <span class="param">${p.hour.ganZhi}</span>。`
  ]);
}

function renderL2(chart) {
  const fe = chart.fiveElements;
  const counts = fe.counts;
  const dayMaster = fe.dayMaster;
  const ratio = fe.dayMasterRatio;
  const maxEl = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const p = chart.pillars;
  const stemMap = [p.year.heavenly, p.month.heavenly, p.day.heavenly, p.hour.heavenly].map(s => `${s}→${STEM_ELEMENT[s]}`).join('，');
  const branchMap = [p.year.earthly, p.month.earthly, p.day.earthly, p.hour.earthly].map(b => `${b}→${BRANCH_ELEMENT[b]}`).join('，');
  return card('L2', '五行', '五行分布与日主占比', `
    <div class="conclusion">
      <div class="l2-layout">
        <div class="l2-chart">${elementBars(counts)}</div>
        <div class="l2-text">
          <p>日主五行：${elementTag(dayMaster)} ${dayMaster}</p>
          <p>日主占比：${fmtPercent(ratio)}</p>
          <p>最旺五行：${elementTag(maxEl[0])} ${maxEl[0]}（${maxEl[1]}个）</p>
        </div>
      </div>
    </div>
  `, [
    `命局四柱：年柱${p.year.ganZhi}、月柱${p.month.ganZhi}、日柱${p.day.ganZhi}、时柱${p.hour.ganZhi}。`,
    `${t('天干')}五行映射：${stemMap}。`,
    `${t('地支')}本气五行映射：${branchMap}。`,
    `统计：木${counts['木']}、火${counts['火']}、土${counts['土']}、金${counts['金']}、水${counts['水']}，合计 8 个字。`,
    `日主为${p.day.heavenly}，天干五行属${dayMaster}。日主占比 = 命中${dayMaster}的个数 ${counts[dayMaster]} / 8 = <span class="param">${fmtPercent(ratio)}</span>。`,
    `最旺五行：${maxEl[0]}（${maxEl[1]}个），${maxEl[0] === dayMaster ? '与日主相同' : '与日主不同'}。`
  ]);
}

function renderL3(chart) {
  const h = chart.hidden;
  const counts = h.tenGodCounts;
  const sorted = Object.entries(counts).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  const stats = sorted.map(([name, v]) => `${tenGodTag(name)}×${v}`).join(' ');
  const dayStem = h.dayStem;
  const hiddenDetails = h.hiddenStems.map(p => {
    const hiddenList = p.hidden.map(h => `${h.stem}（${h.role} ${Math.round(h.weight * 100)}%）→ ${h.tenGod}，${explainTenGod(dayStem, h.stem)}`).join('；');
    return `${p.label} ${p.branch}：${hiddenList}`;
  });
  const stemTenGodDetails = h.stemTenGods.map(s => `${s.label} ${s.stem} → ${s.tenGod}`).join('，');
  return card('L3', '藏干 & 十神', '地支藏干与十神矩阵', `
    <div class="conclusion">
      <div class="ten-god-stats">${stats}</div>
      ${hiddenStemChart(h.hiddenStems, h.dayStem)}
    </div>
  `, [
    `日主（日干）为 <span class="param">${dayStem}</span>，所有十神均以此为参照。`,
    `天干十神：${stemTenGodDetails}。`,
    `地支藏干与十神：${hiddenDetails.join('；')}。`,
    `十神统计：${sorted.map(([name, v]) => `${name} ${v} 个`).join('，')}。`,
    `十神判定规则：同我为比劫，生我者为印，我生者为食伤，克我者为官杀，我克者为财；阴阳相同为“偏”，阴阳不同为“正”。`
  ]);
}

function renderL3b(chart) {
  const ds = chart.divineSigns;
  const signItems = ds.signs.map(s => `
    <div class="sign-item type-${s.type.replace(/[\/偏]/g, '')}">
      <div class="sign-name">${s.name}</div>
      <div class="sign-meta">${s.type} · ${s.position} · 影响：${s.influence}</div>
      <div class="sign-method">查法：${s.method}</div>
      <div class="sign-meaning">${s.meaning}</div>
    </div>
  `).join('');
  const foundNames = ds.signs.map(s => s.name);
  const missing = ds.signs.length ? '' : '本造按日干/年支查表后，未在四柱地支中见到任何神煞。';
  return card('L3b', '神煞', '干支组合吉凶标签', `
    <div class="conclusion">
      <div class="sign-summary">
        <span class="sign-good">吉 ${ds.summary['吉'] + ds.summary['大吉'] + ds.summary['中性偏吉']}</span>
        <span class="sign-neutral">中性 ${ds.summary['中性']}</span>
        <span class="sign-bad">凶 ${ds.summary['凶']}</span>
      </div>
      <div class="sign-list">${signItems || '<p>无显著神煞。</p>'}</div>
    </div>
  `, [
    `以日干 <span class="param">${chart.pillars.day.heavenly}</span> 和年支 <span class="param">${chart.pillars.year.earthly}</span> 为主，查对应神煞表。`,
    `命中出现的神煞：${foundNames.join('、') || '无'}。`,
    ...ds.signs.map(s => `<strong>${s.name}</strong>：${s.method}；命中地支有 <span class="param">${s.position}</span>，故成立，影响为 <span class="param">${s.influence}</span>。`),
    missing
  ].filter(Boolean));
}

function renderL4(chart) {
  const st = chart.strength;
  const breakdown = st.breakdown;
  const rows = Object.entries(breakdown).map(([k, v]) => `
    <div class="strength-row">
      <div class="strength-name">${k} <span class="strength-score">+${v.score}</span></div>
      <div class="strength-bar"><div class="strength-fill" style="width:${Math.min(v.score, 20) / 20 * 100}%"></div></div>
      <div class="strength-reason">${v.reason}</div>
    </div>
  `).join('');
  const detailSteps = Object.entries(breakdown).map(([k, v]) => `${k}：${v.reason}，得分 <span class="param">+${v.score}</span>。`);
  return card('L4', '日主强弱', '得令 · 得地 · 得势 · 得助', `
    <div class="conclusion">
      <div class="strength-head">
        <div class="strength-conclusion">${st.conclusion}</div>
        <div class="strength-gauge">${strengthGauge(st.score)}</div>
      </div>
      <div class="strength-breakdown">${rows}</div>
    </div>
  `, [
    `日主 <span class="param">${chart.pillars.day.heavenly}</span> 五行属 <span class="param">${STEM_ELEMENT[chart.pillars.day.heavenly]}</span>，月令 <span class="param">${chart.pillars.month.earthly}</span> 五行属 <span class="param">${BRANCH_ELEMENT[chart.pillars.month.earthly]}</span>。`,
    ...detailSteps,
    `总分 = ${Object.entries(breakdown).map(([k, v]) => `${k}${v.score}`).join(' + ')} = <span class="param">${st.score}</span>。`,
    `判定阈值：>45 身强；25–45 中和；15–25 中和偏弱；<15 身弱。`,
    `结论：<span class="param">${st.conclusion}</span>。`
  ]);
}

function renderL5(chart) {
  const r = chart.relationships;
  const heavenlyList = r.heavenly.length ? r.heavenly.map(x => `${x.from}${x.to} ${x.type}${x.element ? '→' + x.element : ''}`).join('、') : '无';
  const earthlyList = r.earthly.length ? r.earthly.map(x => `${x.branches ? x.branches.join('') : x.from + x.to} ${x.type}${x.element ? '→' + x.element : ''}`).join('、') : '无';
  const hSteps = r.heavenly.map(x => {
    const rule = x.type === '合' ? `${x.from}与${x.to}为五合，化气${x.element}` : `${x.from}与${x.to}为四冲`;
    return `<strong>天干</strong>：${x.from}（${pillarLabel(x.fromIdx)}干）与 ${x.to}（${pillarLabel(x.toIdx)}干）${rule}。`;
  });
  const eSteps = r.earthly.map(x => {
    if (x.branches && x.branches.length > 2) {
      const present = x.branches.join('');
      const missing = [];
      // For triple, find missing branches from the defining set
      const all = [...EARTHLY_TRIPLE, ...EARTHLY_TRIPLE_MEET].find(t => t.element === x.element && x.branches.every(b => t.branches.includes(b)));
      if (all) missing.push(...all.branches.filter(b => !x.branches.includes(b)));
      const missingText = missing.length ? `，缺${missing.join('')}` : '';
      return `<strong>地支</strong>：${present} ${x.type}（${x.element}）${missingText}。`;
    }
    return `<strong>地支</strong>：${x.from}（${pillarLabel(x.fromIdx)}支）与 ${x.to}（${pillarLabel(x.toIdx)}支）${x.type}${x.element ? '→' + x.element : ''}。`;
  });
  return card('L5', '合会冲刑', '天干地支相互作用', `
    <div class="conclusion">
      ${relationshipGraph(r.heavenly, r.earthly, chart.pillars)}
      <div class="relationship-summary">
        <p><strong>天干：</strong>${heavenlyList}</p>
        <p><strong>地支：</strong>${earthlyList}</p>
      </div>
    </div>
  `, [
    ...hSteps,
    ...eSteps,
    `合化成立条件：化神当令、得地，否则只论合不论化。`
  ]);
}

function renderL6(chart) {
  const lp = chart.luckPillars;
  const current = lp.currentPillar;
  const sequenceDetail = lp.sequence.slice(0, 5).map(p => `${p.heavenly}${p.earthly}（${p.ageRange}岁）`).join(' → ');
  return card('L6', '大运 & 流年', '十年一大运', `
    <div class="conclusion">
      <div class="luck-info">
        <p>起运方向：${lp.direction} · 起运年龄：${lp.startAge}岁 · 距${lp.boundary.name}：${lp.daysToBoundary}天</p>
        <p>当前年龄：${lp.currentAge}岁 · 当前大运：${current.heavenly}${current.earthly}（${current.ageRange}岁）</p>
        <p>当前流年：${lp.currentYear}年 ${lp.currentYearGz}</p>
      </div>
      ${luckTimeline(lp)}
    </div>
  `, [
    `年干 <span class="param">${chart.pillars.year.heavenly}</span> 为${isYang(chart.pillars.year.heavenly) ? '阳' : '阴'}干，性别${chart.input.gender === 'male' ? '男' : '女'}，${(isYang(chart.pillars.year.heavenly) === (chart.input.gender === 'male')) ? '阳男/阴女顺排' : '阴男/阳女逆排'}，故大运 <span class="param">${lp.direction}</span>。`,
    `从出生日 <span class="param">${chart.pillars.solar.toString()}</span> 到最近${t('节气')} <span class="param">${lp.boundary.name}（${lp.boundary.date}）</span> 相距 <span class="param">${lp.daysToBoundary} 天</span>。`,
    `起运年龄 = ${lp.daysToBoundary} / 3 ≈ <span class="param">${lp.startAge} 岁</span>。`,
    `大运从月柱 <span class="param">${chart.pillars.month.ganZhi}</span> 开始${lp.direction}推：${sequenceDetail}……`,
    `当前年龄 <span class="param">${lp.currentAge}</span> 岁，落在 <span class="param">${current.heavenly}${current.earthly}</span> 大运（${current.ageRange} 岁）；当前流年 <span class="param">${lp.currentYear}</span> 年为 <span class="param">${lp.currentYearGz}</span>。`
  ]);
}

function renderL7(chart) {
  const rd = chart.reading;
  const monthHidden = chart.hidden.hiddenStems.find(x => x.pillar === 'month').hidden[0];
  const goodSigns = chart.divineSigns.signs.filter(s => s.type !== '凶').map(s => s.name).join('、') || '无';
  return card('L7', '综合判断', '格局 · 用神 · 建议', `
    <div class="conclusion">
      <div class="reading-grid">
        <div class="reading-item"><span class="reading-label">格局</span><span class="reading-value">${rd.pattern}</span></div>
        <div class="reading-item"><span class="reading-label">用神</span><span class="reading-value">${elementTag(rd.favorable)} ${rd.favorable}</span></div>
        <div class="reading-item"><span class="reading-label">喜神</span><span class="reading-value">${elementTag(rd.happy)} ${rd.happy}</span></div>
        <div class="reading-item"><span class="reading-label">忌神</span><span class="reading-value">${elementTag(rd.unfavorable)} ${rd.unfavorable}</span></div>
      </div>
      <div class="reading-detail">
        <p><strong>格局依据：</strong>${rd.patternReason}</p>
        <p><strong>用神依据：</strong>${rd.favorableReason}</p>
        <p><strong>忌神依据：</strong>${rd.unfavorableReason}</p>
        <p><strong>适合方向：</strong>${rd.industry.join('、')}；颜色：${rd.color}</p>
      </div>
      <div class="reading-warning">${rd.warning}</div>
    </div>
  `, [
    `格局：月令 <span class="param">${chart.pillars.month.earthly}</span> 藏干本气为 <span class="param">${monthHidden.stem}</span>（${monthHidden.tenGod}），${rd.patternReason}，故格局为 <span class="param">${rd.pattern}</span>。`,
    `日主强弱：${chart.strength.conclusion}（${chart.strength.score} 分）。`,
    `用神：<span class="param">${rd.favorable}</span>，${rd.favorableReason}`,
    `喜神：<span class="param">${rd.happy}</span>，${rd.happyReason}`,
    `忌神：<span class="param">${rd.unfavorable}</span>，${rd.unfavorableReason}`,
    `神煞辅助：${goodSigns}。`,
    `建议行业：${rd.industry.join('、')}；建议颜色：${rd.color}。`
  ]);
}

function card(id, title, subtitle, conclusion, derivationSteps) {
  const derivation = Array.isArray(derivationSteps)
    ? `<ul class="derivation-steps">${derivationSteps.map(s => `<li>${s}</li>`).join('')}</ul>`
    : `<div>${derivationSteps}</div>`;
  return `
    <div class="layer-card" data-layer="${id}">
      <div class="layer-header">
        <div>
          <span class="layer-id">${id}</span>
          <span class="layer-title">${title}</span>
          <span class="layer-subtitle">${subtitle}</span>
        </div>
        <button class="toggle-derivation" aria-expanded="false">展开推导</button>
      </div>
      <div class="layer-body">
        ${conclusion}
        <div class="derivation" hidden>
          <h4>推导过程</h4>
          ${derivation}
        </div>
      </div>
    </div>
  `;
}

export function bindTermClicks(container, onTermClick) {
  container.querySelectorAll('.term').forEach(el => {
    el.addEventListener('click', () => onTermClick(el.dataset.term));
  });
}

export function bindToggles(container) {
  container.querySelectorAll('.toggle-derivation').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.layer-card');
      const deriv = card.querySelector('.derivation');
      const hidden = deriv.hasAttribute('hidden');
      deriv.toggleAttribute('hidden', !hidden);
      btn.textContent = hidden ? '收起推导' : '展开推导';
      btn.setAttribute('aria-expanded', String(hidden));
    });
  });
}

export function renderKnowledge(term) {
  const k = lookupKnowledge(term);
  if (!knowledgeTitle || !knowledgeContent) return;
  if (!k) {
    knowledgeTitle.textContent = '横向知识';
    knowledgeContent.innerHTML = '<p>未找到该术语的解释。点击推导中的蓝色术语查看。</p>';
    return;
  }
  knowledgeTitle.textContent = k.name;
  knowledgeContent.innerHTML = `
    <div class="knowledge-section">
      <h5>定义</h5>
      <p>${k.definition}</p>
    </div>
    <div class="knowledge-section">
      <h5>出处</h5>
      <p>${k.source}</p>
    </div>
    <div class="knowledge-section">
      <h5>公式 / 查法</h5>
      <p>${k.formula}</p>
    </div>
    <div class="knowledge-section">
      <h5>相关概念</h5>
      <p>${k.related.map(r => `<span class="term" data-term="${r}">${r}</span>`).join(' · ')}</p>
    </div>
    <div class="knowledge-section">
      <h5>案例</h5>
      ${k.examples.map(ex => `<p><strong>${ex.chart}</strong> → ${ex.result} <span class="muted">(${ex.reason})</span></p>`).join('')}
    </div>
  `;
  // Re-bind knowledge terms within panel
  knowledgeContent.querySelectorAll('.term').forEach(el => {
    el.addEventListener('click', () => renderKnowledge(el.dataset.term));
  });
}

export function setDefaultKnowledge() {
  renderKnowledge('四柱');
}
