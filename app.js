/* ==========================================================================
   App v7.0 — 多窗口管理器 · Y2K 电脑
   ==========================================================================
   所有应用（Word / 青搜 / 记事本 / VV）都是桌面上的浮动窗口：
   - 可并存、可拖动、可缩放（右下角手柄）、可最小化、可关闭
   - 点击窗口 = 置顶（z 管理）
   - 任务栏 = 打开中的窗口列表，点击 最小化/恢复
   - 桌面壁纸（#app 层）永远可见

   开场状态机（flags，不变）：
   (无) → medicalRead → blogFavorited / blogCloseHintShown →
   vvNotified → vvAnswered → 全部自由
   ========================================================================== */

import * as desktop from './pages/desktop.js';
import * as medical from './pages/medical.js';
import * as vv      from './pages/vv.js';
import * as web     from './pages/web.js';
import * as desk    from './pages/desk.js';
import * as album   from './pages/album.js';
import { load, save } from './state.js';

const APP_TITLES = {
  medical: 'Microsoft Word 2003 — 患者诊疗记录.doc',
  web:     '青搜浏览器',
  desk:    '记事本',
  vv:      'VV',
  album:   '相册',
};
const APP_MENUS = {
  medical: ['文件(F)', '编辑(E)', '视图(V)', '插入(I)', '格式(O)', '工具(T)', '表格(A)', '窗口(W)', '帮助(H)'],
  desk:    ['文件(F)', '编辑(E)', '格式(O)', '查看(V)', '帮助(H)'],
};
const APP_TOOLBARS = {
  medical: ['新建', '打开', '保存', '|', '打印', '|', '剪切', '复制', '粘贴', '|', '撤销', '|', '100%', '|', '帮助'],
};

/* 窗口默认尺寸与初始位置（比例） */
const WIN_SPEC = {
  medical: { w: 940, h: 680, fx: 0.5, fy: 0.42 },
  web:     { w: 1080, h: 820, fx: 0.5, fy: 0.40 },
  desk:    { w: 620, h: 460, fx: 0.38, fy: 0.52 },
  vv:      { w: 500, h: 430, fx: 0.5, fy: 0.46 },
  album:   { w: 640, h: 560, fx: 0.5, fy: 0.44 },
};

const LOCK_MSG = {
  web:   ['青搜', '无法启动应用程序。', '请稍后再试。'],
  vv:    ['VV', '当前无法启动。'],
  desk:  ['记事本', '文件暂时无法访问。'],
  album: ['相册', '暂无照片。'],
};

const LOCK_PASS = '20190117';

let S = null;
let app, taskbarEl, startmenuEl, sysdlgEl;
let clockTimer = null;
let zTop = 500;
const wins = {};              // id → { open, min, z }
let vvAutoNav = false;        // VV 弹出自动定位会话时抑制"已读"判定
let huangVv2Timer = null;     // 钥匙剧情：7-10s 延迟定时器

function scheduleHuangVv2(delay) {
  clearTimeout(huangVv2Timer);
  huangVv2Timer = setTimeout(() => {
    const f = S.flags || {};
    if (!f.forumKeyTriggered || f.huangVv2Sent) return;
    ctx.setState({ flags: { ...f, huangVv2Sent: 1 } });
  }, delay);
}

/* ---------------- 解锁状态机 ---------------- */
function canOpen(id) {
  const f = S.flags || {};
  switch (id) {
    case 'medical': return true;
    case 'web':     return !!f.medicalRead;
    case 'vv':      return !!f.vvNotified;
    case 'desk':    return !!f.vvAnswered;
    case 'album':   return !!f.photoSaved;
    default:        return false;
  }
}

