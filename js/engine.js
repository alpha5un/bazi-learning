/* 四柱八字计算引擎（子平派，基于 6tail/lunar-javascript） */

const Solar = (typeof window !== 'undefined' && window.Solar) || (typeof global !== 'undefined' && global.Solar);

export const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export const YANG_STEMS = ['甲', '丙', '戊', '庚', '壬'];
export const ELEMENTS = ['木', '火', '土', '金', '水'];

export const STEM_ELEMENT = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
  己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水'
};
export const BRANCH_ELEMENT = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水'
};
export const ELEMENT_COLOR = {
  木: '#4a7c59', 火: '#c0392b', 土: '#b08d57', 金: '#d4af37', 水: '#2e6da4'
};
export const BRANCH_SEASON = {
  寅: '春', 卯: '春', 辰: '春', 巳: '夏', 午: '夏', 未: '夏',
  申: '秋', 酉: '秋', 戌: '秋', 亥: '冬', 子: '冬', 丑: '冬'
};
export const SEASON_ELEMENT = { 春: '木', 夏: '火', 秋: '金', 冬: '水' };

export const HIDDEN_STEMS = {
  子: [{ stem: '癸', role: '本气', weight: 1 }],
  丑: [{ stem: '己', role: '本气', weight: 0.6 }, { stem: '癸', role: '中气', weight: 0.3 }, { stem: '辛', role: '余气', weight: 0.1 }],
  寅: [{ stem: '甲', role: '本气', weight: 0.6 }, { stem: '丙', role: '中气', weight: 0.3 }, { stem: '戊', role: '余气', weight: 0.1 }],
  卯: [{ stem: '乙', role: '本气', weight: 1 }],
  辰: [{ stem: '戊', role: '本气', weight: 0.6 }, { stem: '乙', role: '中气', weight: 0.3 }, { stem: '癸', role: '余气', weight: 0.1 }],
  巳: [{ stem: '丙', role: '本气', weight: 0.6 }, { stem: '戊', role: '中气', weight: 0.3 }, { stem: '庚', role: '余气', weight: 0.1 }],
  午: [{ stem: '丁', role: '本气', weight: 0.7 }, { stem: '己', role: '中气', weight: 0.3 }],
  未: [{ stem: '己', role: '本气', weight: 0.6 }, { stem: '丁', role: '中气', weight: 0.3 }, { stem: '乙', role: '余气', weight: 0.1 }],
  申: [{ stem: '庚', role: '本气', weight: 0.6 }, { stem: '壬', role: '中气', weight: 0.3 }, { stem: '戊', role: '余气', weight: 0.1 }],
  酉: [{ stem: '辛', role: '本气', weight: 1 }],
  戌: [{ stem: '戊', role: '本气', weight: 0.6 }, { stem: '辛', role: '中气', weight: 0.3 }, { stem: '丁', role: '余气', weight: 0.1 }],
  亥: [{ stem: '壬', role: '本气', weight: 0.7 }, { stem: '甲', role: '中气', weight: 0.3 }]
};

const GENERATES = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const OVERCOMES = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };
const HOUR_STEM_START = { 甲: 0, 己: 0, 乙: 2, 庚: 2, 丙: 4, 辛: 4, 丁: 6, 壬: 6, 戊: 8, 癸: 8 };

export { GENERATES, OVERCOMES };
export function hourStemFor(dayStem, hourBranch) {
  const start = HOUR_STEM_START[dayStem];
  const idx = (start + BRANCHES.indexOf(hourBranch)) % 10;
  return STEMS[idx];
}

