/* ==========================================================================
   PAGE 003 — 学校论坛
   ==========================================================================
   构图：被发现的旧内网截图（窗口外围大留白，建立"物证"感）
   视觉中心：帖子标题 + [失踪] 红标
   Material：3 类 4 实例 —— forum-page / 红标 / 极轻噪点
   刻意不使用：纸张纹理 / 胶带 / 图钉 / 红线（这是屏幕，不是纸）
   ==========================================================================
   内容纪律：论坛用户均为当前时间线普通 NPC
   绝不出「你已经死了」「这个世界是假的」这类廉价谜语
   ========================================================================== */

export const meta = {
  id: 'forum',
  no: '003',
  label: '校园论坛',
};

export function render() {
  return `
  <div class="forum-wrap">

    <div class="browser forum-browser" role="region" aria-label="校园论坛">

      <!-- 旧浏览器标题栏 -->
      <div class="browser__bar">
        <div class="browser__dots" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <div class="browser__title">校园论坛 v2.1</div>
        <div class="browser__url">http://bbs.campus.edu/thread/20413</div>
      </div>

      <div class="browser__viewport">

        <!-- 侧栏：分类（弱化，不抢主内容） -->
        <aside class="forum-side">
          <div class="forum-side__head">板块</div>
          <nav>
            <div class="forum-side__item">校园公告</div>
            <div class="forum-side__item">失物招领</div>
            <div class="forum-side__item is-active">校园杂谈</div>
            <div class="forum-side__item">跳蚤市场</div>
            <div class="forum-side__item">学习交流</div>
          </nav>
        </aside>

        <!-- 主内容 -->
        <main class="forum-main">
          <article class="thread">

            <div class="thread__tag">失踪</div>

            <h1 class="thread__title">有没有人见过 B 同学？</h1>

            <div class="thread__meta">
              <span>楼主 · 匿名用户</span>
              <span>03-11 22:14</span>
              <span>阅读 1,204</span>
            </div>

            <div class="thread__body">
              <p>B 同学已经快两周没出现了。</p>
              <p>宿舍的东西都还在，人联系不上。辅导员那边也说没请过假。</p>
              <p>有谁最近见过他吗？</p>
            </div>

            <!-- 回复：普通 NPC，不知道世界机制 -->
            <div class="thread__replies">

              <div class="reply">
                <div class="reply__avatar reply__avatar--a" aria-hidden="true">林</div>
                <div>
                  <div class="reply__head">
                    <span class="reply__name">林小北</span>
                    <span class="reply__time">03-11 22:41</span>
                  </div>
                  <p class="reply__text">好像是挺久没见到了。不会是转学了吧？</p>
                </div>
              </div>

              <div class="reply">
                <div class="reply__avatar reply__avatar--b" aria-hidden="true">泽</div>
                <div>
                  <div class="reply__head">
                    <span class="reply__name">阿泽</span>
                    <span class="reply__time">03-12 09:17</span>
                  </div>
                  <p class="reply__text">他之前老往综合楼跑，我还在三楼碰到过他一次。</p>
                </div>
              </div>

              <div class="reply">
                <div class="reply__avatar reply__avatar--c" aria-hidden="true">匿</div>
                <div>
                  <div class="reply__head">
                    <span class="reply__name">匿名用户</span>
                    <span class="reply__time">03-12 14:03</span>
                  </div>
                  <p class="reply__text">听说是家里有事请假了。</p>
                </div>
              </div>

              <div class="reply">
                <div class="reply__avatar reply__avatar--d" aria-hidden="true">陈</div>
                <div>
                  <div class="reply__head">
                    <span class="reply__name">老陈</span>
                    <span class="reply__time">03-13 20:55</span>
                  </div>
                  <p class="reply__text">+1，他桌上东西都没收，不像要走的样子。</p>
                </div>
              </div>

            </div>

            <div class="thread__foot">共 4 条回复 · 第 1 / 1 页</div>

          </article>
        </main>

      </div>

      <div class="noise-layer" aria-hidden="true"></div>

    </div>

  </div>`;
}
