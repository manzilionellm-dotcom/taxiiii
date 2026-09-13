import "server-only";

import translations from "@/data/translations.fr.json";
import type { QuestionRecord, QuestionTranslation, Topic, Track } from "@/lib/types";
import { trackForTopic } from "@/lib/types";
import { questionSchema } from "@/lib/questions/schema";
import { sortForStudy } from "@/lib/questions/priority";
import rawQuestions from "@/data/questions.json";

const frMap = translations as Record<string, QuestionTranslation>;

export function parseQuestionBank(records: unknown[]): QuestionRecord[] {
  return records.map((record, index) => {
    const parsed = questionSchema.safeParse(record);
    if (!parsed.success) {
      throw new Error(`Invalid question at index ${index}: ${parsed.error.message}`);
    }
    return parsed.data;
  });
}

export const QUESTIONS: QuestionRecord[] = sortForStudy(
  parseQuestionBank(rawQuestions as unknown[]),
);

export function questionsForTrack(track: Track): QuestionRecord[] {
  return sortForStudy(
    QUESTIONS.filter((question) => trackForTopic(question.topic) === track),
  );
}

export function questionsForTopic(topic: Topic): QuestionRecord[] {
  return QUESTIONS.filter((question) => question.topic === topic);
}

export function getQuestion(id: string): QuestionRecord | undefined {
  return QUESTIONS.find((question) => question.id === id);
}

export function getFrench(question: QuestionRecord): QuestionTranslation {
  return (
    frMap[question.id] ?? {
      stem:
        question.corpus === "research"
          ? question.explanation_fr
          : "Traduction française à ajouter dans data/translations.fr.json — le texte suédois ci-dessus est la source.",
    }
  );
}

export function interleave(questions: QuestionRecord[]): QuestionRecord[] {
  const buckets = new Map<Topic, QuestionRecord[]>();
  for (const question of questions) {
    const list = buckets.get(question.topic) ?? [];
    list.push(question);
    buckets.set(question.topic, list);
  }
  const queues = [...buckets.values()];
  const result: QuestionRecord[] = [];
  let added = true;
  while (added) {
    added = false;
    for (const queue of queues) {
      const next = queue.shift();
      if (next) {
        result.push(next);
        added = true;
      }
    }
  }
  return result;
}
