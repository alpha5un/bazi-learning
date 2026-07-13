/* 入口：读取输入、计算、渲染、事件绑定 */

import { computeChart } from './engine.js';
import { renderPillars, renderLayers, bindTermClicks, bindToggles, renderKnowledge, setDefaultKnowledge } from './ui.js';

const state = {
  date: '1990-03-15',
  time: '14:30',
  gender: 'male',
  longitude: 116.4
};

const els = {
  year: document.getElementById('inp-year'),
  month: document.getElementById('inp-month'),
  day: document.getElementById('inp-day'),
  hour: document.getElementById('inp-hour'),
  minute: document.getElementById('inp-minute'),
  gender: document.getElementById('inp-gender'),
  longitude: document.getElementById('inp-longitude'),
  calc: document.getElementById('btn-calc'),
  expand: document.getElementById('btn-expand-all'),
  pillars: document.getElementById('pillars-strip'),
  layers: document.getElementById('layers'),
  knowledge: document.getElementById('knowledge-panel'),
  knowledgeOverlay: document.getElementById('knowledge-overlay'),
  knowledgeTrigger: document.getElementById('knowledge-trigger'),
  knowledgeClose: document.getElementById('knowledge-close')
};

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1920;

function fillSelect(sel, from, to, pad) {
  sel.innerHTML = '';
  for (let i = from; i <= to; i++) {
    const v = pad ? String(i).padStart(2, '0') : String(i);
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = v;
    sel.appendChild(opt);
  }
}

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function adjustDays() {
  const y = parseInt(els.year.value, 10);
  const m = parseInt(els.month.value, 10);
  const max = daysInMonth(y, m);
  const prev = parseInt(els.day.value, 10) || 1;
  els.day.innerHTML = '';
  for (let d = 1; d <= max; d++) {
    const opt = document.createElement('option');
    opt.value = String(d).padStart(2, '0');
    opt.textContent = String(d).padStart(2, '0');
    els.day.appendChild(opt);
  }
  els.day.value = String(Math.min(prev, max)).padStart(2, '0');
}

function populatePickers() {
  fillSelect(els.year, MIN_YEAR, CURRENT_YEAR, false);
  fillSelect(els.month, 1, 12, true);
  fillSelect(els.hour, 0, 23, true);
  fillSelect(els.minute, 0, 59, true);
  adjustDays();
}

function setPickerDefaults() {
  els.year.value = '1990';
  els.month.value = '03';
  adjustDays();
  els.day.value = '15';
  els.hour.value = '14';
  els.minute.value = '30';
}

function openKnowledge() {
  els.knowledge.classList.add('open');
  els.knowledgeOverlay.removeAttribute('hidden');
  els.knowledgeTrigger.setAttribute('hidden', '');
  document.body.classList.add('knowledge-open');
}

function closeKnowledge() {
  els.knowledge.classList.remove('open');
  els.knowledgeOverlay.setAttribute('hidden', '');
  els.knowledgeTrigger.removeAttribute('hidden');
  document.body.classList.remove('knowledge-open');
}

function readInputs() {
  const y = els.year.value, m = els.month.value, d = els.day.value;
  const hh = els.hour.value, mm = els.minute.value;
  state.date = `${y}-${m}-${d}`;
  state.time = `${hh}:${mm}`;
  state.gender = els.gender.value || state.gender;
  state.longitude = parseFloat(els.longitude.value) || 120;
}

function updateUI() {
  readInputs();
  const chart = computeChart(state);
  els.pillars.innerHTML = renderPillars(chart);
  els.layers.innerHTML = renderLayers(chart);
  bindToggles(els.layers);
  bindTermClicks(els.layers, term => { renderKnowledge(term); openKnowledge(); });
  bindTermClicks(els.pillars, term => { renderKnowledge(term); openKnowledge(); });
  window.__lastChart = chart;
}

els.calc.addEventListener('click', updateUI);

els.knowledgeTrigger.addEventListener('click', openKnowledge);
els.knowledgeClose.addEventListener('click', closeKnowledge);
els.knowledgeOverlay.addEventListener('click', closeKnowledge);

els.expand.addEventListener('click', () => {
  const all = els.layers.querySelectorAll('.derivation');
  const anyHidden = Array.from(all).some(d => d.hasAttribute('hidden'));
  all.forEach(d => {
    d.toggleAttribute('hidden', !anyHidden);
  });
  els.layers.querySelectorAll('.toggle-derivation').forEach(btn => {
    btn.textContent = anyHidden ? '收起推导' : '展开推导';
    btn.setAttribute('aria-expanded', String(anyHidden));
  });
});

document.querySelectorAll('.example').forEach(btn => {
  btn.addEventListener('click', () => {
    const [yy, mm, dd] = btn.dataset.date.split('-');
    const [hh, mi] = btn.dataset.time.split(':');
    els.year.value = yy;
    els.month.value = mm;
    adjustDays();
    els.day.value = dd;
    els.hour.value = hh;
    els.minute.value = mi;
    els.gender.value = btn.dataset.gender;
    els.longitude.value = btn.dataset.lon;
    updateUI();
  });
});

// Initialize
populatePickers();
els.year.addEventListener('change', adjustDays);
els.month.addEventListener('change', adjustDays);
setPickerDefaults();
updateUI();
setDefaultKnowledge();
closeKnowledge();
