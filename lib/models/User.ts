import mongoose, { Model } from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

type TUserDocument = mongoose.InferSchemaType<typeof userSchema> & {
  _id: string;
};

export const User =
  (mongoose.models.User as Model<TUserDocument>) ??
  mongoose.model<TUserDocument>('User', userSchema);
