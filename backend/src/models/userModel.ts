import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface UserType extends mongoose.Document {
  name: string;
  email: string;
  id: string;
  phoneNumber: number;
  address: string;
  laundry: Array<Object>;
}
const laundrySchema = new mongoose.Schema({
  laundryId: {
    type: String,
    unique: true,
  },
  shopId: {
    type: String,
    unique: true,
  },
  totalCost: {
    type: Number,
  },
});

const userSchema = new mongoose.Schema<UserType>({
  name: {
    type: String,
    required: [true, "You have to provide a name"],
  },
  id: {
    type: String,
    unique: true,
    required: [true, "You have to provide an ID"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "You have to provide an email"],
    validate: [validator.isEmail, "You have to provide a valid email"],
    lowercase: true,
  },

  phoneNumber: {
    type: Number,
    unique: true,
  },
  address: {
    type: String,
  },
  laundry: {
    type: [laundrySchema],
    default: [],
    sparse: true,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
