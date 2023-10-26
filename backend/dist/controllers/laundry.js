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
exports.deliverLaundry = exports.cancelLaundry = exports.calculatePrice = exports.updateStatus = exports.getLaundry = exports.getAllLaundry = exports.createLaundryRequest = void 0;
const laundryModel_1 = __importDefault(require("../models/laundryModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const shopModel_1 = __importDefault(require("../models/shopModel"));
const redis_1 = require("../config/redis");
const calculatePrice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shop = yield shopModel_1.default.findById(req.params.shopId);
        const totalCost = Object.keys(shop.price)
            .filter((el) => req.body.list[el] && shop.price[el])
            .reduce((acc, curr) => acc + req.body.list[curr] * shop.price[curr], 0);
        res.status(200).json({ status: "success", totalCost });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.calculatePrice = calculatePrice;
const createLaundryRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let shop = yield shopModel_1.default.findById(req.params.shopId);
        const laundryList = yield laundryModel_1.default.create({
            name: req.user.name,
            shopId: req.params.shopId,
            studentId: req.user._id,
            studentAddress: req.user.address,
            studentPhoneNumber: req.user.phoneNumber,
            list: {
                shirt: req.body.list.shirt,
                tshirt: req.body.list.tshirt,
                shorts: req.body.list.shorts,
                pant: req.body.list.pant,
                towel: req.body.list.towel,
                bedsheet: req.body.list.bedsheet,
                pillowCover: req.body.list.pillowCover,
            },
            totalCost: req.body.totalCost,
            status: "pending",
        });
        const user = yield userModel_1.default.findByIdAndUpdate(req.user._id, {
            $push: {
                laundry: {
                    shopId: shop._id,
                    totalCost: req.body.totalCost,
                    laundryId: laundryList._id,
                },
            },
        });
        shop = yield shopModel_1.default.findByIdAndUpdate(req.params.shopId, {
            $push: {
                laundry: {
                    userId: req.user._id,
                    totalCost: req.body.totalCost,
                    laundryId: laundryList._id,
                },
            },
        });
        res.status(201).json({
            status: "success",
            laundryList,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.createLaundryRequest = createLaundryRequest;
const getLaundry = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let results;
        const shop = yield shopModel_1.default.findById(req.params.shopId);
        const laundryId = shop.laundry.filter((el) => el.userId === req.user._id.toString())[0].laundryId;
        results = yield laundryModel_1.default.findById(laundryId);
        if (!results) {
            throw new Error("This Laundry Id doesn't exist");
        }
        res.status(200).json({ status: "success", laundry: results });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.getLaundry = getLaundry;
const getAllLaundry = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const laundry = yield laundryModel_1.default.find({ shopId: req.owner.shopId });
        if (!laundry) {
            throw new Error("There is no laundry for this shop");
        }
        res.status(200).json({ status: "success", laundry });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.getAllLaundry = getAllLaundry;
const updateStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    try {
        if (req.body.status === "active") {
            results = yield laundryModel_1.default.findByIdAndUpdate(req.body.laundryId, {
                status: "active",
                deliveryDate: req.body.deliveryDate,
            });
        }
        else if (req.body.status === "ready") {
            results = yield laundryModel_1.default.findByIdAndUpdate(req.body.laundryId, {
                status: "ready",
            });
        }
        if (!results) {
            throw new Error("This laundry doesn't exist");
        }
        results = yield laundryModel_1.default.findById(req.body.laundryId);
        res.status(200).json({
            status: "success",
            laundry: results,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.updateStatus = updateStatus;
const cancelLaundry = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let shop = yield shopModel_1.default.findById(req.params.shopId);
        const laundryId = shop.laundry.filter((el) => el.userId === req.user._id.toString())[0].laundryId;
        const laundry = yield laundryModel_1.default.findByIdAndDelete(laundryId);
        shop = yield shopModel_1.default.findByIdAndUpdate(req.params.shopId, {
            $pull: {
                laundry: {
                    laundryId,
                },
            },
        });
        const user = yield userModel_1.default.findByIdAndUpdate(req.user._id, {
            $pull: {
                laundry: {
                    laundryId,
                },
            },
        });
        yield redis_1.redisClient.flushDb();
        res.status(201).json({ status: "success", message: "deleted" });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.cancelLaundry = cancelLaundry;
const deliverLaundry = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const laundry = yield laundryModel_1.default.findByIdAndDelete(req.params.laundryId);
        const shop = yield shopModel_1.default.findByIdAndUpdate(req.params.laundryId, {
            $pull: {
                laundry: {
                    laundryId: req.params.laundryId,
                },
            },
        });
        const user = yield userModel_1.default.findOneAndUpdate({ laundry: { laundryId: req.params.laundryId } }, {
            $pull: {
                laundry: {
                    laundryId: req.params.laundryId,
                },
            },
        });
        res.status(204).json({ status: "success", message: "deleted" });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.deliverLaundry = deliverLaundry;
