<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import LayoutDetailPage from './LayoutDetailPage.vue';
import { layoutFilters, layoutTopics, strategyRows, type LayoutDemo, type LayoutDemoCell, type LayoutFilter, type LayoutTopic } from '../data/layout-library';

const activeFilter = ref<LayoutFilter>('全部');
const activeLayoutId = ref<string | null>(null);

const filteredTopics = computed(() => {
  if (activeFilter.value === '全部') {
    return layoutTopics;
  }

  return layoutTopics.filter((topic) => topic.filters.includes(activeFilter.value));
});

const selectedLayout = computed<LayoutTopic | null>(() => (
  activeLayoutId.value
    ? layoutTopics.find((topic) => topic.id === activeLayoutId.value) ?? null
    : null
));

watch(activeFilter, () => {
  if (!selectedLayout.value) {
    return;
  }

  if (!filteredTopics.value.some((topic) => topic.id === selectedLayout.value?.id)) {
    activeLayoutId.value = null;
  }
});

function toggleFilter(filter: LayoutFilter) {
  activeFilter.value = activeFilter.value === filter ? '全部' : filter;
}

function openLayoutDetail(layoutId: string) {
  activeLayoutId.value = layoutId;
}

function closeLayoutDetail() {
  activeLayoutId.value = null;
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
      return 'h-10';
    case 'lg':
      return 'h-20';
    default:
      return 'h-14';
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

function getTopicDemoLabel(topicId: string, label: string) {
  if (label === 'P') {
    return 'parent';
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
      return ({ '1': 'hero', '2': 'content', '3': 'footer' }[label] ?? label);
    default:
      return label;
  }
}

function solutionTypeLabel(type: LayoutTopic['solutions'][number]['type']) {
  switch (type) {
    case 'flex':
      return 'Flex';
    case 'grid':
      return 'Grid';
    default:
      return '经典';
  }
}

function solutionTypeClass(type: LayoutTopic['solutions'][number]['type']) {
  switch (type) {
    case 'flex':
      return 'bg-emerald-50 text-emerald-600';
    case 'grid':
      return 'bg-sky-50 text-sky-600';
    default:
      return 'bg-amber-50 text-amber-700';
  }
}
</script>

<template>
  <div class="space-y-8">
    <LayoutDetailPage
      v-if="selectedLayout"
      :layout="selectedLayout"
      :active-filter-label="activeFilter"
      @back="closeLayoutDetail"
    />

    <template v-else>
      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">布局方法库</p>
            <h3 class="mt-3 text-2xl font-bold text-slate-800">把文章方案重构成可对比、可讲解的布局题库</h3>
            <p class="mt-3 text-sm leading-7 text-slate-500">
              每张卡片代表一个布局主题；进入详情后，你会看到这个主题下真实可用的经典、Flex、Grid 等方案对比。
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="filter in layoutFilters"
              :key="filter"
              type="button"
              class="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200"
              :class="activeFilter === filter
                ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:text-slate-700'"
              @click="toggleFilter(filter)"
            >
              {{ filter }}
            </button>
          </div>
        </div>
      </section>

      <section class="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="topic in filteredTopics"
          :key="topic.id"
          class="cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
          @click="openLayoutDetail(topic.id)"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">布局主题</p>
              <h3 class="mt-3 text-xl font-bold text-slate-800">{{ topic.title }}</h3>
            </div>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {{ topic.solutions.length }} 种方案
            </span>
          </div>

          <div class="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <template v-if="isParentShellDemo(topic.cardPreview)">
              <div class="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Parent</span>
                  <span class="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">包裹结构</span>
                </div>
                <div class="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-2.5">
                  <div class="space-y-2">
                    <div
                      v-for="(row, rowIndex) in getInnerRows(topic.cardPreview)"
                      :key="`${topic.id}-preview-${rowIndex}`"
                      class="grid gap-2"
                      :style="{ gridTemplateColumns: `repeat(${topic.cardPreview.columns}, minmax(0, 1fr))` }"
                    >
                      <div
                        v-for="(block, blockIndex) in row"
                        :key="`${topic.id}-preview-cell-${rowIndex}-${blockIndex}`"
                        class="flex items-center justify-center rounded-xl border px-2 text-center text-[11px] font-semibold leading-tight break-words"
                        :class="[toneClass(block.tone), heightClass(block.height)]"
                        :style="demoCellStyle(block)"
                      >
                        {{ getTopicDemoLabel(topic.id, block.label) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="space-y-2">
                <div
                  v-for="(row, rowIndex) in topic.cardPreview.rows"
                  :key="`${topic.id}-preview-${rowIndex}`"
                  class="grid gap-2"
                  :style="{ gridTemplateColumns: `repeat(${topic.cardPreview.columns}, minmax(0, 1fr))` }"
                >
                  <div
                    v-for="(block, blockIndex) in row"
                    :key="`${topic.id}-preview-cell-${rowIndex}-${blockIndex}`"
                    class="flex items-center justify-center rounded-xl border px-2 text-center text-[11px] font-semibold leading-tight break-words"
                    :class="[toneClass(block.tone), heightClass(block.height)]"
                    :style="demoCellStyle(block)"
                  >
                    {{ getTopicDemoLabel(topic.id, block.label) }}
                  </div>
                </div>
              </div>
            </template>
          </div>

          <p class="mt-5 text-sm leading-7 text-slate-600">{{ topic.summary }}</p>

          <div class="mt-5 space-y-3 text-sm text-slate-500">
            <p><span class="font-semibold text-slate-700">适用场景：</span>{{ topic.scene }}</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="solution in topic.solutions"
                :key="solution.id"
                class="rounded-full px-3 py-1 text-xs font-semibold"
                :class="solutionTypeClass(solution.type)"
              >
                {{ solutionTypeLabel(solution.type) }}
              </span>
            </div>
          </div>
        </article>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">布局选择建议</p>
        <h3 class="mt-3 text-2xl font-bold text-slate-800">先选方案，再写代码，表达会更稳</h3>

        <div class="mt-6 grid gap-4 lg:grid-cols-2">
          <article
            v-for="row in strategyRows"
            :key="row.label"
            class="rounded-2xl border border-slate-100 bg-slate-50 p-4"
          >
            <p class="text-sm font-semibold text-slate-800">{{ row.label }}</p>
            <p class="mt-2 text-sm leading-7 text-slate-600">{{ row.description }}</p>
          </article>
        </div>
      </section>
    </template>
  </div>
</template>