/* ---------------- 上下文 ---------------- */
const ctx = {
  state: () => S,
  setState(patch) {
    const prevF = S.flags || {};
    const prevR = S.readPosts || {};
    const wasNotified = !!prevF.vvNotified;
    return save(patch).then(next => {
      S = next;
      const f = next.flags || {};
      const nR = next.readPosts || {};
      if (!wasNotified && f.vvNotified && !isWinOpen('vv')) {
        openWindow('vv', { pop: true });
      }
      /* 钥匙剧情：论坛搜"钥匙"/打开旧帖 → 随机 7-10 秒后黄冠亨发来消息 */
      if (!prevF.forumKeyTriggered && f.forumKeyTriggered && !f.huangVv2Sent) {
        scheduleHuangVv2(7000 + Math.random() * 3000);
      }
      /* 消息到达：弹出 VV（可拖动/最小化/关闭，不阻塞页面） */
      if (!prevF.huangVv2Sent && f.huangVv2Sent) {
        if (isWinOpen('vv')) focusWindow('vv');
        else openWindow('vv', { pop: true });
      }
      /* 博客解锁上升沿 → 博客标签明显闪动（不切换不弹窗）：
         d2 = 第一天调查节点（寻人帖/主搜李永钦）；d3 = 主控答应陪黄冠亨去后勤 */
      const d2uPrev = !!(prevR.t2001 || prevF.day1Searched);
      const d2uNow = !!(nR.t2001 || f.day1Searched);
      if (!d2uPrev && d2uNow && isWinOpen('web')) web.blinkBlogTab?.();
      if (!prevF.vv2Done && f.vv2Done && isWinOpen('web')) web.blinkBlogTab?.();
      renderTaskbar();
      return next;
    });
  },
  openWindow,
  focusWindow,
};

/* ---------------- 窗口管理 ---------------- */
const winEl = (id) => app.querySelector(`[data-win="${id}"]`);
const isWinOpen = (id) => !!(wins[id] && wins[id].open && !wins[id].min);
const isWinPresent = (id) => !!(wins[id] && wins[id].open);

function placeWindow(id) {
  const el = winEl(id);
  if (el.style.left) return;                       // 已有位置（含拖动/缩放后的）
  const spec = WIN_SPEC[id];
  const w = Math.min(spec.w, innerWidth * 0.94);
  const h = Math.min(spec.h, (innerHeight - 30) * 0.9);
  el.style.width = w + 'px';
  el.style.height = h + 'px';
  el.style.left = Math.max(4, (innerWidth - w) * spec.fx) + 'px';
  el.style.top = Math.max(4, (innerHeight - 30 - h) * Math.min(spec.fy, 0.6)) + 'px';
}

function openWindow(id, { pop = false } = {}) {
  if (!canOpen(id)) { showErrorDlg(id); return; }
  if (!wins[id]) wins[id] = { open: false, min: false, z: 0 };
  const w = wins[id];
  w.open = true;
  w.min = false;
  w.z = ++zTop;
  placeWindow(id);
  const el = winEl(id);
  el.hidden = false;
  el.style.zIndex = w.z;
  if (id === 'web') {
    const f = S.flags || {};
    app.querySelector('#sessdlg').hidden = !(f.medicalRead && !f.blogRestored);
    /* 有已解锁未读的博客（第二天/第三天）：错过提示后，第一次主动打开青搜 → 直达博客（仅一次） */
    const d2u = !!((S.readPosts || {}).t2001 || f.day1Searched);
    const needBlogHint = (d2u && !f.blogDay2Read) || (f.vv2Done && !f.blogDay3Read);
    if (needBlogHint) web.goto?.('blog');
  }
  renderTaskbar();
  hideStart();
  if (id === 'vv') {
    if (pop) {
      el.classList.remove('shake');
      el.classList.add('pop');
      setTimeout(() => { el.classList.remove('pop'); el.classList.add('shake'); }, 220);
      setTimeout(() => el.classList.remove('shake'), 1700);
    }
    if (el.querySelector('.vv-chat') && !el.querySelector('.vv-contact.is-active')) {
      vvAutoNav = true;
      vv.openHuang?.();
    }
  }
}

function toggleMaxWindow(id) {
  if (!wins[id]) return;
  const el = winEl(id);
  if (wins[id].max) {
    Object.assign(el.style, wins[id].prevRect);
    wins[id].max = false;
  } else {
    wins[id].prevRect = { left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height };
    Object.assign(el.style, { left: '0px', top: '0px', width: innerWidth + 'px', height: (innerHeight - 30) + 'px' });
    wins[id].max = true;
  }
}

