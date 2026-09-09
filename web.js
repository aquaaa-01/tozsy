/* ==========================================================================
   004 — BROWSER · 游戏内浏览器（多标签页）
   ==========================================================================
   - 真·标签页：新建 / 关闭 / 切换，每个标签页拥有独立的历史与搜索状态
   - 官网与论坛是两个独立网站，各有自己的站内搜索
   - 论坛非实名制：搜"李永钦"只能找到 2009 年别人发的帖子；
     只有搜"TEN/ten"才能找到他本人的两个发帖（旧钥匙 / 三楼）
   - 2009/2010 旧帖在列表与详情中带年份归档标签
   ========================================================================== */

import { SITE, BBS, SEARCH, NEWS_2009, siteSearch, bbsSearch } from '../data/web.js';
import { blogHTML } from './blog.js';

export const meta = { id: 'web', no: '004', label: '上网', need: 'p1' };

/* ---------------- 标签页系统 ---------------- */
let tabs = [];
let activeId = null;
let tabSeq = 1;
let ctxRef = null;

function newTab({ activate = true } = {}) {
  const t = { id: tabSeq++, stack: [{ key: 'home', q: null }], ptr: 0, cache: '' };
  tabs.push(t);
  if (activate) activeId = t.id;
  return t;
}

function closeTab(id) {
  const i = tabs.findIndex(t => t.id === id);
  if (i < 0) return;
  tabs.splice(i, 1);
  if (!tabs.length) { newTab(); return; }
  if (activeId === id) activeId = tabs[Math.max(0, i - 1)].id;
}

function curTab() {
  return tabs.find(t => t.id === activeId) || tabs[0];
}

function cur() {
  const t = curTab();
  return t.stack[t.ptr];
}

const URLS = {
  'home':         'http://www.qingsou.cn/',
  'site-home':    'http://www.swhs.edu.cn/index.html',
  'site-about':   'http://www.swhs.edu.cn/about.html',
  'site-staff':   'http://www.swhs.edu.cn/staff.html',
  'site-honor':   'http://www.swhs.edu.cn/honor.html',
  'bbs-home':     'http://bbs.swhs.edu.cn/index.php',
  'bbs-user-ten': 'http://bbs.swhs.edu.cn/space-uid-3045.html',
  'news-old':     NEWS_2009.url,
  'blog':         'http://blog.qingsou.cn/~user/index.html',
};

const TAB_NAME = {
  'home':        '青搜 — 我的上网主页',
  'site-home':   '神威高中官方网站',
  'site-about':  '学校概况 - 神威高中',
  'site-staff':  '教职工信息 - 神威高中',
  'site-honor':  '校园荣誉 - 神威高中',
  'site-search': '站内搜索 - 神威高中',
  'bbs-home':    '神威论坛',
  'bbs-search':  '站内搜索 - 神威论坛',
  'bbs-cat':     '版块 - 神威论坛',
  'bbs-user-ten':'TEN 的个人资料 - 神威论坛',
  'news-old':    NEWS_2009.title,
  'blog':        '未命名的小站 — 个人博客',
};

const urlOf = (key, q) => {
  const u = URLS[key];
  if (u) return u;
  if (key === 'results')       return 'http://www.qingsou.cn/s?wd=' + encodeURIComponent(q || '');
  if (key === 'site-search')   return 'http://www.swhs.edu.cn/search.html?q=' + encodeURIComponent(q || '');
  if (key === 'bbs-search')    return 'http://bbs.swhs.edu.cn/search.php?srchtxt=' + encodeURIComponent(q || '');
  if (key === 'bbs-cat')       return 'http://bbs.swhs.edu.cn/forum.php?cat=' + encodeURIComponent(q || '');
  if (key.startsWith('site-staff-')) return `http://www.swhs.edu.cn/staff/${key.slice(11)}.html`;
  if (key.startsWith('bbs-thread-')) return `http://bbs.swhs.edu.cn/thread-${key.slice(11)}-1-1.html`;
  return 'about:blank';
};

function pageTitle(key, q) {
  if (key === 'results') return `${q || ''} - 青搜`;
  if (key === 'bbs-cat') return `${q || '版块'} - 神威论坛`;
  if (key.startsWith('bbs-thread-')) {
    const t = BBS.allThreads().find(x => x.id === key.slice(11));
    return t ? `${t.year ? '[' + t.year + '] ' : ''}${t.title.slice(0, 14)}… - 神威论坛` : '神威论坛';
  }
  return TAB_NAME[key] || '网页';
}

