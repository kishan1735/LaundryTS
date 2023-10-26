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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ownerModel_1 = __importDefault(require("../models/ownerModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const router = express_1.default.Router();
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.body.token;
        const decoded = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        let owner = yield ownerModel_1.default.findById(decoded.id);
        let user = yield userModel_1.default.findById(decoded.id);
        if (owner) {
            res.status(200).json({ status: "success", type: "owner" });
        }
        else if (user) {
            res.status(200).json({ status: "success", type: "user" });
        }
        else {
            res.status(200).json({ status: "success", type: "notoken" });
        }
        next();
    }
    catch (err) {
        res.status(500).json({ status: "failed", message: err.message });
    }
}));
exports.default = router;