function minimizeWindow(id) {
  if (!wins[id]) return;
  wins[id].min = true;
  winEl(id).hidden = true;
  renderTaskbar();
}

function closeWindow(id) {
  if (!wins[id]) return;
  wins[id].open = false;
  wins[id].min = false;
  winEl(id).hidden = true;
  renderTaskbar();
}

function focusWindow(id) {
  if (!wins[id]) return;
  wins[id].z = ++zTop;
  winEl(id).style.zIndex = wins[id].z;
  if (wins[id].min) { wins[id].min = false; winEl(id).hidden = false; }
  renderTaskbar();
}

function toggleWindow(id) {
  if (!wins[id] || !wins[id].open) { openWindow(id); return; }
  if (wins[id].min) { focusWindow(id); return; }
  minimizeWindow(id);
}

/* ---------------- 上下文对话框 ---------------- */
function showErrorDlg(id) {
  const [title, l1, l2] = LOCK_MSG[id] || ['系统', '无法启动。'];
  sysdlgEl.innerHTML = `
    <div class="sysdlg__win" role="alertdialog" aria-label="${title}">
      <div class="sysdlg__bar"><span class="t">${title}</span><span class="x" data-dlg-close>×</span></div>
      <div class="sysdlg__body">
        <div class="sysdlg__icon">×</div>
        <div class="sysdlg__msg"><b>${title}</b>${l1}${l2 ? '<br>' + l2 : ''}</div>
      </div>
      <div class="sysdlg__btns"><button class="ow-btn" type="button" data-dlg-close>确定</button></div>
    </div>`;
  sysdlgEl.hidden = false;
}

/* 博客首次关闭：浏览器行为提示（仅在博客已成功进入收藏夹时） */
function maybeBlogCloseHint() {
  if (S.flags?.blogCloseHintShown) return false;
  if (!S.flags?.blogFavorited) return false;       // 未收藏成功 → 不提示
  if (!web.isBlogShowing?.()) return false;
  sysdlgEl.innerHTML = `
    <div class="sysdlg__win" role="dialog" aria-label="青搜浏览器">
      <div class="sysdlg__bar"><span class="t">青搜浏览器</span><span class="x" data-blogdlg-cancel>×</span></div>
      <div class="sysdlg__body">
        <div class="sysdlg__msg"><b>要关闭此页面吗？</b>稍后可以在收藏夹再次访问。</div>
      </div>
      <div class="sysdlg__btns">
        <button class="ow-btn" type="button" data-blogdlg-cancel>取消</button>
        <button class="ow-btn" type="button" data-blogdlg-ok>关闭</button>
      </div>
    </div>`;
  sysdlgEl.hidden = false;
  return true;
}

/* ---------------- 任务栏 ---------------- */
function taskLabel(id) { return APP_TITLES[id] || id; }

function renderTaskbar() {
  const f = S.flags || {};
  const openIds = Object.keys(wins).filter(id => wins[id].open);
  const vvUnread = (!!f.vvNotified && !f.vvAnswered) || (!!f.huangVv2Sent && !f.vv2Done);
  const ids = [...openIds];
  if (vvUnread && !ids.includes('vv')) ids.push('vv');
  taskbarEl.innerHTML = `
    <div class="taskbar__start" data-start>开始</div>
    <div class="taskbar__tasks">
      ${ids.map(id => {
        const w = wins[id] || { min: true };
        const unread = id === 'vv' && vvUnread && (!isWinPresent('vv') || wins.vv.min);
        return `<span class="taskbar__task ${w.min ? '' : 'is-down'}" data-task="${id}">
          ${taskLabel(id)}${unread ? ' 1' : ''}</span>`;
      }).join('')}
    </div>
    <div class="taskbar__tray">
      <span class="tray-vv ${f.vvNotified ? 'on' : ''} ${vvUnread ? 'blink' : ''}" data-tray-vv
            title="VV"><span class="tray-vv__ic">V</span>QQ${vvUnread ? '<span class="tray-vv__n">1</span>' : ''}</span>
      <span class="taskbar__clock">${clockText()}</span>
    </div>`;
}

