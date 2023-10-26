import { NextFunction, Request, Response } from "express";
import Owner from "../models/ownerModel";
import { redisClient } from "../config/redis";

interface OwnerRequest extends Request {
  owner: any;
}
const getOwner = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  let owner = req.owner._id.toString();
  let results;
  try {
    const cachedResults = await redisClient.get("Owner:" + owner);
    if (cachedResults !== "null" && cachedResults !== null) {
      results = JSON.parse(cachedResults);
    } else {
      results = await Owner.findById(req.owner._id);
      await redisClient.set("Owner:" + owner, JSON.stringify(results));
      await redisClient.expire("Owner:" + owner, 300);
    }
    if (!results) {
      throw new Error("Login and try again");
    }
    res.status(200).json({ status: "success", owner: results });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};
const updateOwner = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  let owner = req.owner._id.toString();
  let results;
  try {
    const initOwner = await Owner.findById(req.owner._id);
    results = await Owner.findByIdAndUpdate(req.owner._id, {
      phoneNumber: req.body.phoneNumber || initOwner.phoneNumbers,
      name: req.body.name || initOwner.name,
    });

    if (!results) {
      throw new Error("Change existing field to update");
    }
    results = await Owner.findById(req.owner._id);
    await redisClient.set("Owner:" + owner, JSON.stringify(results));
    await redisClient.expire("Owner:" + owner, 300);
    res.status(200).json({
      status: "success",
      owner: results,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const deleteOwner = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner = await Owner.findOneAndRemove({ ownerId: req.owner.ownerId });
    if (!owner) {
      throw new Error("Owner not found");
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

export { updateOwner, deleteOwner, getOwner };
