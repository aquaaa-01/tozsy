/* ==========================================================================
   STORY — 叙事场景引擎（近黑全屏 · 记忆回放）
   ==========================================================================
   点击推进：每点一次出现一条 beat，全部出现后再点 → 完成回调。
   不做跳过按钮，节奏就是叙事。
   ========================================================================== */

import { SCENES } from '../data/scenes.js';

export const meta = { id: 'story', no: '', label: '' };

let state = null;   // { chain, idx, sceneIdx, onDone }
let rootEl = null;

function sceneHTML(head) {
  return `
  <div class="story" role="group" aria-label="剧情场景">
    <header class="story__head">
      <span>${head.no}</span>
      <span>${head.time}</span>
      <span>${head.place}</span>
    </header>
    <div class="story__body"></div>
    <footer class="story__foot">点击继续 ▸</footer>
  </div>`;
}

export function play(root, chain, onDone) {
  rootEl = root;
  state = { chain, sceneIdx: 0, beatIdx: 0, onDone };
  root.innerHTML = sceneHTML(SCENES[chain[0]]);
  next();
}

function next() {
  const chain = state.chain;
  const scene = SCENES[chain[state.sceneIdx]];
  const body = rootEl.querySelector('.story__body');

  if (state.beatIdx < scene.beats.length) {
    const b = scene.beats[state.beatIdx++];
    const el = document.createElement('div');
    el.className = 'story__beat ' + (b.t === 'd' ? 'is-dial' : 'is-narr') + (b.who === '我' ? ' is-me' : '');
    el.innerHTML = b.t === 'd'
      ? `<span class="who">${b.who}：</span>${b.x}`
      : b.x;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return;
  }

  // 本场景播完 → 下一个场景或结束
  state.sceneIdx++;
  if (state.sceneIdx < chain.length) {
    state.beatIdx = 0;
    // 场景切换：淡出重建
    rootEl.querySelector('.story').style.transition = 'opacity 300ms';
    rootEl.querySelector('.story').style.opacity = '0';
    setTimeout(() => {
      rootEl.innerHTML = sceneHTML(SCENES[chain[state.sceneIdx]]);
      next();
    }, 320);
  } else {
    const done = state.onDone;
    state = null;
    rootEl.innerHTML = '';
    done?.();
  }
}

export function mount(root, ctx) {
  root.addEventListener('click', () => { if (state) next(); });
  root.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && state) { e.preventDefault(); next(); }
  });
}
