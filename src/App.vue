<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import LayoutLibraryPage from './components/LayoutLibraryPage.vue';
import MobileHeader from './components/MobileHeader.vue';
import ProfileDashboard from './components/ProfileDashboard.vue';
import QuestionList from './components/QuestionList.vue';
import ScenarioDetailPage from './components/ScenarioDetailPage.vue';
import ScenarioPage from './components/ScenarioPage.vue';
import SidebarNav from './components/SidebarNav.vue';
import ViewToolbar from './components/ViewToolbar.vue';
import { useQuestionBank } from './composables/useQuestionBank';
import { scenarioTopics } from './data/scenario-topics';
import type { TopTab } from './types/question';

const {
  categories,
  viewMode,
  activeCategoryId,
  activeCategory,
  searchQuery,
  searchResults,
  randomQuestions,
  expandedQuestionIds,
  currentQuestions,
  setCategory,
  setViewMode,
  getQuestionsByQuery,
  toggleQuestion,
  refreshRandomQuestions,
} = useQuestionBank();

// 顶部一级导航控制整页切换，但不打断题库内部状态。
const activeTopTab = ref<TopTab>('questions');
const activeScenarioId = ref<string | null>(null);
const scenarioExpandedQuestionIds = ref<string[]>([]);

// 控制右下角返回顶部按钮的显示时机。
const showBackToTop = ref(false);

const isQuestionsTab = computed(() => activeTopTab.value === 'questions');
const activeScenario = computed(() => scenarioTopics.find((item) => item.id === activeScenarioId.value) ?? null);
const isScenarioDetailView = computed(() => activeTopTab.value === 'scenarios' && Boolean(activeScenario.value));
const scenarioQuestions = computed(() => (
  activeScenario.value ? getQuestionsByQuery(activeScenario.value.query) : []
));

const pageTitle = computed(() => {
  if (isScenarioDetailView.value && activeScenario.value) {
    return `${activeScenario.value.title} · 场景详情`;
  }

  if (activeTopTab.value === 'scenarios') {
    return '面试场景专题';
  }

  if (activeTopTab.value === 'layouts') {
    return '前端布局方法库';
  }

  if (activeTopTab.value === 'profile') {
    return '我的学习面板';
  }

  if (viewMode.value === 'search') {
    return '全局搜索结果';
  }

  if (viewMode.value === 'random') {
    return '随机测试（10题）';
  }

  return activeCategory.value.name;
});

const pageDescription = computed(() => {
  if (isScenarioDetailView.value && activeScenario.value) {
    return `${activeScenario.value.detailSummary} 先看回答结构，再补充阅读关联题目会更顺。`;
  }

  if (activeTopTab.value === 'scenarios') {
    return '把登录权限、性能优化、工程化等高频问题，整理成更像真实项目复盘的表达路径。';
  }

  if (activeTopTab.value === 'layouts') {
    return '从 Flex、Grid 到响应式适配，把常见布局方法拆成可复用的选型卡片。';
  }

  if (activeTopTab.value === 'profile') {
    return '用一个轻量的个人学习面板，把最近学习、目标推进和建议复习清单收拢起来。';
  }

  if (viewMode.value === 'search') {
    return searchQuery.value.trim()
      ? `正在搜索“${searchQuery.value.trim()}”，共找到 ${searchResults.value.length} 道相关题目。`
      : '请在右上角的搜索框中输入关键词，结果将实时显示在这里。';
  }

  if (viewMode.value === 'random') {
    return '从完整题库中随机抽取 10 道题，用来快速自测与复盘知识盲区。';
  }

  return '点击题目展开查看详细解答。回答以实际项目经验为核心，避免死记硬背。';
});

const pageTagline = computed(() => {
  if (isScenarioDetailView.value) {
    return '场景详情页';
  }

  if (activeTopTab.value === 'scenarios') {
    return '按真实场景复盘';
  }

  if (activeTopTab.value === 'layouts') {
    return '布局卡片总览';
  }

  if (activeTopTab.value === 'profile') {
    return '本地静态学习面板';
  }

  if (viewMode.value === 'random') {
    return '随机抽取模式';
  }

  return '当前题库浏览';
});

const currentListCount = computed(() => {
  if (!isQuestionsTab.value) {
    return 0;
  }

  if (viewMode.value === 'search') {
    return searchResults.value.length;
  }

  if (viewMode.value === 'random') {
    return randomQuestions.value.length;
  }

  return activeCategory.value.questions.length;
});

