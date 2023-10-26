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
exports.getUser = exports.deleteUser = exports.updateUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const redis_1 = require("../config/redis");
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user._id.toString();
    let results;
    try {
        const cachedResults = yield redis_1.redisClient.get("User:" + user);
        if (cachedResults !== "null" && cachedResults !== null) {
            results = JSON.parse(cachedResults);
        }
        else {
            results = yield userModel_1.default.findById(req.user._id);
            yield redis_1.redisClient.set("User:" + user, JSON.stringify(results));
            yield redis_1.redisClient.expire("User:" + user, 200);
        }
        if (!results) {
            throw new Error("Login and try again");
        }
        res.status(200).json({ status: "success", user: results });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.getUser = getUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user._id.toString();
    let results;
    try {
        const initUser = userModel_1.default.findById(req.user._id);
        results = yield userModel_1.default.findByIdAndUpdate(req.user._id, {
            name: req.body.name || initUser.name,
            phoneNumber: req.body.phoneNumber || initUser.phoneNumber,
            address: req.body.address || initUser.address,
        });
        if (!results) {
            throw new Error("User not found");
        }
        results = yield userModel_1.default.findById(req.user._id);
        yield redis_1.redisClient.set("User:" + user, JSON.stringify(results));
        yield redis_1.redisClient.expire("User:" + user, 200);
        res.status(200).json({
            status: "success",
            user: results,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    try {
        results = yield userModel_1.default.findOneAndRemove({ id: req.user.id });
        if (!results) {
            throw new Error("User Not Found");
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
exports.deleteUser = deleteUser;