export const HEAVENLY_5_COMBINE = {
  甲: '己', 己: '甲', 乙: '庚', 庚: '乙', 丙: '辛', 辛: '丙', 丁: '壬', 壬: '丁', 戊: '癸', 癸: '戊'
};
export const HEAVENLY_COMBINE_ELEMENT = { 甲己: '土', 乙庚: '金', 丙辛: '水', 丁壬: '木', 戊癸: '火' };
export const HEAVENLY_CLASH = { 甲: '庚', 庚: '甲', 乙: '辛', 辛: '乙', 丙: '壬', 壬: '丙', 丁: '癸', 癸: '丁' };
export const EARTHLY_6_COMBINE = {
  子: '丑', 丑: '子', 寅: '亥', 亥: '寅', 卯: '戌', 戌: '卯', 辰: '酉', 酉: '辰', 巳: '申', 申: '巳', 午: '未', 未: '午'
};
export const EARTHLY_COMBINE_ELEMENT = { 子丑: '土', 寅亥: '木', 卯戌: '火', 辰酉: '金', 巳申: '水', 午未: '火/土' };
export const EARTHLY_CLASH = {
  子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳'
};
export const EARTHLY_HARM = {
  子: '未', 未: '子', 丑: '午', 午: '丑', 寅: '巳', 巳: '寅', 卯: '辰', 辰: '卯', 申: '亥', 亥: '申', 酉: '戌', 戌: '酉'
};
export const EARTHLY_PUNISH_PAIR = { 子: '卯', 卯: '子', 辰: '辰', 午: '午', 酉: '酉', 亥: '亥' };
export const EARTHLY_PUNISH_TRIPLE = [['寅', '巳', '申'], ['丑', '戌', '未']];
export const EARTHLY_TRIPLE = [
  { element: '水', branches: ['申', '子', '辰'] },
  { element: '木', branches: ['亥', '卯', '未'] },
  { element: '火', branches: ['寅', '午', '戌'] },
  { element: '金', branches: ['巳', '酉', '丑'] }
];
export const EARTHLY_TRIPLE_MEET = [
  { element: '水', branches: ['亥', '子', '丑'] },
  { element: '木', branches: ['寅', '卯', '辰'] },
  { element: '火', branches: ['巳', '午', '未'] },
  { element: '金', branches: ['申', '酉', '戌'] }
];

export const JIE_NAMES = ['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒'];

export const TEN_GOD_LABELS = ['比肩', '劫财', '食神', '伤官', '偏财', '正财', '七杀', '正官', '偏印', '正印'];

export function isYang(stem) { return YANG_STEMS.includes(stem); }
export function getPolarity(stem) { return isYang(stem) ? '阳' : '阴'; }
export function stemIndex(stem) { return STEMS.indexOf(stem); }
export function branchIndex(branch) { return BRANCHES.indexOf(branch); }
export function nextStem(idx) { return STEMS[(idx + 1) % 10]; }
export function prevStem(idx) { return STEMS[(idx + 9) % 10]; }
export function nextBranch(idx) { return BRANCHES[(idx + 1) % 12]; }
export function prevBranch(idx) { return BRANCHES[(idx + 11) % 12]; }
export function getGanZhiIndex(gz) { return STEMS.indexOf(gz[0]) * 6 + BRANCHES.indexOf(gz[1]); } // 60甲子 index
export function ganZhiFromIndex(i) { return STEMS[i % 10] + BRANCHES[i % 12]; }
export function yearGanZhi(year) { return ganZhiFromIndex((year - 4) % 60); }

export function getTenGod(dayStem, targetStem) {
  const e1 = STEM_ELEMENT[dayStem], e2 = STEM_ELEMENT[targetStem];
  const p1 = isYang(dayStem), p2 = isYang(targetStem);
  if (e1 === e2) return p1 === p2 ? '比肩' : '劫财';
  if (e2 === GENERATES[e1]) return p1 === p2 ? '偏印' : '正印';
  if (e1 === GENERATES[e2]) return p1 === p2 ? '食神' : '伤官';
  if (e2 === OVERCOMES[e1]) return p1 === p2 ? '偏财' : '正财';
  if (e1 === OVERCOMES[e2]) return p1 === p2 ? '七杀' : '正官';
  return '';
}

export function getHiddenStems(branch) {
  return HIDDEN_STEMS[branch] || [];
}

export function applyTrueSolarTime(dateStr, timeStr, longitude) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mi] = timeStr.split(':').map(Number);
  const local = new Date(y, m - 1, d, hh, mi, 0, 0);
  const diffMinutes = (longitude - 120) * 4;
  const trueDate = new Date(local.getTime() + diffMinutes * 60000);
  return trueDate;
}

