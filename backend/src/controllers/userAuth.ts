import User from "../models/userModel";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface UserRequest extends Request {
  user: any;
}

const signRefreshToken = (id: string, expiresIn) => {
  return jwt.sign({ id, type: "refresh" }, process.env.JWT_SECRET!, {
    expiresIn: expiresIn,
  });
};

const signAccessToken = (id: string, expiresIn) => {
  return jwt.sign({ id, type: "access" }, process.env.JWT_SECRET!, {
    expiresIn: expiresIn,
  });
};

const userProtect = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;
    if (!req.headers.authorization) {
      throw new Error("Login and try again");
    }
    if (
      req.headers.authorization.split(" ")[0] == "Bearer" &&
      req.headers.authorization.split(" ")[1]
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      throw new Error("You are not logged In !!! Please Login to gain access");
    }
    const decoded: any = await jwt.verify(token, process.env.JWT_SECRET);
    const freshUser = await User.findOne({ id: decoded.id });
    if (!freshUser) {
      throw new Error("Login as user and try later");
    }
    req.user = freshUser;
    next();
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const createAccessToken = async (req: UserRequest, res: Response) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("Login and try again");
    }
    let refreshToken;
    if (
      req.headers.authorization.split(" ")[0] == "Bearer" &&
      req.headers.authorization.split(" ")[1]
    ) {
      refreshToken = req.headers.authorization.split(" ")[1];
    }
    if (!refreshToken) {
      throw new Error("You are not logged In !!! Please Login to gain access");
    }
    const decoded: any = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (!decoded) {
      throw new Error("Login to gain access");
    }
    const accessToken = signAccessToken(decoded.id, "1h");
    res.status(200).json({ status: "success", accessToken });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

export { userProtect, createAccessToken };
