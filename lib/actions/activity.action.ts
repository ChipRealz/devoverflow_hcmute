import { connectToDatabase } from '@/lib/mongoose';
import Activity from '@/database/activity.model';
import User from '@/database/user.model';
import Question from '@/database/question.model';

interface LogActivityParams {
  clerkId: string;
  actionType: 'upvote' | 'downvote' | 'remove_upvote' | 'remove_downvote' | 'post' | 'answer' | 'save' | 'unsave';
  targetType: 'question' | 'answer';
  targetId: string;
}

export async function logActivity({
  clerkId,
  actionType,
  targetType,
  targetId,
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
    if (question) {
      targetContent = question.title;
    }

    const activity = await Activity.create({
      userId: user._id,
      actionType,
      targetType,
      targetId,
      targetContent,
    });

    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
} 