function clockText() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/* ---------------- 开始菜单 ---------------- */
const START_ITEMS = [
  { id: 'medical', label: 'Word 2003', ic: 'W', cls: 'ic-word' },
  { id: 'web',     label: '青搜',      ic: '青', cls: 'ic-qs' },
  { id: 'vv',      label: 'VV',        ic: 'V', cls: 'ic-vv' },
  { id: 'desk',    label: '记事本',    ic: '017', cls: 'ic-folder' },
  { id: 'album',   label: '相册',      ic: '相',  cls: 'ic-album' },
];

function renderStart() {
  startmenuEl.innerHTML = `
    <div class="startmenu__head">神威高中 · 校园机</div>
    ${START_ITEMS.map(it => `
      <div class="startmenu__item ${canOpen(it.id) ? '' : 'is-dim'}" data-startapp="${it.id}">
        <span class="mi ${it.cls}">${it.ic}</span>${it.label}
      </div>`).join('')}`;
}

function hideStart() { startmenuEl.hidden = true; }
function toggleStart() {
  if (startmenuEl.hidden) { renderStart(); startmenuEl.hidden = false; }
  else hideStart();
}

/* ---------------- 拖动 / 缩放 ---------------- */
function makeDraggable(el, bar) {
  bar.addEventListener('pointerdown', (e) => {
    if (e.target.closest('[data-win-close]') || e.target.closest('[data-win-min]')) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - r.left, dy = e.clientY - r.top;
    el.style.left = r.left + 'px';
    el.style.top = r.top + 'px';
    el.style.transform = 'none';
    const move = (ev) => {
      el.style.left = Math.max(-40, ev.clientX - dx) + 'px';
      el.style.top = Math.max(0, ev.clientY - dy) + 'px';
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  });
}

function makeResizable(el) {
  const h = document.createElement('div');
  h.className = 'win-rz';
  el.appendChild(h);
  h.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    const r = el.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const sw = r.width, sh = r.height;
    const move = (ev) => {
      el.style.width = Math.max(340, sw + ev.clientX - sx) + 'px';
      el.style.height = Math.max(240, sh + ev.clientY - sy) + 'px';
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  });
}

/* ---------------- 窗口 DOM ---------------- */
function windowHTML(id) {
  const title = APP_TITLES[id];
  const menu = APP_MENUS[id];
  const toolbar = APP_TOOLBARS[id];
  const ic = id === 'medical' ? 'W' : id === 'desk' ? '0' : id === 'album' ? '相' : id === 'vv'
    ? '<span style="display:grid;place-items:center;width:100%;height:100%;background:linear-gradient(180deg,#4FA84F,#2A702A);color:#FFF;">V</span>'
    : '<span style="display:grid;place-items:center;width:100%;height:100%;background:linear-gradient(180deg,#4A6C94,#33567C);color:#FFF;">青</span>';
  let body = '';
  if (id === 'medical') body = medical.render(ctx);
  else if (id === 'web') body = web.render();
  else if (id === 'vv') body = vv.render(ctx);
  else if (id === 'desk') body = desk.render();
  else if (id === 'album') body = album.render();
  return `
  <div class="window ${id === 'vv' ? 'vvwin' : 'appwin'}" data-win="${id}" hidden>
    <div class="appwin__bar">
      <span class="appwin__ic">${ic}</span>
      <span class="appwin__title">${title}</span>
      <span class="appwin__btns">
        ${id === 'vv' ? `<span data-win-max data-win-id="${id}" style="cursor:pointer;">□</span>` : ''}
        <span data-win-min data-win-id="${id}" style="cursor:pointer;">─</span>
        <span class="appwin__close" data-win-close data-win-id="${id}" style="cursor:pointer;font-weight:700;">×</span>
      </span>
    </div>
    ${menu ? `<div class="appwin__menu">${menu.map(m => `<span>${m}</span>`).join('')}</div>` : ''}
    ${toolbar ? `<div class="appwin__toolbar">${toolbar.map(t => `<span class="tb${t === '|' ? ' tb-sep' : ''}">${t}</span>`).join('')}</div>` : ''}
    <div class="appwin__body">${body}</div>
    ${id === 'medical' ? `<div class="appwin__status">第 1 页，共 1 页</div>` : ''}
  </div>`;
}

