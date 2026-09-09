/* ==========================================================================
   002 — PERSONAL BLOG · 个人博客（现为青搜浏览器内的一个网页）
   ==========================================================================
   "我自己记录我"。博客本身就是剧情记录的一部分。
   第一人称、非常普通、不文学化、不解释世界观。
   时间线：2026-03-20 第一天 / 03-21 第二天（文化节）。
   第二篇仅在 flags.vvAnswered（第一天流程完成）后可见。
   导出 blogHTML(state) 供 004 浏览器以 key='blog' 渲染。
   ========================================================================== */

const ENTRIES = [
  {
    id: 'd3',
    title: '03.22｜下午去了趟后勤',
    date: '03 / 22', time: '21:47', cat: '记事', views: 1, comments: 0,
    need: 'd3',
    body: `
    <p>今天下午跟黄冠亨去了趟后勤。</p>
    <p>本来只是陪他去搬班里的东西，没什么特别的。</p>
    <p>直到他说起要去后勤，我才突然想起昨天晚上看到的那条动态。</p>
    <p>昨天文化节散场前，他把自己的VV号写在纸条上给了我。</p>
    <p>我回去以后，还是忍不住搜了一下。</p>
    <p>他的空间里没什么特别的东西，只是一些很普通的动态。</p>
    <p>其中有一条，提到了一把钥匙。</p>
    <p>上面贴着一个很小的标签，写着"3F"。</p>
    <p>他当时说，是自己捡到的，发到了论坛的失物招领区，要是没人认领，就拿去后勤。</p>
    <p>我也是看到这里，才顺着去论坛搜了那条旧帖子。</p>
    <p>现在我给他发的好友申请，还躺在那里。</p>
    <p>他没有通过，也没有拒绝。</p>
    <p>他的账号一直显示不在线，空间里最新的一条动态，停在2009年。</p>
    <p>但这并不能说明什么。</p>
    <p>这些年他有没有登录过、有没有只是不再发东西，我都不知道。</p>
    <p>……可能只是我想多了。</p>
    <p>只是"3F"这两个字符，从昨晚开始就一直卡在我脑子里。</p>
    <p>在路上我问黄冠亨，综合楼三楼是不是还有别的房间。</p>
    <p>他看我的眼神有点奇怪，问我为什么突然问这个。</p>
    <p>我只能说晚上在校医室太无聊，随便翻论坛看到的。</p>
    <p>现在想想这个理由挺蹩脚的。但他好像也没多问。</p>
    <p>到了后勤，办公室里堆着半人高的纸箱。</p>
    <p>管后勤的大叔听完我们的来意，挠了挠头。</p>
    <blockquote class="blog-quote">"这么久了，我也不确定还在不在。"</blockquote>
    <blockquote class="blog-quote">"钥匙都堆在后头库房里，你们要不自己找找？"</blockquote>
    <blockquote class="blog-quote">"我记得以前有学生往这边交过不少东西，具体哪一把我真说不上来。"</blockquote>
    <p>黄冠亨本来就要搬班里的东西，我们跟大叔说了一声，就进了里间的库房。</p>
    <p>库房比我想的还挤。</p>
    <p>纸箱摞着纸箱，缝里塞着折叠椅，墙上靠着几张卷起来的旧海报，全都落了一层灰。</p>
    <p>角落里挂着几个透明袋子，里面是伞、水杯、校牌之类的东西。</p>
    <p>看得出真的有人常年往这里塞东西。</p>
    <p>我们分头翻。黄冠亨去搬他要搬的箱子，我一格一格看架子上的杂物盒。</p>
    <p>翻到第三个纸箱的时候，底下压着几张报纸。</p>
    <p>已经泛黄了。最上面一张是《神威高中校园报》，前年十月的，标题是校园歌手大赛总决赛的报道。</p>
    <p>我本来只是随便扫了一眼。</p>
    <p>正文里有一行：高二组参赛学生，钱锟。</p>
    <p>我下意识愣了一下。</p>
    <p>但很快又觉得，应该只是同名。</p>
    <p>钱这个姓也不算特别。现在的钱医生已经在校医室工作了，这张报纸都已经是两年前的了。</p>
    <p>我正准备把报纸放回去，黄冠亨却突然开口。</p>
    <blockquote class="blog-quote">"钱锟？"</blockquote>
    <p>我嗯了一声。</p>
    <p>他皱了一下眉。</p>
    <blockquote class="blog-quote">"我好像真的见过他穿校服。"</blockquote>
    <p>我愣了一下。</p>
    <blockquote class="blog-quote">"你是不是以前在哪个考古贴里看过？"</blockquote>
    <blockquote class="blog-quote">"钱医生肯定也上过学啊，有穿校服的照片不是很正常吗。"</blockquote>
    <p>他盯着我看了一会儿。</p>
    <blockquote class="blog-quote">"……可能吧。"</blockquote>
    <blockquote class="blog-quote">"我也不确定。"</blockquote>
    <p>他把那张报纸压回箱子里，说先找东西。</p>
    <p>我们继续翻。</p>
    <p>钥匙是在靠窗最底下一层找到的。</p>
    <p>一个铁皮盒里，跟几把没拆封的挂锁挤在一起。</p>
    <p>一根旧钥匙，标签折得快断了，"3F"两个字符还在。</p>
    <blockquote class="blog-quote">"这个？"</blockquote>
    <p>黄冠亨拿起来对着光看了一眼，递给我。</p>
    <p>就是这个。</p>
    <div class="itemget">
      <div class="itemget__bar">获得物品</div>
      <div class="itemget__body">
        <div class="itemget__key" aria-hidden="true"></div>
        <div>
          <b>旧钥匙</b>
          <span>一把普通的旧金属钥匙。标签折过几道，上面写着"3F"。</span>
        </div>
      </div>
    </div>
    <p>我问大叔能不能拿走，大叔摆摆手，说放着也是放着。</p>
    <p>从库房出来的时候，黄冠亨拎着他要搬的箱子，我兜里揣着那把钥匙。</p>
    <p>他说既然都拿了，要不要顺便去试试是哪扇门。</p>
    <p>其实不用他说，我也正想去。</p>
    <p>综合楼三楼。走廊尽头是校医室，那扇门我熟。</p>
    <p>但 3F 对的不是那扇门。</p>
    <p>是走廊中段一扇很不起眼的门，长得跟普通教室门差不多，我前天路过的时候根本没注意过它。</p>
    <p>钥匙插进去，转了两下，开了。</p>
    <p>黄冠亨愣在门口。</p>
    <blockquote class="blog-quote">"这里还有房间？"</blockquote>
    <p>门后面不是教室。</p>
    <p>是一间校医室。</p>
    <p>跟我住的那间几乎一模一样。同样的格局，同样靠墙的白柜子，同样一排候诊椅，连床头帘子的挂法都一样。</p>
    <p>只是这里到处蒙着灰，空气闷闷的，是一种门窗关了很久的味道。</p>
    <p>黄冠亨进去转了一圈，什么都没说。</p>
    <p>然后他停在墙边一块软木板前面。</p>
    <p>板上钉着两张纸。</p>
    <p>一张是《校医室值班安排》，2026 年 3 月，上面的名字我很眼熟，钱医生就在上面。</p>
    <p>另一张纸已经泛黄，边角卷了起来，也是值班安排，日期却是 2015 年 12 月。</p>
    <p>两张纸钉在同一块板上。不像谁随手存的旧档案，倒像是……一直被人这么用着。</p>
    <p>我在旧的那张上，看到了一个名字。</p>
    <p>肖俊。</p>
    <blockquote class="blog-quote">"肖老师？"</blockquote>
    <p>我又看了一遍那一栏。</p>
    <blockquote class="blog-quote">"医生值班？"</blockquote>
    <p>黄冠亨看了那张表很久。</p>
    <blockquote class="blog-quote">"肖俊以前……"</blockquote>
    <p>他停了一下。</p>
    <blockquote class="blog-quote">"我好像对他穿这身衣服有点印象。"</blockquote>
    <p>我顺着他的视线看向值班表。</p>
    <blockquote class="blog-quote">"医生服？"</blockquote>
    <blockquote class="blog-quote">"嗯。"</blockquote>
    <blockquote class="blog-quote">"但具体什么时候，我不记得了。"</blockquote>
    <p>他说完自己摇了摇头，没再往下说。</p>
    <p>就在这时候，走廊里传来脚步声。</p>
    <p>由远及近，不紧不慢，但在那种安静里特别清楚。</p>
    <p>我们两个同时闭嘴。</p>
    <p>黄冠亨压低声音："有人来了。拍一下。"</p>
    <p>我掏出手机，他也掏出了手机。</p>
    <p>两张值班表，一人拍一张，镜头都没端稳。</p>
    <p>脚步声到门口附近停了一下，又往楼梯那边去了。</p>
    <p>我们几乎是逃出来的，钥匙揣进兜里，门在身后带上，锁舌咔哒一声。</p>
    <p>刚走到楼梯口，就碰上了肖老师。</p>
    <p>他看了看我们两个。</p>
    <blockquote class="blog-quote">"你们两个怎么跑这儿来了？"</blockquote>
    <p>黄冠亨抢着说来找点东西，我在旁边点头。</p>
    <p>他"嗯"了一声。</p>
    <blockquote class="blog-quote">"三楼没什么好逛的吧？没事的话就回去吧。"</blockquote>
    <p>然后他就先下楼了。从头到尾，没有多问一句。</p>
    <p>……</p>
    <p>回到医务室，我把照片传到了电脑上。</p>
    <p>拍得不太好，手抖了，有一点糊。但值班表上的字都还能看清。</p>
    <p>两张表，两个年份，钉在同一块板上。</p>
    <p>还有库房里那张报纸。</p>
    <p>黄冠亨到现在也没说清他到底想起了什么。</p>
    <p>我当时不知道他到底想起了什么。</p>
    <p>我现在也不知道。</p>
  `,
  },
  {
    id: 'd2',
    title: '03.21｜文化节',
    date: '03 / 21', time: '23:19', cat: '记事', views: 2, comments: 0,
    need: 'd2',
    body: `
    <p>今天终于可以出去走走了。</p>
    <p>早上醒的时候其实还是有点懵，我甚至不知道自己现在到底算不算已经好了。昨天从综合楼回来以后整个人都累得不行，晚上打针的时候手还是有点发凉。</p>
    <p>钱锟医生过来的时候看了我一会儿，说我今天气色比昨天好多了。</p>
    <p>他说学校今天有文化节，问我要不要下去逛一会儿。</p>
    <p>我本来还犹豫了一下。</p>
    <p>不过一直躺在医务室里也确实有点闷，所以最后还是答应了。他让我别做剧烈运动，觉得累了就回来，晚上还得继续打针。</p>
    <p>我记得自己当时还说了一句"知道了"。</p>
    <p>现在想想，那个时候我甚至有点高兴。</p>
    <p>至少今天不用一直待在那里。</p>
    <p>文化节比我想象得热闹。</p>
    <p>外面到处都是人，摊位挤在一起，路边还贴着各种乱七八糟的海报。有人拿着吃的从我旁边跑过去，还有人在很远的地方喊自己的朋友。</p>
    <p>我其实没参加什么，就是慢慢走。</p>
    <p>中间碰到了肖俊。</p>
    <p>我之前在学校官网上看到过他的资料，知道他是老师。他应该是在文化节现场维持秩序，看见我的时候停下来问了一句：</p>
    <blockquote class="blog-quote">"最近身体好一点了吗？"</blockquote>
    <p>我说：</p>
    <blockquote class="blog-quote">"好多了。"</blockquote>
    <p>他说：</p>
    <blockquote class="blog-quote">"那就好，今天别太累。"</blockquote>
    <p>然后就走了。</p>
    <p>就这么几句话。</p>
    <p>不知道为什么，我看着他的背影的时候，总有种他好像认识我的感觉。</p>
    <p>但我对他确实没什么印象。</p>
    <p>算了，也可能只是我自己想多了。</p>
    <p>后来我在人群里看到了昨天那个人。</p>
    <p>就是在综合楼后面遇到的那个人。</p>
    <p>李永钦。</p>
    <p>他没有站在哪个摊位前，也没有和谁说话。</p>
    <p>就是在人群里慢慢地走。</p>
    <p>我看了他一会儿，还是走过去了。</p>
    <blockquote class="blog-quote">"诶，你也在这里吗？"</blockquote>
    <p>他看见我，点了一下头。</p>
    <blockquote class="blog-quote">"嗯。"</blockquote>
    <p>我突然觉得昨天的事情有点荒唐。</p>
    <p>所以先跟他说了声谢谢。</p>
    <blockquote class="blog-quote">"昨天谢谢你的提醒。"</blockquote>
    <blockquote class="blog-quote">"那条路真的停电了。"</blockquote>
    <p>他说：</p>
    <blockquote class="blog-quote">"这没什么。"</blockquote>
    <p>他说得很平常。</p>
    <p>好像昨天晚上那件事根本不值得提。</p>
    <p>可我反而因为他的这个反应，想起了另外一件事。</p>
    <p>我问他：</p>
    <blockquote class="blog-quote">"对了，你知不知道有一个学长和你同名？"</blockquote>
    <p>他看着我，像是觉得这个问题有点奇怪。</p>
    <blockquote class="blog-quote">"同名不是很常见吗？"</blockquote>
    <p>我没接话。</p>
    <p>因为我脑子里想到的，是我昨天查到的那些东西。</p>
    <p>同样的名字。</p>
    <p>同样的学校。</p>
    <p>可是一个是在2009年留下最后记录以后就再也没有消息的人。</p>
    <p>而眼前这个人，现在就站在我面前。</p>
    <p>我忍不住又问：</p>
    <blockquote class="blog-quote">"可是你是怎么知道昨天那条路……"</blockquote>
    <p>后面的那句话还没说完，他突然看向了我身后。</p>
    <p>我顺着他的视线看过去。</p>
    <p>黄冠亨正在朝这边走。</p>
    <p>他离得还有一点距离，我还没来得及说什么，李永钦已经先开口了。</p>
    <blockquote class="blog-quote">"我现在有点急事。"</blockquote>
    <p>我愣了一下。</p>
    <blockquote class="blog-quote">"啊？"</blockquote>
    <blockquote class="blog-quote">"现在不太方便说话。"</blockquote>
    <p>他说完以后，从口袋里拿出一张很小的纸条，折得整整齐齐，直接放到我手里。</p>
    <blockquote class="blog-quote">"如果有什么事，可以通过这个找我。"</blockquote>
    <p>我低头看了一眼。</p>
    <p>是一串字母和数字。</p>
    <p>我还没来得及问他，他已经往旁边走了。</p>
    <p>我本来想把刚才没问完的话继续说下去，可黄冠亨已经走到我旁边了。</p>
    <blockquote class="blog-quote">"诶，你刚才在跟谁说话？"</blockquote>
    <p>我一下不知道该怎么回答。</p>
    <blockquote class="blog-quote">"没有啊。"</blockquote>
    <p>我停了一下。</p>
    <blockquote class="blog-quote">"我自言自语。"</blockquote>
    <p>黄冠亨看了我一眼。</p>
    <blockquote class="blog-quote">"你是不是还没完全好啊？"</blockquote>
    <blockquote class="blog-quote">"没有，真的好多了。"</blockquote>
    <p>他说：</p>
    <blockquote class="blog-quote">"那你别一个人待太久，晚上还得回去打针呢。"</blockquote>
    <p>我说知道了。</p>
    <p>后来我再回头的时候，已经看不到李永钦了。</p>
    <p>我也不知道他是什么时候走的。</p>
    <p>晚上回到医务室以后，我又把那张纸条拿出来看了一遍。</p>
    <p>我到现在还是有点想不明白。</p>
    <p>也不知道我到底是在怀疑什么。</p>
    <p>但我还是打开了电脑。</p>
    <div class="blog-note-wrap">
      <div class="blog-note" aria-label="纸条">kelyqqq_1001</div>
    </div>
  `,
  },
  {
    id: 'd1',
    title: '03.20｜第一次下楼',
    date: '03 / 20', time: '22:41', cat: '记事', views: 3, comments: 0,
    need: null,
    body: `
    <p>今天醒起来之后好像什么都不记得……有两个叫小花和黄冠亨的"朋友"来找我。我不太记得他们。但我发现病历上面他们好像每天都来……</p>
    <p>钱医生说我可以出去走走，不过晚上记得回来打针。</p>
    <p>我们三个一起下楼，随便扯了几句</p>
    <p>但是突然好多人都在往综合楼走。</p>
    <p>不知道发生了什么。</p>
    <p>有人在跑，还有人在喊。</p>
    <p>综合楼好像停电了。</p>
    <p>天又快黑了，里面特别乱。</p>
    <p>黄冠亨说，要不直接送我回校医室吧，我们就跟着人群回去了。</p>
    <p>可能是因为停电了吧，小花好像特别害怕。</p>
    <p>黄冠亨怎么劝她都不和我们上三楼。</p>
    <p>她说她要回宿舍。</p>
    <p>最后她自己走了。</p>
    <p>我和黄冠亨发现，三楼的校医室门锁着。</p>
    <p>而且好像是从里面锁的。</p>
    <p>敲了几次都没人开。</p>
    <p>黄冠亨说可能有别的后门侧面什么的，附近应该也还有教室开着。让我们分开找找。</p>
    <p>我就先下楼了。</p>
    <p>从综合楼后面绕出去的时候，在湖边看见一个人。</p>
    <p>旁边都是废弃的健身器材。</p>
    <p>我问他为什么一个人在这里。</p>
    <p>他说了几句奇怪的话。</p>
    <p>我后来才注意到他衣服上的校牌。</p>
    <p>李永钦。</p>
    <figure class="blog-photo">
      <div class="slot slot--placeholder" data-slot="blog-li-card">
        <img src="./assets/images/blog-li-card.jpg" alt=""
             onerror="this.remove()" loading="lazy">
      </div>
      <figcaption>他衣服上的校牌。</figcaption>
    </figure>
    <p>我问他：</p>
    <blockquote class="blog-quote">"你不回寝室吗？"</blockquote>
    <p>他看着综合楼那边。</p>
    <p>说了一句：</p>
    <blockquote class="blog-quote">"他们不是都在里面吗？"</blockquote>
    <p>我没听懂。</p>
    <p>也没继续问。觉得这个人神神鬼鬼的。还是别理他。</p>
    <p>我准备走的时候，他突然叫住我和我说别走那条大路。</p>
    <p>我问为什么。</p>
    <p>他就说绕路。</p>
    <p>感觉这个人有点莫名其妙。</p>
    <p>我本来没打算听他的。</p>
    <p>结果走到大路那边的时候，才发现那一段真的一点灯都没有。</p>
    <p>应该是停电了。</p>
    <p>天已经很黑了。</p>
    <p>我怕黑，最后还是绕开了。</p>
    <p>回三楼的时候，校医室已经开门了。</p>
    <p>钱医生还在里面。</p>
    <p>好像什么都没发生过。</p>
    <p>他还问我怎么这么晚。</p>
    <p>然后给我打了针。</p>
    <p>他说下次别这么晚回来。</p>
    <p>……</p>
    <p>现在想想。</p>
    <p>今天遇到的那个人还是有点奇怪。</p>
    <p>不过应该没什么吧。</p>
  `,
  },
];

