// models/Expense.ts
import { Frequency } from '@/lib/types';
import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './User';

export interface IExpense extends Document {
  user: IUser['_id'];
  category: string;
  amount: number;
  frequency: Frequency;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    frequency: { type: String, enum: Frequency, required: true },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const Expense: Model<IExpense> =
  mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
