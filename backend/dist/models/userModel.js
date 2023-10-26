"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const laundrySchema = new mongoose_1.default.Schema({
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
const userSchema = new mongoose_1.default.Schema({
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
        validate: [validator_1.default.isEmail, "You have to provide a valid email"],
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
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        this.password = yield bcryptjs_1.default.hash(this.password, 12);
        next();
    });
});
userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(candidatePassword, userPassword);
    });
};
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(16).toString("hex");
    this.passwordResetToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
const User = mongoose_1.default.models.User || mongoose_1.default.model("User", userSchema);
exports.default = User;