/* ---------------- 外壳 ---------------- */
export function render() {
  newTab();
  return `
  <div class="ow-page">
    <div class="bw" role="application" aria-label="浏览器">

      <div class="bw-titlebar">
        <span class="bw__icon">e</span>
        <span class="bw__title" id="bw-title">青搜 — 我的上网主页</span>
        <span class="bw__winbtns"><span class="bw__win" data-win-min data-win-id="web" style="cursor:pointer;">—</span><span class="bw__win">□</span><span class="bw__win" data-win-close data-win-id="web" style="cursor:pointer;font-weight:700;">×</span></span>
      </div>

      <div class="bw-tabs" id="bw-tabs"></div>

      <div class="bw-menubar">
        <span>文件(F)</span><span>编辑(E)</span><span>查看(V)</span>
        <span data-favmenu>收藏夹(A)</span><span>工具(T)</span><span>帮助(H)</span>
      </div>
      <div class="bw-favbar" id="bw-favbar" hidden>
        <span class="fav-link" data-favopen="blog">★ 个人博客</span>
      </div>

      <div class="bw-toolbar">
        <button class="bw-nav" id="bw-back" title="后退">←</button>
        <button class="bw-nav" id="bw-fwd" title="前进">→</button>
        <button class="bw-nav" id="bw-reload" title="刷新">⟳</button>
        <div class="bw-address">
          <span style="font-size:11px;color:#6E747E;">地址</span>
          <input class="ow-input" id="bw-url" type="text" readonly aria-label="地址栏">
          <button class="ow-btn" id="bw-go">转到</button>
        </div>
      </div>

      <div class="bw-viewport" id="bw-view"></div>

      <div class="bw-statusbar">
        <span id="bw-status">完成</span>
        <span class="bw__zone">Internet</span>
      </div>

      <div class="bw-favmenu" id="bw-favmenu" hidden></div>

      <div class="sessdlg" id="sessdlg" hidden>
        <div class="sessdlg__win">
          <div class="sessdlg__bar">青搜浏览器</div>
          <div class="sessdlg__body">
            <p>上次使用青搜时，有一个网页未正常关闭：</p>
            <div class="sessdlg__page">
              <b>未命名的小站 — 个人博客</b>
              <span>http://blog.qingsou.cn/~user/index.html</span>
            </div>
          </div>
          <div class="sessdlg__btns">
            <button class="ow-btn" id="sess-skip" type="button">不恢复</button>
            <button class="ow-btn" id="sess-restore" type="button">恢复页面</button>
          </div>
        </div>
      </div>

    </div>
  </div>`;
}

/* ---------------- 标签条 ---------------- */
function renderTabs(root) {
  const box = root.querySelector('#bw-tabs');
  box.innerHTML = tabs.map(t => {
    const { key, q } = t.stack[t.ptr];
    const active = t.id === activeId;
    return `
    <span class="bw-tab ${active ? 'is-active' : ''}" data-tabid="${t.id}" role="tab" tabindex="0">
      <span class="bw-tab__label">${esc(pageTitle(key, q))}</span>
      <span class="bw-tab__close" data-close="${t.id}" title="关闭标签页">×</span>
    </span>`;
  }).join('') + `<button class="bw-tab bw-tab--new" data-newtab type="button" title="新建标签页">+</button>`;
}

/* ---------------- 视图渲染 ---------------- */
function viewHTML(key, q) {
  if (key === 'home')          return qingsouHome(q);
  if (key === 'results')       return qingsouResults(q);
  if (key === 'site-home')     return siteHome();
  if (key === 'site-about')    return siteAbout();
  if (key === 'site-staff')    return siteStaff();
  if (key === 'site-honor')    return siteHonor();
  if (key === 'site-search')   return siteSearchPage(q);
  if (key === 'bbs-home')      return bbsHome();
  if (key === 'bbs-search')    return bbsSearchPage(q);
  if (key === 'bbs-cat')       return bbsCatPage(q);
  if (key === 'bbs-user-ten')  return bbsProfile();
  if (key === 'news-old')      return oldNewsPage();
  if (key === 'blog')          return blogHTML(ctxRef?.state());
  if (key.startsWith('site-staff-')) return siteStaffDetail(key.slice(11));
  if (key.startsWith('bbs-thread-')) return bbsThread(key.slice(11));
  return '<div style="padding:40px;font-family:var(--font-ui);color:#6E747E;">无法显示此页。</div>';
}

