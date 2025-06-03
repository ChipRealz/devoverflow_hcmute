import { Schema, models, model, Document } from 'mongoose';

export interface IActivity extends Document {
  userId: Schema.Types.ObjectId;
  actionType: 'upvote' | 'downvote' | 'remove_upvote' | 'remove_downvote' | 'post' | 'answer' | 'save' | 'unsave';
  targetType: 'question' | 'answer';
  targetId: Schema.Types.ObjectId;
  targetContent: string;
  createdAt: Date;
}

const ActivitySchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  actionType: { 
    type: String, 
    enum: ['upvote', 'downvote', 'remove_upvote', 'remove_downvote', 'post', 'answer', 'save', 'unsave'],
    required: true 
  },
  targetType: { 
    type: String, 
    enum: ['question', 'answer'],
    required: true 
  },
  targetId: { 
    type: Schema.Types.ObjectId, 
    required: true 
  },
  targetContent: {
    type: String,
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Create indexes for better query performance
ActivitySchema.index({ userId: 1, createdAt: -1 });
ActivitySchema.index({ targetId: 1, targetType: 1 });

const Activity = models.Activity || model('Activity', ActivitySchema);

export default Activity; 