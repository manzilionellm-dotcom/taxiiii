import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseQuestionBank } from "@/lib/questions/bank";
import type { QuestionRecord } from "@/lib/types";

export function loadQuestionsFromDisk(root = process.cwd()): QuestionRecord[] {
  const raw = readFileSync(join(root, "data/questions.jsonl"), "utf8");
  const records = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => JSON.parse(line) as unknown);
  return parseQuestionBank(records);
}
