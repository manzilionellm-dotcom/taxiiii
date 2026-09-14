import { z } from "zod";
import { OPTION_LETTERS, TOPICS } from "@/lib/types";

export const optionSchema = z.object({
  letter: z.enum(OPTION_LETTERS),
  text: z.string().min(1),
});

export const questionSchema = z
  .object({
    id: z.string().min(1),
    topic: z.enum(TOPICS),
    trackHint: z.enum(["b", "taxi", "owner"]).optional(),
    stem_sv: z.string().min(1),
    options: z.array(optionSchema).min(2),
    answer: z.enum(OPTION_LETTERS),
    explanation_sv: z.string().min(1),
    explanation_fr: z.string().min(1),
    imageUrl: z.string().optional(),
    imageCaption: z.string().optional(),
    source: z.string().optional(),
    corpus: z.enum(["research", "manzi", "owner-seed", "owner-official", "owner-import"]).optional(),
    freq: z.enum(["high", "medium", "low"]).optional(),
    trap: z.string().optional(),
    type: z.string().optional(),
    youtubeId: z.string().optional(),
    conceptId: z.string().optional(),
    variantOf: z.string().optional(),
    form: z
      .enum([
        "original",
        "sibling",
        "paraphrase",
        "cloze",
        "scenario",
        "reverse",
        "trap",
        "image-first",
      ])
      .optional(),
    imageFirst: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.options.some((option) => option.letter === value.answer)) {
      ctx.addIssue({
        code: "custom",
        message: `answer ${value.answer} is not among options for ${value.id}`,
        path: ["answer"],
      });
    }
  });

export type ParsedQuestion = z.infer<typeof questionSchema>;
