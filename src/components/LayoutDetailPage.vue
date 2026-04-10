<script setup lang="ts">
import type { LayoutDemo, LayoutDemoCell, LayoutDemoPanel, LayoutSolution, LayoutSolutionType, LayoutTopic } from '../data/layout-library';

const props = defineProps<{
  layout: LayoutTopic;
  activeFilterLabel: string;
}>();

const emit = defineEmits<{
  (event: 'back'): void;
}>();

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function highlightHtml(code: string) {
  let html = escapeHtml(code);

  html = html.replace(/(&lt;\/?)([a-zA-Z][\w-]*)/g, '$1<span class="text-sky-300">$2</span>');
  html = html.replace(/([a-zA-Z-:]+)=(&quot;.*?&quot;)/g, '<span class="text-emerald-300">$1</span>=<span class="text-amber-300">$2</span>');
  html = html.replace(/(&lt;!--.*?--&gt;)/g, '<span class="text-slate-500">$1</span>');

  return html;
}

function highlightCss(code: string) {
  const escaped = escapeHtml(code);
  const trimmed = escaped.trim();

  if (trimmed.startsWith('/*') && trimmed.endsWith('*/')) {
    return `<span class="text-slate-500">${escaped}</span>`;
  }

  if (trimmed.startsWith('@media')) {
    return escaped
      .replace(/(@media)/, '<span class="text-fuchsia-300">$1</span>')
      .replace(/(max-width|min-width)/g, '<span class="text-emerald-300">$1</span>')
      .replace(/(:\s*[^\)\{;]+)/g, '<span class="text-amber-300">$1</span>');
  }

  if (escaped.includes('{') && !escaped.includes(':')) {
    return escaped.replace(/^\s*([^\{]+)(\s*\{)/, '<span class="text-sky-300">$1</span>$2');
  }

  if (escaped.includes(':')) {
    return escaped.replace(/^(\s*)([a-zA-Z-]+)(\s*:\s*)([^;]+)(;?)/, '$1<span class="text-emerald-300">$2</span>$3<span class="text-amber-300">$4</span><span class="text-slate-500">$5</span>');
  }

  return escaped;
}

function highlightLine(code: string, language: 'html' | 'css') {
  return language === 'html' ? highlightHtml(code) : highlightCss(code);
}

function getCodeLines(code: string) {
  return code.replace(/\r\n/g, '\n').trim().split('\n');
}

function toneClass(tone?: LayoutDemoCell['tone']) {
  switch (tone) {
    case 'emerald':
      return 'border-emerald-200 bg-emerald-100 text-emerald-700';
    case 'blue':
      return 'border-sky-200 bg-sky-100 text-sky-700';
    case 'amber':
      return 'border-amber-200 bg-amber-100 text-amber-700';
    default:
      return 'border-slate-200 bg-white text-slate-500';
  }
}

function heightClass(height?: LayoutDemoCell['height']) {
  switch (height) {
    case 'sm':
      return 'h-14';
    case 'lg':
      return 'h-28';
    default:
      return 'h-20';
  }
}

function isParentShellDemo(demo: LayoutDemo) {
  const firstRow = demo.rows[0];
  return Boolean(firstRow?.length === 1 && firstRow[0]?.label === 'P');
}

function getInnerRows(demo: LayoutDemo) {
  return isParentShellDemo(demo) ? demo.rows.slice(1) : demo.rows;
}

function demoCellStyle(cell: LayoutDemoCell) {
  if (cell.start) {
    return {
      gridColumn: `${cell.start} / span ${cell.cols ?? 1}`,
    };
  }

  return {
    gridColumn: `span ${cell.cols ?? 1} / span ${cell.cols ?? 1}`,
  };
}

function getSolutionDemoLabel(topicId: string, solutionId: string, label: string) {
  if (label === 'P') {
    return 'parent';
  }

  if (topicId === 'holy-grail' && solutionId === 'holy-grail-classic') {
    return ({ '1': 'header', '2': 'content', '3': 'left', '4': 'right', '5': 'footer' }[label] ?? label);
  }

  switch (topicId) {
    case 'center-layout':
      return label === '1' ? 'child' : label;
    case 'layout-deconstruction':
      return ({ '1': 'child-a', '2': 'child-b', '3': 'child-c' }[label] ?? label);
    case 'sidebar-adaptive':
      return ({ '1': 'sidebar', '2': 'content' }[label] ?? label);
    case 'sticky-footer':
      return ({ '1': 'header', '2': 'main', '3': 'footer' }[label] ?? label);
    case 'holy-grail':
      return ({ '1': 'header', '2': 'left', '3': 'content', '4': 'right', '5': 'footer' }[label] ?? label);
    case 'span-grid':
      return ({ '1': 'span-12', '2': 'span-6', '3': 'span-4', '4': 'span-2' }[label] ?? label);
    case 'ram-layout':
    case 'responsive-breakpoints':
      return ({ '1': 'card-a', '2': 'card-b', '3': 'card-c', '4': 'card-d' }[label] ?? label);
    case 'clamp-responsive':
    case 'aspect-ratio-layout':
      return label === '1' ? 'child' : label;
    case 'mobile-adaptation':
      if (solutionId === 'mobile-adaptation-classic') {
        return ({ '1': 'hero', '2': 'panel' }[label] ?? label);
      }

      return ({ '1': 'header', '2': 'content', '3': 'footer' }[label] ?? label);
    default:
      return label;
  }
}

function solutionBadgeClass(type: LayoutSolutionType) {
  switch (type) {
    case 'flex':
      return 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200';
    case 'grid':
      return 'bg-sky-50 text-sky-600 ring-1 ring-sky-200';
    default:
      return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
  }
}

function codePanelTitle(solution: LayoutSolution, language: 'html' | 'css') {
  return language === 'html' ? `${solution.label} HTML` : `${solution.label} CSS`;
}

function demoPanelGridClass(panels: LayoutDemoPanel[]) {
  if (panels.length >= 3) {
    return 'grid gap-4 xl:grid-cols-3';
  }

  if (panels.length === 2) {
    return 'grid gap-4 lg:grid-cols-2';
  }

  return 'grid gap-4';
}
</script>

<template>
  <section class="space-y-6">
    <section class="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/70 p-6 shadow-sm md:p-8">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div class="max-w-4xl">
          <button
            type="button"
            class="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
            @click="emit('back')"
          >
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回布局列表
          </button>

          <div class="mt-5 flex flex-wrap items-center gap-3">
            <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">布局详情</span>
            <span class="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm ring-1 ring-slate-200">
              当前筛选：{{ props.activeFilterLabel }}
            </span>
            <span class="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm ring-1 ring-slate-200">
              方案数：{{ props.layout.solutions.length }}
            </span>
          </div>

          <h3 class="mt-5 text-3xl font-bold text-slate-900 md:text-4xl">{{ props.layout.title }}</h3>
          <p class="mt-4 text-base leading-8 text-slate-600">{{ props.layout.summary }}</p>
        </div>

        <div class="grid gap-3 lg:w-80">
          <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">适用场景</p>
            <p class="mt-3 text-sm leading-7 text-slate-600">{{ props.layout.scene }}</p>
          </div>
          <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">阅读建议</p>
            <p class="mt-3 text-sm leading-7 text-slate-600">
              先确认 parent 和 child 的层级，再看效果示意，最后对着 CSS 里的注释讲清楚“属性 + 值 + 作用”。
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-6">
      <article
        v-for="solution in props.layout.solutions"
        :key="solution.id"
        class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <div class="border-b border-slate-200 bg-slate-50 px-6 py-5 md:px-8">
          <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div class="flex flex-wrap items-center gap-3">
                <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="solutionBadgeClass(solution.type)">
                  {{ solution.label }}
                </span>
                <span class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">方案块</span>
              </div>
              <h4 class="mt-4 text-2xl font-bold text-slate-900">{{ solution.recommendation }}</h4>
              <p class="mt-3 text-sm leading-7 text-slate-600">{{ solution.summary }}</p>
            </div>
            <div class="rounded-2xl bg-white px-4 py-3 text-sm leading-7 text-slate-500 ring-1 ring-slate-200 md:max-w-xs">
              现在效果图会优先按代码里的父子层级来画，避免“块数对了但结构不对”的情况。
            </div>
          </div>
        </div>

        <div class="space-y-6 p-6 md:p-8">
          <section class="rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">效果展示区</p>
                <h5 class="mt-2 text-xl font-bold text-slate-800">用父容器 + 子元素关系理解布局</h5>
              </div>
              <span class="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                {{ solution.demoPanels.length > 1 ? '多断点示意' : '结构示意' }}
              </span>
            </div>

            <div class="mt-5" :class="demoPanelGridClass(solution.demoPanels)">
              <article
                v-for="demoPanel in solution.demoPanels"
                :key="`${solution.id}-${demoPanel.label}`"
                class="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div class="flex items-center justify-between gap-2">
                  <span class="text-sm font-semibold text-slate-700">{{ demoPanel.label }}</span>
                  <span class="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">parent / child</span>
                </div>

                <div class="mt-4">
                  <template v-if="isParentShellDemo(demoPanel.demo)">
                    <div class="rounded-[1.25rem] border border-slate-200 bg-white p-3 shadow-sm">
                      <div class="flex items-center justify-between gap-2">
                        <span class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Parent</span>
                        <span class="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">外层容器</span>
                      </div>
                      <div class="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 md:p-4">
                        <div class="space-y-3">
                          <div
                            v-for="(row, rowIndex) in getInnerRows(demoPanel.demo)"
                            :key="`${solution.id}-${demoPanel.label}-row-${rowIndex}`"
                            class="grid gap-3"
                            :style="{ gridTemplateColumns: `repeat(${demoPanel.demo.columns}, minmax(0, 1fr))` }"
                          >
                            <div
                              v-for="(block, blockIndex) in row"
                              :key="`${solution.id}-${demoPanel.label}-cell-${rowIndex}-${blockIndex}`"
                              class="flex items-center justify-center rounded-2xl border px-2 text-center text-[11px] font-semibold leading-tight break-words shadow-sm md:text-xs"
                              :class="[toneClass(block.tone), heightClass(block.height)]"
                              :style="demoCellStyle(block)"
                            >
                              {{ getSolutionDemoLabel(props.layout.id, solution.id, block.label) }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>

                  <template v-else>
                    <div class="rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 p-3 md:p-4">
                      <div class="space-y-3">
                        <div
                          v-for="(row, rowIndex) in demoPanel.demo.rows"
                          :key="`${solution.id}-${demoPanel.label}-row-${rowIndex}`"
                          class="grid gap-3"
                          :style="{ gridTemplateColumns: `repeat(${demoPanel.demo.columns}, minmax(0, 1fr))` }"
                        >
                          <div
                            v-for="(block, blockIndex) in row"
                            :key="`${solution.id}-${demoPanel.label}-cell-${rowIndex}-${blockIndex}`"
                            class="flex items-center justify-center rounded-2xl border px-2 text-center text-[11px] font-semibold leading-tight break-words shadow-sm md:text-xs"
                            :class="[toneClass(block.tone), heightClass(block.height)]"
                            :style="demoCellStyle(block)"
                          >
                            {{ getSolutionDemoLabel(props.layout.id, solution.id, block.label) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </article>
            </div>
          </section>

          <section class="grid gap-4 lg:grid-cols-2">
            <article class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div class="border-b border-slate-200 bg-slate-50 px-5 py-4">
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">HTML</p>
                <h5 class="mt-2 text-lg font-bold text-slate-800">{{ codePanelTitle(solution, 'html') }}</h5>
              </div>
              <div class="overflow-x-auto bg-[#020617] px-4 py-5 text-slate-100">
                <div class="min-w-[30rem] font-mono text-xs leading-7 md:text-sm">
                  <div
                    v-for="(line, index) in getCodeLines(solution.htmlCode)"
                    :key="`${solution.id}-html-${index}`"
                    class="grid grid-cols-[40px_1fr] gap-4 border-b border-slate-800 px-2 py-1.5 last:border-b-0"
                  >
                    <span class="select-none text-right text-slate-500">{{ index + 1 }}</span>
                    <span class="block whitespace-pre" v-html="highlightLine(line, 'html')" />
                  </div>
                </div>
              </div>
            </article>

            <article class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div class="border-b border-slate-200 bg-slate-50 px-5 py-4">
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">CSS</p>
                <h5 class="mt-2 text-lg font-bold text-slate-800">{{ codePanelTitle(solution, 'css') }}</h5>
                <p class="mt-2 text-sm leading-6 text-slate-500">关键属性、对应的值，以及为什么这样写，都已经写进注释。</p>
              </div>
              <div class="overflow-x-auto bg-[#020617] px-4 py-5 text-slate-100">
                <div class="min-w-[30rem] font-mono text-xs leading-7 md:text-sm">
                  <div
                    v-for="(line, index) in getCodeLines(solution.cssCode)"
                    :key="`${solution.id}-css-${index}`"
                    class="grid grid-cols-[40px_1fr] gap-4 border-b border-slate-800 px-2 py-1.5 last:border-b-0"
                  >
                    <span class="select-none text-right text-slate-500">{{ index + 1 }}</span>
                    <span class="block whitespace-pre" v-html="highlightLine(line, 'css')" />
                  </div>
                </div>
              </div>
            </article>
          </section>
        </div>
      </article>
    </section>
  </section>
</template>