/* ---------- 青搜 ---------- */
function qingsouHome() {
  return `
  <div class="qs-home">
    <div class="qs-logo">青<b>搜</b></div>
    <div class="qs-slogan">青搜一下，你就知道</div>
    <div class="qs-tabs"><b>网页</b><span>论坛</span><span>词典</span><span>图片</span></div>
    <form class="qs-searchrow" id="qs-form">
      <input class="ow-input" id="qs-input" type="text" value=""
             placeholder="" aria-label="搜索" autocomplete="off">
      <button class="ow-btn" type="submit">青搜一下</button>
    </form>
    <div class="qs-dir">
      <span>学校导航：<a class="ow-link" data-go="site-home">神威高中官网</a></span>
      <span>常用：校历 · 成绩查询 · 教务系统</span>
    </div>
    <div class="qs-footer">本站已备案<span>|</span>青搜 QINGSOU<span>|</span>关于青搜</div>
  </div>`;
}

function qingsouResults(q) {
  const r = SEARCH.engine(q);
  if (!r.items.length) {
    return `
    <div class="qs-results">
      <div class="qs-empty">
        <span class="qs-sorry">抱歉</span>未找到与 <b>"${esc(q)}"</b> 相关的结果。
        <div class="qs-tip">
          建议：检查输入是否正确<br>
          建议：尝试其他关键词<br>
          建议：减少查询字数
        </div>
      </div>
    </div>`;
  }
  return `
  <div class="qs-results">
    <div class="qs-results-head">找到约 <b>${r.total}</b> 条结果 （用时 0.0${Math.floor(Math.random() * 8) + 1} 秒）</div>
    ${r.items.map(it => `
      <div class="qs-item">
        <div class="qs-item__title"><a ${it.go ? `data-go="${it.go}"` : ''}>${it.title}</a></div>
        <div class="qs-item__snip">${it.snip.join('')}</div>
        <div class="qs-item__url">${it.url}</div>
      </div>`).join('')}
  </div>`;
}

/* ---------- 官网（独立网站 · 站内搜索 · 无论坛导航） ---------- */
function siteHead(active) {
  return `
  <div class="site-banner">
    <div class="site__cn">${SITE.cn}</div>
    <div class="site__en">${SITE.en}</div>
    <div class="site__motto">${SITE.motto}</div>
  </div>
  <div class="site-navrow">
    <nav class="site-nav">
      <a data-go="site-home" class="${active === 'home' ? 'is-here' : ''}">首页</a>
      <a data-go="site-about" class="${active === 'about' ? 'is-here' : ''}">学校概况</a>
      <a data-go="site-staff" class="${active === 'staff' ? 'is-here' : ''}">教职工信息</a>
      <a data-go="site-honor" class="${active === 'honor' ? 'is-here' : ''}">校园荣誉</a>
    </nav>
    <form class="site-searchrow" id="site-search-form">
      <input class="ow-input" id="site-search-input" type="text" placeholder="站内搜索" aria-label="站内搜索">
      <button class="ow-btn" type="submit">搜索</button>
    </form>
  </div>`;
}

function siteHome() {
  return `
  <div class="site">
    ${siteHead('home')}
    <div class="site-body">
      <div>
        <div class="site-box">
          <div class="site-col__title">栏目导航</div>
          <ul class="site-menu">
            <li><a data-go="site-about">学校概况</a></li>
            <li><a data-go="site-staff">教职工信息</a></li>
            <li><a data-go="site-honor">校园荣誉</a></li>
          </ul>
        </div>
        <div class="site-box">
          <div class="site-col__title">校园网络</div>
          <ul class="site-menu">
            <li><a data-go="bbs-home">神威论坛（学生社区）</a></li>
            <li><a>教务系统</a></li>
            <li><a>图书检索</a></li>
          </ul>
        </div>
      </div>
      <div>
        <div class="site-col__title">通知公告</div>
        <ul class="site-list" style="margin-bottom:16px;">
          ${SITE.notices.map(n => `<li><a class="${n.urgent ? 'is-urgent' : ''}">${n.t}</a><time>${n.d}</time></li>`).join('')}
        </ul>
        <div class="site-col__title">校园动态</div>
        <ul class="site-list">
          ${SITE.news.map(n => `<li><a>${n.t}</a><time>${n.d}</time></li>`).join('')}
        </ul>
      </div>
      <div>
        <div class="site-box" style="text-align:center;color:#6E747E;">
          <div class="site-col__title" style="text-align:left;">校历</div>
          <div style="font-size:12px;line-height:2;">本周第 8 教学周<br>期中考试：04 月</div>
        </div>
        <div class="site-box">
          <div class="site-col__title">友情链接</div>
          <ul class="site-menu"><li><a data-go="bbs-home">神威论坛</a></li><li><a>市教育局</a></li></ul>
        </div>
      </div>
    </div>
    <footer class="site-footer">
      神威高中 版权所有 · 地址：市区东侧<br>
      备案号：SICP备 08001717 号
    </footer>
  </div>`;
}

