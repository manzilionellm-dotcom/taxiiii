import type { Attempt, MockExam, QuestionRecord, Track } from "@/lib/types";
import { topicsForTrack } from "@/lib/types";

export interface ReadinessBreakdown {
  score: number;
  recentAccuracy: number;
  topicCoverage: number;
  trend30: number;
  mockExam: number;
  ready: boolean;
}

const DAY = 24 * 60 * 60 * 1000;

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function accuracy(attempts: Attempt[]) {
  if (!attempts.length) return 0;
  return (attempts.filter((item) => item.correct).length / attempts.length) * 100;
}

export function computeReadiness(
  track: Track,
  questions: QuestionRecord[],
  attempts: Attempt[],
  exams: MockExam[],
  now = new Date(),
): ReadinessBreakdown {
  const trackAttempts = attempts.filter((item) => item.track === track);
  const recent = trackAttempts.filter(
    (item) => now.getTime() - new Date(item.at).getTime() <= 14 * DAY,
  );
  const recentAccuracy = accuracy(recent.slice(-40));

  const topics = topicsForTrack(track);
  const byTopic = topics.map((topic) => {
    const ids = new Set(
      questions.filter((question) => question.topic === topic).map((q) => q.id),
    );
    const seen = new Set(
      trackAttempts.filter((item) => ids.has(item.questionId)).map((item) => item.questionId),
    );
    return ids.size === 0 ? 0 : (seen.size / ids.size) * 100;
  });
  const topicCoverage = byTopic.length
    ? byTopic.reduce((sum, value) => sum + value, 0) / byTopic.length
    : 0;

  const last30 = trackAttempts.filter(
    (item) => now.getTime() - new Date(item.at).getTime() <= 30 * DAY,
  );
  const midpoint = now.getTime() - 15 * DAY;
  const older = last30.filter((item) => new Date(item.at).getTime() < midpoint);
  const newer = last30.filter((item) => new Date(item.at).getTime() >= midpoint);
  const olderAcc = older.length ? accuracy(older) : recentAccuracy;
  const newerAcc = newer.length ? accuracy(newer) : recentAccuracy;
  const trend30 = clamp(50 + (newerAcc - olderAcc));

  const finished = exams.filter((exam) => exam.track === track && exam.finishedAt);
  const mockExam = finished.length
    ? finished.slice(-5).reduce((sum, exam) => sum + (exam.score ?? 0), 0) /
      Math.min(finished.length, 5)
    : 0;

  const score = clamp(
    0.35 * recentAccuracy + 0.25 * topicCoverage + 0.2 * trend30 + 0.2 * mockExam,
  );

  return {
    score,
    recentAccuracy: clamp(recentAccuracy),
    topicCoverage: clamp(topicCoverage),
    trend30: clamp(trend30),
    mockExam: clamp(mockExam),
    ready: score >= 95,
  };
}
