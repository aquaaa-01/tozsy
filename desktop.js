/* ==========================================================================
   DESKTOP — 千禧年电脑桌面（外层环境）
   ==========================================================================
   桌面本体：壁纸 + 四个程序图标。任务栏 / 开始菜单 / 错误弹窗在 app 层。
   程序能否打开由 app 的 canOpen() 决定，桌面只负责点击转发。
   ========================================================================== */

export const meta = { id: 'desktop', no: '', label: '桌面' };

const ICONS = [
  { id: 'medical', label: 'Word 2003', ic: 'W' },
  { id: 'web',     label: '青搜',      ic: '青' },
  { id: 'vv',      label: 'VV',        ic: 'V' },
  { id: 'desk',    label: '记事本',    ic: '<small>017</small>' },
  { id: 'album',   label: '相册',      ic: '相', cls: 'ic-album' },
];

export function render() {
  return `
  <div class="desktop">
    <div class="desktop__cloud c1"></div>
    <div class="desktop__cloud c2"></div>
    <div class="desktop__cloud c3"></div>
    <div class="desktop__cloud c4"></div>
    <div class="desktop__cloud c5"></div>
    <div class="desktop__hill"></div>
    <div class="desktop__hill2"></div>

    <div class="desktop__icons">
      ${ICONS.map(ic => `
        <div class="dicon" data-app="${ic.id}" role="button" tabindex="0"
             aria-label="${ic.label}">
          <div class="dicon__img ${ic.cls || ('ic-' + (ic.id === 'medical' ? 'word' : ic.id === 'web' ? 'qs' : ic.id === 'vv' ? 'vv' : 'folder'))}">${ic.ic}</div>
          <span class="dicon__lbl">${ic.label}</span>
        </div>`).join('')}
    </div>
  </div>`;
}

export function mount(root, ctx) {
  root.addEventListener('click', (e) => {
    const ic = e.target.closest('[data-app]');
    if (ic) ctx.openWindow(ic.dataset.app);
  });
}
