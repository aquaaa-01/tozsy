/* ==========================================================================
   003 — VV · 即时通讯
   ==========================================================================
   "我与别人交流"。私人通讯记录，不承担世界观解释。
   - 黄冠亨：少量自然消息 + 主角快捷回复（对话树，路径存 flags.vvPath）
   - 小花：5 小时前主角发的两条消息，未读、无回复、离线
   - 查找联系人：只查找【已有好友】（黄冠亨/小花），搜不到陌生人
   - ＋添加好友：陌生人入口 → 输入 VV 号 → 陌生人资料卡（仅基本资料）
     → 资料卡上的【VV空间 ＞】二级入口 → 空间（非好友仅最近三条动态）
   - 好友申请状态存 flags.vvFriendReqSent（持久化；发送≠通过，权限不变）
   ========================================================================== */

import { VV_CONTACTS, VV_DIALOG, VV_DIALOG2, VV_SPACE, vvOptionsFor, vv2OptionsFor } from '../data/web.js';

export const meta = { id: 'vv', no: '003', label: 'VV', need: 'p1' };

const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let addFound = false;         // 添加好友页：当前搜索结果（返回空间后保留资料卡）

export function render(ctx) {
  return `
  <div class="ow-page">
    <div class="vv" role="application" aria-label="VV 即时通讯">

      <aside class="vv-contacts">
        <div class="vv-me">
          <div class="vv-avatar">我</div>
          <div>
            <div class="vv__nick">（未设置昵称）</div>
            <div class="vv__sign">—</div>
          </div>
        </div>
        <div class="vv-search"><input class="ow-input" type="text" placeholder="查找联系人..." aria-label="查找联系人"></div>
        <div class="vv-addrow">
          <button class="ow-btn vv-miniadd" type="button" data-open-addfriend>＋ 添加好友</button>
        </div>
        <div id="vv-contact-note" class="vv-contact-note" hidden></div>
        <div class="vv-groups">
          <div class="vv-group__name">我的好友 (2/2)</div>
          ${VV_CONTACTS.map(c => `
            <div class="vv-contact ${c.online ? '' : 'is-offline'}" data-contact="${c.id}"
                 role="button" tabindex="0" aria-label="${c.name} ${c.online ? '在线' : '离线'}">
              <div class="vv-avatar ${c.online ? '' : 'is-off'}">${c.char}</div>
              <div>
                <div class="vv__nick">
                  <span class="vv-dot ${c.online ? 'is-on' : 'is-off'}" aria-hidden="true"></span>
                  ${c.name}
                </div>
                <div class="vv__msg">${lastPreview(c, ctx)}</div>
              </div>
              <span class="vv-presence ${c.online ? 'is-on' : ''}">${c.presence}</span>
            </div>
          `).join('')}
          <div class="vv-group__name" style="margin-top:10px;">陌生人 (0)</div>
          <div class="vv-group__name">黑名单 (0)</div>
        </div>
      </aside>

      <section class="vv-chat" id="vv-chat">
        <div style="flex:1;display:grid;place-items:center;color:#9AA1AA;font-size:12px;">
          <p>选择一位联系人查看消息记录</p>
        </div>
      </section>

    </div>
  </div>`;
}

function pathOf(ctx) { return ctx.state().flags?.vvPath || []; }
function pathOf2(ctx) { return ctx.state().flags?.vv2Path || []; }

function dialogMessages(path, path2, flags) {
  const base = VV_CONTACTS.find(c => c.id === 'huang');
  const all = [...base.messages];
  for (const step of path) {
    const d = VV_DIALOG[step];
    if (!d) continue;
    const lastT = all[all.length - 1]?.time || '20:31';
    all.push({ d: '03/20', time: nextTime(lastT, 1), who: 'me', name: '我', x: d.me });
    d.reply.forEach((r, i) => all.push({ d: '03/20', time: nextTime(lastT, 2 + i), ...r }));
  }
  /* 03/22 中午：黄冠亨约主控去后勤 */
  if (flags?.huangVv2Sent) {
    all.push({ group: '03 / 22' });
    all.push({ d: '03/22', time: '12:32', who: 'huang', name: '黄冠亨', x: '你下午有空吗？' });
    for (const step of (path2 || [])) {
      const d = VV_DIALOG2[step];
      if (!d) continue;
      const lastT = all[all.length - 1]?.time || '12:32';
      all.push({ d: '03/22', time: nextTime(lastT, 1), who: 'me', name: '我', x: d.me });
      d.reply.forEach((r, i) => all.push({ d: '03/22', time: nextTime(lastT, 2 + i), ...r }));
    }
  }
  return all;
}

