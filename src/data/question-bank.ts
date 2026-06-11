import type { QuestionCategory } from '../types/question';

export const questionBank: QuestionCategory[] = [
  {
    "id": "lifecycle",
    "name": "1. Vue 2 生命周期",
    "questions": [
      {
        "id": "lifecycle-01",
        "question": "1.1 生命周期有哪些？发送请求在created还是mounted？",
        "answerHtml": "分为创建、挂载、更新、销毁四个阶段，共8个主要钩子（beforeCreate, created, beforeMount, mounted, beforeUpdate, updated, beforeDestroy, destroyed）。<br><br><strong>发送请求一般放在 <code>created</code> 中。</strong>因为此时 <code>data</code> 已经初始化完毕，能尽早发请求减少页面白屏时间；但如果请求的入参严重依赖于某些获取真实 DOM 之后才能确定的状态（比如容器实际渲染的宽度），则会放在 <code>mounted</code> 里进行。"
      },
      {
        "id": "lifecycle-02",
        "question": "1.2 为什么发送请求不在beforeCreated里？beforeCreate和created有什么区别？",
        "answerHtml": "因为在 <code>beforeCreate</code> 阶段，Vue 实例仅仅刚初始化了默认事件和生命周期，<strong>数据劫持（如 <code>data</code>、<code>methods</code>、<code>computed</code>）都还没有开始。</strong><br><br>此时如果发异步请求拿到了数据并尝试赋给 <code>this.xxx</code>，会直接报错找不到属性，或者就算强行赋上去了也会完全失去响应式。而到了 <code>created</code> 阶段响应式数据已准备就绪，可以安全、合规地进行赋值。"
      },
      {
        "id": "lifecycle-03",
        "question": "1.3 在created中如何获取dom？",
        "answerHtml": "正常情况下 <code>created</code> 时期模板还没有开始编译，真实的 DOM 自然也没有渲染出来。如果业务要求非要在此时获取 DOM，<strong>必须把操作代码包裹在 <code>this.$nextTick(callback)</code> 中。</strong><br>Vue 会把这个回调任务推迟到下一次 DOM 更新循环彻底结束后再执行，那个时候就能安全拿到 DOM 节点了。"
      },
      {
        "id": "lifecycle-04",
        "question": "1.4 一旦进入组件会执行哪些生命周期？",
        "answerHtml": "如果是首次进入一个普通的 Vue 组件（即没有被 keep-alive 缓存的组件），会严格按顺序依次执行四个生命周期钩子：<br><strong><code>beforeCreate</code> ➔ <code>created</code> ➔ <code>beforeMount</code> ➔ <code>mounted</code></strong>。"
      },
      {
        "id": "lifecycle-05",
        "question": "1.5 第二次或者第N次进去组件会执行哪些生命周期？",
        "answerHtml": "这取决于组件有没有被 <code>&lt;keep-alive&gt;</code> 缓存包裹起来。<br>1. <strong>如果没有被缓存：</strong>每次进入都等同于销毁后重新创建，依然会老老实实走一遍 <code>beforeCreate</code> 到 <code>mounted</code>。<br>2. <strong>如果被缓存了：</strong>组件状态保留在内存中，第 2 到 N 次进入<strong>只会执行 <code>activated</code> 钩子</strong>，绝对不会再去触发初始化的那几个生命周期。"
      },
      {
        "id": "lifecycle-06",
        "question": "1.6 父组件引入子组件，那么生命周期执行的顺序是？",
        "answerHtml": "这个执行顺序的核心规律是<strong>“父组件先开始创建，子组件先完成挂载”</strong>。<br>完整的执行流程为：<br>父 <code>beforeCreate</code> ➔ 父 <code>created</code> ➔ 父 <code>beforeMount</code><br>➔ 子 <code>beforeCreate</code> ➔ 子 <code>created</code> ➔ 子 <code>beforeMount</code> ➔ <strong>子 <code>mounted</code></strong><br>➔ <strong>父 <code>mounted</code></strong>。<br>因为父组件必须等内部包含的子组件真实 DOM 全部挂载完毕后，自己才能算作整体挂载完成。"
      },
      {
        "id": "lifecycle-07",
        "question": "1.7 加入keep-alive会执行哪些生命周期？",
        "answerHtml": "被 <code>&lt;keep-alive&gt;</code> 缓存的组件会多出两个专属的生命周期：<strong><code>activated</code>（激活时）</strong>和 <strong><code>deactivated</code>（失活/切走时）</strong>。<br>首次进入时：<code>created</code> ➔ <code>mounted</code> ➔ <strong><code>activated</code></strong>。<br>之后再进入：只触发 <strong><code>activated</code></strong>。<br>离开组件时：触发 <strong><code>deactivated</code></strong>，此时组件处于休眠状态，绝对不会触发 <code>beforeDestroy/destroyed</code> 等销毁钩子。"
      },
      {
        "id": "lifecycle-08",
        "question": "1.8 你在什么情况下用过哪些生命周期？说一说使用场景？",
        "answerHtml": "结合我这一年的项目经验，主要在这几个场景重度使用：<br>1. <strong><code>created</code>：</strong> 最常用。页面绝大多数的初始化列表接口请求、从路由参数中提取 id 等业务逻辑都放在这里。<br>2. <strong><code>mounted</code>：</strong> 必须操作 DOM 的场景。比如初始化 ECharts 图表、绑定原生网页滚动事件、获取某块区域的实际宽高。<br>3. <strong><code>beforeDestroy</code>：</strong> <span class=\"text-amber-600\">⚠️ 极易被新手忽略但极其重要！</span>我通常在这里做“擦屁股”的清理工作：清除轮播图倒计时的定时器、解绑全局 EventBus 事件监听、销毁重型的第三方图表实例，以此来严防内存泄漏引起的网页卡顿。"
      }
    ]
  },
  {
    "id": "vue2",
    "name": "2. Vue 2 基础与组件",
    "questions": [
      {
        "id": "vue2-01",
        "question": "2.1 组件传值（通信）的方式有哪些？",
        "answerHtml": "<strong>核心是根据层级关系选方案。</strong><br>1. 父子通信：父组件用 <code>props</code> 下发，子组件用 <code>$emit</code> 向上抛出事件。<br>2. 跨级/兄弟：简单场景用 EventBus（<code>new Vue()</code>），复杂状态引入 Vuex。<br>3. 祖孙深层嵌套：优先使用 <code>provide/inject</code>，避免逐层透传。<br>4. 封装高阶组件：利用 <code>$attrs</code> 和 <code>$listeners</code> 实现属性和事件的批量向下透传。"
      },
      {
        "id": "vue2-02",
        "question": "2.2 父组件如何直接修改子组件的值？",
        "answerHtml": "在子组件标签上打上 <code>ref</code> 标识（如 <code>&lt;Child ref=\"myChild\" /&gt;</code>），父组件即可通过 <code>this.$refs.myChild</code> 拿到完整实例，从而强行赋值或调方法。<br><br><span class=\"text-amber-600 text-sm\">⚠️ 经验之谈：虽然直接，但这破坏了单向数据流原则，导致状态变更极难追踪，团队协作中我会克制使用。</span>"
      },
      {
        "id": "vue2-03",
        "question": "2.3 子组件如何直接修改父组件的值？",
        "answerHtml": "粗暴的方法是通过 <code>this.$parent</code> 强行修改，但这会造成强耦合。<br><br><strong>推荐做法：使用 <code>.sync</code> 语法糖。</strong><br>父组件在传值时加上修饰符（<code>:title.sync=\"pageTitle\"</code>），子组件只需按约定格式抛出事件（<code>this.$emit(\"update:title\", 新值)</code>），底层依然是单向数据流，但表现上实现了直接优雅的修改。"
      },
      {
        "id": "vue2-04",
        "question": "2.4 如何找到父组件？",
        "answerHtml": "在组件内部读取实例的 <code>this.$parent</code> 属性，可以直接拿到上一级包裹它的父组件实例。如果需要跨层找特定祖先，通常写个 while 循环沿着 <code>$parent</code> 链条向上遍历。如果是根组件，它的 <code>$parent</code> 是 undefined。"
      },
      {
        "id": "vue2-05",
        "question": "2.5 如何找到根组件？",
        "answerHtml": "使用 <code>this.$root</code> 属性。无论当前组件嵌套多深，它永远一步到位精准指向 main.js 里 <code>new Vue()</code> 出来的最外层实例。在无 Vuex 的极小项目里，有时会把它当做简易的全局数据中心。"
      },
      {
        "id": "vue2-06",
        "question": "2.7 slot插槽有哪几种形式？你是如何使用的？",
        "answerHtml": "分为三种：<strong>默认插槽、具名插槽、作用域插槽。</strong><br>1. 基础内容替换（如按钮文字）直接用默认 <code>&lt;slot&gt;</code>。<br>2. 复杂结构（如弹窗分头部/内容/底部）用具名插槽，父组件通过 <code>#header</code> 精准分发。<br>3. 高度定制渲染（如通用列表）用作用域插槽，子组件把内部数据绑在 slot 上传出，父组件接收后决定具体 UI 样式。"
      },
      {
        "id": "vue2-07",
        "question": "2.8 你是如何封装组件的？",
        "answerHtml": "<strong>核心遵循“高内聚、低耦合、单向数据流”。</strong><br>1. 明确边界：分清是纯 UI 组件还是带业务逻辑的组件。<br>2. 严格校验：向外暴露的 <code>props</code> 必须加上 type 类型限制和 default 默认值。<br>3. 数据流向：坚决不在内部修改 props，需要变更一律通过 <code>$emit</code> 抛出自定义事件。<br>4. 留好后路：在关键结构处预留 <code>slot</code> 供外部扩展，复杂组件暴露出必要的内部方法供 <code>ref</code> 调用。"
      },
      {
        "id": "vue2-08",
        "question": "2.9 封装一个可复用的组件，需要满足什么条件？",
        "answerHtml": "<strong>核心原则是：高内聚、低耦合、易扩展。</strong><br>1. <strong>数据流向清晰：</strong> 严格遵循单向数据流，组件内部绝不能直接修改传入的 <code>props</code>，必须通过抛出 <code>$emit</code> 告知外部去修改。<br>2. <strong>接口规范 (Props)：</strong> 对向外暴露的 <code>props</code> 必须进行严格的验证，包括 <code>type</code> 类型约束、提供合理的 <code>default</code> 默认值，甚至自定义 <code>validator</code>。<br>3. <strong>预留扩展点 (Slots)：</strong> 不要把内部结构彻底写死。关键位置（如头部、内容区、尾部）要预留 <code>slot</code> 插槽，让使用方可以灵活定制 UI。<br>4. <strong>状态自治：</strong> 组件私有的状态（例如控制自身内部列表展开收起的变量）应该维护在自身的 <code>data</code> 中，尽量不要依赖外部的 Vuex 全局状态，保证“拔插即用”。<br><span class=\"text-emerald-600 text-sm\">💡 经验之谈：在企业级基础组件封装中，为了用起来更接近原生 HTML 标签，我会频繁使用 <code>v-bind=\"$attrs\"</code> 和 <code>v-on=\"$listeners\"</code> 把外部未显式定义的属性和原生事件直接透传给内部核心的 DOM 元素（比如封装一个增强版的 input 框）。</span>"
      }
    ]
  },
  {
    "id": "vuex",
    "name": "3. Vuex 状态管理",
    "questions": [
      {
        "id": "vuex-01",
        "question": "3.1 Vuex有哪些属性？它和Pinia的区别是什么？",
        "answerHtml": "包含五大核心：<strong>state</strong>(数据)、<strong>getters</strong>(计算属性)、<strong>mutations</strong>(同步修改)、<strong>actions</strong>(异步操作)、<strong>modules</strong>(模块化)。<br><br><strong>与 Pinia 的区别：</strong>Pinia 废弃了 mutations 的概念，将同步异步合并到 actions；全面拥抱 TS 且类型推导完美；采用扁平化架构替代了 Vuex 复杂的嵌套树状结构，开发心智负担显著降低。"
      },
      {
        "id": "vuex-02",
        "question": "3.2 Vuex如何使用state值？",
        "answerHtml": "简单场景直接在模板中用 <code>$store.state.xxx</code> 读取。但遇到依赖较多全局状态时，我习惯在组件的 <code>computed</code> 区域，使用扩展运算符配合 <code>...mapState([\"userInfo\"])</code> 将其映射为局部计算属性，代码更清爽。"
      },
      {
        "id": "vuex-03",
        "question": "3.3 Vuex的getters值如何修改？",
        "answerHtml": "<strong>getters 是只读的，不能被直接赋值修改！</strong><br>它对标组件的 computed。想改变 getters 的返回值，唯一的合法途径是去 <code>commit</code> 触发 mutations 修改它所依赖的源头 state 数据。源头一变，响应式机制会自动重新计算 getters。"
      },
      {
        "id": "vuex-04",
        "question": "3.4 mutations和action的区别是什么？你是如何使用的？",
        "answerHtml": "<strong>核心区别是：同步 vs 异步。</strong><br>1. mutations 是唯一允许修改 state 的地方，且必须是纯同步，为了保证开发者工具能精准抓取状态快照。<br>2. actions 专治异步。项目中调后台接口时，我会 <code>dispatch</code> 派发一个 action，拿到异步结果后，再在 action 内部 <code>commit</code> 交给 mutations 去真正更新视图。"
      },
      {
        "id": "vuex-05",
        "question": "3.5 Vuex如何进行持久化存储？",
        "answerHtml": "Vuex 数据在内存中，一刷新就没。为了保存 Token 等关键数据：<br>手工做法是每次 mutation 修改时顺手存一下 <code>localStorage</code>。<br><strong>项目实战中</strong>，我通常直接引入 <code>vuex-persistedstate</code> 插件，只需在 store 插件数组里注册一下，它就会自动监听状态变更并无缝同步到本地缓存，省时省力。"
      }
    ]
  },
  {
    "id": "router",
    "name": "4. Vue Router 路由",
    "questions": [
      {
        "id": "router-01",
        "question": "4.1 路由的模式和区别",
        "answerHtml": "1. <strong>Hash模式：</strong>URL带 <code>#</code>，底层监听 <code>onhashchange</code> 事件。前端自娱自乐，无需后端配合，刷新不报错。<br>2. <strong>History模式：</strong>基于 HTML5 History API，路径干净美观像真实目录。但部署时用户刷新深层路径会报 404，必须要求 Nginx 配置 fallback 重定向兜底（全指回 index.html）。"
      },
      {
        "id": "router-02",
        "question": "4.2 子路由和动态路由",
        "answerHtml": "<strong>子路由 (children)：</strong>用于页面内嵌区域切换（如管理后台侧边栏不动，右侧切换），在父组件放内层 <code>router-view</code> 渲染。<br><strong>动态路由：</strong>用于排版相同但数据不同的页面复用（如商品详情 <code>/detail/:id</code>），组件内部通过读取路径上的参数对象来发起不同的网络请求。"
      },
      {
        "id": "router-03",
        "question": "4.3 路由传值的方式及注意事项",
        "answerHtml": "1. <strong>query：</strong>类似 GET，参数明文拼接在 URL 的问号后，用户刷新页面参数不丢，适合搜索条件传参。<br>2. <strong>params：</strong>配合路由 name 使用，隐式传递 URL 上看不见痕迹。<strong>注意踩坑：</strong>如果没有在路由配置里用冒号占位，手动刷新页面 params 参数会直接变成 undefined 丢失。"
      },
      {
        "id": "router-04",
        "question": "4.4 导航故障是什么？什么情况下发生？",
        "answerHtml": "主要是编程式导航（push）抛出的 Promise 报错。<br>最常见触发场景是<strong>“重复导航”</strong>：用户狂点按钮往当前相同的路径跳转。由于路由改成异步 API，就会被识别为冗余并抛出错误。我一般在 main.js 重写 push 方法统一静默 catch 掉这个无害报错。"
      },
      {
        "id": "router-05",
        "question": "4.5 $router和$route的区别",
        "answerHtml": "<strong>一句话总结：前者用来“执行动作”，后者用来“查询状态”。</strong><br><code>$router</code>：全局路由实例，身上绑定了 push、replace、go 等控制页面跳转的方法。<br><code>$route</code>：局部只读对象（当前页的身份卡），包含了当前路径、query/params 参数以及 meta 路由元信息。"
      },
      {
        "id": "router-06",
        "question": "4.6 导航守卫的作用与使用",
        "answerHtml": "像安检站，用于跳转前后的拦截处理。<br>项目中重度使用全局前置守卫 <code>beforeEach</code> 做登录鉴权：读取目标路由的 meta 判断是否需要权限，无 token 则强制重定向到登录页。<br><span class=\"text-amber-600 text-sm\">⚠️ 核心注意：务必保证 <code>next()</code> 函数在所有逻辑分支中被严格放行且只执行一次，否则页面会卡死白屏。</span>"
      }
    ]
  },
  {
    "id": "instance",
    "name": "5. Vue 实例与 API",
    "questions": [
      {
        "id": "instance-01",
        "question": "5.1 $set的作用",
        "answerHtml": "<strong>专治 Vue 2 的响应式盲区。</strong><br>由于 Object.defineProperty 的限制，Vue 2 无法监听到对象事后动态新增的属性，或直接通过下标修改的数组。使用 <code>this.$set(对象, 属性名, 值)</code> 可以强行触发依赖收集，给新数据打上响应式补丁并驱动视图更新。"
      },
      {
        "id": "instance-02",
        "question": "5.2 $nextTick的作用",
        "answerHtml": "<strong>处理异步 DOM 渲染的时序差。</strong><br>Vue 监听到数据变化后不会立刻操作 DOM，而是等同步代码跑完再统一更新。如果刚把 <code>v-if</code> 设为 true 就立刻去原生 focus 输入框会报错找不到节点。把逻辑包在 <code>$nextTick</code> 回调里，它会等到下一次 DOM 真正渲染完毕后再执行。"
      },
      {
        "id": "instance-03",
        "question": "5.3 $refs的作用",
        "answerHtml": "Vue 提供的官方“后门”。<br>在模板标签上打上 <code>ref</code>，在逻辑里就能通过 <code>this.$refs.xxx</code> 拿到原生的 DOM 节点（初始化 ECharts 图表必备）；如果打在子组件上，拿到的就是完整的子组件实例，可直接调其方法。"
      },
      {
        "id": "instance-04",
        "question": "5.4 $el的作用",
        "answerHtml": "代表当前组件编译渲染后映射的<strong>最外层真实 DOM 根节点</strong>。<br>组件过了 mounted 阶段即可访问。我常用来快速读取组件自身的物理高度尺寸，或者在集成一些完全独立于 Vue 体系的老旧第三方原生插件时，把它作为挂载容器传过去。"
      }
    ]
  },
  {
    "id": "vue3",
    "name": "6. Vue 3 专题",
    "questions": [
      {
        "id": "vue3-01",
        "question": "6.1 Vue 2 和 Vue 3 有哪些核心区别？",
        "answerHtml": "<strong>1. 响应式重构：</strong>底层从 Object.defineProperty 升级为 ES6 Proxy，解决了属性动态添加的盲区，性能大幅提升。<br><strong>2. API 范式：</strong>从按选项拆分的 Options API 走向按业务高内聚的 Composition API，复杂逻辑复用极其清爽。<br><strong>3. 新特性：</strong>支持 Fragment（多根节点）、Teleport（传送门弹窗）。<br><strong>4. 生态：</strong>引入完美支持 TS 的 Pinia 替代 Vuex，构建工具全面拥抱极速的 Vite。"
      },
      {
        "id": "vue3-02",
        "question": "6.2 Vue 3 常用的 API 有哪些？",
        "answerHtml": "在 <code>&lt;script setup&gt;</code> 下：<br>- 状态定义：<code>ref</code>, <code>reactive</code><br>- 派生与副作用：<code>computed</code>, <code>watch</code>, <code>watchEffect</code><br>- 组件通信宏：<code>defineProps</code>(接参), <code>defineEmits</code>(抛事件), <code>defineExpose</code>(向外暴露内部方法)<br>- 生命周期钩子：<code>onMounted</code>, <code>onUnmounted</code> 等。"
      },
      {
        "id": "vue3-03",
        "question": "6.3 请介绍一下 Vue 3 的响应式数据类型",
        "answerHtml": "核心是 <code>reactive</code> 和 <code>ref</code>。<br>- <strong>reactive：</strong>底层是纯正 Proxy，专攻对象/数组等复杂类型。但坑点是<strong>解构赋值或重新赋值会导致响应式断裂</strong>。<br>- <strong>ref：</strong>通过 <code>.value</code> 包装对象实现拦截，原本是为基础数据类型设计的。<br><span class=\"text-amber-600 text-sm\">⚠️ 经验之谈：为了降低心智负担和避免解构 Bug，现在业界实战中普遍倾向于“一把梭”，不论基础类型还是复杂对象，统一优先用 ref。</span>"
      }
    ]
  },
  {
    "id": "advanced",
    "name": "7. Vue 进阶与原理",
    "questions": [
      {
        "id": "advanced-01",
        "question": "7.1 什么是渐进式框架？",
        "answerHtml": "渐进式就像是“搭积木，按需引入”。<br>如果只是个简单的静态页面，只需引入 Vue 的核心库做数据绑定即可；如果业务变得复杂，可以逐步引入 Vue Router（路由）、Pinia/Vuex（状态管理）、Vite/Webpack（构建工具）。它不强求你一开始就用全家桶，非常灵活，对渐进式的项目重构极其友好。"
      },
      {
        "id": "advanced-02",
        "question": "7.2 v-if和v-for的优先级？",
        "answerHtml": "<strong>Vue 2 中：</strong><code>v-for</code> 优先级<strong>高于</strong> <code>v-if</code>。如果写在同个标签上，每次渲染都会先循环出所有节点再去判断是否隐藏，极度浪费性能。<br><strong>Vue 3 中：</strong><code>v-if</code> 优先级<strong>高于</strong> <code>v-for</code>。连用时，<code>v-if</code> 拿不到 <code>v-for</code> 里的变量，会直接报错。<br><span class=\"text-amber-600 text-sm\">⚠️ 经验之谈：永远不要把它们写在同一个标签上。正确做法是用 <code>&lt;template v-for&gt;</code> 包裹，或者用 computed 把数据提前过滤好。</span>"
      },
      {
        "id": "advanced-02b",
        "question": "7.2.1 v-for为什么需要key？",
        "answerHtml": "<code>key</code> 的作用是给每一项一个<strong>稳定且唯一的身份标识</strong>，让 Vue 在 diff 更新时能准确判断“谁是新增、谁是删除、谁是移动、谁是复用”。<br><br>如果 <code>v-for</code> 不写 <code>key</code>，或者写成不稳定的值，Vue 往往会采用就地复用策略，表面上看性能可能还行，但一旦列表发生<strong>排序、插入、删除</strong>，就容易出现状态错乱，比如输入框内容串位、组件内部状态错位、动画异常等。<br><br><strong>实践建议：</strong>优先使用后端返回的 <code>id</code> 这类稳定唯一值作为 <code>key</code>，尽量不要用数组下标；只有在列表完全静态、不会增删改和重排时，才勉强可以考虑用 index。",
        "keywords": ["v-for", "key", "列表渲染", "diff"],
      },
      {
        "id": "advanced-03",
        "question": "7.3 ref是什么？",
        "answerHtml": "<strong>在 Vue 2 中：</strong>主要是一个打在 DOM 或组件标签上的“标记”，用于在逻辑里通过 <code>this.$refs</code> 获取原生 DOM 节点或子组件的实例。<br><strong>在 Vue 3 中：</strong>除了保留获取 DOM 的功能，它摇身一变成为了最核心的响应式 API（Composition API），用于将基础类型（甚至复杂类型）包装为响应式对象，通过 <code>.value</code> 读写数据。"
      },
      {
        "id": "advanced-04",
        "question": "7.4 scoped的原理？",
        "answerHtml": "<code>scoped</code> 是为了实现组件样式的私有化，防止全局污染。<br><strong>底层原理：</strong>Vue 在编译时，会给当前组件内所有的 DOM 节点打上一个唯一的哈希自定义属性（如 <code>data-v-xxxxx</code>）。然后借助 CSS 的属性选择器（如 <code>.box[data-v-xxxxx]</code>），限制这些样式只对带有该哈希标签的元素生效。"
      },
      {
        "id": "advanced-05",
        "question": "7.5 Vue中如何做样式穿透？",
        "answerHtml": "当我们需要覆盖第三方 UI 库的内部样式，又不想去掉 <code>scoped</code> 时就需要穿透。<br><strong>Vue 2 中：</strong>普通 CSS 用 <code>&gt;&gt;&gt;</code>，如果用了 Sass/Less 等预处理器，通常使用 <code>/deep/</code> 或 <code>::v-deep</code>。<br><strong>Vue 3 中：</strong>废弃了以前的写法，官方统一规范强制要求使用 <code>:deep(选择器)</code> 的伪类函数语法。"
      },
      {
        "id": "advanced-06",
        "question": "7.6 Vue2的defineProperty和Vue3的Proxy的响应式原理区别？",
        "answerHtml": "<strong>Vue 2 (Object.defineProperty)：</strong>只能拦截对象已有的属性（getter/setter）。痛点是无法监听到动态新增/删除的属性，也无法完美拦截数组的下标修改，必须借用 <code>$set</code> 补救。且初始化时需递归遍历整个对象，性能开销大。<br><strong>Vue 3 (Proxy)：</strong>直接代理整个对象的最外层。无论你是新增属性、删除属性、还是修改数组下标，全都能在底层被直接拦截到。不需要在初始化时深度遍历，性能更优异，完美解决了 Vue 2 的痛点。"
      },
      {
        "id": "advanced-07",
        "question": "7.7 v-model双向绑定原理？",
        "answerHtml": "<code>v-model</code> 本质上是属性绑定加事件抛出的<strong>语法糖</strong>。<br><strong>Vue 2 中：</strong>默认等价于向子组件传递一个 <code>value</code> 属性，并监听子组件 <code>$emit</code> 抛出的 <code>input</code> 事件。<br><strong>Vue 3 中：</strong>为了语意更清晰且支持在同一个组件上绑定多个 v-model，它默认等价于传递 <code>modelValue</code> 属性，并监听 <code>update:modelValue</code> 事件。"
      },
      {
        "id": "advanced-08",
        "question": "7.8 什么是MVVM？",
        "answerHtml": "MVVM 是 <strong>Model-View-ViewModel</strong> 的缩写。<br>1. <strong>Model（模型）：</strong>指的是 JS 中的数据层（业务数据）。<br>2. <strong>View（视图）：</strong>指的是页面上的 DOM 结构。<br>3. <strong>ViewModel（视图模型）：</strong>连接前两者的桥梁，也就是 Vue 的实例对象。<br><strong>核心思想：数据驱动视图。</strong>开发者不再需要手动去频繁获取和操作 DOM，只需要关注业务去改变数据（Model），ViewModel 会通过底层的响应式引擎自动将最新的数据更新到页面（View）上。"
      }
    ]
  },
  {
    "id": "javascript",
    "name": "8. JS 核心与实战",
    "questions": [
      {
        "id": "javascript-01",
        "question": "8.1 延迟加载JS有哪些方式？",
        "answerHtml": "为了防止 JS 阻塞页面的 DOM 渲染，常用的延迟加载方式有：<br>1. <strong><code>defer</code> 属性：</strong>脚本在后台异步下载，等 HTML 解析完成后，按脚本在文档里的先后顺序依次执行。<br>2. <strong><code>async</code> 属性：</strong>脚本异步下载，下载完立刻中断 HTML 解析去执行它，谁先下载完就执行谁，不保证顺序。<br>3. <strong>动态创建 script 标签：</strong>通过 <code>document.createElement(\"script\")</code> 插入页面。<br>4. <strong>ES6 动态引入：</strong>使用 <code>import()</code> 语法按需加载模块。"
      },
      {
        "id": "javascript-02",
        "question": "8.2 JS中有哪些数据类型？",
        "answerHtml": "主要分为两大类：<br>1. <strong>基本数据类型（栈内存）：</strong><code>String</code>、<code>Number</code>、<code>Boolean</code>、<code>Undefined</code>、<code>Null</code>，以及 ES6 新增的 <code>Symbol</code>（唯一标识）和 <code>BigInt</code>（大整数）。它们按值访问。<br>2. <strong>引用数据类型（堆内存）：</strong>统称为 <code>Object</code>（包括 <code>Array</code>、<code>Function</code>、<code>Date</code>、<code>RegExp</code> 等）。在栈中只存了一个指向堆内存的指针，按引用访问。"
      },
      {
        "id": "javascript-03",
        "question": "8.3 null和undefined的区别",
        "answerHtml": "两者都代表“没有值”，但在语义和用法上有区别：<br><strong><code>undefined</code>（未定义）：</strong>表示变量声明了但还没赋值。比如函数没写 return 时默认返回就是 undefined。<br><strong><code>null</code>（空对象指针）：</strong>表示人为显式地赋了一个“空”值，通常用来初始化一个将来要保存对象的变量，或者用来主动释放内存。<br><span class=\"text-amber-600 text-sm\">⚠️ 注意：<code>typeof null</code> 会返回 \"object\"（这是 JS 底层的历史遗留 bug），而 <code>null == undefined</code> 是 true，<code>null === undefined</code> 是 false。</span>"
      },
      {
        "id": "javascript-04",
        "question": "8.4 ==和===有什么不同？",
        "answerHtml": "<strong><code>==</code> (宽松相等)：</strong>在比较前会先进行“隐式类型转换”。比如 <code>1 == \"1\"</code>，它会把字符串转成数字再比，结果是 true。<br><strong><code>===</code> (严格相等)：</strong>不仅比较值，还比较数据类型，绝不进行类型转换。比如 <code>1 === \"1\"</code> 结果是 false。<br><span class=\"text-emerald-600 text-sm\">💡 经验之谈：在实际开发中，除了极个别判断 <code>if(obj == null)</code>（等价于判断 null 或 undefined）之外，强烈建议一律使用 <code>===</code> 避免玄学 Bug。</span>"
      },
      {
        "id": "javascript-05",
        "question": "8.5 ES6引入了哪些新特性？",
        "answerHtml": "常用的非常多，极大提升了开发体验：<br>1. <strong>变量声明：</strong><code>let</code> 和 <code>const</code>（块级作用域、无变量提升）。<br>2. <strong>函数扩展：</strong>箭头函数（词法绑定 this，很关键）、参数默认值。<br>3. <strong>语法糖：</strong>模板字符串（反引号）、解构赋值（快速提取对象/数组里的值）、扩展运算符（<code>...</code>）。<br>4. <strong>异步编程：</strong><code>Promise</code> 彻底解决了回调地狱问题。<br>5. <strong>面向对象与模块化：</strong>引入 <code>class</code> 类的概念以及 <code>import/export</code> 模块化体系。"
      },
      {
        "id": "javascript-06",
        "question": "8.6 原型和原型链是什么？两者有什么关系？",
        "answerHtml": "在 JavaScript 里，每个对象都可以通过内部链路关联到它的原型对象，这条查找链就是原型链。<br><br><strong>原型的作用：</strong>把公共属性和方法放在原型上，多个实例共享，减少重复创建。<br><br><strong>原型链的作用：</strong>当访问对象属性时，如果当前对象没有，JS 会沿着原型链向上查找，直到找到或到达顶层。<br><br>面试里建议补一句：这既是继承机制的基础，也是性能与内存复用的重要手段。",
        "keywords": [
          "prototype",
          "原型",
          "原型链",
          "__proto__",
          "继承"
        ]
      },
      {
        "id": "javascript-08",
        "question": "8.8 说一说call、apply、bind区别",
        "answerHtml": "它们三个都是用来<strong>改变函数内部 this 指向</strong>的，区别在于执行时机和传参方式：<br>1. <strong><code>call</code>：</strong>立即执行函数。传参方式是<strong>逐个传入</strong>（<code>fn.call(obj, arg1, arg2)</code>）。<br>2. <strong><code>apply</code>：</strong>立即执行函数。传参方式是<strong>以数组形式传入</strong>（<code>fn.apply(obj, [arg1, arg2])</code>）。<br>3. <strong><code>bind</code>：</strong><strong>不立即执行</strong>，而是返回一个新的、绑定了 this 的函数，供以后调用。传参和 call 一样是逐个传入。"
      },
      {
        "id": "javascript-09",
        "question": "8.9 深拷贝和浅拷贝",
        "answerHtml": "针对引用数据类型（如对象/数组）：<br><strong>浅拷贝：</strong>只拷贝第一层属性。如果属性值是对象，拷贝的只是个内存指针，修改其中一个会导致另一个联动变化。常用 <code>Object.assign()</code> 或扩展运算符 <code>...</code>。<br><strong>深拷贝：</strong>在内存中完全开辟一块新空间，将内外层数据完完全全复制一份，互不影响。<br><br><strong>深拷贝实现方式：</strong><br>1. <code>JSON.parse(JSON.stringify(obj))</code>（最常用但有缺陷：会丢失函数、undefined 和正则）。<br>2. 引入 lodash 的 <code>_.cloneDeep</code> 工具函数（企业级稳妥方案）。<br>3. 现代浏览器原生 API：<code>structuredClone(obj)</code>（推荐，支持 Map/Set，且没有 JSON 的缺陷）。"
      },
      {
        "id": "javascript-10",
        "question": "8.10 sort背后原理是什么？",
        "answerHtml": "JS 数组的 <code>sort()</code> 方法底层是用什么排序算法，主要取决于浏览器的 JS 引擎（如 Chrome 的 V8）。<br><br>在早期 V8 版本中：当数组长度较短（小于等于 10）时，使用<strong>插入排序</strong>；当数组较长时，使用<strong>快速排序</strong>。由于快速排序是不稳定的排序，这在以前经常会引发一些莫名其妙的顺序变动问题。<br><strong>现代 V8 引擎（v7.0 之后）：</strong>全面放弃了快速排序，改用 <strong>TimSort</strong> 算法。TimSort 是一种结合了归并排序（Merge Sort）和插入排序（Insertion Sort）的混合排序算法，最关键的是，它是<strong>稳定排序</strong>，完美解决了一样大的元素排序后相对位置可能被乱序的问题。"
      },
      {
        "id": "javascript-11",
        "question": "8.11 Promise解决了什么问题？有哪些状态与常见方法？",
        "answerHtml": "Promise 主要解决了回调地狱和异步流程难维护的问题，让异步代码可以链式组织并统一处理成功和失败。<br><br><strong>状态有三种：</strong><code>pending</code>、<code>fulfilled</code>、<code>rejected</code>，且状态一旦落定就不可逆。<br><br><strong>常见方法：</strong><code>then</code>/<code>catch</code>/<code>finally</code> 处理单链路，<code>Promise.all</code> 做并发汇总，<code>Promise.race</code> 做竞速控制。<br><br>项目中可再补一句：配合 <code>async/await</code> 可以把异步流程写得更接近同步逻辑。",
        "keywords": [
          "promise",
          "pending",
          "fulfilled",
          "rejected",
          "async",
          "await"
        ]
      },
      {
        "id": "javascript-12",
        "question": "8.12 JS如何判断一个对象或数组是否为空？",
        "answerHtml": "<strong>数组判空：</strong>最直接，判断 <code>arr.length === 0</code> 即可。<br><strong>对象判空：</strong><br>1. 常用做法：<code>Object.keys(obj).length === 0</code>。<br>2. 投机做法：<code>JSON.stringify(obj) === \"{}\"</code>。但要注意踩坑，如果对象里有值为 <code>undefined</code>、函数或 <code>Symbol</code> 的属性，序列化时会被自动忽略，可能导致误判为空。"
      },
      {
        "id": "javascript-13",
        "question": "8.13 说一下闭包，闭包有什么特点？",
        "answerHtml": "<strong>闭包本质上就是函数嵌套函数，内层函数可以访问外层函数的局部变量。</strong><br><strong>特点：</strong><br>1. <strong>延长生命周期：</strong>外层函数执行完后，其内部被引用的变量不会被垃圾回收引擎清理。<br>2. <strong>私有化数据：</strong>可以在全局环境外隐藏一些特权变量，防止被别人随意篡改。<br><span class=\"text-amber-600 text-sm\">⚠️ 经验之谈：平时封装防抖节流函数、或是 Vue2 中组件 data 必须是一个返回对象的函数，底层都利用了闭包。缺点是过度使用会导致内存泄漏，不用时要记得把外层引用赋为 null。</span>"
      },
      {
        "id": "javascript-14",
        "question": "8.14 内存泄漏怎么理解？",
        "answerHtml": "内存泄漏是指：程序中动态分配的内存由于某种原因<strong>未被释放或无法释放</strong>，导致系统可用内存越来越少，最终页面卡顿甚至浏览器崩溃。<br><strong>前端常见场景及防范：</strong><br>1. <strong>未清除的定时器或事件监听：</strong>组件销毁时（Vue 的 <code>beforeDestroy</code> 中）必须 <code>clearInterval</code> 或 <code>removeEventListener</code>。<br>2. <strong>不合理的闭包：</strong>内部变量保存了巨大的 DOM 节点或数据字典未被置空。<br>3. <strong>脱离 DOM 的引用：</strong>DOM 节点在页面上被删除了，但 JS 变量对象里还强引用着它。"
      },
      {
        "id": "javascript-15",
        "question": "8.15 JS中的事件循环 (Event Loop)",
        "answerHtml": "因为 JS 是单线程的，为防止耗时任务阻塞页面，引入了事件循环机制。<br>任务被分为<strong>同步任务</strong>和<strong>异步任务</strong>，异步任务又细分为<strong>微任务</strong>（Promise.then、Vue 的 nextTick）和<strong>宏任务</strong>（setTimeout、setInterval）。<br><strong>执行顺序：</strong><br>1. 执行主栈里的同步代码。<br>2. 同步代码执行完，立刻清空当前的<strong>微任务队列</strong>（有几个就执行几个）。<br>3. 去<strong>宏任务队列</strong>里取出一个宏任务执行。<br>4. 执行完这个宏任务后，再去检查并清空微任务队列...如此循环往复。"
      },
      {
        "id": "javascript-16",
        "question": "8.16 AJAX是什么？怎么实现的？",
        "answerHtml": "AJAX（Asynchronous JavaScript and XML）是一种在<strong>不重新加载整个页面的情况下，与服务器异步交换数据并局部更新网页</strong>的技术。<br><strong>原生核心实现步骤：</strong><br>1. 创建实例：<code>let xhr = new XMLHttpRequest();</code><br>2. 建立连接：<code>xhr.open(\"GET\", url, true);</code><br>3. 监听状态：绑定 <code>xhr.onreadystatechange</code> 事件，判断当 <code>xhr.readyState === 4</code> 且 <code>status === 200</code> 时处理返回的数据。<br>4. 发送请求：<code>xhr.send();</code><br>（注：现在项目中大多直接使用 Promise 封装好的 Axios 库或浏览器原生的 Fetch API 了。）"
      },
      {
        "id": "javascript-17",
        "question": "8.17 GET和POST的区别",
        "answerHtml": "两者都是 HTTP 最常用的请求方法：<br>1. <strong>传参位置：</strong>GET 参数直接拼接在 URL 后面；POST 参数放在请求体（Body）中。<br>2. <strong>大小限制：</strong>浏览器对 URL 长度有限制（一般是 2KB 左右），所以 GET 传参受限；POST 理论上无大小限制。<br>3. <strong>安全性：</strong>POST 相对 GET 略微安全一点，因为参数不会直接暴露在地址栏，也不会保存在历史记录里。<br>4. <strong>缓存与幂等：</strong>GET 请求会被浏览器主动缓存，且是幂等的（请求 1 次和 100 次结果一致，不改变服务器状态）；POST 不会被缓存，常用于非幂等操作（如向数据库新增一条数据）。"
      },
      {
        "id": "javascript-18",
        "question": "8.18 防抖和节流是什么？",
        "answerHtml": "这两者都是为了优化高频触发事件（如页面滚动、窗口缩放、频繁点击、搜索框输入）的性能问题。<br><strong>防抖 (Debounce)：</strong>“等手停下来再干活”。例如搜索框实时搜索，不管你输入多快，只有当你停止输入 N 毫秒后，才会发送一次网络请求。<br><strong>节流 (Throttle)：</strong>“按固定频率干活”。例如页面滑动加载，不管滚动得多剧烈，保证每隔 N 毫秒强制执行一次回调。<br><span class=\"text-emerald-600 text-sm\">💡 经验之谈：手写它俩其实就是利用定时器和闭包。但实际企业项目中，为了稳妥和代码整洁，我通常会直接引入 <code>lodash</code> 库里的 <code>_.debounce</code> 和 <code>_.throttle</code> 方法。</span>"
      },
      {
        "id": "javascript-19",
        "question": "8.19 如何阻止事件冒泡和默认事件？",
        "answerHtml": "在原生 JS 里通常这样处理：<br>1. <strong>阻止事件冒泡：</strong>调用 <code>event.stopPropagation()</code>，让事件不再继续向父元素传播。<br>2. <strong>阻止默认行为：</strong>调用 <code>event.preventDefault()</code>，比如阻止链接跳转、表单提交。<br>3. <strong>两者可以同时使用：</strong>如果既不想冒泡，也不想触发默认行为，就两个方法都调用。<br><br><strong>在 Vue 中更推荐事件修饰符：</strong><code>@click.stop</code>、<code>@submit.prevent</code>，语义更清晰，模板也更简洁。",
        "keywords": [
          "stopPropagation",
          "preventDefault",
          "event bubbling",
          "default action",
          "Vue .stop",
          "Vue .prevent",
          "事件冒泡",
          "默认事件"
        ]
      },
      {
        "id": "javascript-20",
        "question": "8.20 H5如何处理兼容性问题？",
        "answerHtml": "<strong>核心思路：先识别差异，再做兼容补齐和降级兜底。</strong><br>1. <strong>优先做特性检测：</strong>不要只依赖 UA 判断，先看目标浏览器是否真的支持某个 API 或能力。<br>2. <strong>处理 JS 语法和 API 兼容：</strong>通过 Babel 配合 Polyfill（如 <code>core-js</code>）补齐低版本环境缺失能力。<br>3. <strong>处理 CSS 兼容：</strong>使用 PostCSS + <code>autoprefixer</code> 自动补前缀，关键样式准备兜底方案。<br>4. <strong>关注移动端真实场景：</strong>重点验证视口、点击延迟、软键盘顶起、安全区、滚动穿透等问题。<br>5. <strong>工程化保障：</strong>明确浏览器支持范围，做真机和主流浏览器回归测试，按影响范围采用渐进增强或优雅降级。",
        "keywords": [
          "H5",
          "compatibility",
          "polyfill",
          "autoprefixer",
          "progressive enhancement",
          "graceful degradation",
          "兼容性",
          "渐进增强",
          "优雅降级"
        ]
      },
      {
        "id": "javascript-21",
        "question": "8.21 async/await 本质是什么？",
        "answerHtml": "<code>async/await</code> 本质上是 Promise 的语法糖，它没有改变异步本质，只是让代码组织更接近同步写法。<br><br><strong>优势：</strong>流程清晰、错误处理统一（配合 <code>try/catch</code>）、可读性更好。<br><br><strong>注意点：</strong>串行 await 会拖慢并发场景，能并行的任务应先收集 Promise 再统一等待。",
        "keywords": [
          "async",
          "await",
          "promise",
          "语法糖"
        ]
      },
      {
        "id": "javascript-22",
        "question": "8.22 说说你对 this 的理解。",
        "answerHtml": "<code>this</code> 指向取决于函数调用方式，而不是定义位置。<br><br><strong>常见规则：</strong>普通函数调用看运行时上下文；对象方法调用时指向该对象；构造调用时指向实例；箭头函数没有自己的 this，会捕获外层 this。<br><br>面试答题时建议配一个实际场景，比如事件回调里 this 丢失怎么通过箭头函数或 <code>bind</code> 处理。",
        "keywords": [
          "this",
          "调用方式",
          "bind",
          "箭头函数"
        ]
      },
      {
        "id": "javascript-23",
        "question": "8.23 箭头函数和普通函数有什么区别？",
        "answerHtml": "箭头函数没有自己的 <code>this</code>、<code>arguments</code>，不能作为构造函数，也不能使用 <code>new</code>。<br><br><strong>适合场景：</strong>需要继承外层 this 的回调函数。<br><br><strong>不适合场景：</strong>对象方法、需要动态 this 的函数、构造函数。",
        "keywords": [
          "箭头函数",
          "this",
          "arguments",
          "new"
        ]
      },
      {
        "id": "javascript-24",
        "question": "8.24 常见数组去重方式有哪些？",
        "answerHtml": "最常见写法是 <code>Array.from(new Set(arr))</code>，代码最短、可读性最好。<br><br>如果是对象数组去重，通常会按业务主键配合 <code>Map</code> 去重。<br><br>面试里建议补充：去重策略要看数据类型和主键规则，不能只背一种写法。",
        "keywords": [
          "数组去重",
          "set",
          "map",
          "去重策略"
        ]
      }
    ]
  },
  {
    "id": "css",
    "name": "9. CSS 基础与进阶",
    "questions": [
      {
        "id": "css-01",
        "question": "9.1 CSS的优先级是怎么计算的？",
        "answerHtml": "CSS 优先级按照“权重”来计算，规则如下：<br>1. <strong>!important：</strong> 权重最高（破坏原有级联规则，慎用）。<br>2. <strong>内联样式 (style=\"...\")：</strong> 权重 1000。<br>3. <strong>ID 选择器 (#id)：</strong> 权重 100。<br>4. <strong>类、伪类、属性选择器 (.class, :hover, [type=\"text\"])：</strong> 权重 10。<br>5. <strong>标签、伪元素选择器 (div, ::before)：</strong> 权重 1。<br><span class=\"text-amber-600 text-sm\">⚠️ 经验之谈：当权重相同时，后面的样式会覆盖前面的样式（就近原则）。平时写代码尽量用类选择器，少用 ID，绝不滥用 !important 以免后续样式无法覆盖。</span>"
      },
      {
        "id": "css-02",
        "question": "9.2 隐藏元素的方法有哪些？",
        "answerHtml": "常用的有这几种，区别主要在于是否占据空间和能否响应事件：<br>1. <strong><code>display: none</code>：</strong> 彻底消失，不占据页面空间，会导致浏览器的重排（回流）和重绘。<br>2. <strong><code>visibility: hidden</code>：</strong> 隐身，但依然占据原来位置的空间，不会导致重排只触发重绘，且无法触发点击事件。<br>3. <strong><code>opacity: 0</code>：</strong> 透明度设为0，视觉上看不见，占据空间，<strong>且仍然可以响应点击事件</strong>（除非加上 <code>pointer-events: none</code>）。<br>4. <strong>绝对定位移出屏幕：</strong> <code>position: absolute; left: -9999px;</code>，常用于屏幕阅读器等无障碍访问（A11y）场景中。"
      },
      {
        "id": "css-03",
        "question": "9.3 CSS中有哪些相对单位和绝对单位？",
        "answerHtml": "<strong>绝对单位：</strong> 它们的值是固定的，不随设备或父元素改变。最常用的是 <strong><code>px</code></strong>（像素），虽然严格意义上它是相对显示器分辨率的，但在网页开发中通常被视为绝对单位。<br><br><strong>相对单位：</strong> 会根据参照物动态变化，适合做响应式开发：<br>- <strong><code>%</code>：</strong> 相对于父元素的对应属性计算。<br>- <strong><code>em</code>：</strong> 相对于<strong>当前元素自身</strong>的字体大小（font-size）。<br>- <strong><code>rem</code>：</strong> 相对于<strong>根元素（&lt;html&gt;）</strong>的字体大小。<br>- <strong><code>vw / vh</code>：</strong> 视窗（Viewport）宽度/高度的 1%。"
      },
      {
        "id": "css-04",
        "question": "9.4 px和rem的区别是什么？",
        "answerHtml": "1. <strong><code>px</code>（像素）：</strong> 固定的绝对单位。写了 16px，在任何设备上它都会渲染出对应大小的逻辑像素块，不会随屏幕大小自动伸缩。<br>2. <strong><code>rem</code>（root em）：</strong> 相对单位。它永远且唯一参考 <code>&lt;html&gt;</code> 标签上的 <code>font-size</code> 属性。<br><br><span class=\"text-emerald-600 text-sm\">💡 经验之谈：在做移动端 H5 适配或大屏数据可视化时，<code>rem</code> 是神器。我们只需配合一小段 JS 代码动态监听屏幕宽度的变化，按比例修改 html 根节点的 font-size，页面里所有用到 <code>rem</code> 的元素就会整体跟着等比例自动缩放，完美实现多端适配！</span>"
      },
      {
        "id": "css-05",
        "question": "9.5 Sass/Scss中有哪些常用的特性？",
        "answerHtml": "在项目里引入预处理器 Sass 极大提升了写样式的幸福感和工程化能力，最常用的有：<br>1. <strong>嵌套 (Nesting)：</strong> 允许将 CSS 选择器嵌套在另一个里面，结构和 HTML 保持一致，用 <code>&amp;</code> 代表父选择器（如写 <code>&amp;:hover</code> 贼方便）。<br>2. <strong>变量 (Variables)：</strong> 用 <code>$</code> 定义变量，比如 <code>$primary-color: #3b82f6;</code>，方便全站统一修改主题色。<br>3. <strong>混入 (Mixins)：</strong> 用 <code>@mixin</code> 封装一段可重用的代码块（还支持传参），用 <code>@include</code> 引入。我经常用来封装 flex 居中对齐或者文本单行/多行超长省略号代码。<br>4. <strong>继承 (Extend)：</strong> 用 <code>@extend</code> 共享相同样式，减少代码冗余。<br>5. <strong>内置函数：</strong> 可以在代码里直接做数学运算，或者用 <code>darken()</code>、<code>lighten()</code> 等颜色函数动态调整主题颜色的明暗。"
      }
    ]
  },
  {
    "id": "git",
    "name": "10. Git 版本控制",
    "questions": [
      {
        "id": "git-01",
        "question": "10.1 Git是什么？",
        "answerHtml": "Git 是一个开源的<strong>分布式版本控制系统</strong>。<br>与老式的 SVN 最大不同在于它是分布式的，我们每个开发者的电脑上都有一个完整的本地代码库。它不仅能帮我们记录代码的每一次修改历史，方便随时回滚，更是团队多人协作开发中不可或缺的基础工具。"
      },
      {
        "id": "git-02",
        "question": "10.2 Git的常用命令有哪些？",
        "answerHtml": "日常高频使用的命令：<br>1. <code>git clone</code>：克隆远程仓库到本地。<br>2. <code>git status</code>：查看当前工作区文件的状态。<br>3. <code>git add .</code>：将所有修改添加到暂存区。<br>4. <code>git commit -m \"描述\"</code>：将暂存区代码提交到本地仓库。<br>5. <code>git push</code> / <code>git pull</code>：推送到远程 / 从远程拉取。<br>6. <code>git branch</code>：查看分支。<br>7. <code>git checkout</code>（或 <code>git switch</code>）：切换分支。<br>8. <code>git merge</code>：合并分支。"
      },
      {
        "id": "git-03",
        "question": "10.3 Git如何合并、拉取代码？",
        "answerHtml": "<strong>拉取代码：</strong>直接使用 <code>git pull</code>。它其实是 <code>git fetch</code>（获取远程最新更新）和 <code>git merge</code>（合并到本地）的组合。<br><strong>合并代码：</strong>比如我们要把 <code>feature</code> 分支合并到 <code>main</code> 主分支：<br>1. 首先切换到主分支：<code>git checkout main</code>。<br>2. 确保主分支是最新的：<code>git pull</code>。<br>3. 执行合并：<code>git merge feature</code>。<br>4. 最后推送到远程：<code>git push</code>。"
      },
      {
        "id": "git-04",
        "question": "10.4 Git如何解决冲突？",
        "answerHtml": "<strong>冲突原因：</strong>通常是因为两个开发者修改了同一个文件的同一行代码，Git 无法自动判断该保留谁的。<br><strong>解决步骤：</strong><br>1. 在执行 <code>pull</code> 或 <code>merge</code> 时，如果出现冲突终端会标红提示（CONFLICT）。<br>2. 打开代码编辑器，Git 会在冲突文件里生成 <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>、<code>=======</code>、<code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> 的标记，分割了本地代码和别人提交的代码。<br>3. 我们需要人工甄别，删掉这些提示符，把代码调整为最终正确保留的样子。<br>4. 修改完毕后，重新执行 <code>git add .</code> 和 <code>git commit -m \"fix conflict\"</code> 即可完成冲突解决。"
      }
    ]
  },
  {
    "id": "ui-components",
    "name": "11. UI 组件库应用",
    "questions": [
      {
        "id": "ui-components-01",
        "question": "11.1 ECharts有用过吗？常用的配置/组件有哪些？",
        "answerHtml": "用过，它是前端做数据可视化的利器。<br>最常用的配置项（ECharts 中统称为 option）：<br>1. <strong><code>title</code></strong>：图表的标题。<br>2. <strong><code>tooltip</code></strong>：提示框，鼠标悬浮时展示的具体数据。<br>3. <strong><code>legend</code></strong>：图例，用来区分不同的数据项，且可以点击切换显示。<br>4. <strong><code>xAxis / yAxis</code></strong>：控制 X 轴和 Y 轴的数据与样式。<br>5. <strong><code>series</code></strong>：系列列表，这里决定了画什么图表（如 <code>type: \"line\"</code> 折线图、<code>\"bar\"</code> 柱状图、<code>\"pie\"</code> 饼图）以及核心数据源。<br><span class=\"text-amber-600 text-sm\">⚠️ 注意：ECharts 初始化必须等 DOM 渲染完，所以一般放在 <code>mounted</code> 或 <code>$nextTick</code> 中执行，且通常需要监听 window 的 <code>resize</code> 事件来调用 <code>chart.resize()</code> 实现图表的自适应。</span>"
      },
      {
        "id": "ui-components-02",
        "question": "11.2 Element UI 是怎么做表单验证的？",
        "answerHtml": "在 Element UI（包含 Vue3 的 Element Plus）中做表单验证需要三个核心绑定：<br>1. 在 <code>&lt;el-form&gt;</code> 上绑定 <strong><code>:model=\"formData\"</code></strong>（表单数据对象）和 <strong><code>:rules=\"rules\"</code></strong>（验证规则对象）。<br>2. 在对应的 <code>&lt;el-form-item&gt;</code> 上绑定 <strong><code>prop=\"字段名\"</code></strong>（此 prop 必须与 model 对象里的键名、rules 里的键名完全一致）。<br>3. 在提交操作时，通过 <code>ref</code> 获取 el-form 实例，调用其内部的 <strong><code>validate</code></strong> 方法，如果回调里的 valid 为 true，则验证通过并向后端发请求。"
      },
      {
        "id": "ui-components-03",
        "question": "11.3 经常用的 Element UI 组件有哪些？",
        "answerHtml": "基本上每天都在打交道，最常用的有：<br>1. <strong>基础类：</strong>Button（按钮）、Icon（图标）、Layout（栅格布局）。<br>2. <strong>数据录入类：</strong>Form（表单）、Input（输入框）、Select（下拉框）、DatePicker（日期选择器）。<br>3. <strong>数据展示类（重头戏）：</strong>Table（表格，业务逻辑最复杂）、Pagination（分页，常与表格联动）。<br>4. <strong>反馈提示类：</strong>Dialog（弹窗）、Message（消息提示，常用作操作成功/失败反馈）、Loading（加载遮罩）。"
      }
    ]
  },
  {
    "id": "uniapp",
    "name": "12. uni-app 跨端开发",
    "questions": [
      {
        "id": "uniapp-01",
        "question": "12.1 uni-app的页面生命周期有哪些？进入或重新进入时执行顺序如何？",
        "answerHtml": "除了兼容 Vue 的组件生命周期，uni-app 还有自己的专属“页面级”生命周期：<br>常用的是：<strong><code>onLoad</code></strong>(接收页面参数)、<strong><code>onShow</code></strong>(页面显示)、<strong><code>onReady</code></strong>(初次渲染完成)、<strong><code>onHide</code></strong>(页面隐藏)、<strong><code>onUnload</code></strong>(页面卸载)。<br><br><strong>执行顺序：</strong><br>1. <strong>首次进入页面：</strong> <code>onLoad</code> ➔ <code>onShow</code> ➔ <code>onReady</code>。<br>2. <strong>重新进入（从其他页返回，或从后台切回）：</strong> 由于页面尚未被销毁只是隐藏，此时只会触发 <strong><code>onShow</code></strong>，不会再执行 onLoad 和 onReady。如果要每次进页面都刷新数据，接口请求通常放在 onShow 中。"
      },
      {
        "id": "uniapp-02",
        "question": "12.2 在uni-app中实现页面跳转有哪些方式？有什么不同？",
        "answerHtml": "uni-app 提供了非常规范的路由跳转 API：<br>1. <strong><code>uni.navigateTo</code></strong>：保留当前页，跳到新页面，可使用 <code>navigateBack</code> 返回。<strong>最常用</strong>，但小程序端通常有 10 层页面栈限制。<br>2. <strong><code>uni.redirectTo</code></strong>：关闭当前页，跳转到新页面（无法返回到刚才的页面）。<br>3. <strong><code>uni.reLaunch</code></strong>：关闭所有页面栈，直接打开新页面（常用于退出登录后回首页）。<br>4. <strong><code>uni.switchTab</code></strong>：专用于跳转到 <code>pages.json</code> 中配置的 tabBar（底部导航）页面，且会关闭其他非 tabBar 页面。<br>5. <strong><code>uni.navigateBack</code></strong>：关闭当前页面，返回上一级或多级页面。"
      },
      {
        "id": "uniapp-03",
        "question": "12.3 uni-app中如何进行条件编译？",
        "answerHtml": "这是 uni-app 跨端适配的核心杀手锏。通过特殊格式的注释，能让特定代码只在特定平台上编译进去。<br><strong>语法规则：</strong> 以 <code>#ifdef 平台名</code> 开头，以 <code>#endif</code> 结尾。<br>1. <strong>HTML模板中：</strong> <code>&lt;!-- #ifdef MP-WEIXIN --&gt;</code> 仅微信小程序可见的内容 <code>&lt;!-- #endif --&gt;</code><br>2. <strong>JS逻辑中：</strong> <code>// #ifdef APP-PLUS</code> 仅APP端执行的逻辑 <code>// #endif</code><br>3. <strong>CSS样式中：</strong> <code>/* #ifdef H5 */</code> 仅H5端生效的样式 <code>/* #endif */</code>"
      },
      {
        "id": "uniapp-04",
        "question": "12.4 uni-app中如何编写路由结构？",
        "answerHtml": "与传统的 Vue Router 写单独的路由配置文件不同，uni-app 的路由配置是强约定的。<br>所有的页面路由都必须统一在项目根目录下的 <strong><code>pages.json</code></strong> 文件中进行配置。<br>在 <code>pages</code> 数组中添加对象，指明 <code>path</code> (页面路径) 和 <code>style</code> (页面窗口表现，如导航栏标题)。<strong>注意：<code>pages</code> 数组里的第一项会被默认设置为应用的启动首页。</strong>"
      },
      {
        "id": "uniapp-05",
        "question": "12.5 uni-app中怎么进行网络请求？",
        "answerHtml": "官方提供了原生的 <strong><code>uni.request()</code></strong> API 来发起网络请求。<br><span class=\"text-emerald-600 text-sm\">💡 经验之谈：虽然原生 API 也能用，但在企业级实际项目中，我们绝对不会散落在各个页面到处写 <code>uni.request</code>。我通常会封装一个全局的网络请求工具类，在里面返回 <code>Promise</code> 对象，并统一拦截配置 <code>baseUrl</code>、在 Header 里注入登录 <code>Token</code>，以及利用 <code>uni.showToast</code> 集中处理各种 HTTP 错误状态码。</span>"
      },
      {
        "id": "uniapp-06",
        "question": "12.6 uni-app在页面之间的传值方式有哪些？",
        "answerHtml": "日常开发中主要有以下几种手段：<br>1. <strong>URL 拼接传参：</strong> <code>uni.navigateTo({ url: \"detail?id=123\" })</code>，在目标页面的 <code>onLoad(options)</code> 中通过 <code>options.id</code> 接收。适合传简单的基本类型数据。<br>2. <strong>全局状态管理：</strong> 引入 Vuex 或 Pinia，这是处理跨页面复杂对象传值的最优解。<br>3. <strong>本地缓存存储：</strong> 使用 <code>uni.setStorageSync(\"key\", data)</code> 和 <code>uni.getStorageSync(\"key\")</code>，常用于用户信息持久化。<br>4. <strong>全局事件通道（EventBus机制）：</strong> 使用 <code>uni.$emit(\"事件名\", 数据)</code> 发送，目标页面用 <code>uni.$on(\"事件名\", 回调)</code> 接收。"
      }
    ]
  },
  {
    "id": "practical-action",
    "name": "13. 核心实战与架构",
    "questions": [
      {
        "id": "practical-action-01",
        "question": "13.1 如何实现无感 Token 刷新？",
        "answerHtml": "<strong>核心思想：</strong> 当短效的 <code>access_token</code> 过期时，利用拦截器自动使用长效的 <code>refresh_token</code> 去换取新的 token，然后重发刚才失败的请求，全程用户毫无察觉。<br><br><strong>详细实现闭环：</strong><br>1. <strong>双Token下发：</strong> 登录成功后，后端下发 <code>access_token</code>（短效，如2小时）和 <code>refresh_token</code>（长效，如7天）。<br>2. <strong>拦截401报错：</strong> 在 Axios 的响应拦截器中，如果捕获到 HTTP 状态码为 401（Token过期），则拦截该请求。<br>3. <strong>锁定刷新状态：</strong> 定义一个 <code>isRefreshing</code> 变量防抖。如果有多个请求同时报 401，只允许第一个请求去调用刷新接口，其他的请求用 <code>Promise</code> 挂起，存入一个重试队列（数组）中。<br>4. <strong>发起刷新：</strong> 携带 <code>refresh_token</code> 请求刷新接口。如果成功，将新的 token 存入本地；如果失败（refresh_token也过期了），则清空本地缓存，强制跳转登录页。<br>5. <strong>重试队列：</strong> 刷新成功后，遍历执行刚才存入队列里的所有 <code>Promise</code> 回调，并携带新的 token 重新发起这些被拦截的业务请求，最后将 <code>isRefreshing</code> 恢复为 false。",
        "keywords": [
          "token",
          "刷新",
          "401",
          "拦截器",
          "并发控制"
        ]
      },
      {
        "id": "practical-action-02",
        "question": "13.2 单点登录（SSO）是什么？如何实现？",
        "answerHtml": "<strong>核心思想：</strong> “一处登录，处处通行”。在由多个应用组成的庞大系统中，用户只需登录一次，就能访问所有相互信任的应用系统。<br><br><strong>详细实现方案：</strong><br>1. <strong>同主域名下的 SSO（如 a.test.com 和 b.test.com）：</strong><br>这是最简单的方案。前端只需在登录成功后，将 Token 存入 Cookie，并且设置 <code>domain=\".test.com\"</code>。这样不管是 A 系统还是 B 系统，每次发请求浏览器都会自动带上这个 Cookie，实现会话共享。<br><br>2. <strong>完全跨域下的 SSO（基于 CAS 或 OAuth2 标准体系）：</strong><br>这种场景需要一个独立的<strong>认证中心（Auth Server）</strong>。<br>• <strong>首次登录 A 系统：</strong> 用户访问 A 系统受限页面，A 系统发现未登录，重定向到认证中心。用户在认证中心输入账号密码登录成功后，认证中心在自己的域名下种下全局 Cookie（建立全局会话），并生成一个授权码（Ticket/Code），携带着它重定向回 A 系统。A 系统拿着 Code 去后台校验并换取真正的 Token，建立 A 系统的局部会话。<br>• <strong>免密登录 B 系统：</strong> 用户接着访问 B 系统，B 系统发现未登录，同样重定向到认证中心。此时认证中心发现该用户已经有全局 Cookie 了（说明在 A 登录过），于是跳过账号密码校验，直接自动生成一个 B 系统的 Code，并重定向回 B 系统。B 系统拿着 Code 去后台换 Token 建立局部会话，整个过程瞬间完成，用户无感。",
        "keywords": [
          "sso",
          "统一认证",
          "票据",
          "oauth2",
          "cas"
        ]
      },
      {
        "id": "practical-action-03",
        "question": "13.3 前端为什么要做请求层封装？",
        "answerHtml": "请求层封装的核心价值是统一治理：统一 baseURL、超时、鉴权头、错误码处理和日志埋点。<br><br>这样页面层只关注业务参数和展示逻辑，避免每个页面重复写一套请求处理。<br><br>当接口策略变更时，也能在一处收敛修改，降低维护成本。",
        "keywords": [
          "axios",
          "请求封装",
          "拦截器",
          "错误处理",
          "统一治理"
        ]
      },
      {
        "id": "practical-action-04",
        "question": "13.4 Vue 怎么做首屏优化？（综合版）",
        "answerHtml": "首屏优化建议按链路拆：资源体积、请求并发、渲染阻塞。<br><br><strong>常用动作：</strong>路由懒加载、关键资源预加载、图片压缩与懒加载、按需引入、缓存策略、骨架屏。<br><br><strong>验证指标：</strong>首屏可用时间、LCP、接口耗时、JS 执行耗时。<br><br>答题时要强调“有定位、有动作、有结果”。",
        "keywords": [
          "首屏优化",
          "lcp",
          "懒加载",
          "按需加载",
          "骨架屏"
        ]
      },
      {
        "id": "practical-action-05",
        "question": "13.5 长列表优化方案有哪些？如何结合项目落地？",
        "answerHtml": "通用方案包括分页、虚拟列表、分片渲染、懒加载和请求节流。<br><br>项目落地时我会先判断业务约束：是否必须整表展示、是否允许分页、滚动体验优先还是功能完整优先。<br><br>在中后台里通常会“分页 + 局部虚拟化 + 减少单行渲染成本”组合使用，并配合埋点验证卡顿是否下降。",
        "keywords": [
          "长列表",
          "虚拟列表",
          "分页",
          "分片渲染",
          "性能优化"
        ]
      },
      {
        "id": "practical-action-06",
        "question": "13.6 说说你对组件化的理解。",
        "answerHtml": "组件化不是只为复用，而是为了把复杂页面拆成边界清晰、可维护、可协作的模块。<br><br>我会重点关注三件事：职责单一、输入输出清晰、扩展点可控。<br><br>在中后台项目里，筛选区、批量操作区、弹层选择器这类高频结构最适合抽组件。",
        "keywords": [
          "组件化",
          "复用",
          "边界",
          "职责"
        ]
      },
      {
        "id": "practical-action-07",
        "question": "13.7 什么样的内容适合抽成组件？",
        "answerHtml": "通常满足“复用频率高 + 结构稳定 + 业务语义清晰”就适合抽组件。<br><br>如果只在单页面且逻辑变化很快，过早抽象反而会增加维护成本。<br><br>所以抽象不是越早越好，而是要在复用价值和复杂度之间平衡。",
        "keywords": [
          "抽组件",
          "复用",
          "过度封装",
          "边界"
        ]
      },
      {
        "id": "practical-action-08",
        "question": "13.8 什么样的逻辑适合抽成 hooks / 组合函数？",
        "answerHtml": "跨多个组件复用、和具体 UI 耦合较低、状态流程清晰的逻辑最适合抽成 hooks。<br><br>例如分页查询、筛选状态同步、防抖节流、请求生命周期管理。<br><br>抽完后建议对外只暴露最小必要接口，避免 hooks 变成新的“大而全工具箱”。",
        "keywords": [
          "hooks",
          "组合函数",
          "逻辑复用",
          "状态管理"
        ]
      },
      {
        "id": "practical-action-09",
        "question": "13.9 你理解的前端工程化是什么？",
        "answerHtml": "工程化的目标是让项目“稳定交付 + 可持续演进”，不是单纯上工具。<br><br>它包含规范（Lint/提交规范）、构建（打包与环境管理）、质量（测试与发布检查）、协作（分支与流程）。<br><br>面试里建议把工程化和实际收益绑定，比如减少回归事故、缩短联调时间。",
        "keywords": [
          "工程化",
          "规范",
          "构建",
          "质量保障",
          "交付"
        ]
      },
      {
        "id": "practical-action-10",
        "question": "13.10 Vite 和 Webpack 有什么区别？为什么 Vite 更快？",
        "answerHtml": "两者都能完成构建，但开发阶段机制不同：Webpack 偏“先打包再服务”，Vite 偏“原生 ESM 按需加载”。<br><br>Vite 快主要体现在冷启动和热更新：只处理当前用到的模块，不必每次全量重构建。<br><br>选型时还要看项目历史包袱、生态依赖和团队经验，不是单一性能维度决策。",
        "keywords": [
          "vite",
          "webpack",
          "esm",
          "热更新",
          "构建速度"
        ]
      },
      {
        "id": "practical-action-11",
        "question": "13.11 响应式页面适配有哪几种方式？如何实现？",
        "answerHtml": "常见方案有媒体查询、Flex/Grid 流式布局、rem/vw、断点策略和大屏 scale 方案。<br><br>落地时通常组合使用：结构用 Flex/Grid，尺寸用 rem/vw，行为在关键断点做差异化处理。<br><br>移动端还要补充安全区、软键盘顶起与触控区域的适配，避免只停留在宽度缩放。",
        "keywords": [
          "响应式",
          "media query",
          "rem",
          "vw",
          "flex",
          "grid"
        ]
      }
    ]
  },
  {
    "id": "browser-network",
    "name": "14. 浏览器与网络",
    "questions": [
      {
        "id": "browser-network-01",
        "question": "14.1 从输入 URL 到页面展示，大致经历了什么？",
        "answerHtml": "可以分成两段：网络链路和浏览器渲染。<br><br>网络链路包含 DNS 解析、连接建立、请求响应；渲染链路包含 DOM/CSSOM 构建、布局、绘制和合成。<br><br>面试中建议先讲主流程，再补缓存命中与渲染阻塞等细节。",
        "keywords": [
          "url",
          "dns",
          "渲染流程",
          "网络链路"
        ]
      },
      {
        "id": "browser-network-02",
        "question": "14.2 强缓存和协商缓存的区别是什么？",
        "answerHtml": "强缓存命中时浏览器直接使用本地资源，不发请求；协商缓存会向服务端确认资源是否更新。<br><br>通常强缓存优先，强缓存失效后再走协商缓存。<br><br>项目中常见策略是静态资源强缓存 + 指纹，入口 HTML 协商缓存。",
        "keywords": [
          "强缓存",
          "协商缓存",
          "cache-control",
          "etag"
        ]
      },
      {
        "id": "browser-network-03",
        "question": "14.3 常见缓存头有哪些？",
        "answerHtml": "<strong>强缓存：</strong><code>Cache-Control</code>、<code>Expires</code>。<br><strong>协商缓存：</strong><code>ETag/If-None-Match</code>、<code>Last-Modified/If-Modified-Since</code>。<br>面试里可以补一句：现代项目更常把 Cache-Control 作为主配置。",
        "keywords": [
          "缓存头",
          "cache-control",
          "etag",
          "last-modified"
        ]
      },
      {
        "id": "browser-network-04",
        "question": "14.4 localStorage、sessionStorage、cookie 的区别是什么？",
        "answerHtml": "localStorage 持久化、sessionStorage 会话级、cookie 会随请求发送到服务端且容量较小。<br><br>所以它们不是互相替代关系，而是按场景选择：本地缓存、会话态、服务端会话协同。",
        "keywords": [
          "localStorage",
          "sessionStorage",
          "cookie",
          "存储"
        ]
      },
      {
        "id": "browser-network-05",
        "question": "14.5 跨域是什么？常见解决方案有哪些？",
        "answerHtml": "跨域本质是浏览器同源策略限制，不是服务端“不能访问”。<br><br>常见方案有 CORS、反向代理、开发环境代理；JSONP 仅适用于 GET 且已较少使用。<br><br>有 Cookie 场景时还要关注凭证配置和同站策略。",
        "keywords": [
          "跨域",
          "cors",
          "代理",
          "jsonp"
        ]
      },
      {
        "id": "browser-network-06",
        "question": "14.6 同源策略是什么？",
        "answerHtml": "同源策略要求协议、域名、端口都相同，浏览器才认为是同源。<br><br>它的核心价值是隔离不同来源脚本对敏感数据的随意访问，是 Web 安全的基础机制之一。",
        "keywords": [
          "同源策略",
          "安全",
          "协议",
          "域名",
          "端口"
        ]
      },
      {
        "id": "browser-network-07",
        "question": "14.7 浏览器渲染页面的关键流程是什么？",
        "answerHtml": "浏览器会先解析 HTML 和 CSS，生成 DOM 树与 CSSOM，再合成渲染树，随后进行布局、绘制和图层合成。<br><br>性能优化时要尽量减少高成本的布局与绘制频次。",
        "keywords": [
          "浏览器渲染",
          "dom",
          "cssom",
          "layout",
          "paint"
        ]
      },
      {
        "id": "browser-network-08",
        "question": "14.8 什么是重排和重绘？",
        "answerHtml": "重排是几何信息变化导致布局重算，重绘是视觉样式变化导致重新绘制。<br><br>一般重排成本高于重绘，频繁触发会造成卡顿。",
        "keywords": [
          "重排",
          "回流",
          "重绘",
          "性能"
        ]
      },
      {
        "id": "browser-network-09",
        "question": "14.9 怎么减少重排和重绘？",
        "answerHtml": "可以通过批量修改样式、减少强制同步布局读取、优先使用 <code>transform/opacity</code> 动画、降低 DOM 复杂度来优化。<br><br>项目里建议结合 Performance 面板定位真实瓶颈，而不是只靠经验优化。",
        "keywords": [
          "减少重排",
          "减少重绘",
          "transform",
          "性能优化"
        ]
      },
      {
        "id": "browser-network-10",
        "question": "14.10 前端请求层为什么要统一封装？",
        "answerHtml": "统一封装可以把鉴权、超时、错误提示、重试与日志埋点集中治理。<br><br>这样页面只处理业务数据，维护成本更低，也更利于全局问题排查。",
        "keywords": [
          "请求封装",
          "axios",
          "拦截器",
          "统一治理"
        ]
      }
    ]
  },
  {
    "id": "project-practice",
    "name": "15. 项目实战复盘",
    "questions": [
      {
        "id": "project-practice-01",
        "question": "15.1 你先介绍一下你做过的项目。",
        "answerHtml": "<strong>业务背景：</strong>我主要做过 ERP 中后台和社区团购小程序两类项目。<br><strong>难点：</strong>两类项目在交互、性能和业务复杂度上差异很大。<br><strong>处理方案：</strong>ERP 侧聚焦商品中心与采购供应链，小程序侧聚焦商品流、订单和用户链路。<br><strong>结果：</strong>形成了“中后台复杂业务 + C 端体验优化”的组合经验。",
        "keywords": [
          "项目介绍",
          "erp",
          "小程序"
        ]
      },
      {
        "id": "project-practice-02",
        "question": "15.2 你这几个项目里，哪个最有价值？",
        "answerHtml": "<strong>业务背景：</strong>我会优先讲 ERP 商品中心与采购供应链。<br><strong>难点：</strong>该模块涉及批量操作、导入导出、权限和状态一致性。<br><strong>处理方案：</strong>通过模块化拆分与通用能力抽象保证交付稳定。<br><strong>结果：</strong>对复杂业务建模和团队协作能力提升最大。",
        "keywords": [
          "项目价值",
          "erp",
          "中后台"
        ]
      },
      {
        "id": "project-practice-03",
        "question": "15.3 ERP 项目中你主要负责哪些模块？",
        "answerHtml": "<strong>业务背景：</strong>核心负责商品中心和采购入库链路。<br><strong>难点：</strong>模块多且关联深，跨页面状态和权限边界复杂。<br><strong>处理方案：</strong>我负责列表筛选、批量操作、导入导出、库存校验与日志展示。<br><strong>结果：</strong>模块能独立交付并稳定支持后续需求迭代。",
        "keywords": [
          "erp模块",
          "商品中心",
          "采购入库"
        ]
      },
      {
        "id": "project-practice-04",
        "question": "15.4 商品中心这个模块的核心功能有哪些？",
        "answerHtml": "<strong>业务背景：</strong>业务核心是商品全生命周期管理。<br><strong>难点：</strong>功能多且操作频繁，容易出现状态不一致。<br><strong>处理方案：</strong>搭建了筛选、批量上下架、属性维护、导入导出和权限控制。<br><strong>结果：</strong>运营处理效率和页面稳定性都有明显提升。",
        "keywords": [
          "商品中心",
          "批量操作",
          "导入导出"
        ]
      },
      {
        "id": "project-practice-05",
        "question": "15.5 商品列表页最复杂的点是什么？",
        "answerHtml": "<strong>业务背景：</strong>商品列表承接高频查询和批量操作。<br><strong>难点：</strong>筛选、分页、勾选、批量动作之间联动复杂。<br><strong>处理方案：</strong>统一维护查询参数、勾选状态与操作反馈链路。<br><strong>结果：</strong>减少了误操作和状态错乱问题。",
        "keywords": [
          "商品列表",
          "筛选联动",
          "分页"
        ]
      },
      {
        "id": "project-practice-06",
        "question": "15.6 批量操作你是怎么做的？",
        "answerHtml": "<strong>业务背景：</strong>批量操作覆盖上下架、属性调整等场景。<br><strong>难点：</strong>难点在于跨页勾选、权限校验和失败回显。<br><strong>处理方案：</strong>前端做选择态管理 + 操作前校验 + 执行后结果分层提示。<br><strong>结果：</strong>既保证效率，也让错误可追踪。",
        "keywords": [
          "批量操作",
          "校验",
          "结果回显"
        ]
      },
      {
        "id": "project-practice-07",
        "question": "15.7 Excel 导入导出功能你是怎么做的？",
        "answerHtml": "<strong>业务背景：</strong>导入导出是运营高频功能。<br><strong>难点：</strong>导入流程容易因格式问题失败且难定位。<br><strong>处理方案：</strong>提供模板下载、上传前校验、结果明细回显和失败原因提示。<br><strong>结果：</strong>减少了反复试错，提升了业务可用性。",
        "keywords": [
          "excel",
          "导入导出",
          "上传校验"
        ]
      },
      {
        "id": "project-practice-08",
        "question": "15.8 采购入库模块你做了哪些内容？",
        "answerHtml": "<strong>业务背景：</strong>采购入库是核心业务流程页。<br><strong>难点：</strong>存在多步骤数据编辑与状态流转，回填逻辑复杂。<br><strong>处理方案：</strong>我负责表单骨架、明细编辑、校验、草稿与提交链路。<br><strong>结果：</strong>保证了复杂单据流程可控且可维护。",
        "keywords": [
          "采购入库",
          "表单",
          "状态流转"
        ]
      },
      {
        "id": "project-practice-09",
        "question": "15.9 采购入库为什么难？",
        "answerHtml": "<strong>业务背景：</strong>它不是简单表单，而是业务流程页面。<br><strong>难点：</strong>字段联动、明细编辑、权限和状态机同时存在。<br><strong>处理方案：</strong>按领域拆状态，区分展示态与业务态并分层校验。<br><strong>结果：</strong>降低了变更风险和线上异常率。",
        "keywords": [
          "采购入库难点",
          "状态管理",
          "业务流程"
        ]
      },
      {
        "id": "project-practice-10",
        "question": "15.10 采购入库中的状态管理你是怎么做的？",
        "answerHtml": "<strong>业务背景：</strong>核心是共享状态集中治理。<br><strong>难点：</strong>跨组件同步容易失控，局部状态难复盘。<br><strong>处理方案：</strong>把跨组件共享状态收敛到 Pinia，组件只保留展示态。<br><strong>结果：</strong>数据来源更单一，调试和扩展更稳定。",
        "keywords": [
          "pinia",
          "状态管理",
          "采购入库"
        ]
      },
      {
        "id": "project-practice-11",
        "question": "15.11 库存校验你是怎么理解的？",
        "answerHtml": "<strong>业务背景：</strong>库存校验分前端基础校验和后端业务校验。<br><strong>难点：</strong>只做前端校验会出现并发与脏数据问题。<br><strong>处理方案：</strong>前端先挡格式错误，最终以服务端校验结果为准并回显原因。<br><strong>结果：</strong>既提升输入体验，也保证业务正确性。",
        "keywords": [
          "库存校验",
          "前后端协同",
          "业务校验"
        ]
      },
      {
        "id": "project-practice-12",
        "question": "15.12 如果后端库存接口返回慢，你会怎么处理？",
        "answerHtml": "<strong>业务背景：</strong>接口慢会直接影响提交流程体验。<br><strong>难点：</strong>用户会重复点击并产生重复请求风险。<br><strong>处理方案：</strong>增加按钮防重、请求超时提示、局部 loading 与幂等控制。<br><strong>结果：</strong>流程可感知且可恢复，避免错误操作放大。",
        "keywords": [
          "接口慢",
          "防重",
          "幂等",
          "loading"
        ]
      },
      {
        "id": "project-practice-13",
        "question": "15.13 你做过哪些权限控制？",
        "answerHtml": "<strong>业务背景：</strong>权限控制覆盖页面、菜单、按钮和接口协同。<br><strong>难点：</strong>只做前端显隐无法保证真正安全。<br><strong>处理方案：</strong>前端做路由守卫与按钮控制，后端做接口强校验。<br><strong>结果：</strong>减少越权操作并统一权限口径。",
        "keywords": [
          "权限控制",
          "路由守卫",
          "按钮权限",
          "接口鉴权"
        ]
      },
      {
        "id": "project-practice-14",
        "question": "15.14 前端做权限控制的意义是什么？",
        "answerHtml": "<strong>业务背景：</strong>前端权限控制主要提升体验和流程正确性。<br><strong>难点：</strong>如果没有前端控制，用户会频繁触发无权限操作。<br><strong>处理方案：</strong>通过菜单、页面和按钮层限制减少无效操作。<br><strong>结果：</strong>最终与后端权限校验形成双层保障。",
        "keywords": [
          "前端权限",
          "用户体验",
          "越权"
        ]
      },
      {
        "id": "project-practice-15",
        "question": "15.15 你在 ERP 中做过哪些通用能力抽象？",
        "answerHtml": "<strong>业务背景：</strong>我重点抽了筛选区、批量操作区和业务选择弹层。<br><strong>难点：</strong>重复页面多，直接复制会导致维护成本持续上升。<br><strong>处理方案：</strong>提炼输入输出接口和可配置项，避免过度耦合业务细节。<br><strong>结果：</strong>后续新页面开发效率明显提升。",
        "keywords": [
          "通用能力",
          "组件抽象",
          "复用"
        ]
      },
      {
        "id": "project-practice-16",
        "question": "15.16 怎样避免通用组件过度封装？",
        "answerHtml": "<strong>业务背景：</strong>过度封装通常来自“预判太多未来需求”。<br><strong>难点：</strong>组件越大越全，反而难复用难维护。<br><strong>处理方案：</strong>坚持最小可复用原则，保留插槽和配置扩展，不把业务硬编码进基础组件。<br><strong>结果：</strong>组件边界清晰后，维护和迭代都更稳。",
        "keywords": [
          "过度封装",
          "组件边界",
          "最小可复用"
        ]
      },
      {
        "id": "project-practice-17",
        "question": "15.17 邻里购小程序你主要负责哪些页面？",
        "answerHtml": "<strong>业务背景：</strong>主要负责商品流、拼团详情、订单中心、地址管理和订单确认。<br><strong>难点：</strong>页面看似独立，但状态和请求链路关联紧密。<br><strong>处理方案：</strong>通过模块拆分与状态收敛，保证核心交易流程稳定。<br><strong>结果：</strong>提高了页面迭代效率和联调可控性。",
        "keywords": [
          "小程序",
          "订单中心",
          "地址管理"
        ]
      },
      {
        "id": "project-practice-18",
        "question": "15.18 小程序项目里最复杂的问题是什么？",
        "answerHtml": "<strong>业务背景：</strong>最复杂的是高频交互下的状态一致性。<br><strong>难点：</strong>弱网、快速切换和并发请求容易造成旧数据覆盖新状态。<br><strong>处理方案：</strong>用请求取消、版本号校验和防重提交保障最终一致性。<br><strong>结果：</strong>显著减少了错单和状态错乱。",
        "keywords": [
          "小程序难点",
          "状态一致性",
          "并发请求"
        ]
      },
      {
        "id": "project-practice-19",
        "question": "15.19 小程序长列表优化你做了哪些？",
        "answerHtml": "<strong>业务背景：</strong>长列表是小程序性能瓶颈高发点。<br><strong>难点：</strong>一次性渲染过多节点会导致滚动和交互卡顿。<br><strong>处理方案：</strong>采用分页加载、图片懒加载、局部骨架和请求节流策略。<br><strong>结果：</strong>滚动流畅度和首屏体验明显改善。",
        "keywords": [
          "小程序长列表",
          "分页",
          "懒加载",
          "性能"
        ]
      },
      {
        "id": "project-practice-20",
        "question": "15.20 小程序里你怎么防止重复请求？",
        "answerHtml": "<strong>业务背景：</strong>重复请求常由频繁点击和状态变更触发。<br><strong>难点：</strong>会造成数据抖动和服务端压力。<br><strong>处理方案：</strong>通过按钮节流、请求中的状态锁、幂等标识和取消旧请求处理。<br><strong>结果：</strong>保证页面以最后一次有效操作为准。",
        "keywords": [
          "防重复请求",
          "节流",
          "幂等",
          "请求取消"
        ]
      },
      {
        "id": "project-practice-21",
        "question": "15.21 多端兼容你遇到过哪些问题？如何处理？",
        "answerHtml": "<strong>业务背景：</strong>常见问题是样式差异、滚动行为差异和输入框问题。<br><strong>难点：</strong>同一代码在不同机型表现不一致。<br><strong>处理方案：</strong>建立机型清单并按“检测-补齐-降级-回归”流程处理。<br><strong>结果：</strong>核心流程页面在主要机型上表现更稳定。",
        "keywords": [
          "多端兼容",
          "机型差异",
          "降级方案"
        ]
      },
      {
        "id": "project-practice-22",
        "question": "15.22 你在项目中怎么和后端联调？",
        "answerHtml": "<strong>业务背景：</strong>联调阶段我会先对齐字段定义和状态码约定。<br><strong>难点：</strong>接口频繁变更容易引发页面异常和返工。<br><strong>处理方案：</strong>通过接口文档、mock、统一错误处理和联调清单推进。<br><strong>结果：</strong>问题定位更快，沟通成本更低。",
        "keywords": [
          "联调",
          "接口文档",
          "mock",
          "协作"
        ]
      },
      {
        "id": "project-practice-23",
        "question": "15.23 如果接口字段变了，你会怎么办？",
        "answerHtml": "<strong>业务背景：</strong>先判断是向后兼容变更还是破坏性变更。<br><strong>难点：</strong>直接替换字段会牵连多个页面。<br><strong>处理方案：</strong>在请求层做兼容适配，逐步迁移页面并补回归测试。<br><strong>结果：</strong>降低线上风险，保证迭代连续性。",
        "keywords": [
          "字段变更",
          "兼容适配",
          "回归测试"
        ]
      },
      {
        "id": "project-practice-24",
        "question": "15.24 你如何证明这些项目不是只做了页面？",
        "answerHtml": "<strong>业务背景：</strong>我会从业务链路、状态治理和异常兜底来证明。<br><strong>难点：</strong>只讲页面样式无法体现真实工程价值。<br><strong>处理方案：</strong>重点说明我负责的模块边界、关键决策和可量化结果。<br><strong>结果：</strong>能体现对业务与工程的双重理解。",
        "keywords": [
          "项目真实性",
          "业务链路",
          "工程能力"
        ]
      },
      {
        "id": "project-practice-25",
        "question": "15.25 你为什么做通用能力建设？",
        "answerHtml": "<strong>业务背景：</strong>通用能力建设是为了降低重复开发与联调成本。<br><strong>难点：</strong>每个页面从零搭会导致风格与逻辑不一致。<br><strong>处理方案：</strong>提炼高频模块并配置化使用，保留业务可扩展接口。<br><strong>结果：</strong>长期看能显著提升团队交付速度和稳定性。",
        "keywords": [
          "通用能力建设",
          "复用",
          "交付效率"
        ]
      }
    ]
  }
];
