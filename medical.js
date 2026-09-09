/* ==========================================================================
   001 — PATIENT FILE · 患者诊疗记录
   ==========================================================================
   "别人记录我"。像医院系统打印出来的纸质病历：干净、正式、真实。
   唯一的不协调藏在文字本身（记忆缺失 / 医嘱措辞 / 空白栏），不做恐怖病历。
   ========================================================================== */

export const meta = { id: 'medical', no: '001', label: '病历', need: 'p0' };

export function render() {
  return `
  <div class="doc-area">

    <!-- 普通 Word 白纸 -->
    <article class="doc-paper" role="document" aria-label="患者诊疗记录">
      <h1 class="doc__title">患者诊疗记录</h1>
      <p class="doc__sub">神威高中 医务室</p>

      <p class="doc__line">就诊编号：NO.0017　　　　记录日期：03 / 14</p>
      <p class="doc__line">姓　　名：不详（暂缺）　　　性　别：女</p>
      <p class="doc__line">年　　龄：16　　　　　　　　就诊类型：留观</p>
      <p class="doc__line">科　　室：校医室（综合楼三楼）</p>

      <h2 class="doc__h">主诉</h2>
      <p class="doc__p">03 / 14 于校内被发现，意识模糊，无法说明来路。近期出现短暂记忆缺失、注意力不集中等情况。</p>

      <h2 class="doc__h">诊断</h2>
      <p class="doc__p">记忆缺失（部分）。近期记忆保留，定向力正常，原因待查。建议观察。</p>

      <h2 class="doc__h">既往</h2>
      <p class="doc__p">无法核实。本人否认重大疾病史及过敏史。</p>

      <h2 class="doc__h">医嘱</h2>
      <ol class="doc__ol">
        <li>保持休息，按时服药。</li>
        <li>按时复诊。</li>
        <li>避免短时间接受大量无关信息。</li>
        <li>如患者主动询问过去经历，不建议强行诱导回忆。</li>
        <li>留观期间夜间注射，须由东侧门往返。</li>
      </ol>

      <h2 class="doc__h">查房记录</h2>
      <table class="doc__table">
        <tr><td class="d">03 / 15</td><td>神清，生命体征平稳。</td></tr>
        <tr><td class="d">03 / 17</td><td>夜间睡眠欠佳。患者反复询问同样问题数次。</td></tr>
        <tr><td class="d">03 / 19</td><td>记忆缺失无明显改善，再次出现类似情况。维持目前作息。</td></tr>
      </table>

      <h2 class="doc__h">探视记录</h2>
      <table class="doc__table">
        <tr><td class="d">03 / 15</td><td>黄冠亨</td><td class="r">朋友</td></tr>
        <tr><td class="d">03 / 16</td><td>小花</td><td class="r">朋友</td></tr>
        <tr><td class="d">03 / 17</td><td>黄冠亨</td><td class="r">朋友</td></tr>
        <tr><td class="d">03 / 18</td><td>小花</td><td class="r">朋友</td></tr>
        <tr><td class="d">03 / 19</td><td>黄冠亨</td><td class="r">朋友</td></tr>
      </table>

      <p class="doc__doc-sign">接诊医生：钱锟（校医 / 医务室医生）</p>

      <p class="doc__next-row"><a class="doc__next" data-story="start">03 / 20 上午 ›</a></p>
    </article>

  </div>`;
}

export function mount(root, ctx) {
  const btn = root.querySelector('[data-story]');
  if (!btn) return;
  if (ctx.state().flags?.medicalRead) {
    lockButton(btn);
    return;
  }
  btn.addEventListener('click', () => {
    lockButton(btn);
    const f = ctx.state().flags || {};
    ctx.setState({ progress: 'p1', day: 1, flags: { ...f, medicalRead: 1 } });
  });
}

function lockButton(btn) {
  btn.classList.add('is-done');
  btn.textContent = '03 / 20 上午（已记录）';
}
