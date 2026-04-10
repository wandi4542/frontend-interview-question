import { computed, ref, watch } from 'vue';
import { questionBank } from '../data/question-bank';
import type { QuestionCategory, QuestionRecord, QuestionViewMode } from '../types/question';

// Fisher-Yates 洗牌算法，保证随机题目分布更均匀。
function shuffleQuestions(questions: QuestionRecord[]) {
  const copied = [...questions];

  for (let index = copied.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copied[index], copied[randomIndex]] = [copied[randomIndex], copied[index]];
  }

  return copied;
}

// 统一题目匹配规则，保证题目页搜索和场景页推荐使用同一套结果。
function matchQuestionsByQuery(questions: QuestionRecord[], rawQuery: string) {
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    return [];
  }

  const tokens = query.split(/\s+/).filter(Boolean);

  return questions.filter((item) => {
    const haystacks = [item.question, item.answerHtml, ...(item.keywords ?? [])].map((value) => value.toLowerCase());
    return haystacks.some((value) => tokens.some((token) => value.includes(token)));
  });
}

// 题库核心状态：集中管理分类、搜索、随机抽题和展开状态。
export function useQuestionBank() {
  const categories = ref<QuestionCategory[]>(questionBank);
  const viewMode = ref<QuestionViewMode>('category');
  const activeCategoryId = ref(categories.value[0]?.id ?? '');
  const searchQuery = ref('');
  const randomQuestions = ref<QuestionRecord[]>([]);
  const expandedQuestionIds = ref<string[]>([]);

  // 扁平化所有分类，方便全局搜索和随机抽题。
  const allQuestions = computed<QuestionRecord[]>(() =>
    categories.value.flatMap((category) =>
      category.questions.map((question) => ({
        ...question,
        categoryId: category.id,
        categoryName: category.name,
      })),
    ),
  );

  const activeCategory = computed(
    () => categories.value.find((category) => category.id === activeCategoryId.value) ?? categories.value[0],
  );

  // 搜索支持空格分词，适合场景页按关键词组联动题库。
  const searchResults = computed(() => matchQuestionsByQuery(allQuestions.value, searchQuery.value));

  // 根据视图模式返回当前应展示的题目列表。
  const currentQuestions = computed<QuestionRecord[]>(() => {
    if (viewMode.value === 'search') {
      return searchResults.value;
    }

    if (viewMode.value === 'random') {
      return randomQuestions.value;
    }

    return activeCategory.value.questions.map((question) => ({
      ...question,
      categoryId: activeCategory.value.id,
      categoryName: activeCategory.value.name,
    }));
  });

  // 切换数据源后默认展开第一题，降低首屏认知成本。
  function setExpandedToFirstQuestion() {
    const [firstQuestion] = currentQuestions.value;
    expandedQuestionIds.value = firstQuestion ? [firstQuestion.id] : [];
  }

  function setCategory(categoryId: string) {
    activeCategoryId.value = categoryId;
    viewMode.value = 'category';
    setExpandedToFirstQuestion();
  }

  // 统一处理模式切换带来的联动行为。
  function setViewMode(mode: QuestionViewMode) {
    viewMode.value = mode;

    if (mode === 'search') {
      expandedQuestionIds.value = [];
      return;
    }

    if (mode === 'random') {
      refreshRandomQuestions();
      return;
    }

    setExpandedToFirstQuestion();
  }

  // 允许其他页面直接带着关键词切到题目搜索结果。
  function openSearch(query: string) {
    searchQuery.value = query;
    viewMode.value = 'search';
    expandedQuestionIds.value = [];
  }

  // 提供只读查询能力，供场景详情页就地展示关联题目。
  function getQuestionsByQuery(query: string) {
    return matchQuestionsByQuery(allQuestions.value, query);
  }

  // 支持多题展开：点开追加，点同一题再次关闭。
  function toggleQuestion(questionId: string) {
    const isOpen = expandedQuestionIds.value.includes(questionId);

    if (isOpen) {
      expandedQuestionIds.value = expandedQuestionIds.value.filter((id) => id !== questionId);
      return;
    }

    expandedQuestionIds.value = [...expandedQuestionIds.value, questionId];
  }

  // 每次随机抽取 10 道题，并默认展开第一道。
  function refreshRandomQuestions() {
    randomQuestions.value = shuffleQuestions(allQuestions.value).slice(0, 10);
    expandedQuestionIds.value = randomQuestions.value[0] ? [randomQuestions.value[0].id] : [];
  }

  // 搜索词变化时重置展开态，避免旧状态干扰结果阅读。
  watch(searchQuery, () => {
    if (viewMode.value === 'search') {
      expandedQuestionIds.value = [];
    }
  });

  setExpandedToFirstQuestion();

  return {
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
    openSearch,
    getQuestionsByQuery,
    toggleQuestion,
    refreshRandomQuestions,
  };
}
