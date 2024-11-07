import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IExpense {
  _id: string;
  date: string;
  category: string;
  amount: number;
  color?: string;
  description?: string;
  type: '一次性' | '每月固定開銷' | '每年固定開銷';
  tags: Types.ObjectId[];
}

type IExpenseDocument = IExpense & Document;

const ExpenseSchema: Schema = new Schema<IExpenseDocument>(
  {
    date: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    color: { type: String },
    description: { type: String },
    type: { type: String, enum: ['一次性', '每月固定開銷', '每年固定開銷'], required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Expense ||
  mongoose.model<IExpenseDocument>('Expense', ExpenseSchema);
