import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface UserType extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  id: string;
  phoneNumber: number;
  address: string;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;
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
  password: {
    type: String,
    required: [true, "You have to provide a password"],
    select: false,
    minLength: 8,
  },
  phoneNumber: {
    type: Number,
    unique: true,
    required: [true, "You  have to provide a phone number"],
  },
  address: {
    type: String,
    required: [true, "you have to provide an address"],
  },
  laundry: {
    type: [laundrySchema],
    default: [],
    sparse: true,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(16).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
