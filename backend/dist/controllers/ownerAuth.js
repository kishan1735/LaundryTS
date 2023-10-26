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
exports.resetPassword = exports.forgotPassword = exports.ownerProtect = exports.ownerSignup = exports.ownerLogin = void 0;
const ownerModel_1 = __importDefault(require("../models/ownerModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { transporter } from "../components/nodemailer";
const nodemailer_1 = require("../config/nodemailer");
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
const ownerSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newOwner = yield ownerModel_1.default.create({
            name: req.body.name,
            email: req.body.email,
            ownerId: req.body.ownerId,
            password: req.body.password,
            shopId: req.body.shopId || "",
            phoneNumber: req.body.phoneNumber,
        });
        res.status(201).json({ status: "success", data: { user: newOwner } });
    }
    catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
});
exports.ownerSignup = ownerSignup;
const ownerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("You have to provide both email and password");
        }
        const owner = yield ownerModel_1.default.findOne({ email }).select("+password");
        if (!owner || !(yield owner.correctPassword(password, owner.password))) {
            throw new Error("Unauthorised : Password or email incorrect");
        }
        const token = signToken(owner._id);
        res
            .cookie("access_token", token, {
            httpOnly: true,
        })
            .status(200)
            .json({
            status: "success",
            message: "Logged In",
            access_token: token,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
});
exports.ownerLogin = ownerLogin;
const ownerProtect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token;
        if (!req.headers.authorization) {
            throw new Error("Login and try again");
        }
        if (req.headers.authorization.split(" ")[0] == "Bearer" &&
            req.headers.authorization.split(" ")[1]) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            throw new Error("You are not logged In !!! Please Login to gain access");
        }
        const decoded = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const freshOwner = yield ownerModel_1.default.findById(decoded.id);
        if (!freshOwner) {
            throw new Error("Login as owner and try later");
        }
        req.owner = freshOwner;
        next();
    }
    catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
});
exports.ownerProtect = ownerProtect;
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield ownerModel_1.default.findOne({ email: req.body.email });
    try {
        if (!owner) {
            throw new Error("Owner doesn't exist - SignUp");
        }
        const resetToken = owner.createPasswordResetToken();
        yield owner.save({ validateBeforeSave: false });
        let mailOptions = {
            to: req.body.email,
            subject: "Password Reset Token",
            text: `${resetToken}`,
        };
        yield (0, nodemailer_1.sendMail)({
            email: req.body.email,
            subject: "Your password reset token",
            message: owner.passwordResetToken,
        });
        res.status(200).json({
            status: "success",
            message: "Token Sent",
            resetToken: owner.passwordResetToken,
        });
    }
    catch (err) {
        console.log(err);
        if (owner === null || owner === void 0 ? void 0 : owner.passwordResetToken) {
            owner.passwordResetToken;
        }
        if (owner === null || owner === void 0 ? void 0 : owner.passwordResetExpires)
            owner.passwordResetExpires = undefined;
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedToken = req.body.token;
        const owner = yield ownerModel_1.default.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });
        if (!owner) {
            throw new Error("Token is invalid or expired");
        }
        if (!req.body.password) {
            throw new Error("Give password");
        }
        owner.password = req.body.password;
        owner.passwordResetToken = undefined;
        owner.passwordResetExpires = undefined;
        yield owner.save();
        res.status(200).json({
            status: "success",
            message: "password updated",
        });
    }
    catch (err) {
        res.status(500).json({ status: "failed", message: err.message });
    }
});
exports.resetPassword = resetPassword;
