<script setup lang="ts">
import type { QuestionCategory, QuestionViewMode } from '../types/question';

const props = defineProps<{
  categories: QuestionCategory[];
  activeCategoryId: string;
  viewMode: QuestionViewMode;
}>();

const emit = defineEmits<{
  (event: 'select-category', categoryId: string): void;
}>();
</script>

<template>
  <aside class="fixed left-0 top-0 z-10 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white shadow-[1px_0_5px_rgba(0,0,0,0.05)] md:flex">
    <div class="flex h-16 shrink-0 flex-col justify-center border-b border-slate-100 px-6">
      <h1 class="truncate text-xl font-bold text-emerald-600">Vue 面试题库</h1>
      <p class="mt-1 flex items-center gap-1 text-sm text-slate-500">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3m-4 0h16M5 7v13a2 2 0 002 2h10a2 2 0 002-2V7" />
        </svg>
        一年经验精简版
      </p>
    </div>

    <nav class="scrollbar-thin flex-1 space-y-2 overflow-y-auto p-4">
      <button
        v-for="category in props.categories"
        :key="category.id"
        type="button"
        class="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200"
        :class="props.viewMode === 'category' && props.activeCategoryId === category.id
          ? 'border-l-4 border-emerald-500 bg-emerald-50 text-emerald-700'
          : 'text-slate-600 hover:bg-slate-50'"
        @click="emit('select-category', category.id)"
      >
        <span class="truncate pr-3">{{ category.name }}</span>
        <span
          v-if="!(props.viewMode === 'category' && props.activeCategoryId === category.id)"
          class="inline-flex min-w-7 items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500"
        >
          {{ category.questions.length }}
        </span>
      </button>
    </nav>

    <div class="px-4 pb-5 text-center text-xs text-slate-400">持续学习，保持热爱</div>
  </aside>
</template>
