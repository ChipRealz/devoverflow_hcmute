import * as z from "zod"

export const QuestionsSchema = z.object({
    title: z.string().min(5).max(200),
    explanation: z.string().min(100),
    tags: z.array(z.string().min(1).max(25)).min(1).max(7),
})

export const AnswerSchema = z.object({
  answer: z.string().min(100),
})

export const ProfileSchema = z.object({
  name: z.string().min(2).max(50),
  username: z.string().min(0).max(50),
  bio: z.string().min(10).max(150),
  portfolioWebsite: z.string().url(),
  location: z.string().min(5).max(50),
})