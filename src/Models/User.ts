import mongoose, { Schema } from "mongoose";

export interface IDish extends Document {
  id: number;
  name: string;
  price: number;
}

const dishSchema: Schema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IDish>("Dish", dishSchema);