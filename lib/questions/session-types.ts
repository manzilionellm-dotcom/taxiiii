import type { QuestionRecord, QuestionTranslation, Topic } from "@/lib/types";

export interface QuestionCatalogItem {
  id: string;
  topic: Topic;
}

export interface SessionQuestion extends QuestionRecord {
  translation: QuestionTranslation;
  watermark: string;
}
