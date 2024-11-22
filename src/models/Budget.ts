import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './User';

export interface IBudget extends Document {
  user: IUser['_id'];
  category: string;
  allocatedAmount: number;
  currentSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    allocatedAmount: { type: Number, required: true },
    currentSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Budget: Model<IBudget> =
  mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);

export default Budget;
