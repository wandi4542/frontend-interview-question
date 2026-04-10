<script setup lang="ts">
import { ref, watch } from 'vue';
import QuestionList from './QuestionList.vue';
import type { QuestionRecord, ScenarioTopic } from '../types/question';

const props = defineProps<{
  scenario: ScenarioTopic;
  questions: QuestionRecord[];
  expandedQuestionIds: string[];
}>();

const emit = defineEmits<{
  (event: 'back'): void;
  (event: 'toggle-question', questionId: string): void;
}>();

const activeDetailQuestionId = ref(props.scenario.detailQuestions[0]?.id ?? '');

watch(
  () => props.scenario.id,
  () => {
    activeDetailQuestionId.value = props.scenario.detailQuestions[0]?.id ?? '';
  },
  { immediate: true },
);

function toggleDetailQuestion(questionId: string) {
  activeDetailQuestionId.value = activeDetailQuestionId.value === questionId ? '' : questionId;
}

function isDetailQuestionOpen(questionId: string) {
  return activeDetailQuestionId.value === questionId;
}
</script>

<template>
  <div class="space-y-8">
    <section class="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/70 p-6 shadow-sm md:p-8">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div class="max-w-3xl">
          <button
            type="button"
            class="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
            @click="emit('back')"
          >
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回场景列表
          </button>

          <div class="mt-5 flex flex-wrap items-center gap-3">
            <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="props.scenario.badgeClass">
              {{ props.scenario.badge }}
            </span>
            <span class="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm ring-1 ring-slate-200">
              面试场景：{{ props.scenario.title }}
            </span>
          </div>

          <h3 class="mt-5 text-3xl font-bold text-slate-900 md:text-4xl">{{ props.scenario.detailTitle }}</h3>
          <p class="mt-4 text-base leading-8 text-slate-600">{{ props.scenario.detailSummary }}</p>
        </div>

        <div class="lg:w-72">
          <div class="rounded-2xl bg-white p-5 text-sm leading-7 text-slate-500 shadow-sm ring-1 ring-slate-200">
            这里展示的是这个场景下更适合怎么答、怎么组织表达，你可以直接把下面的标准答题当作面试口述模板来用。
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm md:p-8">
      <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">面试回答参考</p>
          <h4 class="mt-3 text-2xl font-bold text-slate-800">如果面试官问“{{ props.scenario.title }}怎么做”，可以这样回答</h4>
        </div>
        <div class="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-600">
          建议按“背景、处理、结果”展开
        </div>
      </div>

      <div class="mt-6 space-y-4">
        <article
          v-for="(item, index) in props.scenario.answerStructure"
          :key="item"
          class="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5"
        >
          <p class="text-sm font-semibold text-emerald-600">回答第 {{ index + 1 }} 段</p>
          <p class="mt-3 text-sm leading-8 text-slate-700">{{ item }}</p>
        </article>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">高频场景题</p>
          <h4 class="mt-3 text-2xl font-bold text-slate-800">这个场景下，面试官通常会这样问</h4>
          <p class="mt-2 text-sm text-slate-500">每道题都提供标准答题和回答思路，方便你直接练口述。</p>
        </div>
        <div class="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500">
          共 {{ props.scenario.detailQuestions.length }} 题
        </div>
      </div>

      <div class="mt-6 space-y-4">
        <article
          v-for="item in props.scenario.detailQuestions"
          :key="item.id"
          class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 transition-shadow hover:shadow-sm"
        >
          <button
            type="button"
            class="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
            @click="toggleDetailQuestion(item.id)"
          >
            <div class="flex-1">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">场景问题</p>
              <h5 class="mt-2 text-base font-semibold leading-7 text-slate-800 md:text-lg">{{ item.question }}</h5>
            </div>
            <svg
              class="mt-1 h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300"
              :class="isDetailQuestionOpen(item.id) ? 'rotate-180 text-emerald-500' : ''"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div v-if="isDetailQuestionOpen(item.id)" class="border-t border-slate-200 bg-white px-5 py-5">
            <div class="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <section class="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">标准答题</p>
                <div class="mt-4 space-y-3 text-sm leading-8 text-slate-700">
                  <p v-for="answer in item.standardAnswer" :key="answer">{{ answer }}</p>
                </div>
              </section>

              <section class="rounded-2xl border border-sky-100 bg-sky-50/60 p-5">
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">回答思路</p>
                <ul class="mt-4 space-y-3 text-sm leading-8 text-slate-700">
                  <li v-for="thinking in item.answerThinking" :key="thinking" class="flex gap-3">
                    <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                    <span>{{ thinking }}</span>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">回答重点</p>
        <h4 class="mt-3 text-2xl font-bold text-slate-800">这类问题，建议按这几个层次展开</h4>

        <div class="mt-6 space-y-4">
          <div
            v-for="(point, index) in props.scenario.keyPoints"
            :key="point"
            class="flex gap-4 rounded-2xl bg-slate-50 p-4"
          >
            <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-emerald-600 shadow-sm">
              {{ index + 1 }}
            </span>
            <p class="text-sm leading-7 text-slate-600">{{ point }}</p>
          </div>
        </div>
      </article>

      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">快速提示</p>
        <h4 class="mt-3 text-2xl font-bold text-slate-800">容易被追问的点</h4>

        <div class="mt-6 flex flex-wrap gap-2">
          <span
            v-for="tag in props.scenario.tags"
            :key="tag"
            class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500"
          >
            {{ tag }}
          </span>
        </div>

        <div class="mt-6 rounded-2xl bg-emerald-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">一句话重点</p>
          <p class="mt-3 text-sm leading-7 text-emerald-700">{{ props.scenario.focus }}</p>
        </div>

        <div class="mt-6 rounded-2xl bg-rose-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">避坑提醒</p>
          <ul class="mt-3 space-y-3 text-sm leading-7 text-rose-700">
            <li v-for="pitfall in props.scenario.pitfalls" :key="pitfall">{{ pitfall }}</li>
          </ul>
        </div>
      </article>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">补充题目</p>
          <h4 class="mt-3 text-2xl font-bold text-slate-800">如果你想继续延伸，这些题目可以一起复习</h4>
          <p class="mt-2 text-sm text-slate-500">这里只做补充阅读，不会影响上面的场景标准答题。</p>
        </div>
        <div class="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500">
          共 {{ props.questions.length }} 题
        </div>
      </div>

      <div class="mt-6">
        <QuestionList
          v-if="props.questions.length > 0"
          :questions="props.questions"
          :expanded-question-ids="props.expandedQuestionIds"
          view-mode="category"
          :has-search-query="false"
          :show-category-badge="true"
          @toggle-question="emit('toggle-question', $event)"
        />

        <div
          v-else
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm leading-7 text-slate-500"
        >
          当前题库里还没有和这个场景匹配的补充题目，可以先把上面的高频场景题和标准答题练熟。
        </div>
      </div>
    </section>
  </div>
</template>
