"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_1 = require("../controllers/userAuth");
const user_1 = require("../controllers/user");
const shop_1 = require("../controllers/shop");
const laundry_1 = require("../controllers/laundry");
const router = express_1.default.Router();
router.route("/signup").post(userAuth_1.userSignup);
router.route("/login").post(userAuth_1.userLogin);
router.route("/forgotPassword").post(userAuth_1.forgotPassword);
router.route("/resetpassword").post(userAuth_1.resetPassword);
router
    .route("/profile")
    .get(userAuth_1.userProtect, user_1.getUser)
    .patch(userAuth_1.userProtect, user_1.updateUser)
    .delete(userAuth_1.userProtect, user_1.deleteUser);
router.route("/shops").get(userAuth_1.userProtect, shop_1.getAllShops);
router.route("/shops/:shopId").get(userAuth_1.userProtect, shop_1.getUserShop);
router.route("/shops/:shopId/satisfaction").patch(userAuth_1.userProtect, shop_1.updateSatisfy);
router.route("/shops/:shopId/calculateCost").post(userAuth_1.userProtect, laundry_1.calculatePrice);
router
    .route("/:id/:shopId/laundry")
    .post(userAuth_1.userProtect, laundry_1.createLaundryRequest)
    .get(userAuth_1.userProtect, laundry_1.getLaundry)
    .delete(userAuth_1.userProtect, laundry_1.cancelLaundry);
router
    .route("/shops/:shopId/rating")
    .get(userAuth_1.userProtect, shop_1.getRating)
    .patch(userAuth_1.userProtect, shop_1.updateRating);
exports.default = router;