function nextTime(t, plus) {
  const [h, m] = t.split(':').map(Number);
  const v = h * 60 + m + plus;
  return `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`;
}

function lastPreview(c, ctx) {
  if (c.id === 'huang' && ctx?.state().flags?.huangVv2Sent) return '你下午有空吗？';
  return c.online ? '你回到校医室打针了吗？' : '对方已离线';
}

function chatHTML(c, ctx) {
  const path = c.id === 'huang' ? pathOf(ctx) : [];
  const path2 = c.id === 'huang' ? pathOf2(ctx) : [];
  const msgs = c.id === 'huang' ? dialogMessages(path, path2, ctx.state().flags) : c.messages;
  const day1Opts = c.id === 'huang' ? vvOptionsFor(path) : [];
  const day2Opts = (c.id === 'huang' && ctx.state().flags?.huangVv2Sent) ? vv2OptionsFor(path2) : [];
  const options = [...day1Opts, ...day2Opts];
  void path2;

  return `
    <header class="vv-chat__title">
      <div class="vv-avatar ${c.online ? '' : 'is-off'}" style="width:26px;height:26px;font-size:12px;line-height:24px;">${c.char}</div>
      <div>
        <div class="t">${c.name}</div>
        <div class="s ${c.online ? 'is-on' : ''}">${c.online ? '在线' : '对方已离线'}</div>
      </div>
    </header>
    <div class="vv-chat__hist" id="vv-hist">
      ${msgs.map(m => {
        if (m.group) return `<div class="vv-sysmsg" style="margin-top:16px;"><span>${m.group}</span></div>`;
        if (m.sys) return `<div class="vv-sysmsg"><span>${m.d} ${m.time}　${m.x}</span></div>`;
        const self = m.who === 'me';
        return `
        <div class="vv-msg ${self ? 'is-self' : ''}">
          <div class="vv-avatar ${self ? '' : (c.online ? '' : 'is-off')}">${self ? '我' : c.char}</div>
          <div class="vv-msg__body">
            <div class="vv-msg__head"><span class="nick ${self ? 'is-self' : ''}">${m.name}</span>　${m.d} ${m.time}</div>
            <div class="vv-msg__text">${m.x}</div>
          </div>
        </div>`;
      }).join('')}
    </div>
    ${options.length ? `
    <div class="vv-quickrow" id="vv-quickrow">
      <span class="lbl">快捷回复</span>
      ${day1Opts.map(o => `<button class="ow-btn" type="button" data-vv="${o}">${VV_DIALOG[o].me}</button>`).join('')}
      ${day2Opts.map(o => `<button class="ow-btn" type="button" data-vv2="${o}">${VV_DIALOG2[o].me}</button>`).join('')}
    </div>` : ''}
    <div class="vv-chat__input">
      <div class="vv-chat__tools"><span>字体</span><span>表情</span><span>截图</span><span>消息记录</span></div>
      <div class="vv-chat__editor">暂不支持自由输入 —— 这是保存在本机的消息记录。</div>
      <div class="vv-chat__sendrow">
        <span class="hint">消息记录（只读） · 03 / 20</span>
        <button class="ow-btn" disabled>发送(S)</button>
      </div>
    </div>`;
}

