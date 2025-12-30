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
