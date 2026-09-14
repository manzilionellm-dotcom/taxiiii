export const TOPICS = ["lagstiftning", "sakerhet", "karta", "bkort", "agare"] as const;
export type Topic = (typeof TOPICS)[number];

export const TRACKS = ["b", "taxi", "owner"] as const;
export type Track = (typeof TRACKS)[number];

export const LOCALES = ["sv", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export type OptionLetter = "A" | "B" | "C" | "D" | "E";

export interface QuestionOption {
  letter: OptionLetter;
  text: string;
}

export type Corpus = "research" | "manzi" | "owner-seed";
export type Freq = "high" | "medium" | "low";

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
}

export interface QuestionTranslation {
  stem: string;
  options?: Partial<Record<OptionLetter, string>>;
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

export interface AppState {
  version: 1;
  profile: Profile;
  attempts: Attempt[];
  srs: SrsCard[];
  exams: MockExam[];
  chat: ChatTurn[];
}

export function isOwnerQuestion(question: {
  topic?: Topic | string;
  trackHint?: Track | string;
  corpus?: Corpus | string;
}): boolean {
  return (
    question.trackHint === "owner" ||
    question.topic === "agare" ||
    question.corpus === "owner-seed"
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
