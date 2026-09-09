/* ==========================================================================
   记事本 — Notepad
   ==========================================================================
   它就是玩家这台电脑上自带的一个普通记事本，仅此而已。
   - 玩家自己想记什么就记什么
   - 文本持久保存（state.playerNote，向后兼容增量字段）
   - 游戏不读取、不分析、不根据内容触发任何东西
   ========================================================================== */

export const meta = { id: 'desk', no: '', label: '记事本' };

export function render() {
  return `<textarea class="notepad-area" id="notepad-area"
    spellcheck="false" autocomplete="off" aria-label="记事本"></textarea>`;
}

export function mount(root, ctx) {
  const ta = root.querySelector('#notepad-area');
  if (!ta) return;
  ta.value = ctx.state().playerNote || '';

  let timer = null;
  ta.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      ctx.setState({ playerNote: ta.value });
    }, 400);
  });
}