function entryHTML(e) {
  return `
        <article class="blog-entry" data-blog-entry="${e.id}">
          <h2 class="blog-entry__title"><a>${e.title}</a></h2>
          <div class="blog-entry__meta">
            <span>${e.date} ${e.time}</span>
            <span>分类: ${e.cat}</span>
            <span>浏览(${e.views})</span>
            <span>评论(${e.comments})</span>
          </div>
          <div class="blog-entry__body">${e.body}</div>
          <div class="blog-entry__foot">
            <a>阅读(1)</a><a>评论(0)</a><a>编辑</a>
          </div>
        </article>`;
}

/** 博客页面主体（浏览器视口内直接滚动）。
 *  state.flags.vvAnswered = 第一天流程完成 → 解锁 03.21 文化节篇（新日志在前） */
export function blogHTML(state = null) {
  const f = state?.flags || {};
  const rp = state?.readPosts || {};
  /* d2 = 第一天调查节点（打开寻人帖 或 主搜"李永钦"）；d3 = 主控答应陪黄冠亨去后勤 */
  const gates = {
    d2: !!(rp.t2001 || f.day1Searched),
    d3: !!f.vv2Done,
  };
  const list = ENTRIES.filter(e => !e.need || gates[e.need]);
  const cal = gates.d2
    ? '19　<b>20</b>　<b style="border-bottom-color:#A32C26;">21</b>　22　23　24　25'
    : '19　<b>20</b>　21　22　23　24　25';

  return `
  <div class="blog">
    <header class="blog-banner">
      <div class="blog__name">未命名的小站</div>
      <div class="blog__desc">这里用来放记事 · SINCE 03/14</div>
    </header>
    <nav class="blog-nav">
      <a>首页</a><a>日志</a><a>相册</a><a>留言板</a>
    </nav>

    <div class="blog-body">
      <div class="blog-main">
        ${list.map(entryHTML).join('\n')}

        <div class="blog-entry" style="text-align:center;color:#94989F;">
          上一页　<b style="color:#A32C26;">1</b>　下一页
        </div>
      </div>

      <aside class="blog-side">
        <div class="blog-side__box">
          <div class="blog-side__title">日历</div>
          <div class="blog-side__inner">
            <div class="cal">
              三 月<br>
              日　一　二　三　四　五　六<br>
              　　　　　　1　2　3　4<br>
              5　6　7　8　9　10　11<br>
              12　13　14　15　16　17　18<br>
              ${cal}<br>
              26　27　28　29　30　31
            </div>
          </div>
        </div>
        <div class="blog-side__box">
          <div class="blog-side__title">日志分类</div>
          <div class="blog-side__inner">
            <ul><li><a>记事</a> <span class="cnt">(${list.length})</span></li></ul>
          </div>
        </div>
        <div class="blog-side__box">
          <div class="blog-side__title">访客计数</div>
          <div class="blog-side__inner">
            <div style="text-align:center;margin-bottom:4px;">您是第</div>
            <div class="blog-counter">000006</div>
            <div style="text-align:center;margin-top:4px;">位访客</div>
          </div>
        </div>
      </aside>
    </div>

    <div style="text-align:center;font-size:11px;color:#94989F;padding:14px 0 20px;">
      未命名的小站 · Powered by 无名博客 1.0 · SINCE 03/14
    </div>
  </div>`;
}