export function computePillars(trueDate) {
  const s = Solar.fromYmdHms(trueDate.getFullYear(), trueDate.getMonth() + 1, trueDate.getDate(), trueDate.getHours(), trueDate.getMinutes(), 0);
  const l = s.getLunar();
  return {
    year: { label: '年柱', heavenly: l.getYearGanByLiChun(), earthly: l.getYearZhiByLiChun(), ganZhi: l.getYearInGanZhiByLiChun() },
    month: { label: '月柱', heavenly: l.getMonthGanExact(), earthly: l.getMonthZhiExact(), ganZhi: l.getMonthInGanZhiExact() },
    day: { label: '日柱', heavenly: l.getDayGanExact(), earthly: l.getDayZhiExact(), ganZhi: l.getDayInGanZhiExact() },
    hour: { label: '时柱', heavenly: l.getTimeGan(), earthly: l.getTimeZhi(), ganZhi: l.getTimeInGanZhi() },
    solar: s,
    lunar: l,
    trueSolarTime: `${trueDate.getFullYear()}-${String(trueDate.getMonth() + 1).padStart(2, '0')}-${String(trueDate.getDate()).padStart(2, '0')} ${String(trueDate.getHours()).padStart(2, '0')}:${String(trueDate.getMinutes()).padStart(2, '0')}`
  };
}

export function computeFiveElements(pillars) {
  const counts = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  const allStems = [pillars.year.heavenly, pillars.month.heavenly, pillars.day.heavenly, pillars.hour.heavenly];
  const allBranches = [pillars.year.earthly, pillars.month.earthly, pillars.day.earthly, pillars.hour.earthly];
  allStems.forEach(s => counts[STEM_ELEMENT[s]]++);
  allBranches.forEach(b => counts[BRANCH_ELEMENT[b]]++);
  const total = 8;
  const dayMaster = STEM_ELEMENT[pillars.day.heavenly];
  const ratios = {};
  ELEMENTS.forEach(e => { ratios[e] = (counts[e] / total); });
  return { counts, dayMaster, dayMasterRatio: ratios[dayMaster], total, ratios };
}

export function computeHiddenStemsAndTenGods(pillars) {
  const dayStem = pillars.day.heavenly;
  const result = [];
  const tenGodCounts = {};
  TEN_GOD_LABELS.forEach(g => tenGodCounts[g] = 0);
  const pillarsList = ['year', 'month', 'day', 'hour'];
  pillarsList.forEach(key => {
    const branch = pillars[key].earthly;
    const hidden = getHiddenStems(branch).map(h => {
      const tenGod = getTenGod(dayStem, h.stem);
      tenGodCounts[tenGod] += 1;
      return { ...h, tenGod };
    });
    result.push({ pillar: key, label: pillars[key].label, branch, hidden });
  });
  // 天干十神统计
  const stemTenGods = pillarsList.map(key => {
    const stem = pillars[key].heavenly;
    const tenGod = getTenGod(dayStem, stem);
    tenGodCounts[tenGod] += 1;
    return { pillar: key, label: pillars[key].label, stem, tenGod };
  });
  return { hiddenStems: result, stemTenGods, tenGodCounts, dayStem };
}

