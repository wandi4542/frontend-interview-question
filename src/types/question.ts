// 单道题目的基础结构。
export interface QuestionItem {
  id: string;
  question: string;
  answerHtml: string;
  keywords?: string[];
}

// 题目分类结构，每个分类包含多个题目。
export interface QuestionCategory {
  id: string;
  name: string;
  questions: QuestionItem[];
}

// 展示层使用的扁平化题目记录，补充了分类信息。
export interface QuestionRecord extends QuestionItem {
  categoryId: string;
  categoryName: string;
}

// 当前页面支持的三种展示模式。
export type QuestionViewMode = 'category' | 'search' | 'random';

// 顶部导航使用的四个一级页面。
export type TopTab = 'questions' | 'scenarios' | 'layouts' | 'profile';

// 场景详情页中的高频面试题。
export interface ScenarioDetailQuestion {
  id: string;
  question: string;
  standardAnswer: string[];
  answerThinking: string[];
}

// 场景页中的补充型经典场景题。
export interface ScenarioClassicQuestion {
  id: string;
  question: string;
  answerPoints: string[];
}

// 场景专题卡片及详情页共用的数据结构。
export interface ScenarioTopic {
  id: string;
  title: string;
  badge: string;
  badgeClass: string;
  description: string;
  tags: string[];
  focus: string;
  query: string;
  detailTitle: string;
  detailSummary: string;
  keyPoints: string[];
  answerStructure: string[];
  followUps: string[];
  pitfalls: string[];
  detailQuestions: ScenarioDetailQuestion[];
}
