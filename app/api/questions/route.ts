import { QUESTIONS, questionsForTrack } from "@/lib/questions/bank";
import type { Track } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const track = searchParams.get("track") as Track | null;
  const questions = track === "b" || track === "taxi" ? questionsForTrack(track) : QUESTIONS;
  return Response.json({ count: questions.length, questions });
}
