import { Frequency } from '@/lib/types';
import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './User';

export interface IIncome extends Document {
  user: IUser['_id'];
  source: string;
  amount: number;
  frequency: Frequency;
  dateReceived: Date;
  createdAt: Date;
  updatedAt: Date;
}

const IncomeSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    source: { type: String, required: true },
    amount: { type: Number, required: true },
    frequency: { type: String, enum: Frequency, required: true },
    dateReceived: { type: Date, required: true },
  },
  { timestamps: true }
);

const Income: Model<IIncome> =
  mongoose.models.Income || mongoose.model<IIncome>('Income', IncomeSchema);

export default Income;
