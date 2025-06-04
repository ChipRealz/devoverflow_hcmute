import { Schema, models, model, Document } from 'mongoose';

export interface IReply extends Document {
    author: Schema.Types.ObjectId;
    answer: Schema.Types.ObjectId;
    content: string;
    upvotes: Schema.Types.ObjectId[];
    downvotes: Schema.Types.ObjectId[];
    createdAt: Date;
}

const ReplySchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    answer: { type: Schema.Types.ObjectId, ref: 'Answer', required: true },
    content: { type: String, required: true },
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
})

const Reply = models.Reply || model('Reply', ReplySchema);

export default Reply; 