import express from "express";
import {
  ownerSignup,
  ownerLogin,
  ownerProtect,
  forgotPassword,
  createAccessToken,
} from "../controllers/ownerAuth";
import {
  updateShop,
  updatePrice,
  getOwnerShop,
  deleteShop,
  createShop,
} from "../controllers/shop";
import { updateOwner, deleteOwner, getOwner } from "../controllers/owner";
import {
  getLaundry,
  getAllLaundry,
  updateStatus,
  deliverLaundry,
} from "../controllers/laundry";
import { resetPassword } from "../controllers/ownerAuth";
const router = express.Router();

router.route("/signup").post(ownerSignup);
router.route("/login").post(ownerLogin);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword").post(resetPassword);
router.route("/createtoken").post(createAccessToken);
router
  .route("/shop")
  .post(ownerProtect, createShop)
  .get(ownerProtect, getOwnerShop)
  .patch(ownerProtect, updateShop)
  .delete(ownerProtect, deleteShop);
router
  .route("/profile")
  .get(ownerProtect, getOwner)
  .patch(ownerProtect, updateOwner)
  .delete(ownerProtect, deleteOwner);

router.route("/shop/updatePrice").patch(ownerProtect, updatePrice);
router.route("/shop/laundry").get(ownerProtect, getAllLaundry);
router
  .route("/shop/laundry/:laundryId")
  .patch(ownerProtect, updateStatus)
  .delete(ownerProtect, deliverLaundry);

export default router;
