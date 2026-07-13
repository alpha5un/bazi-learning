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
  date: document.getElementById('inp-date'),
  time: document.getElementById('inp-time'),
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
  state.date = els.date.value || state.date;
  state.time = els.time.value || state.time;
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
    els.date.value = btn.dataset.date;
    els.time.value = btn.dataset.time;
    els.gender.value = btn.dataset.gender;
    els.longitude.value = btn.dataset.lon;
    updateUI();
  });
});

// Initialize with default
updateUI();
setDefaultKnowledge();
closeKnowledge();
