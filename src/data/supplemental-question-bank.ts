import type { QuestionCategory, QuestionItem } from '../types/question';
import { supplementalSections } from './supplemental-question-data';
import type { SupplementalQuestionSource } from './supplemental-question-data';

interface SectionConfig {
  id: string;
  name: string;
  keywords: string[];
}

const FIRST_CATEGORY_NUMBER = 16;

const sectionConfigs: SectionConfig[] = [
  { id: 'troubleshooting', name: '页面异常与问题排查', keywords: ['排查', '调试', '线上问题', '白屏'] },
  { id: 'network-scenarios', name: '接口请求与网络场景', keywords: ['网络请求', 'Axios', '接口', '跨域'] },
  { id: 'vue3-design', name: 'Vue 3 组件设计场景', keywords: ['Vue 3', '组件设计', '组合式函数'] },
  { id: 'table-data', name: '表格与大数据场景', keywords: ['表格', '大数据', '虚拟列表', '分页'] },
  { id: 'echarts-scenarios', name: 'ECharts 图表场景', keywords: ['ECharts', '图表', '可视化'] },
  { id: 'auth-permissions', name: '登录、菜单与权限管理', keywords: ['登录', '权限', '菜单', '动态路由'] },
  { id: 'performance-scenarios', name: '性能优化场景', keywords: ['性能优化', '首屏', '打包体积'] },
  { id: 'layout-scenarios', name: 'CSS 与页面布局场景', keywords: ['CSS', '布局', '响应式'] },
  { id: 'map-scenarios', name: '地图项目场景', keywords: ['地图', 'Marker', '坐标系'] },
  { id: 'realtime-iot', name: 'WebSocket、MQTT 与物联网场景', keywords: ['WebSocket', 'MQTT', '物联网'] },
  { id: 'git-collaboration', name: 'Git 与团队协作场景', keywords: ['Git', '团队协作', '冲突'] },
  { id: 'project-behavior', name: '项目经历与行为场景题', keywords: ['项目经历', '行为面试', '沟通协作'] },
];

const duplicateQuestionTitles = new Set([
  normalizeQuestionTitle('v-for为什么要使用稳定的key？'),
]);

const answerEnhancements: Record<string, string> = {
  '项目启动后页面白屏，可能有哪些原因？你会怎么排查？':
    '生产环境还应结合错误监控平台、Source Map 和发布版本号定位具体报错代码；排查顺序建议遵循“资源加载 → 运行时错误 → 路由挂载 → 接口与权限 → 最近变更”，避免无目的地逐段试错。',
  '本地运行正常，打包部署后白屏，如何定位？':
    '如果项目部署在二级目录，还要同时核对 Vite 的 <code>base</code>、路由的 history base 和服务器静态目录。修复后应直接访问深层路由并刷新，验证资源路径和 history 回退都正常。',
  '多个接口同时返回401，如何避免重复弹窗和重复跳转？':
    '更完整的实现通常采用“单飞刷新”：全局只允许一个刷新 Token 请求，其余失败请求进入队列；刷新成功后统一重放，失败后只执行一次清理登录态和跳转。',
  '用户快速切换条件，后发请求先返回，导致显示旧数据，怎么处理？':
    '除了取消请求，也可以为每次查询递增版本号，响应返回时只接收最新版本。无论采用哪种方案，加载状态也必须和当前请求绑定，避免旧请求提前关闭新请求的 loading。',
  '如何使用useXXX抽离公共逻辑？':
    '组合式函数应优先抽离可复用的状态和副作用，而不是模板结构。对外返回最小必要接口，并在内部处理监听清理；如果调用方需要大量条件参数才能使用，通常说明抽象边界过大。',
  '后端返回十万条数据，前端应该全部渲染吗？':
    '即使使用虚拟列表，也不代表应该一次传输十万条完整数据。虚拟列表解决的是 DOM 数量，分页和分段请求解决的是网络、内存与数据计算压力，两者应按场景组合使用。',
  '页面有多个图表，如何管理实例并防止内存泄漏？':
    '可以使用 <code>Map&lt;HTMLElement, ECharts&gt;</code> 或按业务 ID 管理实例，初始化前通过 <code>getInstanceByDom</code> 检查复用；卸载时统一 <code>dispose</code>，并清除 ResizeObserver、事件监听与数据订阅。',
  '页面刷新后动态路由丢失，如何恢复？':
    '路由恢复期间应提供明确的初始化状态，先完成用户信息与权限加载，再放行首次导航。还要防止守卫重复添加路由造成死循环，并在退出登录时重置动态路由。',
  '首屏加载很长，如何排查和优化？':
    '优化前应先建立指标基线，例如 FCP、LCP、INP 和首屏接口耗时，再按瓶颈处理。完成优化后使用相同网络与设备条件复测，避免只凭主观感受判断效果。',
  'WebSocket断开后如何自动重连？':
    '重连逻辑需要区分网络异常与主动关闭，并使用带随机抖动的指数退避。连接恢复后还应重新鉴权、恢复订阅，并根据消息序号补偿断线期间遗漏的数据。',
  '如何避免无限快速重连？':
    '除了最大重试次数，还应监听浏览器在线状态，在离线期间暂停重连；服务端不可用时加入随机抖动，避免大量客户端在同一时间集中重连形成雪崩。',
  '测试环境出现问题，如何确认是哪个版本引入的？':
    '当提交范围较大时可以使用 <code>git bisect</code> 二分定位。定位后不仅要修复当前问题，还应补充能复现该回归的测试或检查项，避免同类问题再次进入发布版本。',
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeQuestionTitle(value: string) {
  return value
    .replace(/^\d+(?:\.\d+)*\s*/, '')
    .replace(/[？?。！!，,\s]/g, '')
    .toLowerCase();
}

function formatAnswer(question: SupplementalQuestionSource) {
  const answerPoints = question.answerLines
    .map((line, index) => `${index + 1}. ${escapeHtml(line)}`)
    .join('<br>');
  const enhancement = answerEnhancements[question.title];

  return [
    '<strong>回答要点：</strong><br>',
    answerPoints,
    enhancement ? `<br><br><strong>补充说明：</strong><br>${enhancement}` : '',
  ].join('');
}

function buildQuestion(
  question: SupplementalQuestionSource,
  config: SectionConfig,
  categoryNumber: number,
): QuestionItem {
  return {
    id: `supplement-${config.id}-${String(question.sourceNumber).padStart(2, '0')}`,
    question: `${categoryNumber}.${question.sourceNumber} ${question.title}`,
    answerHtml: formatAnswer(question),
    keywords: [...config.keywords, question.title],
  };
}

export function createSupplementalQuestionBank(existingCategories: QuestionCategory[]) {
  const existingTitles = new Set(
    existingCategories.flatMap((category) =>
      category.questions.map((question) => normalizeQuestionTitle(question.question)),
    ),
  );
  return supplementalSections.flatMap<QuestionCategory>((section, index) => {
    const config = sectionConfigs[index];

    if (!config) {
      return [];
    }

    const categoryNumber = FIRST_CATEGORY_NUMBER + index;
    const questions = section.questions
      .filter((question) => {
        const normalizedTitle = normalizeQuestionTitle(question.title);
        return !existingTitles.has(normalizedTitle) && !duplicateQuestionTitles.has(normalizedTitle);
      })
      .map((question) => buildQuestion(question, config, categoryNumber));

    if (questions.length === 0) {
      return [];
    }

    return [{
      id: `supplement-${config.id}`,
      name: `${categoryNumber}. ${config.name}`,
      questions,
    }];
  });
}
