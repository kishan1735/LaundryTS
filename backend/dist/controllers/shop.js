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
exports.getOwnerShop = exports.updateRating = exports.updateSatisfy = exports.getRating = exports.getUserShop = exports.deleteShop = exports.getAllShops = exports.updatePrice = exports.updateShop = exports.createShop = void 0;
const ownerModel_1 = __importDefault(require("../models/ownerModel"));
const shopModel_1 = __importDefault(require("../models/shopModel"));
const redis_1 = require("../config/redis");
const getAllShops = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shops = yield shopModel_1.default.find();
        if (!shops) {
            throw new Error("No shops registered");
        }
        res.status(200).json({
            status: "success",
            shops,
        });
    }
    catch (err) {
        res.status(404).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.getAllShops = getAllShops;
const getUserShop = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let shop = req.params.shopId;
    let results;
    try {
        const cachedResults = yield redis_1.redisClient.get("Shop:" + shop);
        if (cachedResults !== "null" && cachedResults !== null) {
            results = JSON.parse(cachedResults);
        }
        else {
            results = yield shopModel_1.default.findById(req.params.shopId);
            yield redis_1.redisClient.set("Shop:" + shop, JSON.stringify(results));
            yield redis_1.redisClient.expire("Shop:" + shop, 200);
        }
        if (!results) {
            throw new Error("Shop not found");
        }
        res.status(200).json({ status: "success", shop: results });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.getUserShop = getUserShop;
const getOwnerShop = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let shop = req.owner.shopId.toString();
    let results;
    try {
        const cachedResults = yield redis_1.redisClient.get("Shop:" + shop);
        if (cachedResults !== null && cachedResults !== "null") {
            results = JSON.parse(cachedResults);
        }
        else {
            results = yield shopModel_1.default.findById(req.owner.shopId.toString());
            yield redis_1.redisClient.set("Shop:" + shop, JSON.stringify(results));
            yield redis_1.redisClient.expire("Shop:" + shop, 200);
        }
        if (!results) {
            throw new Error("Shop not found");
        }
        res.status(200).json({ status: "success", shop: results });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.getOwnerShop = getOwnerShop;
const createShop = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const owner = yield ownerModel_1.default.findOne({ ownerId: req.owner.ownerId });
        if (!owner) {
            throw new Error("Register as Owner to create shop");
        }
        const shop = yield shopModel_1.default.create({
            name: req.body.name,
            address: req.body.address,
            ownerId: req.owner.ownerId,
            contactNumber: req.body.contactNumber,
            price: {
                shirt: req.body.price.shirt,
                tshirt: req.body.price.tshirt,
                shorts: req.body.price.shorts,
                pant: req.body.price.pant,
                towel: req.body.price.towel,
                bedsheet: req.body.price.bedsheet,
                pillowCover: req.body.price.pillowCover,
            },
        });
        yield ownerModel_1.default.findOneAndUpdate({ ownerId: req.owner.ownerId }, { shopId: shop._id.toString() });
        res.status(201).json({
            status: "success",
            shop,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.createShop = createShop;
const updatePrice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    let shop = req.owner.shopId;
    let results;
    try {
        const initShop = yield shopModel_1.default.findById(req.owner.shopId);
        results = yield shopModel_1.default.findByIdAndUpdate(req.owner.shopId, {
            price: {
                shirt: (_a = req.body.price.shirt) !== null && _a !== void 0 ? _a : initShop.price.shirt,
                tshirt: (_b = req.body.price.tshirt) !== null && _b !== void 0 ? _b : initShop.price.tshirt,
                shorts: (_c = req.body.price.shorts) !== null && _c !== void 0 ? _c : initShop.price.shorts,
                pant: (_d = req.body.price.pant) !== null && _d !== void 0 ? _d : initShop.price.pant,
                towel: (_e = req.body.price.towel) !== null && _e !== void 0 ? _e : initShop.price.towel,
                bedsheet: (_f = req.body.price.bedsheet) !== null && _f !== void 0 ? _f : initShop.price.bedsheet,
                pillowCover: (_g = req.body.price.pillowCover) !== null && _g !== void 0 ? _g : initShop.price.pillowCover,
            },
        });
        if (!results) {
            throw new Error("Shop Not Found");
        }
        results = yield shopModel_1.default.findById(req.owner.shopId);
        yield redis_1.redisClient.set("Shop:" + shop, JSON.stringify(results), {
            XX: true,
        });
        res.status(200).json({
            status: "success",
            shop: results,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.updatePrice = updatePrice;
const updateShop = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j, _k;
    let shop = req.owner.shopId;
    let results;
    try {
        const initShop = yield shopModel_1.default.findById(req.owner.shopId);
        results = yield shopModel_1.default.findByIdAndUpdate(req.owner.shopId, {
            contactNumber: (_h = req.body.contactNumber) !== null && _h !== void 0 ? _h : initShop.contactNumber,
            name: (_j = req.body.name) !== null && _j !== void 0 ? _j : initShop.name,
            address: (_k = req.body.address) !== null && _k !== void 0 ? _k : initShop.address,
        });
        if (!shop) {
            throw new Error("Shop Not Found");
        }
        results = yield shopModel_1.default.findById(req.owner.shopId);
        yield redis_1.redisClient.set("Shop:" + shop, JSON.stringify(results));
        yield redis_1.redisClient.expire("Shop:" + shop, 200);
        res.status(200).json({
            status: "success",
            shop: results,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.updateShop = updateShop;
const deleteShop = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shop = yield shopModel_1.default.findByIdAndDelete(req.owner.shopId);
        if (!shop) {
            throw new Error("You don't own a shop yet");
        }
        const owner = yield ownerModel_1.default.findOneAndUpdate({ ownerId: req.owner.ownerId }, { shopId: "" });
        yield redis_1.redisClient.flushDb();
        res.status(204).json({ status: "success", message: "deleted" });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.deleteShop = deleteShop;
const updateSatisfy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let shop = req.params.shopId;
    let results;
    try {
        const initShop = yield shopModel_1.default.findById(req.params.shopId);
        if (req.body.satisfaction === "satisfied") {
            results = yield shopModel_1.default.findByIdAndUpdate(req.params.shopId, {
                satisfied: initShop.satisfied + 1,
            });
        }
        else if (req.body.satisfaction === "unsatisfied") {
            results = yield shopModel_1.default.findByIdAndUpdate(req.params.shopId, {
                unsatisfied: initShop.unsatisfied + 1,
            });
        }
        if (!results) {
            throw new Error("Shop Not Found");
        }
        results = yield shopModel_1.default.findById(req.params.shopId);
        yield redis_1.redisClient.set("Shop:" + shop, JSON.stringify(results));
        yield redis_1.redisClient.expire("Shop:" + shop, 200);
        res.status(200).json({
            status: "success",
            shop: results,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.updateSatisfy = updateSatisfy;
const getRating = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shop = yield shopModel_1.default.findById(req.params.shopId);
        if (!shop) {
            throw new Error("This shop doesn't exist");
        }
        const length = shop.ratings.length;
        const ratingCalc = shop.ratings.reduce((acc, curr) => acc + curr.rating / length, 0);
        const user = yield shopModel_1.default.findById(req.params.shopId);
        const userRating = user.ratings.filter((el) => el.id == req.user.id);
        res.status(200).json({
            status: "success",
            rating: ratingCalc,
            userRating,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.getRating = getRating;
const updateRating = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let shop = req.params.shopId;
    let results;
    try {
        results = yield shopModel_1.default.findByIdAndUpdate(req.params.shopId, {
            $push: {
                ratings: {
                    id: req.user.id,
                    rating: req.body.rating,
                    description: req.body.description,
                },
            },
        });
        if (!results) {
            throw new Error("This shop doesn't exist");
        }
        results = yield shopModel_1.default.findById(req.params.shopId);
        yield redis_1.redisClient.set("Shop:" + shop, JSON.stringify(results));
        yield redis_1.redisClient.expire("Shop:" + shop, 200);
        res.status(200).json({
            status: "success",
            shop: results,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.updateRating = updateRating;
