/* eslint-disable @typescript-eslint/ban-ts-comment */
import { connectToDatabase } from '@/lib/mongoose';
import Activity from '@/database/activity.model';
import User from '@/database/user.model';
import Question from '@/database/question.model';
import Answer from '@/database/answer.model';

interface LogActivityParams {
  clerkId: string;
  actionType: 'upvote' | 'downvote' | 'remove_upvote' | 'remove_downvote' | 'post' | 'answer' | 'save' | 'unsave';
  targetType: 'question' | 'answer';
  targetId: string; // question ID
  answerId?: string; // answer ID (optional, only for answer activities)
}

export async function logActivity({
  clerkId,
  actionType,
  targetType,
  targetId,
  answerId,
}: LogActivityParams) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId });
    if (!user) {
      throw new Error('User not found');
    }

    console.log('logActivity targetId:', targetId);
    const question = await Question.findById(targetId);
    console.log('Fetched question:', question);

    let targetContent = '';
    let targetUserName = '';
    if (question) {
      targetContent = question.title;
    }

    // If voting on an answer, find the answer and its author using answerId
    if (targetType === 'answer' && answerId) {
      const answer = await Answer.findById(answerId).populate('author');
      console.log('Fetched answer:', answer);
      if (answer && answer.author && typeof answer.author === 'object') {
        targetUserName = answer.author.name;
      }
    }

    const activity = await Activity.create({
      userId: user._id,
      actionType,
      targetType,
      targetId,
      targetContent,
      targetUserName,
    });

    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
} 