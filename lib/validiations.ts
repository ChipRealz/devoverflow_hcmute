import * as z from "zod"

export const QuestionsSchema = z.object({
    title: z.string().min(5).max(200),
    explanation: z.string().min(100),
    tags: z.array(z.string().min(1).max(20)).min(1).max(4),
})

export const AnswerSchema = z.object({
  answer: z.string().min(100),
})