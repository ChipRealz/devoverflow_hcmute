"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";
import User from "@/database/user.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, userId } = params;

    // Update view count for the question
    const question = await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } }, { new: true });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if (existingInteraction) return console.log("User has already viewed.");

      // Create interaction
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
    }

    // Increment author's reputation by +1 for every 5 views on their question
    const viewCount = question.views;
    if (viewCount % 5 === 0) {
      await User.findByIdAndUpdate(question.author, { $inc: { reputation: 1 } });
    }

  } catch (error) {
    console.log(error);
    throw error;
  }
}
// Testing the increment of author's reputation (not stable || not working)
// This function may not be working as expected, as the increment of the author's reputation is not stable.
// It will be developed further in the future.