const contentPaddingClass = computed(() => (
  isQuestionsTab.value ? 'pt-32 md:pt-16' : 'pt-32 md:pt-16'
));

const mainOffsetClass = computed(() => (
  isQuestionsTab.value ? 'md:ml-64' : ''
));

const contentWidthClass = computed(() => (
  isQuestionsTab.value ? 'max-w-4xl' : 'max-w-6xl'
));

const headingAccentClass = computed(() => {
  if (isScenarioDetailView.value) {
    return 'border-emerald-500';
  }

  if (!isQuestionsTab.value) {
    return 'border-emerald-500';
  }

  if (viewMode.value === 'search') {
    return 'border-indigo-500';
  }

  if (viewMode.value === 'random') {
    return 'border-orange-500';
  }

  return 'border-emerald-500';
});

function setScenarioExpandedToFirst(query: string) {
  const [firstQuestion] = getQuestionsByQuery(query);
  scenarioExpandedQuestionIds.value = firstQuestion ? [firstQuestion.id] : [];
}

function handleTopTabSwitch(tab: TopTab) {
  activeTopTab.value = tab;

  if (tab !== 'scenarios') {
    activeScenarioId.value = null;
    scenarioExpandedQuestionIds.value = [];
  }
}

function handleScenarioDetailOpen(scenarioId: string) {
  const scenario = scenarioTopics.find((item) => item.id === scenarioId);

  activeTopTab.value = 'scenarios';
  activeScenarioId.value = scenarioId;
  scenarioExpandedQuestionIds.value = [];

  if (scenario) {
    setScenarioExpandedToFirst(scenario.query);
  }

  scrollToTop();
}

function handleScenarioBack() {
  activeScenarioId.value = null;
  scenarioExpandedQuestionIds.value = [];
  scrollToTop();
}

function handleScenarioQuestionToggle(questionId: string) {
  const isOpen = scenarioExpandedQuestionIds.value.includes(questionId);

  if (isOpen) {
    scenarioExpandedQuestionIds.value = scenarioExpandedQuestionIds.value.filter((id) => id !== questionId);
    return;
  }

  scenarioExpandedQuestionIds.value = [...scenarioExpandedQuestionIds.value, questionId];
}

function handleCategorySelect(categoryId: string) {
  setCategory(categoryId);
}

// 输入框聚焦时自动切到搜索视图，避免用户手动切换。
function handleSearchFocus() {
  if (viewMode.value !== 'search') {
    setViewMode('search');
  }
}

function handleSearchInput(event: Event) {
  const target = event.target as HTMLInputElement;

  if (viewMode.value !== 'search') {
    setViewMode('search');
  }

  searchQuery.value = target.value;
}

// 点击随机抽题按钮时切换视图，具体抽题逻辑由 composable 统一处理。
function handleRandomClick() {
  setViewMode('random');
}

