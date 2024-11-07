import mongoose, { Document, Schema } from 'mongoose';

export interface ITag {
  name: string;
  color?: string;
  description?: string;
}

type ITagDocument = ITag & Document;

const TagSchema: Schema = new Schema<ITagDocument>(
  {
    name: { type: String, required: true, unique: true },
    color: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Tag || mongoose.model<ITagDocument>('Tag', TagSchema);
