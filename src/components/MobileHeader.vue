<script setup lang="ts">
import type { QuestionCategory, QuestionViewMode } from '../types/question';

defineProps<{
  categories: QuestionCategory[];
  activeCategoryId: string;
  viewMode: QuestionViewMode;
  showDrawer: boolean;
}>();

defineEmits<{
  (event: 'update:showDrawer', value: boolean): void;
  (event: 'select-category', categoryId: string): void;
  (event: 'switch-view', mode: QuestionViewMode): void;
}>();
</script>

<template>
  <div class="hidden"></div>
</template>
