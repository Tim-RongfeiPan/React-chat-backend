import mongoose, { Model, model, Schema } from 'mongoose';
import { IMessageDocument } from '@chat/interfaces/message.interface';

const messageSchema: Schema = new Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const MessageSchema: Model<IMessageDocument> = model<IMessageDocument>(
  'Conversation',
  messageSchema,
  'Conversation'
);
export { MessageSchema };
