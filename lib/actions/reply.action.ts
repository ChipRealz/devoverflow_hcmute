"use server";

import { connectToDatabase } from "../mongoose";
import Reply from "@/database/reply.model";
import Answer from "@/database/answer.model";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";

interface CreateReplyParams {
  content: string;
  author: string;
  answer: string;
  path: string;
}

export async function createReply(params: CreateReplyParams) {
  try {
    await connectToDatabase();

    const { content, author, answer, path } = params;

    const newReply = await Reply.create({ content, author, answer });

    // Add the reply to the answer's replies array
    await Answer.findByIdAndUpdate(answer, {
      $push: { replies: newReply._id },
    });

    // Increment author's reputation
    await User.findByIdAndUpdate(author, { $inc: { reputation: 2 } });

    revalidatePath(path);
  } catch (error) {
    console.log('DEBUG: error in createReply', error);
    throw error;
  }
}

export async function getReplies(answerId: string) {
  try {
    connectToDatabase();

    const replies = await Reply.find({ answer: answerId })
      .populate("author", "_id clerkId name picture")
      .sort({ createdAt: -1 });

    return replies;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteReply(replyId: string, answerId: string, path: string) {
  try {
    connectToDatabase();

    const reply = await Reply.findById(replyId);

    if (!reply) {
      throw new Error("Reply not found");
    }

    await reply.deleteOne({ _id: replyId });
    await Answer.updateMany(
      { _id: answerId },
      { $pull: { replies: replyId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
} 