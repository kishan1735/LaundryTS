"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const laundrySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    studentId: {
        type: String,
        required: true,
    },
    studentPhoneNumber: {
        type: Number,
        required: true,
    },
    studentAddress: {
        type: String,
        required: true,
    },
    shopId: {
        type: String,
        required: true,
    },
    deliveryDate: {
        type: Date,
        default: new Date(new Date().getDate() + 3),
    },
    list: {
        tshirt: {
            type: Number,
            default: 0,
        },
        shirt: {
            type: Number,
            default: 0,
        },
        shorts: {
            type: Number,
            default: 0,
        },
        pant: {
            type: Number,
            default: 0,
        },
        towel: {
            type: Number,
            default: 0,
        },
        bedsheet: {
            type: Number,
            default: 0,
        },
        pillowCover: {
            type: Number,
            default: 0,
        },
    },
    totalCost: {
        type: Number,
        required: [true, "Total cost cannot be calculated- Error in details"],
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "active", "ready", "deliver"],
    },
});
const Laundry = mongoose_1.default.models.Laundry || mongoose_1.default.model("Laundry", laundrySchema);
exports.default = Laundry;
