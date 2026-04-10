<script setup lang="ts">
import { ref } from 'vue';
import { followUpQuestions, scenarioClassicQuestions, scenarioStats, scenarioTopics } from '../data/scenario-topics';

const emit = defineEmits<{
  (event: 'open-detail', scenarioId: string): void;
}>();

const classicSourceUrl = 'https://adjfks.github.io/daydayup-website/Interview/%E5%9C%BA%E6%99%AF%E9%A2%98.html';
const activeClassicQuestionId = ref(scenarioClassicQuestions[0]?.id ?? '');

function handleOpenDetail(scenarioId: string) {
  emit('open-detail', scenarioId);
}

function toggleClassicQuestion(questionId: string) {
  activeClassicQuestionId.value = activeClassicQuestionId.value === questionId ? '' : questionId;
}

function isClassicQuestionOpen(questionId: string) {
  return activeClassicQuestionId.value === questionId;
}
</script>

<template>
  <div class="space-y-8">
    <section class="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-700 shadow-sm">
      点击任一专题卡片或“查看重点”后，会进入对应的场景详情页；场景页下方也补充了 9 道经典场景题和答案，方便你直接横向刷题。
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      <article
        v-for="stat in scenarioStats"
        :key="stat.label"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <p class="text-sm text-slate-500">{{ stat.label }}</p>
        <p class="mt-3 text-3xl font-bold text-slate-800">{{ stat.value }}</p>
        <p class="mt-2 text-sm text-slate-400">{{ stat.hint }}</p>
      </article>
    </section>

    <section class="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="card in scenarioTopics"
        :key="card.id"
        class="flex h-full cursor-pointer flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
        @click="handleOpenDetail(card.id)"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">面试专题</p>
            <h3 class="mt-3 text-xl font-bold text-slate-800">{{ card.title }}</h3>
          </div>
          <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="card.badgeClass">
            {{ card.badge }}
          </span>
        </div>

        <p class="mt-4 text-sm leading-7 text-slate-600">{{ card.description }}</p>

        <div class="mt-5 flex flex-wrap gap-2">
          <span
            v-for="tag in card.tags"
            :key="tag"
            class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500"
          >
            {{ tag }}
          </span>
        </div>

        <div class="mt-5 rounded-2xl bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">回答重点</p>
          <p class="mt-3 text-sm leading-7 text-slate-600">{{ card.focus }}</p>
        </div>

        <button
          type="button"
          class="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-100"
          @click.stop="handleOpenDetail(card.id)"
        >
          查看重点
        </button>
      </article>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">补充场景题</p>
          <h3 class="mt-3 text-2xl font-bold text-slate-800">把经典前端场景题和参考答案直接放进场景页</h3>
          <p class="mt-2 text-sm leading-7 text-slate-500">
            这部分根据你提供的资料整理成了更适合当前项目阅读的版本，方便直接展开看答案。
          </p>
        </div>
        <a
          :href="classicSourceUrl"
          target="_blank"
          rel="noreferrer"
          class="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
        >
          查看原始资料
        </a>
      </div>

      <div class="mt-6 space-y-4">
        <article
          v-for="item in scenarioClassicQuestions"
          :key="item.id"
          class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 transition-shadow hover:shadow-sm"
        >
          <button
            type="button"
            class="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
            @click="toggleClassicQuestion(item.id)"
          >
            <div class="flex-1">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">经典场景题</p>
              <h4 class="mt-2 text-base font-semibold leading-7 text-slate-800 md:text-lg">{{ item.question }}</h4>
            </div>
            <svg
              class="mt-1 h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300"
              :class="isClassicQuestionOpen(item.id) ? 'rotate-180 text-emerald-500' : ''"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div v-if="isClassicQuestionOpen(item.id)" class="border-t border-slate-200 bg-white px-5 py-5">
            <section class="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">参考答案</p>
              <ul class="mt-4 space-y-3 text-sm leading-8 text-slate-700">
                <li v-for="answer in item.answerPoints" :key="answer" class="flex gap-3">
                  <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  <span>{{ answer }}</span>
                </li>
              </ul>
            </section>
          </div>
        </article>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">高频追问</p>
          <h3 class="mt-3 text-2xl font-bold text-slate-800">面试官常顺着这些问题继续追</h3>
        </div>
        <p class="text-sm text-slate-500">把回答拆成“背景、方案、结果”三段，表达会更稳。</p>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <article
          v-for="(question, index) in followUpQuestions"
          :key="question"
          class="rounded-2xl border border-slate-100 bg-slate-50 p-4"
        >
          <div class="flex items-start gap-4">
            <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-emerald-600 shadow-sm">
              {{ index + 1 }}
            </span>
            <p class="text-sm leading-7 text-slate-600">{{ question }}</p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