/* ---------------- 装配 ---------------- */
function build() {
  app.innerHTML = `
    <div class="desktop-root">${desktop.render()}</div>
    ${windowHTML('medical')}
    <div class="window" data-win="web" hidden>${web.render()}</div>
    ${windowHTML('desk')}
    ${windowHTML('vv')}
    ${windowHTML('album')}
    <div class="taskbar" id="taskbar"></div>
    <div class="startmenu" id="startmenu" hidden></div>
    <div class="sysdlg" id="sysdlg" hidden></div>
    <div class="lockscr" id="lockscr">
      <div class="lockscr__topbar"><span>神威高中 · 校园机</span></div>
      <div class="lockscr__mid">
        <div class="lockscr__welcome">欢迎使用</div>
        <div class="lockscr__user">
          <div class="lockscr__ava">01</div>
          <div class="lockscr__uname">用户 01</div>
          <div class="lockscr__row">
            <span>密码</span>
            <input class="lockscr__pw" id="lock-pw" type="password" maxlength="8"
                   autocomplete="off" spellcheck="false" aria-label="密码">
            <button class="lockscr__enter" id="lock-enter" type="button" aria-label="登录">→</button>
          </div>
          <div class="lockscr__err" id="lock-err"></div>
        </div>
      </div>
      <div class="lockscr__help">需要帮助登录？</div>
      <div class="lockscr__sys">Last system initialization: 19 / 01 / 17</div>
      <div class="lockscr__botbar"></div>
    </div>
  `;
  taskbarEl = app.querySelector('#taskbar');
  startmenuEl = app.querySelector('#startmenu');
  sysdlgEl = app.querySelector('#sysdlg');

  desktop.mount(app.querySelector('.desktop-root'), ctx);
  medical.mount(winEl('medical').querySelector('.appwin__body'), ctx);
  desk.mount(winEl('desk').querySelector('.appwin__body'), ctx);
  vv.mount(winEl('vv').querySelector('.appwin__body'), ctx);
  album.mount(winEl('album').querySelector('.appwin__body'));
  web.mount(winEl('web'), ctx);

  makeDraggable(winEl('medical'), winEl('medical').querySelector('.appwin__bar'));
  makeDraggable(winEl('desk'), winEl('desk').querySelector('.appwin__bar'));
  makeDraggable(winEl('web'), winEl('web').querySelector('.bw-titlebar'));
  makeDraggable(winEl('vv'), winEl('vv').querySelector('.appwin__bar'));
  makeDraggable(winEl('album'), winEl('album').querySelector('.appwin__bar'));
  makeResizable(winEl('medical'));
  makeResizable(winEl('desk'));
  makeResizable(winEl('web'));
  makeResizable(winEl('album'));

  /* 窗口点击置顶 */
  ['medical', 'web', 'desk', 'vv', 'album'].forEach(id => {
    winEl(id).addEventListener('pointerdown', () => focusWindow(id));
  });

  app.addEventListener('click', (e) => {
    /* VV：窗口内首次主动交互 = 已读（弹出时的自动定位不算） */
    if (vvAutoNav) { vvAutoNav = false; }
    else if (!S.flags?.vvAnswered && S.flags?.vvNotified && e.target.closest('[data-win="vv"] .appwin__body')) {
      ctx.setState({ flags: { ...S.flags, vvAnswered: 1 }, progress: 'p2', day: 2 });
    }

    if (e.target.closest('[data-dlg-close]')) { sysdlgEl.hidden = true; return; }
    if (e.target.closest('#lock-enter')) { tryUnlock(); return; }
    if (e.target.closest('[data-blogdlg-cancel]')) { sysdlgEl.hidden = true; return; }
    if (e.target.closest('[data-blogdlg-ok]')) {
      ctx.setState({ flags: { ...S.flags, blogCloseHintShown: 1 } });
      sysdlgEl.hidden = true;
      closeWindow('web');
      return;
    }
    if (e.target.closest('[data-win-max]')) {
      toggleMaxWindow(e.target.closest('[data-win-max]').dataset.winId);
      return;
    }
    if (e.target.closest('[data-win-min]')) {
      minimizeWindow(e.target.closest('[data-win-min]').dataset.winId);
      return;
    }
    if (e.target.closest('[data-win-close]')) {
      const id = e.target.closest('[data-win-close]').dataset.winId;
      if (id === 'web' && maybeBlogCloseHint()) return;   // 已收藏的博客首次关闭 → 浏览器提示
      closeWindow(id);
      return;
    }
    if (e.target.closest('[data-start]')) { toggleStart(); return; }
    if (e.target.closest('[data-tray-vv]')) { hideStart(); toggleWindow('vv'); return; }
    const task = e.target.closest('[data-task]');
    if (task) {
      hideStart();
      const id = task.dataset.task;
      if (wins[id] && wins[id].open && !wins[id].min) minimizeWindow(id);
      else openWindow(id);
      return;
    }
    const sa = e.target.closest('[data-startapp]');
    if (sa) { hideStart(); openWindow(sa.dataset.startapp); return; }
    /* 收藏夹 */
    if (e.target.closest('[data-favmenu]')) {
      const m = app.querySelector('#bw-favmenu');
      const bms = S.bookmarks || [];
      m.innerHTML = bms.length
        ? bms.map(b => `<div class="favitem" data-favopen="${b.key}">★ ${b.title}</div>`).join('')
        : `<div class="favitem is-empty">（空）</div>`;
      m.hidden = !m.hidden;
      return;
    }
    if (e.target.closest('[data-favopen]')) {
      app.querySelector('#bw-favmenu').hidden = true;
      openWindow('web');
      focusWindow('web');
      web.goto?.(e.target.closest('[data-favopen]').dataset.favopen);
      return;
    }
    if (!e.target.closest('#bw-favmenu') && !e.target.closest('[data-favmenu]')) {
      const fm = app.querySelector('#bw-favmenu');
      if (fm && !fm.hidden) fm.hidden = true;
    }
  });

  /* 锁屏 Enter */
  app.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    if (e.target.id === 'lock-pw') { e.preventDefault(); tryUnlock(); }
  });

  clockTimer = setInterval(renderTaskbar, 30000);
}