// 监听页面滚动距离，超过阈值后显示返回顶部按钮。
function handleScroll() {
  showBackToTop.value = window.scrollY > 300;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 页面挂载时注册滚动监听，卸载时及时清理，避免内存泄漏。
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <header class="fixed inset-x-0 top-0 z-30 h-16 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div class="mx-auto flex h-full items-center justify-between gap-4 px-4 md:grid md:grid-cols-[minmax(180px,1fr)_auto_minmax(220px,1fr)] md:px-6 lg:grid-cols-[minmax(220px,1fr)_auto_minmax(280px,1fr)]">
        <div class="min-w-0">
          <h1 class="truncate text-xl font-bold text-emerald-600 md:text-2xl">Vue 面试题库</h1>
          <p class="mt-1 hidden items-center gap-1 text-sm text-slate-500 xl:flex">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3m-4 0h16M5 7v13a2 2 0 002 2h10a2 2 0 002-2V7" />
            </svg>
            一年经验精简版
          </p>
        </div>

        <div class="hidden justify-center md:flex">
          <ViewToolbar :active-tab="activeTopTab" :in-header="true" @switch-tab="handleTopTabSwitch" />
        </div>

        <div v-if="isQuestionsTab" class="flex items-center justify-end gap-2 md:min-w-0 md:gap-3">
          <div class="group relative">
            <input
              :value="searchQuery"
              type="text"
              placeholder="搜索题目或答案..."
              class="w-36 rounded-full border border-transparent bg-slate-100 py-2 pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:w-48 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 md:w-44 md:max-w-full md:focus:w-52 lg:w-56 lg:focus:w-72 xl:w-60 xl:focus:w-80"
              @focus="handleSearchFocus"
              @input="handleSearchInput"
            />
            <svg class="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <button
            type="button"
            class="inline-flex items-center rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200 md:shrink-0 md:px-3 lg:px-4"
            :class="viewMode === 'random' ? 'bg-orange-500 text-white shadow' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'"
            @click="handleRandomClick"
          >
            <svg class="h-5 w-5 md:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span class="hidden lg:inline">随机抽题</span>
          </button>
        </div>

        <div v-else class="flex items-center gap-3">
          <div class="hidden rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-600 md:inline-flex">
            学习空间
          </div>
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
            我
          </div>
        </div>
      </div>
    </header>

    <MobileHeader :active-tab="activeTopTab" @switch-tab="handleTopTabSwitch" />

    <div class="flex min-h-screen flex-col md:flex-row" :class="contentPaddingClass">
      <nav
        v-if="isQuestionsTab"
        class="scrollbar-hide w-full overflow-x-auto whitespace-nowrap border-b border-slate-100 bg-white px-2 py-2 shadow-sm md:hidden"
      >
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="mx-1 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200"
          :class="viewMode === 'category' && activeCategoryId === category.id ? 'bg-emerald-500 text-white shadow' : 'bg-slate-100 text-slate-600'"
          @click="handleCategorySelect(category.id)"
        >
          {{ category.name }}
        </button>
      </nav>

      <SidebarNav
        v-if="isQuestionsTab"
        :categories="categories"
        :active-category-id="activeCategoryId"
        :view-mode="viewMode"
        @select-category="handleCategorySelect"
      />

      <main class="flex-1 p-4 transition-all duration-300 md:p-8" :class="mainOffsetClass">
        <div class="mx-auto" :class="contentWidthClass">
          <section class="mb-8 lg:pt-2">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div class="mb-4 hidden lg:block"></div>
                <h2 class="border-l-4 pl-4 text-2xl font-extrabold text-slate-800 md:text-3xl" :class="headingAccentClass">
                  {{ pageTitle }}
                </h2>
                <p class="mt-2 pl-4 text-sm text-slate-500 md:text-base">
                  {{ pageDescription }}
                </p>
              </div>

              <button
                v-if="isQuestionsTab && viewMode === 'random'"
                type="button"
                class="inline-flex items-center justify-center rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-orange-600"
                @click="refreshRandomQuestions"
              >
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                重新抽取
              </button>

              <div
                v-else-if="!isQuestionsTab"
                class="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow-sm ring-1 ring-slate-200"
              >
                {{ pageTagline }}
              </div>
            </div>
          </section>

          <QuestionList
            v-if="isQuestionsTab"
            :questions="currentQuestions"
            :expanded-question-ids="expandedQuestionIds"
            :view-mode="viewMode"
            :has-search-query="Boolean(searchQuery.trim())"
            @toggle-question="toggleQuestion"
          />

          <ScenarioDetailPage
            v-else-if="isScenarioDetailView && activeScenario"
            :scenario="activeScenario"
            :questions="scenarioQuestions"
            :expanded-question-ids="scenarioExpandedQuestionIds"
            @back="handleScenarioBack"
            @toggle-question="handleScenarioQuestionToggle"
          />
          <ScenarioPage v-else-if="activeTopTab === 'scenarios'" @open-detail="handleScenarioDetailOpen" />
          <LayoutLibraryPage v-else-if="activeTopTab === 'layouts'" />
          <ProfileDashboard v-else />

          <div v-if="isQuestionsTab && currentListCount > 3" class="mt-8 border-t border-slate-100 pb-8 pt-6 text-center">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium shadow-sm transition-colors"
              :class="viewMode === 'search' ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : viewMode === 'random' ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'"
              @click="scrollToTop"
            >
              <svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              返回顶部
            </button>
          </div>
        </div>
      </main>
    </div>

    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-300"
      leave-to-class="opacity-0"
    >
      <button
        v-if="showBackToTop"
        type="button"
        class="fixed bottom-6 right-6 z-50 rounded-full bg-emerald-500 p-3 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-600 hover:shadow-xl md:bottom-10 md:right-10"
        title="返回顶部"
        @click="scrollToTop"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </Transition>
  </div>
</template>



