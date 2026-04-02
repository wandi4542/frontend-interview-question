<script setup lang="ts">
import { computed } from 'vue';
import type { QuestionRecord, QuestionViewMode } from '../types/question';

const props = defineProps<{
  questions: QuestionRecord[];
  expandedQuestionIds: string[];
  viewMode: QuestionViewMode;
  hasSearchQuery: boolean;
}>();

const emit = defineEmits<{
  (event: 'toggle-question', questionId: string): void;
}>();

// 空列表提示根据当前模式动态变化，给用户明确下一步操作。
const emptyDescription = computed(() => {
  if (props.viewMode === 'search' && props.hasSearchQuery) {
    return '没有找到相关题目，换个关键词试试。';
  }

  if (props.viewMode === 'search') {
    return '请在右上角的搜索框中输入关键词。';
  }

  return '当前没有可展示的题目。';
});

// 不同视图模式使用统一的主题色映射，减少模板里的条件分支。
const accentClasses = computed(() => {
  if (props.viewMode === 'search') {
    return {
      q: 'text-indigo-500',
      a: 'text-indigo-500',
      badge: 'bg-indigo-50 text-indigo-600',
      icon: 'text-indigo-500',
    };
  }

  if (props.viewMode === 'random') {
    return {
      q: 'text-orange-500',
      a: 'text-orange-500',
      badge: 'bg-orange-50 text-orange-600',
      icon: 'text-orange-500',
    };
  }

  return {
    q: 'text-emerald-500',
    a: 'text-emerald-500',
    badge: 'bg-emerald-50 text-emerald-600',
    icon: 'text-emerald-500',
  };
});

// 判断某道题是否处于展开状态。
function isExpanded(questionId: string) {
  return props.expandedQuestionIds.includes(questionId);
}
</script>

<template>
  <div v-if="questions.length === 0" class="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center text-sm text-slate-400 shadow-sm">
    {{ emptyDescription }}
  </div>

  <div v-else class="space-y-4">
    <article
      v-for="question in questions"
      :key="question.id"
      class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <button
        type="button"
        class="flex w-full items-start justify-between gap-4 px-6 py-4 text-left focus:outline-none"
        @click="emit('toggle-question', question.id)"
      >
        <div class="min-w-0 flex-1 pr-4">
          <span
            v-if="viewMode !== 'category'"
            class="mb-2 inline-flex rounded-md px-2 py-1 text-xs"
            :class="accentClasses.badge"
          >
            {{ question.categoryName }}
          </span>

          <div class="flex items-start gap-2 md:gap-3">
            <span class="text-xl font-semibold" :class="accentClasses.q">Q:</span>
            <h3 class="pt-0.5 text-base font-semibold leading-8 text-slate-800 md:text-lg">
              {{ question.question }}
            </h3>
          </div>
        </div>

        <svg
          class="mt-1 h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300"
          :class="[isExpanded(question.id) ? 'rotate-180' : '', isExpanded(question.id) ? accentClasses.icon : '']"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div class="accordion-content" :class="{ 'is-open': isExpanded(question.id) }">
        <div class="accordion-inner">
          <div class="border-t border-slate-100 px-6 pb-6 pt-4 text-sm text-slate-600 md:text-base">
            <span class="block text-xl font-semibold" :class="accentClasses.a">A:</span>
            <div class="answer-content mt-3" v-html="question.answerHtml" />
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

