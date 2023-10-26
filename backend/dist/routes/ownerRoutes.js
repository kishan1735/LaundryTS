"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ownerAuth_1 = require("../controllers/ownerAuth");
const shop_1 = require("../controllers/shop");
const owner_1 = require("../controllers/owner");
const laundry_1 = require("../controllers/laundry");
const ownerAuth_2 = require("../controllers/ownerAuth");
const router = express_1.default.Router();
router.route("/signup").post(ownerAuth_1.ownerSignup);
router.route("/login").post(ownerAuth_1.ownerLogin);
router.route("/forgotpassword").post(ownerAuth_1.forgotPassword);
router.route("/resetpassword").post(ownerAuth_2.resetPassword);
router
    .route("/shop")
    .post(ownerAuth_1.ownerProtect, shop_1.createShop)
    .get(ownerAuth_1.ownerProtect, shop_1.getOwnerShop)
    .patch(ownerAuth_1.ownerProtect, shop_1.updateShop)
    .delete(ownerAuth_1.ownerProtect, shop_1.deleteShop);
router
    .route("/profile")
    .get(ownerAuth_1.ownerProtect, owner_1.getOwner)
    .patch(ownerAuth_1.ownerProtect, owner_1.updateOwner)
    .delete(ownerAuth_1.ownerProtect, owner_1.deleteOwner);
router.route("/shop/updatePrice").patch(ownerAuth_1.ownerProtect, shop_1.updatePrice);
router.route("/shop/laundry").get(ownerAuth_1.ownerProtect, laundry_1.getAllLaundry);
router
    .route("/shop/laundry/:laundryId")
    .patch(ownerAuth_1.ownerProtect, laundry_1.updateStatus)
    .delete(ownerAuth_1.ownerProtect, laundry_1.deliverLaundry);
exports.default = router;
