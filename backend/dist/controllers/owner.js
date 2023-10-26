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
exports.getOwner = exports.deleteOwner = exports.updateOwner = void 0;
const ownerModel_1 = __importDefault(require("../models/ownerModel"));
const redis_1 = require("../config/redis");
const getOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let owner = req.owner._id.toString();
    let results;
    try {
        const cachedResults = yield redis_1.redisClient.get("Owner:" + owner);
        if (cachedResults !== "null" && cachedResults !== null) {
            results = JSON.parse(cachedResults);
        }
        else {
            results = yield ownerModel_1.default.findById(req.owner._id);
            yield redis_1.redisClient.set("Owner:" + owner, JSON.stringify(results));
            yield redis_1.redisClient.expire("Owner:" + owner, 300);
        }
        if (!results) {
            throw new Error("Login and try again");
        }
        res.status(200).json({ status: "success", owner: results });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.getOwner = getOwner;
const updateOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let owner = req.owner._id.toString();
    let results;
    try {
        const initOwner = yield ownerModel_1.default.findById(req.owner._id);
        results = yield ownerModel_1.default.findByIdAndUpdate(req.owner._id, {
            phoneNumber: req.body.phoneNumber || initOwner.phoneNumbers,
            name: req.body.name || initOwner.name,
        });
        if (!results) {
            throw new Error("Change existing field to update");
        }
        results = yield ownerModel_1.default.findById(req.owner._id);
        yield redis_1.redisClient.set("Owner:" + owner, JSON.stringify(results));
        yield redis_1.redisClient.expire("Owner:" + owner, 300);
        res.status(200).json({
            status: "success",
            owner: results,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.updateOwner = updateOwner;
const deleteOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const owner = yield ownerModel_1.default.findOneAndRemove({ ownerId: req.owner.ownerId });
        if (!owner) {
            throw new Error("Owner not found");
        }
        yield redis_1.redisClient.flushDb();
        res.status(204).json({
            status: "success",
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.deleteOwner = deleteOwner;
