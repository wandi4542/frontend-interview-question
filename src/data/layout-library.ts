export type LayoutFilter = '全部' | 'Grid' | 'Flex' | '经典' | '响应式' | '移动端' | '三栏' | '卡片' | '纵向骨架';

export type LayoutSolutionType = 'classic' | 'flex' | 'grid';
export type LayoutDemoTone = 'slate' | 'emerald' | 'blue' | 'amber';
export type LayoutDemoHeight = 'sm' | 'md' | 'lg';

export type LayoutDemoCell = {
  label: string;
  cols?: number;
  start?: number;
  tone?: LayoutDemoTone;
  height?: LayoutDemoHeight;
};

export type LayoutDemo = {
  columns: number;
  rows: LayoutDemoCell[][];
};

export type LayoutDemoPanel = {
  label: string;
  demo: LayoutDemo;
};

export type LayoutSolution = {
  id: string;
  label: string;
  type: LayoutSolutionType;
  recommendation: string;
  summary: string;
  demoPanels: LayoutDemoPanel[];
  htmlCode: string;
  cssCode: string;
};

export type LayoutTopic = {
  id: string;
  title: string;
  summary: string;
  scene: string;
  filters: LayoutFilter[];
  cardPreview: LayoutDemo;
  solutions: LayoutSolution[];
};

const cell = (
  label: string,
  options: Partial<Omit<LayoutDemoCell, 'label'>> = {},
): LayoutDemoCell => ({
  label,
  cols: options.cols ?? 1,
  start: options.start,
  tone: options.tone ?? 'slate',
  height: options.height ?? 'md',
});

const demo = (columns: number, rows: LayoutDemoCell[][]): LayoutDemo => ({ columns, rows });
const panel = (label: string, value: LayoutDemo): LayoutDemoPanel => ({ label, demo: value });

export const layoutFilters: LayoutFilter[] = ['全部', 'Grid', 'Flex', '经典', '响应式', '移动端', '三栏', '卡片', '纵向骨架'];

