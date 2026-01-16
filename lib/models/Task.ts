import mongoose, { Model } from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    status: {
      type: String,
      enum: ['BACKLOG', 'IN_PROGRESS', 'DONE'],
      default: 'BACKLOG',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },
    tags: [String],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

type TTaskDocument = mongoose.InferSchemaType<typeof taskSchema> & {
  _id: string;
};

export const Task =
  (mongoose.models.Task as Model<TTaskDocument>) ??
  mongoose.model<TTaskDocument>('Task', taskSchema);
