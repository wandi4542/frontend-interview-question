<script setup lang="ts">
import type { TopTab } from '../types/question';

const props = defineProps<{
  activeTab: TopTab;
}>();

const emit = defineEmits<{
  (event: 'switch-tab', tab: TopTab): void;
}>();

const tabs: Array<{ label: string; value: TopTab }> = [
  { label: '题目', value: 'questions' },
  { label: '场景', value: 'scenarios' },
  { label: '布局', value: 'layouts' },
  { label: '我的', value: 'profile' },
];
</script>

<template>
  <div class="fixed inset-x-0 top-16 z-20 border-b border-slate-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur md:hidden">
    <div class="scrollbar-hide flex gap-2 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        type="button"
        class="shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200"
        :class="props.activeTab === tab.value
          ? 'bg-emerald-500 text-white shadow'
          : 'bg-slate-100 text-slate-600'"
        @click="emit('switch-tab', tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>