/* ---------------- 添加好友（陌生人入口 · 二级页面） ---------------- */
function addFriendHTML(ctx) {
  const sent = !!ctx.state().flags?.vvFriendReqSent;
  return `
    <header class="vv-chat__title">
      <button class="ow-btn" type="button" data-vv-back style="padding:2px 9px;font-size:11px;" aria-label="返回">←</button>
      <div><div class="t">添加好友</div></div>
    </header>
    <div class="vv-af">
      <div class="vv-af__row">
        <input class="ow-input" id="vv-af-input" type="text" placeholder="请输入VV号或昵称" aria-label="请输入VV号或昵称">
        <button class="ow-btn" type="button" data-af-search>搜索</button>
      </div>
      <div class="vv-af__result" id="vv-af-result">${addFound ? strangerCardHTML(sent) : ''}</div>
    </div>
    <div class="vv-modal" id="vv-modal" hidden>
      <div class="vv-modal__win" role="dialog" aria-label="添加好友">
        <div class="vv-modal__bar">添加好友</div>
        <div class="vv-modal__body">发送好友申请？</div>
        <div class="vv-modal__btns">
          <button class="ow-btn" type="button" data-vv-friend-send>发送申请</button>
        </div>
      </div>
    </div>`;
}

/** 陌生人资料卡：只有基本资料；VV空间是资料卡上的二级入口 */
function strangerCardHTML(sent) {
  return `
    <div class="vv-card">
      <div class="vv-card__head">
        <div class="vv-avatar is-off" style="width:44px;height:44px;font-size:17px;line-height:42px;">K</div>
        <div class="vv-card__info">
          <div class="n">${esc(VV_SPACE.nick)}</div>
          <div class="r">VV号：${esc(VV_SPACE.id)}</div>
          <div class="r">来源：神威高中</div>
          <div class="r">个性签名：${esc(VV_SPACE.sign)}</div>
        </div>
      </div>
      <div class="vv-card__mods">
        <span class="vv-card__mod" data-open-space role="button" tabindex="0">VV空间 ＞</span>
        ${sent
          ? '<span class="vv-card__mod is-done">好友申请已发送</span>'
          : '<span class="vv-card__mod is-act" data-vv-addfriend role="button" tabindex="0">＋ 添加好友</span>'}
      </div>
    </div>`;
}

/* ---------------- VV空间（非好友仅可见最近三条动态） ---------------- */
function spaceHTML() {
  return `
    <header class="vv-chat__title">
      <button class="ow-btn" type="button" data-vv-back style="padding:2px 9px;font-size:11px;" aria-label="返回">←</button>
      <div class="vv-avatar is-off" style="width:26px;height:26px;font-size:12px;line-height:24px;">K</div>
      <div>
        <div class="t">${esc(VV_SPACE.nick)} 的空间</div>
        <div class="s">VV空间</div>
      </div>
    </header>
    <div class="vv-space">
      <div class="vv-space__id">${esc(VV_SPACE.nick)} · ${esc(VV_SPACE.id)}</div>
      ${VV_SPACE.dynamics.slice(0, 3).map(d => `
        <div class="vv-dyn">
          <div class="vv-dyn__meta">发表于 ${d.date}　${d.time}</div>
          <div class="vv-dyn__text">${d.x}</div>
          ${d.comments.length ? `
          <div class="vv-dyn__cmts">
            ${d.comments.map(c => `<div class="vv-dyn__cmt"><b>${esc(c.who)}：</b>${c.x}</div>`).join('')}
          </div>` : ''}
        </div>`).join('')}
      <div class="vv-space__end">
        <span>你还不是${esc(VV_SPACE.nick)}的好友</span>
        <span>仅展示最近三条动态</span>
      </div>
    </div>`;
}

/** 强制弹窗 / 打开 VV 时自动定位到黄冠亨会话 */
export function openHuang() {
  const el = document.querySelector('.vv-contact[data-contact="huang"]');
  el?.click();
}

