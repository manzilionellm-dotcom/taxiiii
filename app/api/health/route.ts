import { QUESTIONS } from "@/lib/questions/bank";

export async function GET() {
  return Response.json({
    ok: true,
    questions: QUESTIONS.length,
    readyThreshold: 95,
  });
}