export function computeStrength(pillars, fiveElements, hidden) {
  const dayStem = pillars.day.heavenly;
  const dayElement = STEM_ELEMENT[dayStem];
  const monthBranch = pillars.month.earthly;
  const monthElement = BRANCH_ELEMENT[monthBranch];

  // 得令
  let deLingScore = 0, deLingReason = '';
  if (monthElement === dayElement) {
    deLingScore = 20; deLingReason = `月令${monthBranch}(${monthElement})与日主${dayStem}(${dayElement})同五行，得令`;
  } else if (GENERATES[monthElement] === dayElement) {
    deLingScore = 20; deLingReason = `月令${monthBranch}(${monthElement})生助日主${dayStem}(${dayElement})，得令`;
  } else if (dayElement === GENERATES[monthElement]) {
    deLingReason = `月令${monthBranch}(${monthElement})为日主${dayStem}(${dayElement})所泄，不得令`;
  } else if (monthElement === OVERCOMES[dayElement]) {
    deLingReason = `月令${monthBranch}(${monthElement})克日主${dayStem}(${dayElement})，不得令`;
  } else {
    deLingReason = `月令${monthBranch}(${monthElement})与日主${dayStem}(${dayElement})无直接生助，不得令`;
  }

  // 得地
  let deDiScore = 0, deDiReason = '', foundRoot = false;
  hidden.hiddenStems.forEach(p => {
    p.hidden.forEach(h => {
      if (h.stem === dayStem) {
        foundRoot = true;
        if (h.role === '本气') { deDiScore = Math.max(deDiScore, 15); }
        else if (h.role === '中气') { deDiScore = Math.max(deDiScore, 10); }
        else { deDiScore = Math.max(deDiScore, 5); }
      } else if (STEM_ELEMENT[h.stem] === dayElement && !foundRoot) {
        if (h.role === '本气') deDiScore = Math.max(deDiScore, 10);
        else if (h.role === '中气') deDiScore = Math.max(deDiScore, 7);
        else deDiScore = Math.max(deDiScore, 3);
      }
    });
  });
  if (deDiScore >= 15) deDiReason = `地支中藏有日主本气${dayStem}，有强根`;
  else if (deDiScore > 0) deDiReason = `地支中藏有${dayElement}气，根气较弱`;
  else deDiReason = '地支无根气';

  // 得势
  const helpStems = [pillars.year.heavenly, pillars.month.heavenly, pillars.day.heavenly, pillars.hour.heavenly].filter(s => {
    const e = STEM_ELEMENT[s];
    return e === dayElement || e === GENERATES[dayElement];
  });
  let deShiScore = 0, deShiReason = '';
  if (helpStems.length >= 2) { deShiScore = 10; }
  else if (helpStems.length === 1) { deShiScore = 5; }
  deShiReason = helpStems.length ? `天干有助身/帮身之干：${helpStems.join('、')}，共${helpStems.length}个` : '天干无助身/帮身之干';

  // 得助
  let deZhuScore = 0, deZhuReason = '';
  const shengStems = [pillars.year.heavenly, pillars.month.heavenly, pillars.hour.heavenly].filter(s => STEM_ELEMENT[s] === GENERATES[dayElement]);
  if (shengStems.length) { deZhuScore = 5; deZhuReason = `天干有印星${shengStems.join('、')}生扶日主`; }
  else { deZhuReason = '天干无印星生扶'; }

  const total = deLingScore + deDiScore + deShiScore + deZhuScore;
  let conclusion = '';
  if (total >= 45) conclusion = '身强';
  else if (total >= 25) conclusion = '中和';
  else if (total >= 15) conclusion = '中和偏弱';
  else conclusion = '身弱';

  return {
    conclusion, score: total,
    threshold: { strong: 45, mediumHigh: 25, mediumLow: 15 },
    breakdown: {
      得令: { score: deLingScore, reason: deLingReason },
      得地: { score: deDiScore, reason: deDiReason },
      得势: { score: deShiScore, reason: deShiReason },
      得助: { score: deZhuScore, reason: deZhuReason }
    }
  };
}