export function mount(root, ctx) {
  const chatBox = root.querySelector('#vv-chat');

  function repaint() {
    const cur = chatBox.dataset.contact || 'huang';
    if (cur === 'space') { chatBox.innerHTML = spaceHTML(); return; }
    if (cur === 'addfriend') { chatBox.innerHTML = addFriendHTML(ctx); return; }
    const c = VV_CONTACTS.find(x => x.id === cur) || VV_CONTACTS[0];
    chatBox.innerHTML = chatHTML(c, ctx);
    const hist = chatBox.querySelector('#vv-hist');
    if (hist) hist.scrollTop = hist.scrollHeight;
  }

  /* 已有好友（点击直接进入会话，收起过滤提示） */
  const searchInput = root.querySelector('.vv-search input');
  const noteEl = root.querySelector('#vv-contact-note');
  root.querySelectorAll('.vv-contact').forEach(el => {
    el.addEventListener('click', () => {
      const c = VV_CONTACTS.find(x => x.id === el.dataset.contact);
      chatBox.dataset.contact = c.id;
      root.querySelectorAll('.vv-contact').forEach(x => x.classList.remove('is-active'));
      el.classList.add('is-active');
      noteEl.hidden = true;
      searchInput.value = '';
      root.querySelectorAll('.vv-contact').forEach(x => x.style.display = '');
      repaint();
      chatBox.classList.remove('vv-nudge');
      void chatBox.offsetWidth;
      chatBox.classList.add('vv-nudge');
    });
  });

  /* 查找联系人：只匹配已有好友，找不到陌生人 */
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    let hit = 0;
    root.querySelectorAll('.vv-contact').forEach(el => {
      const c = VV_CONTACTS.find(x => x.id === el.dataset.contact);
      const show = !q || c.name.toLowerCase().includes(q);
      el.style.display = show ? '' : 'none';
      if (show && q) hit++;
    });
    noteEl.hidden = !(q && !hit);
    noteEl.textContent = '未找到该联系人';
  });

  /* 侧栏：＋添加好友 → 二级页面 */
  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-open-addfriend]')) {
      chatBox.dataset.contact = 'addfriend';
      root.querySelectorAll('.vv-contact').forEach(x => x.classList.remove('is-active'));
      repaint();
      return;
    }
  });

  /* 聊天区事件（委托：repaint 后按钮重建仍有效） */
  chatBox.addEventListener('click', (e) => {
    if (e.target.closest('[data-vv-back]')) {
      /* 空间 → 资料卡；添加好友页 → 会话列表 */
      chatBox.dataset.contact = chatBox.dataset.contact === 'space' ? 'addfriend' : 'huang';
      repaint();
      return;
    }
    if (e.target.closest('[data-af-search]')) { doAfSearch(); return; }
    if (e.target.closest('[data-open-space]')) {
      chatBox.dataset.contact = 'space';
      repaint();
      return;
    }
    if (e.target.closest('[data-vv-addfriend]')) {
      const m = chatBox.querySelector('#vv-modal');
      if (m) m.hidden = false;
      return;
    }
    if (e.target.closest('[data-vv-friend-send]')) {
      const st = ctx.state();
      ctx.setState({ flags: { ...st.flags, vvFriendReqSent: 1 } }).then(() => repaint());
      return;
    }
    const btn2 = e.target.closest('[data-vv2]');
    if (btn2) {
      const step = btn2.dataset.vv2;
      const st = ctx.state();
      const path2 = [...(st.flags?.vv2Path || []), step];
      const patch = { flags: { ...st.flags, vv2Path: path2 } };
      if (step === 'C' && !st.flags?.vv2Done) {
        patch.flags.vv2Done = 1;
        patch.flags.keyObtained = 1;   // logistics_key_obtained
        patch.flags.photoSaved = 1;    // photo_saved → 相册解锁
      }
      ctx.setState(patch).then(() => repaint());
      return;
    }
    const btn = e.target.closest('[data-vv]');
    if (!btn) return;
    const step = btn.dataset.vv;
    const st = ctx.state();
    const path = [...(st.flags?.vvPath || []), step];
    ctx.setState({ flags: { ...st.flags, vvPath: path } }).then(() => repaint());
  });

  chatBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.id === 'vv-af-input') { e.preventDefault(); doAfSearch(); }
  });

  function doAfSearch() {
    const input = chatBox.querySelector('#vv-af-input');
    const result = chatBox.querySelector('#vv-af-result');
    if (!input || !result) return;
    const q = input.value.trim().toLowerCase();
    const kely = VV_SPACE.id.toLowerCase();
    if (q.length >= 3 && (kely.includes(q) || VV_SPACE.nick.toLowerCase().includes(q))) {
      addFound = true;
      result.innerHTML = strangerCardHTML(!!ctx.state().flags?.vvFriendReqSent);
    } else {
      addFound = false;
      result.innerHTML = '<div class="vv-af__none">未找到该用户</div>';
    }
  }
}
