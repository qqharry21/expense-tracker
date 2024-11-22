// models/FinancialGoal.ts
import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './User';

export interface IFinancialGoal extends Document {
  user: IUser['_id'];
  goalDescription: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FinancialGoalSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    goalDescription: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    targetDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const FinancialGoal: Model<IFinancialGoal> =
  mongoose.models.FinancialGoal ||
  mongoose.model<IFinancialGoal>('FinancialGoal', FinancialGoalSchema);

export default FinancialGoal;