export function computeRelationships(pillars) {
  const heavenly = [];
  const stems = [pillars.year.heavenly, pillars.month.heavenly, pillars.day.heavenly, pillars.hour.heavenly];
  const branchList = [pillars.year.earthly, pillars.month.earthly, pillars.day.earthly, pillars.hour.earthly];
  const indices = ['year', 'month', 'day', 'hour'];
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      const a = stems[i], b = stems[j];
      if (HEAVENLY_5_COMBINE[a] === b) {
        const key = a < b ? a + b : b + a;
        heavenly.push({ from: a, to: b, type: '合', element: HEAVENLY_COMBINE_ELEMENT[key] || '', transformed: true, fromIdx: indices[i], toIdx: indices[j] });
      } else if (HEAVENLY_CLASH[a] === b) {
        heavenly.push({ from: a, to: b, type: '冲', element: '', transformed: false, fromIdx: indices[i], toIdx: indices[j] });
      }
    }
  }
  const earthly = [];
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      const a = branchList[i], b = branchList[j];
      if (EARTHLY_6_COMBINE[a] === b) {
        const key = a < b ? a + b : b + a;
        earthly.push({ from: a, to: b, type: '合', element: EARTHLY_COMBINE_ELEMENT[key] || '', transformed: true, fromIdx: indices[i], toIdx: indices[j] });
      } else if (EARTHLY_CLASH[a] === b) {
        earthly.push({ from: a, to: b, type: '冲', element: '', transformed: false, fromIdx: indices[i], toIdx: indices[j] });
      } else if (EARTHLY_HARM[a] === b) {
        earthly.push({ from: a, to: b, type: '害', element: '', transformed: false, fromIdx: indices[i], toIdx: indices[j] });
      } else if (EARTHLY_PUNISH_PAIR[a] === b) {
        earthly.push({ from: a, to: b, type: '刑', element: '', transformed: false, fromIdx: indices[i], toIdx: indices[j] });
      }
    }
  }
  // 三合/三会
  EARTHLY_TRIPLE.forEach(t => {
    const present = t.branches.filter(b => branchList.includes(b));
    if (present.length >= 3) {
      earthly.push({ from: present[0], to: present[2], type: '三合', element: t.element, transformed: false, branches: present, fromIdx: '', toIdx: '' });
    } else if (present.length === 2) {
      earthly.push({ from: present[0], to: present[1], type: '三合(缺)', element: t.element, transformed: false, branches: present, fromIdx: '', toIdx: '' });
    }
  });
  EARTHLY_TRIPLE_MEET.forEach(t => {
    const present = t.branches.filter(b => branchList.includes(b));
    if (present.length >= 3) {
      earthly.push({ from: present[0], to: present[2], type: '三会', element: t.element, transformed: false, branches: present, fromIdx: '', toIdx: '' });
    } else if (present.length === 2) {
      earthly.push({ from: present[0], to: present[1], type: '三会(缺)', element: t.element, transformed: false, branches: present, fromIdx: '', toIdx: '' });
    }
  });
  // 三刑
  EARTHLY_PUNISH_TRIPLE.forEach(arr => {
    const present = arr.filter(b => branchList.includes(b));
    if (present.length >= 2) {
      earthly.push({ from: present[0], to: present[present.length - 1], type: '三刑', element: '', transformed: false, branches: present, fromIdx: '', toIdx: '' });
    }
  });
  return { heavenly, earthly };
}

