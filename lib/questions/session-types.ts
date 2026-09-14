import type { QuestionRecord, QuestionTranslation, Topic, VariantForm } from "@/lib/types";

export interface QuestionCatalogItem {
  id: string;
  topic: Topic;
}

export interface SessionQuestion extends QuestionRecord {
  translation: QuestionTranslation;
  watermark: string;
  conceptId?: string;
  variantOf?: string;
  form?: VariantForm;
  imageFirst?: boolean;
}
