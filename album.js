/* ==========================================================================
   相册 — 一次只看一张照片（主控匆忙拍下的两张值班表）
   ==========================================================================
   - 竖版 3:4，翻拍质感：略歪、光线不均、画面里有墙面/文件柜/桌角
   - 左右箭头切换，底部 1 / 2；不显示文件名、不显示"图片收藏"
   - 解锁：flags.photoSaved
   ========================================================================== */

export const meta = { id: 'album', no: '005', label: '相册', need: 'photoSaved' };

const PHOTOS = [
  {
    cls: 'photo--a',
    sheet: [
      ['标题', '校医室值班安排'],
      ['月份', '2026 年 3 月'],
      ['周一 · 周三', '钱锟'],
      ['周二 · 周四', '周慧'],
      ['周五', '郑立群'],
      ['备注', '夜间值班由当日医生负责'],
    ],
  },
  {
    cls: 'photo--b',
    sheet: [
      ['标题', '校医室值班安排'],
      ['月份', '2015 年 12 月'],
      ['周一 · 周四', '肖俊'],
      ['周二 · 周五', '吴国栋'],
      ['周三', '马桂芳'],
      ['备注', '期末周夜间加岗'],
    ],
  },
];

function photoCard(p, i) {
  return `
  <div class="photo-card ${p.cls} ${i === 0 ? 'is-current' : ''}" data-photo="${i}">
    <div class="pc-scene">
      <div class="pc-wall"></div>
      <div class="pc-cabinet"></div>
      <div class="pc-desk"></div>
      <div class="pc-sheet">
        <table class="duty-sheet">
          ${p.sheet.map(r => `<tr><th>${r[0]}</th><td>${r[1]}</td></tr>`).join('')}
        </table>
      </div>
      <div class="pc-vignette"></div>
    </div>
    <div class="pc-crease"></div>
  </div>`;
}

export function render() {
  return `
  <div class="ow-page">
    <div class="album" role="application" aria-label="相册">
      <div class="album__bar"><span>相册</span></div>
      <div class="album__stage">
        <button class="album__nav" id="album-prev" type="button" aria-label="上一张">‹</button>
        <div class="album__viewer">
          ${PHOTOS.map(photoCard).join('')}
        </div>
        <button class="album__nav" id="album-next" type="button" aria-label="下一张">›</button>
      </div>
      <div class="album__pager" id="album-pager">1 / ${PHOTOS.length}</div>
    </div>
  </div>`;
}

export function mount(root) {
  const cards = [...root.querySelectorAll('[data-photo]')];
  const pager = root.querySelector('#album-pager');
  const prev = root.querySelector('#album-prev');
  const next = root.querySelector('#album-next');
  let idx = 0;

  function show() {
    cards.forEach((c, i) => c.classList.toggle('is-current', i === idx));
    pager.textContent = `${idx + 1} / ${cards.length}`;
    prev.disabled = idx === 0;
    next.disabled = idx === cards.length - 1;
  }
  prev.addEventListener('click', () => { if (idx > 0) { idx--; show(); } });
  next.addEventListener('click', () => { if (idx < cards.length - 1) { idx++; show(); } });
  show();
}