export function computeDivineSigns(pillars, hidden, fiveElements) {
  const dayStem = pillars.day.heavenly;
  const yearBranch = pillars.year.earthly;
  const monthBranch = pillars.month.earthly;
  const branches = [pillars.year.earthly, pillars.month.earthly, pillars.day.earthly, pillars.hour.earthly];
  const branchSet = new Set(branches);
  const signs = [];

  // 天乙贵人
  const tianYiMap = { 甲: '丑未', 戊: '丑未', 乙: '子申', 己: '子申', 丙: '亥酉', 丁: '亥酉', 壬: '卯巳', 癸: '卯巳', 庚: '丑未', 辛: '寅午' };
  const tianYiBranches = tianYiMap[dayStem] || '';
  tianYiBranches.split('').forEach(b => {
    if (branchSet.has(b)) signs.push({ name: '天乙贵人', type: '大吉', position: b, method: `${dayStem}日贵人位在${tianYiBranches}`, meaning: '遇难呈祥，贵人提携' });
  });

  // 文昌
  const wenchangMap = { 甲: '巳', 乙: '午', 丙: '申', 戊: '申', 丁: '酉', 己: '酉', 庚: '亥', 辛: '子', 壬: '寅', 癸: '卯' };
  const wc = wenchangMap[dayStem];
  if (wc && branchSet.has(wc)) signs.push({ name: '文昌', type: '吉', position: wc, method: `${dayStem}日文昌在${wc}`, meaning: '学业才华、文采出众' });

  // 驿马
  const yiMaMap = { 寅: '申', 午: '申', 戌: '申', 申: '寅', 子: '寅', 辰: '寅', 亥: '巳', 卯: '巳', 未: '巳', 巳: '亥', 酉: '亥', 丑: '亥' };
  const ym = yiMaMap[yearBranch];
  if (ym && branchSet.has(ym)) signs.push({ name: '驿马', type: '中性', position: ym, method: `${yearBranch}年支三合驿马在${ym}`, meaning: '主动、变动、远行' });

  // 桃花
  const taoHuaMap = { 寅: '卯', 午: '卯', 戌: '卯', 申: '酉', 子: '酉', 辰: '酉', 亥: '子', 卯: '子', 未: '子', 巳: '午', 酉: '午', 丑: '午' };
  const th = taoHuaMap[yearBranch];
  if (th && branchSet.has(th)) signs.push({ name: '桃花', type: '中性偏吉', position: th, method: `${yearBranch}年支三合桃花在${th}`, meaning: '人缘好、感情丰富' });

  // 华盖
  const huaGaiMap = { 寅: '戌', 午: '戌', 戌: '戌', 申: '辰', 子: '辰', 辰: '辰', 亥: '未', 卯: '未', 未: '未', 巳: '丑', 酉: '丑', 丑: '丑' };
  const hg = huaGaiMap[yearBranch];
  if (hg && branchSet.has(hg)) signs.push({ name: '华盖', type: '中性', position: hg, method: `${yearBranch}年支三合华盖在${hg}`, meaning: '宗教、哲学、孤独' });

  // 将星
  const jiangXingMap = { 寅: '午', 午: '午', 戌: '午', 申: '子', 子: '子', 辰: '子', 亥: '卯', 卯: '卯', 未: '卯', 巳: '酉', 酉: '酉', 丑: '酉' };
  const jx = jiangXingMap[yearBranch];
  if (jx && branchSet.has(jx)) signs.push({ name: '将星', type: '吉', position: jx, method: `${yearBranch}年支三合将星在${jx}`, meaning: '权威、领导力' });

  // 禄神
  const luShenMap = { 甲: '寅', 乙: '卯', 丙: '巳', 戊: '巳', 丁: '午', 己: '午', 庚: '申', 辛: '酉', 壬: '亥', 癸: '子' };
  const ls = luShenMap[dayStem];
  if (ls && branchSet.has(ls)) signs.push({ name: '禄神', type: '吉', position: ls, method: `${dayStem}日禄在${ls}`, meaning: '衣食福禄' });

  // 天德贵人
  const tianDeMap = { 寅: '丁', 卯: '申', 辰: '壬', 巳: '辛', 午: '甲', 未: '癸', 申: '寅', 酉: '丙', 戌: '乙', 亥: '己', 子: '庚', 丑: '庚' };
  const td = tianDeMap[monthBranch];
  if (td && [pillars.year.heavenly, pillars.month.heavenly, pillars.day.heavenly, pillars.hour.heavenly].includes(td)) {
    signs.push({ name: '天德贵人', type: '大吉', position: td, method: `${monthBranch}月天德在${td}`, meaning: '化解灾厄' });
  }

  // 月德贵人
  const yueDeMap = { 寅: '丙', 午: '丙', 戌: '丙', 亥: '甲', 卯: '甲', 未: '甲', 申: '壬', 子: '壬', 辰: '壬', 巳: '庚', 酉: '庚', 丑: '庚' };
  const yd = yueDeMap[monthBranch];
  if (yd && [pillars.year.heavenly, pillars.month.heavenly, pillars.day.heavenly, pillars.hour.heavenly].includes(yd)) {
    signs.push({ name: '月德贵人', type: '吉', position: yd, method: `${monthBranch}月月德在${yd}`, meaning: '化解灾厄' });
  }

  // 孤辰寡宿
  const guChenMap = { 亥: '寅', 子: '寅', 丑: '寅', 寅: '巳', 卯: '巳', 辰: '巳', 巳: '申', 午: '申', 未: '申', 申: '亥', 酉: '亥', 戌: '亥' };
  const guaSuMap = { 亥: '戌', 子: '戌', 丑: '戌', 寅: '丑', 卯: '丑', 辰: '丑', 巳: '辰', 午: '辰', 未: '辰', 申: '未', 酉: '未', 戌: '未' };
  const gc = guChenMap[yearBranch], gs = guaSuMap[yearBranch];
  if (gc && branchSet.has(gc)) signs.push({ name: '孤辰', type: '凶', position: gc, method: `${yearBranch}年支孤辰在${gc}`, meaning: '孤独' });
  if (gs && branchSet.has(gs)) signs.push({ name: '寡宿', type: '凶', position: gs, method: `${yearBranch}年支寡宿在${gs}`, meaning: '孤独' });

  // 劫煞/亡神
  const jieShaMap = { 申: '巳', 子: '巳', 辰: '巳', 寅: '亥', 午: '亥', 戌: '亥', 亥: '申', 卯: '申', 未: '申', 巳: '寅', 酉: '寅', 丑: '寅' };
  const wangShenMap = { 申: '亥', 子: '亥', 辰: '亥', 寅: '巳', 午: '巳', 戌: '巳', 亥: '寅', 卯: '寅', 未: '寅', 巳: '申', 酉: '申', 丑: '申' };
  const js = jieShaMap[yearBranch], ws = wangShenMap[yearBranch];
  if (js && branchSet.has(js)) signs.push({ name: '劫煞', type: '凶', position: js, method: `${yearBranch}年支劫煞在${js}`, meaning: '是非、波动' });
  if (ws && branchSet.has(ws)) signs.push({ name: '亡神', type: '凶', position: ws, method: `${yearBranch}年支亡神在${ws}`, meaning: '暗昧、耗损' });

  // 影响力评估：根据所在支与月令五行关系
  signs.forEach(s => {
    const posBranch = s.position;
    const posElement = BRANCH_ELEMENT[posBranch];
    const monthEl = BRANCH_ELEMENT[monthBranch];
    if (posElement === monthEl || GENERATES[monthEl] === posElement) s.influence = '旺';
    else if (OVERCOMES[monthEl] === posElement || OVERCOMES[posElement] === monthEl) s.influence = '弱';
    else s.influence = '中';
  });

  const summary = { 吉: 0, 凶: 0, 中性: 0, '中性偏吉': 0, '大吉': 0 };
  signs.forEach(s => {
    if (s.type === '大吉' || s.type === '吉') summary['吉']++;
    else if (s.type === '凶') summary['凶']++;
    else if (s.type === '中性') summary['中性']++;
    else if (s.type === '中性偏吉') summary['中性偏吉']++;
  });
  return { signs, summary };
}

