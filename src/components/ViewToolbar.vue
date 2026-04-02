<script setup lang="ts">
import type { QuestionCategory, QuestionViewMode } from '../types/question';

defineProps<{
  viewMode: QuestionViewMode;
  activeCategory?: QuestionCategory;
  searchQuery: string;
  searchResultCount: number;
}>();

defineEmits<{
  (event: 'update:searchQuery', value: string): void;
  (event: 'switch-view', mode: QuestionViewMode): void;
  (event: 'refresh-random'): void;
}>();
</script>

<template>
  <div class="hidden"></div>
</template>
