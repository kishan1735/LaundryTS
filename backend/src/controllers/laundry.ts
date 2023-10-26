import Laundry from "../models/laundryModel";
import User from "../models/userModel";
import Owner from "../models/ownerModel";
import Shop from "../models/shopModel";
import { Request, Response, NextFunction } from "express";
import { redisClient } from "../config/redis";

interface OwnerRequest extends Request {
  owner: any;
}

interface UserRequest extends Request {
  user: any;
}

const calculatePrice = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const shop: any = await Shop.findById(req.params.shopId);
    const totalCost = Object.keys(shop.price)
      .filter((el) => req.body.list[el] && shop.price[el])
      .reduce(
        (acc: number, curr: string) =>
          acc + req.body.list[curr] * shop.price[curr],
        0
      );
    res.status(200).json({ status: "success", totalCost });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};
const createLaundryRequest = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let shop: any = await Shop.findById(req.params.shopId);
    const laundryList = await Laundry.create({
      name: req.user.name,
      shopId: req.params.shopId,
      studentId: req.user._id,
      studentAddress: req.user.address,
      studentPhoneNumber: req.user.phoneNumber,
      list: {
        shirt: req.body.list.shirt,
        tshirt: req.body.list.tshirt,
        shorts: req.body.list.shorts,
        pant: req.body.list.pant,
        towel: req.body.list.towel,
        bedsheet: req.body.list.bedsheet,
        pillowCover: req.body.list.pillowCover,
      },
      totalCost: req.body.totalCost,
      status: "pending",
    });
    const user = await User.findByIdAndUpdate(req.user._id, {
      $push: {
        laundry: {
          shopId: shop._id,
          totalCost: req.body.totalCost,
          laundryId: laundryList._id,
        },
      },
    });
    shop = await Shop.findByIdAndUpdate(req.params.shopId, {
      $push: {
        laundry: {
          userId: req.user._id,
          totalCost: req.body.totalCost,
          laundryId: laundryList._id,
        },
      },
    });
    res.status(201).json({
      status: "success",
      laundryList,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};
const getLaundry = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let results;
    const shop = await Shop.findById(req.params.shopId);
    const laundryId = shop.laundry.filter(
      (el) => el.userId === req.user._id.toString()
    )[0].laundryId;
    results = await Laundry.findById(laundryId);

    if (!results) {
      throw new Error("This Laundry Id doesn't exist");
    }
    res.status(200).json({ status: "success", laundry: results });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};
const getAllLaundry = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const laundry = await Laundry.find({ shopId: req.owner.shopId });
    if (!laundry) {
      throw new Error("There is no laundry for this shop");
    }
    res.status(200).json({ status: "success", laundry });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const updateStatus = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  let results;
  try {
    if (req.body.status === "active") {
      results = await Laundry.findByIdAndUpdate(req.body.laundryId, {
        status: "active",
        deliveryDate: req.body.deliveryDate,
      });
    } else if (req.body.status === "ready") {
      results = await Laundry.findByIdAndUpdate(req.body.laundryId, {
        status: "ready",
      });
    }
    if (!results) {
      throw new Error("This laundry doesn't exist");
    }

    results = await Laundry.findById(req.body.laundryId);
    res.status(200).json({
      status: "success",
      laundry: results,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const cancelLaundry = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let shop: any = await Shop.findById(req.params.shopId);
    const laundryId = shop.laundry.filter(
      (el) => el.userId === req.user._id.toString()
    )[0].laundryId;
    const laundry = await Laundry.findByIdAndDelete(laundryId);
    shop = await Shop.findByIdAndUpdate(req.params.shopId, {
      $pull: {
        laundry: {
          laundryId,
        },
      },
    });
    const user = await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        laundry: {
          laundryId,
        },
      },
    });
    await redisClient.flushDb();
    res.status(201).json({ status: "success", message: "deleted" });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const deliverLaundry = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const laundry = await Laundry.findByIdAndDelete(req.params.laundryId);
    const shop = await Shop.findByIdAndUpdate(req.params.laundryId, {
      $pull: {
        laundry: {
          laundryId: req.params.laundryId,
        },
      },
    });
    const user = await User.findOneAndUpdate(
      { laundry: { laundryId: req.params.laundryId } },
      {
        $pull: {
          laundry: {
            laundryId: req.params.laundryId,
          },
        },
      }
    );
    res.status(204).json({ status: "success", message: "deleted" });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

export {
  createLaundryRequest,
  getAllLaundry,
  getLaundry,
  updateStatus,
  calculatePrice,
  cancelLaundry,
  deliverLaundry,
};
