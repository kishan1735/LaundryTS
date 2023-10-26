import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface OwnerType extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  phoneNumber: number;

  shopId: string;

  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpires: string;
  ownerId: string;
}

const ownerSchema = new mongoose.Schema<OwnerType>({
  name: {
    type: String,
    required: [true, "You have to provide a name"],
  },
  ownerId: {
    type: String,
    unique: true,
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
    required: [true, "You have to provide a phone number"],
  },

  shopId: {
    type: String,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: Date,
  passwordChangedAt: Date,
});

ownerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

ownerSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

ownerSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const Owner = mongoose.models.Owner || mongoose.model("Owner", ownerSchema);

export default Owner;
