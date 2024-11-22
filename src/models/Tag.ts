import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
  name: string;
  color?: string;
  description?: string;
}

const TagSchema: Schema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true },
    color: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);
