<script setup lang="ts">
import type { TopTab } from '../types/question';

const props = withDefaults(defineProps<{
  activeTab: TopTab;
  inHeader?: boolean;
}>(), {
  inHeader: false,
});

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
  <div class="hidden md:block">
    <div class="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        type="button"
        class="rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200"
        :class="props.activeTab === tab.value
          ? 'bg-emerald-500 text-white shadow-sm'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'"
        @click="emit('switch-tab', tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>
