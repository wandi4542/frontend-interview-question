<script setup lang="ts">
const profileStats = [
  { label: '已掌握专题', value: '13', hint: '题库主线已覆盖' },
  { label: '最近浏览', value: '28', hint: '近 7 天访问题目' },
  { label: '随机测试', value: '12', hint: '本周自测次数' },
  { label: '重点收藏', value: '9', hint: '待二刷清单' },
];

const recentLearning = [
  { title: 'JS 核心与实战', detail: '继续复盘 Promise、事件机制和兼容性题目。', time: '今天 09:20' },
  { title: '性能优化场景', detail: '补充首屏优化和渲染链路的表达模板。', time: '昨天 21:15' },
  { title: '布局方法库', detail: '重看 Grid 与 Flex 的选型建议。', time: '昨天 10:40' },
];

const learningGoals = [
  { title: '本周完成 2 次随机测试', progress: 72 },
  { title: '补齐登录权限场景回答', progress: 58 },
  { title: '整理 6 个布局方法卡片', progress: 84 },
];

const quickActions = ['继续刷题', '查看场景专题', '复习布局方法', '整理重点清单'];

const reviewSuggestions = [
  '优先复习“登录与权限”专题，适合串联项目经验。',
  '把 Promise 和事件机制题用自己的项目例子再说一遍。',
  '针对移动端兼容性，准备 2 个真机踩坑案例。',
  '布局题除了记解法，更要会讲适用场景和取舍。',
];
</script>

<template>
  <div class="space-y-8">
    <section class="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div class="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div class="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-2xl font-bold text-emerald-700">
            我
          </div>
          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-3">
              <h3 class="text-2xl font-bold text-slate-800">前端冲刺选手</h3>
              <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                连续学习 18 天
              </span>
            </div>
            <p class="mt-3 text-sm leading-7 text-slate-600">
              保持题感，带着项目经验去回答问题，让每一道面试题都能落到真实场景里。
            </p>
          </div>
        </div>
      </article>

      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">本周状态</p>
        <h3 class="mt-3 text-2xl font-bold text-slate-800">学习节奏稳定</h3>
        <p class="mt-3 text-sm leading-7 text-slate-600">
          当前更适合把“场景题 + 布局题”交叉复习，这样表达会更像真实项目总结，而不是孤立背题。
        </p>
        <div class="mt-5 rounded-2xl bg-slate-50 p-4">
          <p class="text-sm font-semibold text-slate-700">今日建议</p>
          <p class="mt-2 text-sm leading-7 text-slate-600">先做一次随机抽题，再回到“兼容性”场景专题做针对性复盘。</p>
        </div>
      </article>
    </section>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="stat in profileStats"
        :key="stat.label"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <p class="text-sm text-slate-500">{{ stat.label }}</p>
        <p class="mt-3 text-3xl font-bold text-slate-800">{{ stat.value }}</p>
        <p class="mt-2 text-sm text-slate-400">{{ stat.hint }}</p>
      </article>
    </section>

    <section class="grid gap-6 xl:grid-cols-2">
      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">最近学习记录</p>
        <h3 class="mt-3 text-2xl font-bold text-slate-800">最近打开过的内容</h3>

        <div class="mt-6 space-y-4">
          <article
            v-for="item in recentLearning"
            :key="item.title"
            class="rounded-2xl border border-slate-100 bg-slate-50 p-4"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm font-semibold text-slate-800">{{ item.title }}</p>
                <p class="mt-2 text-sm leading-7 text-slate-600">{{ item.detail }}</p>
              </div>
              <span class="shrink-0 text-xs text-slate-400">{{ item.time }}</span>
            </div>
          </article>
        </div>
      </article>

      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">学习目标</p>
        <h3 class="mt-3 text-2xl font-bold text-slate-800">本周计划推进情况</h3>

        <div class="mt-6 space-y-5">
          <article v-for="goal in learningGoals" :key="goal.title">
            <div class="flex items-center justify-between gap-4">
              <p class="text-sm font-semibold text-slate-700">{{ goal.title }}</p>
              <span class="text-sm font-medium text-emerald-600">{{ goal.progress }}%</span>
            </div>
            <div class="mt-3 h-2 rounded-full bg-slate-100">
              <div class="h-full rounded-full bg-emerald-500" :style="{ width: `${goal.progress}%` }"></div>
            </div>
          </article>
        </div>
      </article>
    </section>

    <section class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">常用功能入口</p>
        <h3 class="mt-3 text-2xl font-bold text-slate-800">下一步想做什么</h3>

        <div class="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <button
            v-for="action in quickActions"
            :key="action"
            type="button"
            class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
          >
            {{ action }}
          </button>
        </div>
      </article>

      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">建议复习清单</p>
        <h3 class="mt-3 text-2xl font-bold text-slate-800">把高频薄弱点优先补齐</h3>

        <div class="mt-6 space-y-4">
          <article
            v-for="(item, index) in reviewSuggestions"
            :key="item"
            class="rounded-2xl border border-slate-100 bg-slate-50 p-4"
          >
            <div class="flex items-start gap-4">
              <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-emerald-600 shadow-sm">
                {{ index + 1 }}
              </span>
              <p class="text-sm leading-7 text-slate-600">{{ item }}</p>
            </div>
          </article>
        </div>
      </article>
    </section>
  </div>
</template>