export const layoutTopics: LayoutTopic[] = [
  {
    id: 'center-layout',
    title: '居中对齐',
    summary: '一个父容器里包一个子盒子，让内容在容器中心稳定落位。',
    scene: '空状态、弹窗主体、登录卡片、结果页主视觉。',
    filters: ['经典', 'Flex', 'Grid'],
    cardPreview: demo(3, [[cell('P', { cols: 3, tone: 'slate', height: 'lg' })], [cell('1', { tone: 'emerald', start: 2 })]]),
    solutions: [
      {
        id: 'center-classic',
        label: '经典布局',
        type: 'classic',
        recommendation: '适合回答老项目兼容写法，父 div 套子 div 的关系最清楚。',
        summary: '通过 relative + absolute + translate 实现父容器中的子元素双向居中。',
        demoPanels: [panel('父子结构', demo(3, [[cell('P', { cols: 3, tone: 'slate', height: 'lg' })], [cell('1', { tone: 'emerald', start: 2 })]]))],
        htmlCode: `<div class="parent">
  <div class="child">1</div>
</div>`,
        cssCode: `.parent {
  position: relative;
  /* position: relative 让父容器变成定位参照物，后面的子元素绝对定位才会以它为基准 */
  min-height: 240px;
  /* min-height: 240px 直接给父盒子一个可见高度，不然看不到居中效果 */
}

.child {
  position: absolute;
  /* position: absolute 让子盒子脱离普通文档流，方便精确放到父容器中心 */
  top: 50%;
  left: 50%;
  /* top: 50% + left: 50% 先把子盒子的左上角移动到父容器中心点 */
  transform: translate(-50%, -50%);
  /* translate(-50%, -50%) 再把子盒子往回拉自身宽高的一半，得到真正的视觉居中 */
}`,
      },
      {
        id: 'center-flex',
        label: 'Flex 布局',
        type: 'flex',
        recommendation: '业务里最常用，结构同样是父 div 套子 div，但代码更短。',
        summary: '父容器开 Flex，子元素沿主轴和交叉轴同时居中。',
        demoPanels: [panel('父子结构', demo(3, [[cell('P', { cols: 3, tone: 'slate', height: 'lg' })], [cell('1', { tone: 'emerald', start: 2 })]]))],
        htmlCode: `<div class="parent">
  <div class="child">1</div>
</div>`,
        cssCode: `.parent {
  display: flex;
  /* display: flex 开启一维布局，子元素会进入 flex 排列上下文 */
  justify-content: center;
  /* justify-content: center 表示主轴居中；默认主轴是水平方向 */
  align-items: center;
  /* align-items: center 表示交叉轴居中；这里就是垂直方向居中 */
  min-height: 240px;
  /* min-height: 240px 让父容器本身有高度，垂直居中才有参照空间 */
}`,
      },
      {
        id: 'center-grid',
        label: 'Grid 布局',
        type: 'grid',
        recommendation: '现代 CSS 最简洁的居中方案，同样保留父子结构。',
        summary: '父容器开 Grid，用 place-items 一次完成水平和垂直居中。',
        demoPanels: [panel('父子结构', demo(3, [[cell('P', { cols: 3, tone: 'slate', height: 'lg' })], [cell('1', { tone: 'emerald', start: 2 })]]))],
        htmlCode: `<div class="parent">
  <div class="child">1</div>
</div>`,
        cssCode: `.parent {
  display: grid;
  /* display: grid 把父容器切到二维布局模型，子元素会作为 grid item 参与排版 */
  place-items: center;
  /* place-items: center 是 align-items: center 和 justify-items: center 的简写，一行完成双向居中 */
  min-height: 240px;
  /* min-height: 240px 让居中区域有实际可视高度 */
}`,
      },
    ],
  },
  {
    id: 'layout-deconstruction',
    title: '布局解构',
    summary: '宽屏并排、窄屏堆叠，是最典型的响应式卡片分布方案。',
    scene: '功能入口区、统计卡片、营销卖点列表。',
    filters: ['Flex', 'Grid', '响应式', '卡片'],
    cardPreview: demo(3, [[cell('P', { cols: 3, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' }), cell('2'), cell('3')]]),
    solutions: [
      {
        id: 'layout-deconstruction-flex',
        label: 'Flex 布局',
        type: 'flex',
        recommendation: '适合线性卡片列表，父容器和多个子项的关系很直观。',
        summary: '父容器 wrap，子项通过 flex-basis 控制宽度下限，屏幕变窄时自动换行堆叠。',
        demoPanels: [
          panel('桌面端', demo(3, [[cell('P', { cols: 3, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' }), cell('2'), cell('3')]])),
          panel('平板端', demo(2, [[cell('P', { cols: 2, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' }), cell('2')], [cell('3', { cols: 2 })]])),
          panel('手机端', demo(1, [[cell('P', { cols: 1, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' })], [cell('2')], [cell('3')]])),
        ],
        htmlCode: `<div class="parent">
  <div class="child">1</div>
  <div class="child">2</div>
  <div class="child">3</div>
</div>`,
        cssCode: `.parent {
  display: flex;
  /* display: flex 先让父容器进入 Flex 布局模型 */
  flex-wrap: wrap;
  /* flex-wrap: wrap 允许子项换行，这是从并排切到堆叠的关键开关 */
  justify-content: center;
  /* justify-content: center 让最后一行项目较少时仍然保持居中观感 */
  gap: 16px;
  /* gap: 16px 统一控制子项之间的横向和纵向间距 */
}

.child {
  flex: 1 1 160px;
  /* flex: 1 1 160px 表示子项基础宽度是 160px，空间足够时拉伸，空间不足时收缩并换行 */
}`,
      },
      {
        id: 'layout-deconstruction-grid',
        label: 'Grid 布局',
        type: 'grid',
        recommendation: '如果你想把响应式列数讲得更直观，Grid 会更像标准答案。',
        summary: '父容器通过 auto-fit + minmax 自动控制列数。',
        demoPanels: [
          panel('桌面端', demo(3, [[cell('P', { cols: 3, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' }), cell('2'), cell('3')]])),
          panel('平板端', demo(2, [[cell('P', { cols: 2, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' }), cell('2')], [cell('3', { cols: 2 })]])),
          panel('手机端', demo(1, [[cell('P', { cols: 1, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' })], [cell('2')], [cell('3')]])),
        ],
        htmlCode: `<div class="parent">
  <div class="child">1</div>
  <div class="child">2</div>
  <div class="child">3</div>
</div>`,
        cssCode: `.parent {
  display: grid;
  /* display: grid 让父容器同时拥有行和列的控制能力 */
  gap: 16px;
  /* gap: 16px 统一控制网格项之间的留白 */
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  /* repeat(auto-fit, minmax(160px, 1fr)) 表示每列最小 160px，空间够就多列，空间不够就自动降列 */
}`,
      },
    ],
  },
  {
    id: 'sidebar-adaptive',
    title: '侧边栏宽度自适应',
    summary: '侧栏有最小值和最大占比限制，主区自动填满剩余空间。',
    scene: '后台导航 + 内容区、文档目录 + 正文、筛选栏 + 列表区。',
    filters: ['Flex', 'Grid', '三栏'],
    cardPreview: demo(3, [[cell('P', { cols: 3, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' }), cell('2', { cols: 2 })]]),
    solutions: [
      {
        id: 'sidebar-adaptive-flex',
        label: 'Flex 布局',
        type: 'flex',
        recommendation: '需要主区滚动、表格或复杂表单时，Flex 很稳。',
        summary: '父容器 Flex，侧栏固定弹性规则，主区用 flex: 1 吃掉剩余宽度。',
        demoPanels: [panel('结构示意', demo(3, [[cell('P', { cols: 3, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' }), cell('2', { cols: 2 })]]))],
        htmlCode: `<div class="parent">
  <aside class="sidebar">1</aside>
  <main class="content">2</main>
</div>`,
        cssCode: `.parent {
  display: flex;
  /* display: flex 让 sidebar 和 content 进入同一条主轴 */
  gap: 16px;
  /* gap: 16px 控制侧栏和主内容之间的留白 */
}

.sidebar {
  flex: 0 0 clamp(160px, 28%, 240px);
  /* flex: 0 0 clamp(160px, 28%, 240px) 表示侧栏不拉伸不压缩，宽度在 160px 到 240px 之间按容器比例变化 */
}

.content {
  flex: 1;
  /* flex: 1 让主内容自动吃掉剩余空间 */
  min-width: 0;
  /* min-width: 0 防止长表格或长单词把主区撑爆 */
}`,
      },
      {
        id: 'sidebar-adaptive-grid',
        label: 'Grid 布局',
        type: 'grid',
        recommendation: '如果页面本身就是明确的列布局，Grid 表达更直接。',
        summary: '父容器用 minmax 描述侧栏轨道，用 1fr 表示内容轨道。',
        demoPanels: [panel('结构示意', demo(3, [[cell('P', { cols: 3, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' }), cell('2', { cols: 2 })]]))],
        htmlCode: `<div class="parent">
  <aside class="sidebar">1</aside>
  <main class="content">2</main>
</div>`,
        cssCode: `.parent {
  display: grid;
  /* display: grid 把父容器切到二维布局模型 */
  gap: 16px;
  /* gap: 16px 控制两列之间的间距 */
  grid-template-columns: minmax(160px, 28%) 1fr;
  /* minmax(160px, 28%) 规定左栏最小 160px、最大占父容器 28%，右侧 1fr 自动填满剩余空间 */
}`,
      },
    ],
  },
  {
    id: 'sticky-footer',
    title: 'Footer 紧贴页面底部',
    summary: '内容少时 footer 落在视口底部，内容多时被正文自然撑开。',
    scene: '官网、登录页、文档页、设置页。',
    filters: ['Flex', 'Grid', '纵向骨架'],
    cardPreview: demo(3, [[cell('P', { cols: 3, tone: 'slate', height: 'sm' })], [cell('1', { cols: 3, height: 'sm' })], [cell('2', { cols: 3, tone: 'emerald', height: 'lg' })], [cell('3', { cols: 3, height: 'sm' })]]),
    solutions: [
      {
        id: 'sticky-footer-flex',
        label: 'Flex 布局',
        type: 'flex',
        recommendation: '最适合讲整页纵向骨架，语义清晰也最常用。',
        summary: '父容器纵向 Flex，main 用 flex: 1 拉开 footer。',
        demoPanels: [panel('结构示意', demo(3, [[cell('P', { cols: 3, tone: 'slate', height: 'sm' })], [cell('1', { cols: 3, height: 'sm' })], [cell('2', { cols: 3, tone: 'emerald', height: 'lg' })], [cell('3', { cols: 3, height: 'sm' })]]))],
        htmlCode: `<div class="parent">
  <header class="header">1</header>
  <main class="main">2</main>
  <footer class="footer">3</footer>
</div>`,
        cssCode: `.parent {
  min-height: 100vh;
  /* min-height: 100vh 保证父容器至少和视口一样高 */
  display: flex;
  /* display: flex 开启 Flex 布局 */
  flex-direction: column;
  /* flex-direction: column 把主轴改成纵向，让头中尾从上到下排列 */
}

.main {
  flex: 1;
  /* flex: 1 表示 main 占满剩余高度，footer 就会被自然推到底部 */
}`,
      },
      {
        id: 'sticky-footer-grid',
        label: 'Grid 布局',
        type: 'grid',
        recommendation: '如果你想直接把头中尾三段规则写成轨道，Grid 更好讲。',
        summary: '父容器用 auto 1fr auto 明确表达纵向结构。',
        demoPanels: [panel('结构示意', demo(3, [[cell('P', { cols: 3, tone: 'slate', height: 'sm' })], [cell('1', { cols: 3, height: 'sm' })], [cell('2', { cols: 3, tone: 'emerald', height: 'lg' })], [cell('3', { cols: 3, height: 'sm' })]]))],
        htmlCode: `<div class="parent">
  <header class="header">1</header>
  <main class="main">2</main>
  <footer class="footer">3</footer>
</div>`,
        cssCode: `.parent {
  min-height: 100vh;
  /* min-height: 100vh 让整页至少撑满一个视口 */
  display: grid;
  /* display: grid 让纵向骨架可以用轨道表达 */
  grid-template-rows: auto 1fr auto;
  /* auto 1fr auto 表示头和尾按内容高度走，中间 main 用 1fr 吞掉剩余高度 */
}`,
      },
    ],
  },
  {
    id: 'holy-grail',
    title: '圣杯布局',
    summary: '头尾通栏，中间三列，两侧固定，中间自适应，是最经典的布局对比题。',
    scene: '中后台框架、管理系统主骨架、面试三栏布局题。',
    filters: ['经典', 'Flex', 'Grid', '三栏', '纵向骨架'],
    cardPreview: demo(4, [[cell('P', { cols: 4, tone: 'slate', height: 'sm' })], [cell('1', { cols: 4, height: 'sm' })], [cell('2'), cell('3', { cols: 2, tone: 'emerald' }), cell('4')], [cell('5', { cols: 4, height: 'sm' })]]),
    solutions: [
      {
        id: 'holy-grail-classic',
        label: '经典布局',
        type: 'classic',
        recommendation: '适合讲传统原理，面试辨识度最高。',
        summary: '父容器先预留空间，再用负 margin 和 relative 把左右栏拉回去。',
        demoPanels: [panel('结构示意', demo(4, [[cell('P', { cols: 4, tone: 'slate', height: 'sm' })], [cell('1', { cols: 4, height: 'sm' })], [cell('3'), cell('2', { cols: 2, tone: 'emerald' }), cell('4')], [cell('5', { cols: 4, height: 'sm' })]]))],
        htmlCode: `<div class="parent">
  <header class="header">1</header>
  <div class="container">
    <main class="content">2</main>
    <aside class="left">3</aside>
    <aside class="right">4</aside>
  </div>
  <footer class="footer">5</footer>
</div>`,
        cssCode: `.container {
  padding: 0 220px 0 180px;
  /* padding: 0 220px 0 180px 先给左右栏预留位置，左栏 180px，右栏 220px */
}

.content,
.left,
.right {
  float: left;
  /* float: left 让三列进入同一行布局逻辑 */
}

.content {
  width: 100%;
  /* width: 100% 让中间列先占满整行，这是“中间优先渲染”的关键 */
}

.left {
  width: 180px;
  margin-left: -100%;
  left: -180px;
  position: relative;
  /* width: 180px 固定左栏宽度；margin-left: -100% 把左栏拉到最左边；left: -180px 再移到预留区域 */
}

.right {
  width: 220px;
  margin-left: -220px;
  right: -220px;
  position: relative;
  /* width: 220px 固定右栏宽度；margin-left: -220px 把右栏拉回主区右侧；right: -220px 再推到预留区域 */
}`,
      },
      {
        id: 'holy-grail-flex',
        label: 'Flex 布局',
        type: 'flex',
        recommendation: '真实项目更推荐，结构清晰且维护成本更低。',
        summary: '外层父容器纵向排列，内部 container 再作为三栏父容器。',
        demoPanels: [panel('结构示意', demo(4, [[cell('P', { cols: 4, tone: 'slate', height: 'sm' })], [cell('1', { cols: 4, height: 'sm' })], [cell('2'), cell('3', { cols: 2, tone: 'emerald' }), cell('4')], [cell('5', { cols: 4, height: 'sm' })]]))],
        htmlCode: `<div class="parent">
  <header class="header">1</header>
  <div class="container">
    <aside class="left">2</aside>
    <main class="content">3</main>
    <aside class="right">4</aside>
  </div>
  <footer class="footer">5</footer>
</div>`,
        cssCode: `.parent {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  /* flex-direction: column 让头、内容区、尾部纵向排布 */
}

.container {
  flex: 1;
  display: flex;
  gap: 16px;
  /* flex: 1 让中间区域占满剩余高度；display: flex 把左右栏和主区放进同一条主轴 */
}

.left,
.right {
  flex: 0 0 220px;
  /* flex: 0 0 220px 表示左右栏固定 220px，不拉伸、不压缩 */
}

.content {
  flex: 1;
  min-width: 0;
  /* flex: 1 让主内容填满剩余宽度；min-width: 0 防止长内容把布局撑坏 */
}`,
      },
      {
        id: 'holy-grail-grid',
        label: 'Grid 布局',
        type: 'grid',
        recommendation: '最适合直接把页面骨架用一行轨道规则讲清楚。',
        summary: '父容器直接定义头中尾和中间三栏的轨道关系。',
        demoPanels: [panel('结构示意', demo(4, [[cell('P', { cols: 4, tone: 'slate', height: 'sm' })], [cell('1', { cols: 4, height: 'sm' })], [cell('2'), cell('3', { cols: 2, tone: 'emerald' }), cell('4')], [cell('5', { cols: 4, height: 'sm' })]]))],
        htmlCode: `<div class="parent">
  <header class="header">1</header>
  <aside class="left">2</aside>
  <main class="content">3</main>
  <aside class="right">4</aside>
  <footer class="footer">5</footer>
</div>`,
        cssCode: `.parent {
  min-height: 100vh;
  display: grid;
  /* display: grid 让整页可以同时控制行和列 */
  grid-template: auto 1fr auto / 220px 1fr 220px;
  /* auto 1fr auto 表示头中尾三行；220px 1fr 220px 表示左中右三列 */
  gap: 16px;
  /* gap: 16px 控制区域之间的留白 */
}

.header,
.footer {
  grid-column: 1 / 4;
  /* grid-column: 1 / 4 让头部和尾部横跨三列，形成通栏效果 */
}`,
      },
    ],
  },
  {
    id: 'span-grid',
    title: 'Span Grid 自适应布局',
    summary: '基于 12 栏思路控制模块跨列，适合看板和内容编排。',
    scene: '数据看板、运营活动页、模块化控制台。',
    filters: ['Grid', '卡片', '响应式'],
    cardPreview: demo(4, [[cell('P', { cols: 4, tone: 'slate', height: 'sm' })], [cell('1', { cols: 4, tone: 'emerald' })], [cell('2', { cols: 2 }), cell('3'), cell('4')]]),
    solutions: [
      {
        id: 'span-grid-grid',
        label: 'Grid 布局',
        type: 'grid',
        recommendation: '这是这个题最原生也最好讲的方案。',
        summary: '父容器切成 12 列，子模块通过 span 控制跨列数量。',
        demoPanels: [
          panel('桌面端', demo(4, [[cell('P', { cols: 4, tone: 'slate', height: 'sm' })], [cell('1', { cols: 4, tone: 'emerald' })], [cell('2', { cols: 2 }), cell('3'), cell('4')]])),
          panel('手机端', demo(2, [[cell('P', { cols: 2, tone: 'slate', height: 'sm' })], [cell('1', { cols: 2, tone: 'emerald' })], [cell('2', { cols: 2 })], [cell('3', { cols: 2 })], [cell('4', { cols: 2 })]])),
        ],
        htmlCode: `<div class="parent">
  <section class="span-12">1</section>
  <section class="span-6">2</section>
  <section class="span-4">3</section>
  <section class="span-2">4</section>
</div>`,
        cssCode: `.parent {
  display: grid;
  /* display: grid 让父容器进入网格布局模型 */
  grid-template-columns: repeat(12, minmax(0, 1fr));
  /* repeat(12, minmax(0, 1fr)) 表示把父容器切成 12 个等比分栏 */
  gap: 16px;
  /* gap: 16px 控制模块之间的间距 */
}

.span-12 { grid-column: span 12; }
/* span 12 表示这个模块横跨 12 列，也就是整行通栏 */
.span-6 { grid-column: span 6; }
/* span 6 表示占一半宽度 */
.span-4 { grid-column: span 4; }
/* span 4 表示占三分之一左右的宽度 */
.span-2 { grid-column: span 2; }
/* span 2 表示只占较小一块区域，适合补充信息模块 */

@media (max-width: 640px) {
  .span-6,
  .span-4,
  .span-2 {
    grid-column: span 12;
    /* 小屏下统一改成 span 12，让所有模块都堆叠成单列 */
  }
}`,
      },
    ],
  },
  {
    id: 'ram-layout',
    title: 'RAM 布局',
    summary: 'repeat + auto-fit + minmax 的组合，特别适合自适应卡片宫格。',
    scene: '商品宫格、模块导航、能力卡片、功能入口。',
    filters: ['Grid', 'Flex', '卡片', '响应式'],
    cardPreview: demo(4, [[cell('P', { cols: 4, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' }), cell('2'), cell('3'), cell('4')]]),
    solutions: [
      {
        id: 'ram-grid',
        label: 'Grid 布局',
        type: 'grid',
        recommendation: '标准 RAM 方案，最适合讲自适应宫格。',
        summary: '父容器根据最小卡片宽度自动计算列数。',
        demoPanels: [
          panel('桌面端', demo(4, [[cell('P', { cols: 4, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' }), cell('2'), cell('3'), cell('4')]])),
          panel('平板端', demo(2, [[cell('P', { cols: 2, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' }), cell('2')], [cell('3'), cell('4')]])),
          panel('手机端', demo(1, [[cell('P', { cols: 1, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' })], [cell('2')], [cell('3')], [cell('4')]])),
        ],
        htmlCode: `<div class="parent">
  <article class="child">1</article>
  <article class="child">2</article>
  <article class="child">3</article>
  <article class="child">4</article>
</div>`,
        cssCode: `.parent {
  display: grid;
  /* display: grid 开启网格布局 */
  gap: 16px;
  /* gap: 16px 控制所有卡片之间的统一留白 */
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  /* repeat(auto-fit, minmax(160px, 1fr)) 表示每列最小 160px，空间足够就多列，不够就自动降列 */
}`,
      },
      {
        id: 'ram-flex',
        label: 'Flex 布局',
        type: 'flex',
        recommendation: '如果团队更熟 Flex，也可以做出近似的自适应效果。',
        summary: '父容器 wrap，子项通过 flex-basis 决定最小宽度。',
        demoPanels: [
          panel('桌面端', demo(4, [[cell('P', { cols: 4, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' }), cell('2'), cell('3'), cell('4')]])),
          panel('平板端', demo(2, [[cell('P', { cols: 2, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' }), cell('2')], [cell('3'), cell('4')]])),
          panel('手机端', demo(1, [[cell('P', { cols: 1, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' })], [cell('2')], [cell('3')], [cell('4')]])),
        ],
        htmlCode: `<div class="parent">
  <article class="child">1</article>
  <article class="child">2</article>
  <article class="child">3</article>
  <article class="child">4</article>
</div>`,
        cssCode: `.parent {
  display: flex;
  /* display: flex 让所有卡片先进入同一条主轴 */
  flex-wrap: wrap;
  /* flex-wrap: wrap 允许卡片换行，是小屏堆叠的关键 */
  gap: 16px;
  /* gap: 16px 控制卡片间距 */
}

.child {
  flex: 1 1 160px;
  /* flex: 1 1 160px 表示每张卡片最小按 160px 布局，宽屏时一起拉伸，窄屏时自动换行 */
}`,
      },
    ],
  },
  {
    id: 'clamp-responsive',
    title: 'clamp() 响应式布局',
    summary: '通过 clamp 同时设置最小值、理想值和最大值，特别适合响应式尺寸控制。',
    scene: '标题字号、容器宽度、按钮宽度、表单控件。',
    filters: ['经典', '响应式'],
    cardPreview: demo(4, [[cell('P', { cols: 4, tone: 'slate', height: 'sm' })], [cell('1', { cols: 2, tone: 'emerald' })]]),
    solutions: [
      {
        id: 'clamp-classic',
        label: '经典布局',
        type: 'classic',
        recommendation: '这是讲响应式尺寸最适合的一道现代 CSS 题。',
        summary: '父容器不必变化，子元素通过 clamp 自动卡住尺寸上下界。',
        demoPanels: [
          panel('宽屏', demo(4, [[cell('P', { cols: 4, tone: 'slate', height: 'sm' })], [cell('1', { cols: 2, tone: 'emerald', start: 2 })]])),
          panel('窄屏', demo(2, [[cell('P', { cols: 2, tone: 'slate', height: 'sm' })], [cell('1', { cols: 1, tone: 'emerald', start: 1 })]])),
        ],
        htmlCode: `<div class="parent">
  <div class="child">1</div>
</div>`,
        cssCode: `.child {
  width: clamp(160px, 50vw, 280px);
  /* clamp(160px, 50vw, 280px) 表示最小 160px，理想值按视口 50vw 计算，最大不超过 280px */
  margin: 0 auto;
  /* margin: 0 auto 让子盒子在父容器里保持水平居中 */
}`,
      },
    ],
  },
  {
    id: 'aspect-ratio-layout',
    title: '固定长宽比缩放',
    summary: '盒子跟着宽度伸缩，但宽高比例始终稳定。',
    scene: '视频封面、Banner、媒体卡片、图片容器。',
    filters: ['经典', '响应式'],
    cardPreview: demo(4, [[cell('P', { cols: 4, tone: 'slate', height: 'sm' })], [cell('1', { cols: 3, tone: 'emerald', height: 'lg', start: 1 })]]),
    solutions: [
      {
        id: 'ratio-classic',
        label: '经典布局',
        type: 'classic',
        recommendation: '适合同时讲传统 padding 百分比方案和现代 aspect-ratio。',
        summary: '父容器包子元素，子元素通过比例控制保持 16:9。',
        demoPanels: [
          panel('宽屏', demo(4, [[cell('P', { cols: 4, tone: 'slate', height: 'sm' })], [cell('1', { cols: 3, tone: 'emerald', height: 'lg', start: 1 })]])),
          panel('窄屏', demo(2, [[cell('P', { cols: 2, tone: 'slate', height: 'sm' })], [cell('1', { cols: 2, tone: 'emerald', height: 'md' })]])),
        ],
        htmlCode: `<div class="parent">
  <div class="child">1</div>
</div>`,
        cssCode: `.parent {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  /* padding-top: 56.25% 表示 9 / 16 的比例，是传统固定比例盒子的常见写法 */
}

.child {
  position: absolute;
  inset: 0;
  /* inset: 0 表示子盒子贴满父容器四边 */
  aspect-ratio: 16 / 9;
  /* aspect-ratio: 16 / 9 让盒子在现代浏览器里直接保持 16:9 比例 */
}`,
      },
    ],
  },
  {
    id: 'responsive-breakpoints',
    title: '响应式断点',
    summary: '根据桌面、平板、手机切换列数和信息密度，是多端页面最核心的方案。',
    scene: '官网卡片区、后台列表、内容页推荐区、模块栅格。',
    filters: ['Grid', 'Flex', '响应式', '卡片'],
    cardPreview: demo(4, [[cell('P', { cols: 4, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' }), cell('2'), cell('3'), cell('4')]]),
    solutions: [
      {
        id: 'responsive-breakpoints-grid',
        label: 'Grid 布局',
        type: 'grid',
        recommendation: '最适合讲“断点调整的是列规则，不是整体缩放”。',
        summary: '父容器在不同断点下切换 4 列、2 列、1 列。',
        demoPanels: [
          panel('桌面端', demo(4, [[cell('P', { cols: 4, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' }), cell('2'), cell('3'), cell('4')]])),
          panel('平板端', demo(2, [[cell('P', { cols: 2, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' }), cell('2')], [cell('3'), cell('4')]])),
          panel('手机端', demo(1, [[cell('P', { cols: 1, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' })], [cell('2')], [cell('3')], [cell('4')]])),
        ],
        htmlCode: `<div class="parent">
  <article class="card">1</article>
  <article class="card">2</article>
  <article class="card">3</article>
  <article class="card">4</article>
</div>`,
        cssCode: `.parent {
  display: grid;
  /* display: grid 让父容器的列数可以直接按断点切换 */
  gap: 16px;
  /* gap: 16px 保持不同断点下的间距节奏一致 */
  grid-template-columns: repeat(4, 1fr);
  /* 桌面端用 repeat(4, 1fr) 表示一行四列，适合宽屏高信息密度 */
}

@media (max-width: 1024px) {
  .parent {
    grid-template-columns: repeat(2, 1fr);
    /* 平板端改成两列，让单卡片宽度回到可读范围 */
  }
}

@media (max-width: 640px) {
  .parent {
    grid-template-columns: 1fr;
    /* 手机端改成单列，阅读和点击都更稳定 */
  }
}`,
      },
      {
        id: 'responsive-breakpoints-flex',
        label: 'Flex 布局',
        type: 'flex',
        recommendation: '如果卡片宽度不完全规则，Flex 断点方案也很好讲。',
        summary: '父容器 wrap，子项在不同断点下切换 flex-basis。',
        demoPanels: [
          panel('桌面端', demo(4, [[cell('P', { cols: 4, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' }), cell('2'), cell('3'), cell('4')]])),
          panel('平板端', demo(2, [[cell('P', { cols: 2, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' }), cell('2')], [cell('3'), cell('4')]])),
          panel('手机端', demo(1, [[cell('P', { cols: 1, tone: 'slate', height: 'sm' })], [cell('1', { tone: 'emerald' })], [cell('2')], [cell('3')], [cell('4')]])),
        ],
        htmlCode: `<div class="parent">
  <article class="child">1</article>
  <article class="child">2</article>
  <article class="child">3</article>
  <article class="child">4</article>
</div>`,
        cssCode: `.parent {
  display: flex;
  /* display: flex 让所有子卡片先进入同一条主轴 */
  flex-wrap: wrap;
  /* flex-wrap: wrap 允许宽度不够时自动换行 */
  gap: 16px;
  /* gap: 16px 控制卡片间距 */
}

.child {
  flex: 1 1 calc(25% - 16px);
  /* 桌面端用 25% 减去间距，接近四列布局效果 */
}

@media (max-width: 1024px) {
  .child {
    flex-basis: calc(50% - 16px);
    /* 平板端每项改成约半宽，一行两张卡片 */
  }
}

@media (max-width: 640px) {
  .child {
    flex-basis: 100%;
    /* 手机端每项占满整行，形成单列布局 */
  }
}`,
      },
    ],
  },
  {
    id: 'mobile-adaptation',
    title: '移动端适配',
    summary: '从尺寸体系到安全区再到纵向骨架，统一讲清 H5 页面适配思路。',
    scene: '活动页、内容页、Hybrid 页面、移动端表单页。',
    filters: ['移动端', '响应式', 'Flex', '经典'],
    cardPreview: demo(3, [[cell('P', { cols: 3, tone: 'slate', height: 'sm' })], [cell('1', { cols: 3, tone: 'emerald', height: 'sm' })], [cell('2', { cols: 3, height: 'lg' })]]),
    solutions: [
      {
        id: 'mobile-adaptation-classic',
        label: '经典布局',
        type: 'classic',
        recommendation: '适合先从 rem、vw、safe-area 这些尺寸体系讲起。',
        summary: '父容器负责安全区和留白，内部子模块跟着 rem / vw 变化。',
        demoPanels: [
          panel('大屏手机', demo(3, [[cell('P', { cols: 3, tone: 'slate', height: 'sm' })], [cell('1', { cols: 3, tone: 'emerald', height: 'sm' })], [cell('2', { cols: 3, height: 'lg' })]])),
          panel('小屏手机', demo(1, [[cell('P', { cols: 1, tone: 'slate', height: 'sm' })], [cell('1', { cols: 1, tone: 'emerald', height: 'sm' })], [cell('2', { cols: 1, height: 'lg' })]])),
        ],
        htmlCode: `<div class="parent">
  <section class="hero">1</section>
  <section class="panel">2</section>
</div>`,
        cssCode: `html {
  font-size: clamp(14px, 3.8vw, 18px);
  /* clamp(14px, 3.8vw, 18px) 表示根字体最小 14px，理想按视口宽度缩放，最大不超过 18px */
}

.parent {
  padding: calc(env(safe-area-inset-top) + 12px) 16px 16px;
  /* env(safe-area-inset-top) + 12px 让内容避开刘海区；左右 16px 是常见移动端安全留白 */
}

.hero {
  min-height: 40vw;
  /* min-height: 40vw 表示头图高度按视口宽度的 40% 伸缩 */
  border-radius: 1rem;
  /* border-radius: 1rem 让圆角跟随 rem 尺寸体系一起缩放 */
}`,
      },
      {
        id: 'mobile-adaptation-flex',
        label: 'Flex 布局',
        type: 'flex',
        recommendation: '适合讲移动端纵向页面骨架。',
        summary: '父容器用 column 排布头中尾，再用安全区和 d vh 处理真实设备高度。',
        demoPanels: [
          panel('大屏手机', demo(3, [[cell('P', { cols: 3, tone: 'slate', height: 'sm' })], [cell('1', { cols: 3, tone: 'emerald', height: 'sm' })], [cell('2', { cols: 3, height: 'lg' })], [cell('3', { cols: 3, height: 'sm' })]])),
          panel('小屏手机', demo(1, [[cell('P', { cols: 1, tone: 'slate', height: 'sm' })], [cell('1', { cols: 1, tone: 'emerald', height: 'sm' })], [cell('2', { cols: 1, height: 'lg' })], [cell('3', { cols: 1, height: 'sm' })]])),
        ],
        htmlCode: `<div class="parent">
  <header class="header">1</header>
  <main class="content">2</main>
  <footer class="footer">3</footer>
</div>`,
        cssCode: `.parent {
  min-height: 100dvh;
  /* 100dvh 比 100vh 更适合移动端，会跟随动态地址栏变化 */
  display: flex;
  /* display: flex 开启纵向骨架布局 */
  flex-direction: column;
  /* flex-direction: column 让头、中、尾从上到下排列 */
  gap: 16px;
  /* gap: 16px 控制模块上下间距 */
  padding: calc(env(safe-area-inset-top) + 12px) 16px calc(env(safe-area-inset-bottom) + 16px);
  /* 顶部和底部 padding 同时考虑刘海区与底部手势区 */
}

.content {
  flex: 1;
  /* flex: 1 让主内容在纵向方向上吃掉剩余空间 */
}`,
      },
    ],
  },
];

export const strategyRows = [
  {
    label: '先看父容器，再看子元素',
    description: '布局题先明确谁是 parent，谁是 child，再去解释关键属性，表达会更稳。',
  },
  {
    label: '响应式要展示多态结果',
    description: '遇到响应式布局，最好同时展示桌面端、平板端、手机端，而不是只放一张效果图。',
  },
  {
    label: '属性和数值一起讲',
    description: '面试里不要只说 flex 或 grid，要把像 1fr、160px、220px、100vh 这些关键值一起讲清楚。',
  },
  {
    label: '代码注释尽量贴近代码行',
    description: '把解释写进代码块里，阅读和背诵都会更顺手，也更容易理解为什么这么写。',
  },
];