export function computeLuckPillars(pillars, trueDate, gender) {
  const yearStem = pillars.year.heavenly;
  const isYangYear = isYang(yearStem);
  const isMale = gender === 'male';
  const forward = (isYangYear && isMale) || (!isYangYear && !isMale);

  const s = pillars.solar;
  const l = s.getLunar();
  const table = l.getJieQiTable();
  const candidates = Object.entries(table)
    .filter(([name]) => JIE_NAMES.includes(name))
    .map(([name, solar]) => ({ name, solar }))
    .sort((a, b) => a.solar.getJulianDay() - b.solar.getJulianDay());

  let boundary;
  if (forward) {
    boundary = candidates.find(x => x.solar.getJulianDay() > s.getJulianDay());
    if (!boundary) boundary = candidates[0]; // next year
  } else {
    const before = candidates.filter(x => x.solar.getJulianDay() < s.getJulianDay());
    boundary = before.length ? before[before.length - 1] : candidates[candidates.length - 1];
  }
  const days = Math.abs(boundary.solar.getJulianDay() - s.getJulianDay());
  const startAge = Math.round(days / 3);

  const monthStemIdx = stemIndex(pillars.month.heavenly);
  const monthBranchIdx = branchIndex(pillars.month.earthly);
  const sequence = [];
  for (let i = 0; i < 8; i++) {
    const offset = i + 1;
    const h = forward ? nextStem(monthStemIdx + offset - 1) : prevStem(monthStemIdx - offset + 1);
    const b = forward ? nextBranch(monthBranchIdx + offset - 1) : prevBranch(monthBranchIdx - offset + 1);
    const start = startAge + i * 10;
    const end = start + 9;
    sequence.push({ ageRange: `${start}-${end}`, heavenly: h, earthly: b, start, end });
  }

  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - trueDate.getFullYear() + 1;
  const currentPillar = sequence.find(p => currentAge >= p.start && currentAge <= p.end) || sequence[0];
  const currentYearGz = yearGanZhi(currentYear);

  return {
    direction: forward ? '顺排' : '逆排',
    startAge,
    boundary: { name: boundary.name, date: boundary.solar.toString() },
    daysToBoundary: Math.round(days * 10) / 10,
    sequence,
    currentPillar,
    currentYear: currentYear,
    currentYearGz,
    currentAge
  };
}

