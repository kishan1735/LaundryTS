import express from "express";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Owner from "../models/ownerModel";
import User from "../models/userModel";
const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.body.token;
    const decoded: any = await jwt.verify(token, process.env.JWT_SECRET);
    let owner = await Owner.findById(decoded.id);
    let user = await User.findOne({ id: decoded.id });
    if (owner) {
      res.status(200).json({ status: "success", type: "owner" });
    } else if (user) {
      res.status(200).json({ status: "success", type: "user" });
    } else {
      res.status(200).json({ status: "success", type: "notoken" });
    }
    next();
  } catch (err) {
    res.status(500).json({ status: "failed", message: err.message });
  }
});

export default router;
