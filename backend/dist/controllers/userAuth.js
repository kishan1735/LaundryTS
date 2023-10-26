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
exports.resetPassword = exports.forgotPassword = exports.userProtect = exports.userSignup = exports.userLogin = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = require("../config/nodemailer");
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
const userSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield userModel_1.default.create({
            name: req.body.name,
            email: req.body.email,
            id: req.body.id,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
        });
        const token = signToken(newUser.id);
        res.status(201).json({ status: "success", data: { user: newUser } });
    }
    catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
});
exports.userSignup = userSignup;
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("You have to provide both email and password");
        }
        const user = yield userModel_1.default.findOne({ email }).select("+password");
        if (!user || !(yield user.correctPassword(password, user.password))) {
            throw new Error("Unauthorised : Password or email incorrect");
        }
        const token = signToken(user._id);
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
exports.userLogin = userLogin;
const userProtect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const freshUser = yield userModel_1.default.findById(decoded.id);
        if (!freshUser) {
            throw new Error("Login as user and try later");
        }
        req.user = freshUser;
        next();
    }
    catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
});
exports.userProtect = userProtect;
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ email: req.body.email });
    try {
        if (!user) {
            throw new Error("User doesn't exist - SignUp");
        }
        const resetToken = user.createPasswordResetToken();
        yield user.save({ validateBeforeSave: false });
        yield (0, nodemailer_1.sendMail)({
            email: req.body.email,
            subject: "Your password reset token",
            message: user.passwordResetToken,
        });
        res.status(200).json({
            status: "success",
            message: "Token Sent",
            resetToken: user.passwordResetToken,
        });
    }
    catch (err) {
        if (user === null || user === void 0 ? void 0 : user.passwordResetToken) {
            user.passwordResetToken;
        }
        if (user === null || user === void 0 ? void 0 : user.passwordResetExpires)
            user.passwordResetExpires = undefined;
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
        const user = yield userModel_1.default.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });
        if (!user) {
            throw new Error("Token is invalid or expired");
        }
        if (!req.body.password) {
            throw new Error("Give password");
        }
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        yield user.save();
        res.status(200).json({
            status: "success",
            message: "password updated",
        });
    }
    catch (err) {
        res.status(400).json({ status: "failed", message: err.message });
    }
});
exports.resetPassword = resetPassword;