export function computeReading(pillars, hidden, strength, fiveElements) {
  const dayStem = pillars.day.heavenly;
  const dayElement = STEM_ELEMENT[dayStem];
  const monthBranch = pillars.month.earthly;
  const principalHidden = hidden.hiddenStems.find(h => h.pillar === 'month').hidden[0].stem;

  const appearsInStems = [pillars.year.heavenly, pillars.month.heavenly, pillars.day.heavenly, pillars.hour.heavenly].includes(principalHidden);
  const patternTenGod = getTenGod(dayStem, principalHidden);
  const pattern = `${patternTenGod}格`;
  const patternReason = appearsInStems
    ? `月令${monthBranch}中藏${principalHidden}(${patternTenGod})，且透出天干`
    : `月令${monthBranch}中藏${principalHidden}(${patternTenGod})，为当月主气`;

  const strong = strength.conclusion === '身强' || strength.conclusion === '中和偏强';
  const weak = strength.conclusion === '身弱' || strength.conclusion === '中和偏弱';

  const overcome = OVERCOMES[dayElement];
  const generate = GENERATES[dayElement];
  const generated = Object.keys(GENERATES).find(k => GENERATES[k] === dayElement);
  const same = dayElement;

  const counts = fiveElements.counts;

  let favorable = '', favorableReason = '', unfavorable = '', unfavorableReason = '';
  let happy = '', happyReason = '';
  if (weak) {
    // 喜生扶：印星和比劫
    const options = [same, generated];
    favorable = counts[generated] < counts[same] ? generated : same;
    favorableReason = `日主${strength.conclusion}，需生扶；${generated}（印）${same}（比劫）中${counts[favorable] === counts[same] ? '比劫更直接' : '数较少者为用'}`;
    happy = generated;
    happyReason = `${generated}生助日主，为喜神`;
    const badOptions = [overcome, generate, Object.keys(OVERCOMES).find(k => OVERCOMES[k] === dayElement) || ''];
    unfavorable = badOptions.sort((a, b) => counts[b] - counts[a])[0];
    unfavorableReason = `克泄耗日主之五行${unfavorable}为忌神`;
  } else if (strong) {
    favorable = overcome;
    favorableReason = `日主${strength.conclusion}，喜克泄耗；${overcome}克身有力，取为用神`;
    const badOptions = [same, generated];
    unfavorable = badOptions.sort((a, b) => counts[b] - counts[a])[0];
    unfavorableReason = `生扶日主之五行${unfavorable}为忌神`;
    happy = generate;
    happyReason = `${generate}为日主所泄，泄秀为喜神`;
  } else {
    favorable = same;
    favorableReason = '日主中和，顺势取比劫为用，平衡五行';
    unfavorable = overcome;
    unfavorableReason = '官杀克身，不宜再增';
    happy = generated;
    happyReason = '印星生身，为喜神';
  }

  const industryMap = {
    木: ['教育、文化、出版、园艺、林业'],
    火: ['能源、餐饮、传媒、演艺、电子'],
    土: ['房地产、建筑、农业、矿产、仓储'],
    金: ['金融、机械、汽车、五金、法律'],
    水: ['物流、贸易、航运、旅游、水产']
  };
  const colorMap = { 木: '绿色', 火: '红色', 土: '黄色', 金: '白色/金色', 水: '黑色/蓝色' };

  return {
    pattern, patternReason,
    favorable, favorableReason,
    unfavorable, unfavorableReason,
    happy, happyReason,
    industry: industryMap[favorable] || [],
    color: colorMap[favorable] || '',
    warning: '命理分析流派众多，本结果仅作学习参考，不构成人生决策依据。'
  };
}

export function computeChart(input) {
  const trueDate = applyTrueSolarTime(input.date, input.time, input.longitude);
  const correction = (input.longitude - 120) * 4;
  const pillars = computePillars(trueDate);
  const fiveElements = computeFiveElements(pillars);
  const hidden = computeHiddenStemsAndTenGods(pillars);
  const strength = computeStrength(pillars, fiveElements, hidden);
  const relationships = computeRelationships(pillars);
  const divineSigns = computeDivineSigns(pillars, hidden, fiveElements);
  const luckPillars = computeLuckPillars(pillars, trueDate, input.gender);
  const reading = computeReading(pillars, hidden, strength, fiveElements);

  return {
    input, trueDate: trueDate.toISOString(), correction,
    pillars, fiveElements, hidden, strength,
    relationships, divineSigns, luckPillars, reading
  };
}
