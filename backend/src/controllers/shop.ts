import { NextFunction, Request, Response } from "express";
import Owner from "../models/ownerModel";
import Shop from "../models/shopModel";
import { redisClient } from "../config/redis";

interface OwnerRequest extends Request {
  owner: any;
}

interface UserRequest extends Request {
  user: any;
}
const getAllShops = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const shops = await Shop.find();
    if (!shops) {
      throw new Error("No shops registered");
    }
    res.status(200).json({
      status: "success",
      shops,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

const getUserShop = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  let shop = req.params.shopId;
  let results;
  try {
    const cachedResults = await redisClient.get("Shop:" + shop);
    if (cachedResults !== "null" && cachedResults !== null) {
      results = JSON.parse(cachedResults);
    } else {
      results = await Shop.findById(req.params.shopId);
      await redisClient.set("Shop:" + shop, JSON.stringify(results));
      await redisClient.expire("Shop:" + shop, 200);
    }
    if (!results) {
      throw new Error("Shop not found");
    }
    res.status(200).json({ status: "success", shop: results });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const getOwnerShop = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  let shop = req.owner.shopId.toString();
  let results;
  try {
    const cachedResults: any = await redisClient.get("Shop:" + shop);
    if (cachedResults !== null && cachedResults !== "null") {
      results = JSON.parse(cachedResults);
    } else {
      results = await Shop.findById(req.owner.shopId.toString());

      await redisClient.set("Shop:" + shop, JSON.stringify(results));
      await redisClient.expire("Shop:" + shop, 200);
    }
    if (!results) {
      throw new Error("Shop not found");
    }
    res.status(200).json({ status: "success", shop: results });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const createShop = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner = await Owner.findOne({ ownerId: req.owner.ownerId });
    if (!owner) {
      throw new Error("Register as Owner to create shop");
    }
    const shop = await Shop.create({
      name: req.body.name,
      address: req.body.address,
      ownerId: req.owner.ownerId,
      contactNumber: req.body.contactNumber,
      price: {
        shirt: req.body.price.shirt,
        tshirt: req.body.price.tshirt,
        shorts: req.body.price.shorts,
        pant: req.body.price.pant,
        towel: req.body.price.towel,
        bedsheet: req.body.price.bedsheet,
        pillowCover: req.body.price.pillowCover,
      },
    });

    await Owner.findOneAndUpdate(
      { ownerId: req.owner.ownerId },
      { shopId: shop._id.toString() }
    );
    res.status(201).json({
      status: "success",
      shop,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const updatePrice = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  let shop = req.owner.shopId;
  let results: any;
  try {
    const initShop = await Shop.findById(req.owner.shopId);

    results = await Shop.findByIdAndUpdate(req.owner.shopId, {
      price: {
        shirt: req.body.price.shirt ?? initShop.price.shirt,
        tshirt: req.body.price.tshirt ?? initShop.price.tshirt,
        shorts: req.body.price.shorts ?? initShop.price.shorts,
        pant: req.body.price.pant ?? initShop.price.pant,
        towel: req.body.price.towel ?? initShop.price.towel,
        bedsheet: req.body.price.bedsheet ?? initShop.price.bedsheet,
        pillowCover: req.body.price.pillowCover ?? initShop.price.pillowCover,
      },
    });
    if (!results) {
      throw new Error("Shop Not Found");
    }
    results = await Shop.findById(req.owner.shopId);
    await redisClient.set("Shop:" + shop, JSON.stringify(results), {
      XX: true,
    });
    res.status(200).json({
      status: "success",
      shop: results,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const updateShop = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  let shop = req.owner.shopId;
  let results: any;
  try {
    const initShop = await Shop.findById(req.owner.shopId);
    results = await Shop.findByIdAndUpdate(req.owner.shopId, {
      contactNumber: req.body.contactNumber ?? initShop.contactNumber,
      name: req.body.name ?? initShop.name,
      address: req.body.address ?? initShop.address,
    });
    if (!shop) {
      throw new Error("Shop Not Found");
    }
    results = await Shop.findById(req.owner.shopId);
    await redisClient.set("Shop:" + shop, JSON.stringify(results));
    await redisClient.expire("Shop:" + shop, 200);
    res.status(200).json({
      status: "success",
      shop: results,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const deleteShop = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.owner.shopId);
    if (!shop) {
      throw new Error("You don't own a shop yet");
    }

    const owner = await Owner.findOneAndUpdate(
      { ownerId: req.owner.ownerId },
      { shopId: "" }
    );
    await redisClient.flushDb();
    res.status(204).json({ status: "success", message: "deleted" });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const updateSatisfy = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  let shop = req.params.shopId;
  let results: any;
  try {
    const initShop: any = await Shop.findById(req.params.shopId);
    if (req.body.satisfaction === "satisfied") {
      results = await Shop.findByIdAndUpdate(req.params.shopId, {
        satisfied: initShop.satisfied + 1,
      });
    } else if (req.body.satisfaction === "unsatisfied") {
      results = await Shop.findByIdAndUpdate(req.params.shopId, {
        unsatisfied: initShop.unsatisfied + 1,
      });
    }
    if (!results) {
      throw new Error("Shop Not Found");
    }
    results = await Shop.findById(req.params.shopId);
    await redisClient.set("Shop:" + shop, JSON.stringify(results));
    await redisClient.expire("Shop:" + shop, 200);
    res.status(200).json({
      status: "success",
      shop: results,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const getRating = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) {
      throw new Error("This shop doesn't exist");
    }
    const length = shop.ratings.length;
    const ratingCalc = shop.ratings.reduce(
      (
        acc: number,
        curr: { rating: number; description: string; id: string }
      ) => acc + curr.rating / length,
      0
    );
    const user: any = await Shop.findById(req.params.shopId);
    const userRating = user.ratings.filter((el) => el.id == req.user.id);

    res.status(200).json({
      status: "success",
      rating: ratingCalc,
      userRating,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const updateRating = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  let shop = req.params.shopId;
  let results: any;
  try {
    results = await Shop.findByIdAndUpdate(req.params.shopId, {
      $push: {
        ratings: {
          id: req.user.id,
          rating: req.body.rating,
          description: req.body.description,
        },
      },
    });
    if (!results) {
      throw new Error("This shop doesn't exist");
    }
    results = await Shop.findById(req.params.shopId);
    await redisClient.set("Shop:" + shop, JSON.stringify(results));
    await redisClient.expire("Shop:" + shop, 200);
    res.status(200).json({
      status: "success",
      shop: results,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

export {
  createShop,
  updateShop,
  updatePrice,
  getAllShops,
  deleteShop,
  getUserShop,
  getRating,
  updateSatisfy,
  updateRating,
  getOwnerShop,
};