/* ---------------- 锁屏 ---------------- */
function tryUnlock() {
  const pw = app.querySelector('#lock-pw');
  const err = app.querySelector('#lock-err');
  if (pw.value === LOCK_PASS) {
    err.textContent = '正在登录...';
    err.className = 'lockscr__err is-ok';
    setTimeout(() => {
      const ls = app.querySelector('#lockscr');
      ls.classList.add('is-off');
      setTimeout(() => ls.remove(), 450);
    }, 850);
  } else {
    err.textContent = '密码不正确，请再试一次。';
    err.className = 'lockscr__err is-bad';
    pw.value = '';
    pw.focus();
  }
}

/* ---------------- 启动 ---------------- */
async function init() {
  window.__bootId = Math.random().toString(36).slice(2, 8);
  app = document.getElementById('app');
  S = await load();

  if (S.flags?.forumKeyTriggered && !S.flags?.huangVv2Sent) {
    scheduleHuangVv2(2500 + Math.random() * 3500);   // 等待中刷新：重新补发，不重复
  }

  if (S.progress === 'p1' && !S.flags?.medicalRead) {
    S.flags = { ...(S.flags || {}), medicalRead: 1, blogRestored: 1, blogFavorited: 1, blogCloseHintShown: 1, vvNotified: 1, vvAnswered: 1 };
    await save({ flags: S.flags });
  }

  build();
  renderTaskbar();

  app.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    if (e.target.id === 'lock-pw') { e.preventDefault(); tryUnlock(); }
  });
  app.querySelector('#lock-pw')?.focus();
}

init();
