export const TOPICS = ["lagstiftning", "sakerhet", "karta", "bkort", "agare"] as const;
export type Topic = (typeof TOPICS)[number];

export const TRACKS = ["b", "taxi", "owner"] as const;
export type Track = (typeof TRACKS)[number];

export const LOCALES = ["sv", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"] as const;
export type OptionLetter = (typeof OPTION_LETTERS)[number];

export interface QuestionOption {
  letter: OptionLetter;
  text: string;
}

export const CORPORA = [
  "research",
  "manzi",
  "owner-seed",
  "owner-official",
  "owner-import",
] as const;
export type Corpus = (typeof CORPORA)[number];
export const OWNER_CORPORA = ["owner-seed", "owner-official", "owner-import"] as const;
export type OwnerCorpus = (typeof OWNER_CORPORA)[number];
export type Freq = "high" | "medium" | "low";
export type VariantForm =
  | "original"
  | "sibling"
  | "paraphrase"
  | "cloze"
  | "scenario"
  | "reverse"
  | "trap"
  | "image-first";

export function isOwnerCorpus(value?: string): value is OwnerCorpus {
  return OWNER_CORPORA.includes(value as OwnerCorpus);
}

export interface QuestionRecord {
  id: string;
  topic: Topic;
  trackHint?: Track;
  stem_sv: string;
  options: QuestionOption[];
  answer: OptionLetter;
  explanation_sv: string;
  explanation_fr: string;
  imageUrl?: string;
  imageCaption?: string;
  source?: string;
  corpus?: Corpus;
  freq?: Freq;
  trap?: string;
  type?: string;
  youtubeId?: string;
  conceptId?: string;
  variantOf?: string;
  form?: VariantForm;
  imageFirst?: boolean;
}

export interface QuestionTranslation {
  stem: string;
  options?: Partial<Record<OptionLetter, string>>;
  /** French LÖSNING text. Curated FR wins over a question's own explanation_fr. */
  explanation?: string;
}

export interface HardWord {
  sv: string;
  forms?: string[];
  fr: string;
}

export type SupportLevel = 0 | 1 | 2 | 3;

export interface Profile {
  name: string;
  email?: string;
  tracks: Track[];
  activeTrack: Track;
  locale: Locale;
  fragileMode: boolean;
  supportLevel: SupportLevel;
  onboarded: boolean;
  tosAccepted: boolean;
}

export interface Attempt {
  id: string;
  questionId: string;
  track: Track;
  correct: boolean;
  at: string;
  timed: boolean;
  mockExamId?: string;
}

export interface SrsCard {
  questionId: string;
  track: Track;
  conceptId?: string;
  lastForm?: VariantForm;
  lastVariantId?: string;
  ease: number;
  interval: number;
  repetitions: number;
  due: string;
  lapses: number;
}

export interface MockExam {
  id: string;
  track: Track;
  startedAt: string;
  finishedAt?: string;
  score?: number;
  total?: number;
  correct?: number;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  grounded?: boolean;
  at: string;
}

export interface LastSession {
  track: Track;
  mode: "study" | "exam";
  topic?: Topic;
  questionIds: string[];
  index: number;
  unfinished: boolean;
  at: string;
  missLabel?: string;
  missTopic?: Topic;
}

export interface WeakTopic {
  topic: Topic;
  track: Track;
  accuracy: number;
  attempts: number;
  due?: number;
}

export interface AppState {
  version: 1;
  profile: Profile;
  attempts: Attempt[];
  srs: SrsCard[];
  exams: MockExam[];
  chat: ChatTurn[];
  lastSession?: LastSession;
  weakTopics?: WeakTopic[];
  teacherNotes?: string[];
}

export function isOwnerQuestion(question: {
  topic?: Topic | string;
  trackHint?: Track | string;
  corpus?: Corpus | string;
}): boolean {
  return (
    question.trackHint === "owner" ||
    question.topic === "agare" ||
    isOwnerCorpus(question.corpus)
  );
}

export function trackForTopic(topic: Topic): Track {
  if (topic === "bkort") return "b";
  if (topic === "agare") return "owner";
  return "taxi";
}

export function questionTrack(question: {
  topic: Topic;
  trackHint?: Track;
  corpus?: Corpus;
}): Track {
  if (isOwnerQuestion(question)) return "owner";
  return trackForTopic(question.topic);
}

export function topicsForTrack(track: Track): Topic[] {
  if (track === "b") return ["bkort"];
  if (track === "owner") return ["agare"];
  return ["lagstiftning", "sakerhet", "karta"];
}