function siteAbout() {
  return `
  <div class="site">
    ${siteHead('about')}
    <div class="site-body" style="grid-template-columns:1fr;">
      <div class="site-article">
        <h2>学校概况</h2>
        <div class="site-art-meta">发布时间：2016-09-01　浏览次数：1024</div>
        ${SITE.about.map(p => `<p>${p}</p>`).join('')}
        <p class="center" style="color:#6E747E;">—— 完 ——</p>
      </div>
    </div>
    <footer class="site-footer">神威高中 版权所有 · 备案号：SICP备 08001717 号</footer>
  </div>`;
}

function siteStaff() {
  return `
  <div class="site">
    ${siteHead('staff')}
    <div class="site-body" style="grid-template-columns:1fr;">
      <div class="site-article">
        <h2>教职工信息</h2>
        <div class="site-art-meta">共 4 条记录（部分信息按公示范围展示）</div>
        <table class="site-table">
          <thead><tr><th style="width:16%;">姓名</th><th style="width:34%;">职务</th><th style="width:22%;">部门</th><th>详情</th></tr></thead>
          <tbody>
            ${SITE.staff.map(s => `
              <tr>
                <td><a data-go="site-staff-${s.id}">${s.name}</a></td>
                <td>${s.role}</td>
                <td>${s.dept}</td>
                <td><a data-go="site-staff-${s.id}">查看</a></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <footer class="site-footer">神威高中 版权所有 · 备案号：SICP备 08001717 号</footer>
  </div>`;
}

function siteStaffDetail(id) {
  const s = SITE.staff.find(x => x.id === id);
  if (!s) return siteStaff();
  return `
  <div class="site">
    ${siteHead('staff')}
    <div class="site-body" style="grid-template-columns:1fr;">
      <div class="site-article">
        <h2>教职工资料 · ${s.name}</h2>
        <div class="site-art-meta">来源：人事处公示 · 编号 SW-RS-0${SITE.staff.indexOf(s) + 17}</div>
        <table class="site-table">
          <tbody>
            ${s.rows.map(([k, v]) => `<tr><th style="width:130px;text-align:right;">${k}</th><td>${v}</td></tr>`).join('')}
          </tbody>
        </table>
        <p style="text-indent:0;font-size:12px;color:#6E747E;margin-top:12px;">${s.extra}</p>
        <p style="text-indent:0;"><a class="ow-link" data-go="site-staff">← 返回教职工信息</a></p>
      </div>
    </div>
    <footer class="site-footer">神威高中 版权所有 · 备案号：SICP备 08001717 号</footer>
  </div>`;
}

function siteHonor() {
  return `
  <div class="site">
    ${siteHead('honor')}
    <div class="site-body" style="grid-template-columns:1fr;">
      <div class="site-article">
        <h2>校园荣誉 · 历年学生评优名单</h2>
        <div class="site-art-meta">整理自校档案馆公开档案</div>
        <table class="site-table">
          <thead><tr><th style="width:46%;">年度 / 荣誉</th><th>学生</th></tr></thead>
          <tbody>
            ${SITE.honors.map(h => `
              <tr>
                <td>${h.t}${h.n.includes('李永钦') ? '　<span style="color:#A32C26;">★</span>' : ''}</td>
                <td>${h.n}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <footer class="site-footer">神威高中 版权所有 · 备案号：SICP备 08001717 号</footer>
  </div>`;
}

function siteSearchPage(q) {
  const results = siteSearch(q || '');
  return `
  <div class="site">
    ${siteHead('')}
    <div class="site-body" style="grid-template-columns:1fr;">
      <div class="site-article">
        <h2>站内搜索</h2>
        <div class="site-art-meta">搜索范围：学校公开资料</div>
        ${!q ? '<p style="text-indent:0;color:#6E747E;">输入关键词，检索学校公开资料。</p>' :
          !results.length ?
            `<p style="text-indent:0;">未找到与 <b>"${esc(q)}"</b> 相关的内容。</p>
             <p style="text-indent:0;color:#6E747E;font-size:12px;">建议使用姓名、职务或关键词（如：校医、档案、荣誉）。</p>` :
            `<ul class="site-list">
              ${results.map(r => `<li><a data-go="${r.go}">${r.title}</a><time>公开资料</time></li>`).join('')}
            </ul>`}
      </div>
    </div>
    <footer class="site-footer">神威高中 版权所有 · 备案号：SICP备 08001717 号</footer>
  </div>`;
}

/* ---------- 论坛（独立网站 · 站内搜索） ---------- */
function bbsHead() {
  return `
  <div class="bbs-head">
    <span class="bbs__logo">${BBS.name}</span>
    <span class="bbs__sub">${BBS.sub}</span>
    <form class="bbs-searchrow" id="bbs-search-form">
      <input class="ow-input" id="bbs-search-input" type="text" placeholder="搜索帖子" aria-label="搜索帖子">
      <button class="ow-btn" type="submit">搜索</button>
    </form>
    <span class="bbs__user">${BBS.user} <a>登录</a> <a>注册</a></span>
  </div>
  <div class="bbs-cats">
    <a data-bbscat="">全部</a><a data-bbscat="校园生活">校园生活</a><a data-bbscat="学习交流">学习交流</a><a data-bbscat="活动专区">活动专区</a><a data-bbscat="失物招领">失物招领</a><a data-bbscat="二手交易">二手交易</a><a data-bbscat="其他">其他</a>
  </div>`;
}

/* ---------- 版块分类页（只展示 2026 年的普通帖子，历史档案仅搜索可达） ---------- */
const CAT_KEY = {
  '校园生活': ['chat'],
  '学习交流': ['study'],
  '活动专区': ['act'],
  '失物招领': ['lost'],
  '二手交易': ['market'],
  '其他': ['other'],
};

function bbsCatPage(cat) {
  const keys = CAT_KEY[cat] || null;
  const list = keys ? BBS.threads.filter(t => keys.includes(t.cat)) : BBS.threads;
  return `
  <div class="bbs">
    ${bbsHead()}
    <table class="bbs-table">
      <thead><tr><th>版块：${esc(cat || '全部主题')}　<span style="color:#94989F;font-weight:400;font-size:11px;">共 ${list.length} 篇主题</span></th><th style="width:12%;">作者</th><th style="width:9%;">回复</th><th style="width:16%;">最后回复</th></tr></thead>
      <tbody>${list.length ? list.map(threadRow).join('') : '<tr><td colspan="4" style="color:#94989F;">本版暂无主题。</td></tr>'}</tbody>
    </table>
    <div class="bbs-pages"><a data-go="bbs-home">« 返回论坛首页</a></div>
  </div>`;
}

/* ---------- 钥匙剧情触发：论坛搜索"钥匙" 或 打开 TEN 的 3F 钥匙帖 ---------- */
function keyStoryTrigger() {
  const f = ctxRef.state().flags || {};
  if (f.huangVv2Sent || f.forumKeyTriggered) return;
  ctxRef.setState({ flags: { ...f, forumKeyTriggered: 1 } });
}

function threadRow(t) {
  const st = ctxRef?.state();
  return `
    <tr>
      <td class="bbs__t-title">
        <a class="tlink ${st?.readPosts[t.id] ? 'is-visited' : ''}" data-go="bbs-thread-${t.id}">${t.hot ? '<span class="hot">[hot]</span> ' : ''}${t.title}</a>
        ${t.year ? `<span class="bbs-year">${t.year}</span>` : ''}
        <br><span style="font-size:11px;color:#94989F;">${t.tag}</span>
      </td>
      <td><a class="tuser" data-go="${t.author === 'TEN' ? 'bbs-user-ten' : ''}">${t.author}</a><br><span style="font-size:11px;color:#94989F;">${t.date}</span></td>
      <td class="bbs__t-num">${t.replies}</td>
      <td class="bbs__t-last">${t.last}<br>${t.lastBy || ''}</td>
    </tr>`;
}

function bbsHome() {
  return `
  <div class="bbs">
    ${bbsHead()}
    <table class="bbs-table">
      <thead><tr><th style="width:56%;">版块 / 主题</th><th style="width:12%;">主题</th><th style="width:12%;">帖子</th><th>最后发表</th></tr></thead>
      <tbody>
        <tr><td><div class="bbs-forum-row"><span class="ficon">公</span><div><a class="tlink">校园公告</a><br><span style="color:#94989F;font-size:11px;">仅管理员可发帖</span></div></div></td>
            <td class="bbs__t-num">128</td><td class="bbs__t-num">130</td><td class="bbs__t-last">03-18 10:02<br>管理员</td></tr>
        <tr><td><div class="bbs-forum-row"><span class="ficon">学</span><div><a class="tlink">学习交流</a><br><span style="color:#94989F;font-size:11px;">笔记 · 试题 · 经验</span></div></div></td>
            <td class="bbs__t-num">892</td><td class="bbs__t-num">4102</td><td class="bbs__t-last">03-21 08:12<br>高三党一枚</td></tr>
        <tr><td><div class="bbs-forum-row"><span class="ficon">水</span><div><a class="tlink">灌水区</a><br><span style="color:#94989F;font-size:11px;">今天水了吗</span></div></div></td>
            <td class="bbs__t-num">2107</td><td class="bbs__t-num">18234</td><td class="bbs__t-last">03-21 13:40<br>爱学习的猫</td></tr>
      </tbody>
    </table>

    <table class="bbs-table">
      <thead><tr><th>主题列表 · 最新发表</th><th style="width:12%;">作者</th><th style="width:9%;">回复</th><th style="width:16%;">最后回复</th></tr></thead>
      <tbody>${BBS.threads.map(threadRow).join('')}</tbody>
    </table>
    <div class="bbs-pages">总计 3127 篇主题 / 每页 6 篇<b>1</b><a>2</a><a>3</a><a>下一页</a></div>
  </div>`;
}

function bbsSearchPage(q) {
  const { threads, user } = bbsSearch(q || '');
  if ((q || '').includes('钥匙')) keyStoryTrigger();
  return `
  <div class="bbs">
    ${bbsHead()}
    <table class="bbs-table">
      <thead><tr><th>站内搜索：${q ? `"${esc(q)}"` : '请输入关键词'}</th><th style="width:12%;">作者</th><th style="width:9%;">回复</th><th style="width:16%;">日期</th></tr></thead>
      <tbody>
        ${!q ? '<tr><td colspan="4" style="color:#94989F;">输入关键词检索帖子（支持标题、内容与用户名）。</td></tr>' :
          !threads.length && !user ? `<tr><td colspan="4">未找到与 "${esc(q)}" 相关的帖子。<br><span style="color:#94989F;font-size:11px;">论坛非实名制，用户以论坛 ID 发帖。</span></td></tr>` :
          `${threads.map(threadRow).join('')}
          ${user ? `<tr><td colspan="4">找到用户：<a class="tuser" data-go="bbs-user-ten" style="color:#1F4E8C;text-decoration:underline;cursor:pointer;">${user}</a>（查看个人资料与主题）</td></tr>` : ''}`}
      </tbody>
    </table>
    <div class="bbs-pages"><a data-go="bbs-home">« 返回论坛首页</a></div>
  </div>`;
}

function bbsThread(id) {
  const t = BBS.allThreads().find(x => x.id === id);
  if (!t) return bbsHome();
  if (id === 't0908') keyStoryTrigger();
  const st = ctxRef?.state();
  if (st && !st.readPosts[id]) {
    ctxRef.setState({ readPosts: { ...st.readPosts, [id]: 1 } });
  }
  return `
  <div class="bbs">
    <div class="bbs-thread">
      <div class="bbs-thread__title">
        <span class="rtag">${t.tag}</span>
        ${t.year ? `<span class="bbs-year bbs-year--big">${t.year} 年 · 历史存档</span>` : ''}
        ${t.title}
      </div>
      ${t.floors.map(f => `
        <div class="bbs-floor">
          <aside class="bbs-floor__side">
            <div class="bbs-avatar">${f.char}</div>
            <div><a class="uname" data-go="${f.user === 'TEN' ? 'bbs-user-ten' : ''}" style="color:#1F4E8C;text-decoration:underline;cursor:pointer;">${f.user}</a></div>
            <div class="utag">${f.tag}</div>
          </aside>
          <div class="bbs-floor__main">
            <div class="bbs-floor__meta"><span>发表于 ${f.time}</span><span class="floor-no">${f.floor} 楼</span></div>
            <div class="bbs-floor__body">${f.body.map(p => `<p>${p}</p>`).join('')}</div>
            <div class="bbs-sig">※ 签名档为空</div>
          </div>
        </div>`).join('')}
      <div class="bbs-pages">
        <a data-go="bbs-home">« 返回列表</a>　|　快速回复：<span style="color:#94989F;">${t.locked ? '本帖已锁定。' : '您是游客，无法回复。'}</span>
      </div>
    </div>
  </div>`;
}

function bbsProfile() {
  const p = BBS.profiles.TEN;
  return `
  <div class="bbs">
    <div class="bbs-profile">
      <div class="bbs-profile__head">
        <div class="bbs-avatar">${p.avatar}</div>
        <div>${p.name} <span style="font-size:11px;font-weight:400;opacity:.7;">· 个人资料</span></div>
      </div>
      <table>
        ${p.rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}
        <tr><th>主题列表</th><td>
          <a data-go="bbs-thread-t0908">【失物招领】捡到一把贴着"3F"的钥匙</a><br>
          <a data-go="bbs-thread-t0907">综合楼三楼以前是不是校医室？现在怎么锁着？</a>
        </td></tr>
      </table>
    </div>
    <div class="bbs-pages" style="width:min(760px,94%);"><a data-go="bbs-home">« 返回论坛</a></div>
  </div>`;
}

/* ---------- 2009 年南江在线 · 失踪新闻（含社会人士评论） ---------- */
function oldNewsPage() {
  return `
  <div class="news09">
    <div class="news09__wrap">
      <header class="news09__head">
        <span class="news09__logo">${NEWS_2009.site}</span>
        <span class="news09__nav">首页 · 资讯 · 教育 · 社会 · 论坛</span>
      </header>
      <div class="news09__crumb">您现在的位置：南江在线 &gt; 社会新闻</div>
      <h1 class="news09__title">${NEWS_2009.title}</h1>
      <div class="news09__meta">${NEWS_2009.date}　来源：本网记者　${NEWS_2009.editor}</div>
      <div class="news09__body">
        ${NEWS_2009.body.map(p => `<p>${p}</p>`).join('')}
        <p class="news09__end">（完）</p>
      </div>

      <div class="news09__cmt-title">相关评论（共 ${NEWS_2009.comments.length} 条）</div>
      <div class="news09__cmts">
        ${NEWS_2009.comments.map((c, i) => `
        <div class="news09__cmt">
          <div class="news09__cmt-meta">${i + 1} 楼　网友：<b>${c.user}</b>　发表于 ${c.date}</div>
          <div class="news09__cmt-body">${c.x.map(l => `<p>${l}</p>`).join('')}</div>
        </div>`).join('')}
      </div>
      <div class="news09__note">网友评论仅供网友表达个人看法，并不表明本站同意其观点或证实其描述。</div>
      <div class="news09__back"><a class="ow-link" data-go="home">← 返回青搜</a></div>
    </div>
  </div>`;
}

/** 供收藏夹等外部入口跳转到指定页面（当前标签页内导航） */
export function goto(key) { navigate(key); }

/** 当前标签页是否正在显示个人博客 */
export function isBlogShowing() {
  const t = curTab();
  return t.stack[t.ptr].key === 'blog';
}

/** 博客标签页轻微闪动（亮度脉冲 ×3 ≈4秒）：不跳动、不弹窗、不切换 */
export function blinkBlogTab() {
  const tabs = [...document.querySelectorAll('#bw-tabs .bw-tab')];
  const tab = tabs.find(t => (t.querySelector('.bw-tab__label')?.textContent || '').includes('个人博客'));
  if (!tab) return false;
  tab.classList.remove('is-blinking');
  void tab.offsetWidth;
  tab.classList.add('is-blinking');
  setTimeout(() => tab.classList.remove('is-blinking'), 3700);
  return true;
}

/** 博客进入收藏夹（真实数据注册，按 id 去重，幂等） */
function ensureBlogBookmark() {
  const st = ctxRef.state();
  const list = st.bookmarks || [];
  if (list.some(b => b.id === 'blog')) return;
  ctxRef.setState({ bookmarks: [...list, { id: 'blog', title: '个人博客', key: 'blog' }] });
}

/* ---------------- 工具 / 渲染调度 ---------------- */
function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function renderView(root) {
  const t = curTab();
  const { key, q } = t.stack[t.ptr];

  root.querySelector('#bw-url').value = urlOf(key, q);
  root.querySelector('#bw-back').disabled = t.ptr <= 0;
  root.querySelector('#bw-fwd').disabled = t.ptr >= t.stack.length - 1;
  root.querySelector('#bw-title').textContent = pageTitle(key, q);

  const view = root.querySelector('#bw-view');
  view.innerHTML = viewHTML(key, q);
  view.scrollTop = 0;
  renderTabs(root);

  /* 博客被访问 → 自动进入收藏夹（正常浏览器行为，幂等，无任何提示） */
  if (key === 'blog') {
    ensureBlogBookmark();
    /* 博客被真正打开 → 已解锁的各篇分别标记已读（此后不再闪动/不再自动直达） */
    const bf = ctxRef.state().flags || {};
    const brp = ctxRef.state().readPosts || {};
    const patch = {};
    if ((brp.t2001 || bf.day1Searched) && !bf.blogDay2Read) patch.blogDay2Read = 1;
    if (bf.vv2Done && !bf.blogDay3Read) patch.blogDay3Read = 1;
    if (Object.keys(patch).length) ctxRef.setState({ flags: { ...bf, ...patch } });
  }
  /* 第一天调查节点：主搜"李永钦"并进入结果页 */
  if (key === 'results' && q && q.includes('李永钦')) {
    const sf = ctxRef.state().flags || {};
    if (!sf.day1Searched) ctxRef.setState({ flags: { ...sf, day1Searched: 1 } });
  }
  const favbar = root.querySelector('#bw-favbar');
  if (favbar) favbar.hidden = !((ctxRef.state().bookmarks || []).some(b => b.key === 'blog') || key === 'blog');

  /* 博客阅读过半 → VV 收到新消息（一次性，方案 B） */
  if (key === 'blog' && !ctxRef.state().flags?.vvNotified) {
    const onScroll = () => {
      const max = view.scrollHeight - view.clientHeight;
      if (max > 0 && view.scrollTop / max > 0.5) {
        view.removeEventListener('scroll', onScroll);
        const st = ctxRef.state();
        ctxRef.setState({ flags: { ...st.flags, vvNotified: 1 } });
      }
    };
    view.addEventListener('scroll', onScroll);
  }
}

function navigate(key, q = null) {
  const t = curTab();
  t.stack = t.stack.slice(0, t.ptr + 1);
  t.stack.push({ key, q });
  t.ptr = t.stack.length - 1;
  renderView(rootEl);
}

let rootEl = null;

export function mount(root, ctx) {
  ctxRef = ctx;
  rootEl = root;
  renderView(root);

  /* ---- 恢复上次浏览会话：显隐由 app.openApp 判断，这里只绑按钮 ---- */
  const sessdlg = root.querySelector('#sessdlg');
  const settle = (restore) => {
    sessdlg.hidden = true;
    ctx.setState({ flags: { ...ctx.state().flags, blogRestored: 1 } });
    if (restore) navigate('blog');
  };
  root.querySelector('#sess-restore').addEventListener('click', () => settle(true));
  root.querySelector('#sess-skip').addEventListener('click', () => settle(false));

  /* 搜索提交：青搜 / 官网站内 / 论坛站内 */
  root.addEventListener('submit', (e) => {
    const t = curTab();
    const qs = e.target.closest('#qs-form');
    if (qs) {
      e.preventDefault();
      const q = qs.querySelector('#qs-input').value.trim();
      if (!q) return;
      t.cache = q;
      const st = ctx.state();
      if (!st.searchHistory.includes(q)) {
        ctx.setState({ searchHistory: [q, ...st.searchHistory].slice(0, 6) });
      }
      navigate('results', q);
      return;
    }
    const ss = e.target.closest('#site-search-form');
    if (ss) {
      e.preventDefault();
      navigate('site-search', ss.querySelector('#site-search-input').value.trim() || null);
      return;
    }
    const bs = e.target.closest('#bbs-search-form');
    if (bs) {
      e.preventDefault();
      navigate('bbs-search', bs.querySelector('#bbs-search-input').value.trim() || null);
    }
  });

  root.addEventListener('click', (e) => {
    const bc = e.target.closest('[data-bbscat]');
    if (bc) { navigate('bbs-cat', bc.dataset.bbscat); return; }
    /* 标签页：切换 / 关闭 / 新建 */
    const closeBtn = e.target.closest('[data-close]');
    if (closeBtn) {
      e.stopPropagation();
      closeTab(Number(closeBtn.dataset.close));
      renderView(root);
      return;
    }
    const newBtn = e.target.closest('[data-newtab]');
    if (newBtn) {
      newTab();
      renderView(root);
      return;
    }
    const tabEl = e.target.closest('[data-tabid]');
    if (tabEl) {
      activeId = Number(tabEl.dataset.tabid);
      renderView(root);
      return;
    }

    const nav = e.target.closest('#bw-back, #bw-fwd, #bw-reload');
    if (nav) {
      const t = curTab();
      if (nav.id === 'bw-back' && t.ptr > 0) t.ptr--;
      if (nav.id === 'bw-fwd' && t.ptr < t.stack.length - 1) t.ptr++;
      renderView(root);
      return;
    }
    const goEl = e.target.closest('[data-go]');
    if (goEl) {
      if (goEl.dataset.go) navigate(goEl.dataset.go);
      return;
    }
    const qEl = e.target.closest('[data-q]');
    if (qEl) {
      const t = curTab();
      t.cache = qEl.dataset.q;
      const st = ctx.state();
      if (!st.searchHistory.includes(t.cache)) {
        ctx.setState({ searchHistory: [t.cache, ...st.searchHistory].slice(0, 6) });
      }
      navigate('results', t.cache);
    }
  });
}
