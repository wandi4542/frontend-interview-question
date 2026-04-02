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

