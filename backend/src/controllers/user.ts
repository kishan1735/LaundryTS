import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import { redisClient } from "../config/redis";

interface UserRequest extends Request {
  user: any;
}
const getUser = async (req: UserRequest, res: Response, next: NextFunction) => {
  let user = req.user._id.toString();
  let results;
  try {
    const cachedResults = await redisClient.get("User:" + user);
    if (cachedResults !== "null" && cachedResults !== null) {
      results = JSON.parse(cachedResults);
    } else {
      results = await User.findById(req.user._id);
      await redisClient.set("User:" + user, JSON.stringify(results));
      await redisClient.expire("User:" + user, 200);
    }

    if (!results) {
      throw new Error("Login and try again");
    }
    res.status(200).json({ status: "success", user: results });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};
const updateUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  let user = req.user._id.toString();
  let results;
  try {
    const initUser: any = User.findById(req.user._id);
    results = await User.findByIdAndUpdate(req.user._id, {
      name: req.body.name || initUser.name,
      phoneNumber: req.body.phoneNumber || initUser.phoneNumber,
      address: req.body.address || initUser.address,
    });

    if (!results) {
      throw new Error("User not found");
    }
    results = await User.findById(req.user._id);
    await redisClient.set("User:" + user, JSON.stringify(results));
    await redisClient.expire("User:" + user, 200);
    res.status(200).json({
      status: "success",
      user: results,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const deleteUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  let results;
  try {
    results = await User.findOneAndRemove({ id: req.user.id });
    if (!results) {
      throw new Error("User Not Found");
    }
    await redisClient.flushDb();
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

export { updateUser, deleteUser, getUser };
