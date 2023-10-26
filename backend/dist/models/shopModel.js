"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RatingSchema = new mongoose_1.default.Schema({
    id: { type: String, unique: true, sparse: true },
    rating: { type: Number, sparse: true },
    description: { type: String, sparse: true },
});
const laundrySchema = new mongoose_1.default.Schema({
    laundryId: {
        type: String,
        unique: true,
    },
    userId: {
        type: String,
        unique: true,
    },
    totalCost: {
        type: Number,
    },
});
const shopSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: Number,
        required: [true, "You have to provide contact details"],
        unique: true,
    },
    address: {
        type: String,
        required: [true, "You have to provide shop's address"],
        unique: true,
    },
    ownerId: {
        required: true,
        type: String,
    },
    ratings: {
        type: [RatingSchema],
        default: [],
        sparse: true,
    },
    satisfied: {
        type: Number,
        default: 0,
    },
    unsatisfied: {
        type: Number,
        default: 0,
    },
    price: {
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
    laundry: {
        type: [laundrySchema],
        default: [],
        sparse: true,
    },
});
const Shop = mongoose_1.default.models.Shop || mongoose_1.default.model("Shop", shopSchema);
exports.default = Shop;
