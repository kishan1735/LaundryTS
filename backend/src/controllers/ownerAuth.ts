import Owner from "../models/ownerModel";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
// import { transporter } from "../components/nodemailer";
import { sendMail } from "../config/nodemailer";

interface OwnerRequest extends Request {
  owner: any;
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

const ownerSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newOwner: any = await Owner.create({
      name: req.body.name,
      email: req.body.email,
      ownerId: req.body.ownerId,
      password: req.body.password,
      shopId: req.body.shopId || "",
      phoneNumber: req.body.phoneNumber,
    });
    res.status(201).json({ status: "success", data: { user: newOwner } });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const ownerLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("You have to provide both email and password");
    }

    const owner = await Owner.findOne({ email }).select("+password");

    if (!owner || !(await owner.correctPassword(password, owner.password))) {
      throw new Error("Unauthorised : Password or email incorrect");
    }

    const accessToken = signAccessToken(owner._id, "1h");
    const refreshToken = signRefreshToken(owner._id, "7d");
    res.status(200).json({
      status: "success",
      message: "Logged In",
      accessToken,
      refreshToken,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const ownerProtect = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let access_token;
    if (!req.headers.authorization) {
      throw new Error("Login and try again");
    }
    if (
      req.headers.authorization.split(" ")[0] == "Bearer" &&
      req.headers.authorization.split(" ")[1]
    ) {
      access_token = req.headers.authorization.split(" ")[1];
    }

    const decoded: any = jwt.verify(access_token, process.env.JWT_SECRET);

    const freshOwner = await Owner.findById(decoded.id);
    if (!freshOwner) {
      throw new Error("Login as owner and try later");
    }
    req.owner = freshOwner;
    next();
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const forgotPassword = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  const owner: any = await Owner.findOne({ email: req.body.email });
  try {
    if (!owner) {
      throw new Error("Owner doesn't exist - SignUp");
    }
    const resetToken = owner.createPasswordResetToken();
    await owner.save({ validateBeforeSave: false });
    let mailOptions = {
      to: req.body.email,
      subject: "Password Reset Token",
      text: `${resetToken}`,
    };
    await sendMail({
      email: req.body.email,
      subject: "Your password reset token",
      message: owner.passwordResetToken,
    });
    res.status(200).json({
      status: "success",
      message: "Token Sent",
      resetToken: owner.passwordResetToken,
    });
  } catch (err) {
    if (owner?.passwordResetToken) {
      owner.passwordResetToken;
    }
    if (owner?.passwordResetExpires) owner.passwordResetExpires = undefined;
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
const resetPassword = async (
  req: OwnerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const hashedToken = req.body.token;
    const owner = await Owner.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!owner) {
      throw new Error("Token is invalid or expired");
    }
    if (!req.body.password) {
      throw new Error("Give password");
    }
    owner.password = req.body.password;

    owner.passwordResetToken = undefined;
    owner.passwordResetExpires = undefined;

    await owner.save();
    res.status(200).json({
      status: "success",
      message: "password updated",
    });
  } catch (err) {
    res.status(500).json({ status: "failed", message: err.message });
  }
};
const createAccessToken = async (req: OwnerRequest, res: Response) => {
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
export {
  ownerLogin,
  ownerSignup,
  ownerProtect,
  forgotPassword,
  resetPassword,
  createAccessToken,
};
