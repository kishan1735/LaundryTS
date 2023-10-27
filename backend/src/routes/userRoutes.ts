import express from "express";
import { createAccessToken, userProtect } from "../controllers/userAuth";
import { updateUser, deleteUser, getUser } from "../controllers/user";
import {
  getUserShop,
  updateSatisfy,
  updateRating,
  getRating,
  getAllShops,
} from "../controllers/shop";
import {
  calculatePrice,
  cancelLaundry,
  createLaundryRequest,
  getLaundry,
} from "../controllers/laundry";
const router = express.Router();

router
  .route("/profile")
  .get(userProtect, getUser)
  .patch(userProtect, updateUser)
  .delete(userProtect, deleteUser);
router.route("/shops").get(userProtect, getAllShops);
router.route("/shops/:shopId").get(userProtect, getUserShop);
router.route("/shops/:shopId/satisfaction").patch(userProtect, updateSatisfy);
router.route("/shops/:shopId/calculateCost").post(userProtect, calculatePrice);
router.route("/createtoken").post(createAccessToken);
router
  .route("/:id/:shopId/laundry")
  .post(userProtect, createLaundryRequest)
  .get(userProtect, getLaundry)
  .delete(userProtect, cancelLaundry);
router
  .route("/shops/:shopId/rating")
  .get(userProtect, getRating)
  .patch(userProtect, updateRating);

export default router;
