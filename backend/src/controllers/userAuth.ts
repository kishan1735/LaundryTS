import User from "../models/userModel";
import Owner from "../models/ownerModel";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { promisify } from "util";
import { sendMail } from "../config/nodemailer";
// import { transporter } from "../components/nodemailer";

interface UserRequest extends Request {
  user: any;
}

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });
};

const userSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser: any = await User.create({
      name: req.body.name,
      email: req.body.email,
      id: req.body.id,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
    });

    const token = signToken(newUser.id);

    res.status(201).json({ status: "success", data: { user: newUser } });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("You have to provide both email and password");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error("Unauthorised : Password or email incorrect");
    }

    const token = signToken(user._id);
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        status: "success",
        message: "Logged In",
        access_token: token,
      });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
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
    const freshUser = await User.findById(decoded.id);
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

const forgotPassword = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const user: any = await User.findOne({ email: req.body.email });
  try {
    if (!user) {
      throw new Error("User doesn't exist - SignUp");
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    await sendMail({
      email: req.body.email,
      subject: "Your password reset token",
      message: user.passwordResetToken,
    });
    res.status(200).json({
      status: "success",
      message: "Token Sent",
      resetToken: user.passwordResetToken,
    });
  } catch (err) {
    if (user?.passwordResetToken) {
      user.passwordResetToken;
    }
    if (user?.passwordResetExpires) user.passwordResetExpires = undefined;
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const resetPassword = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const hashedToken = req.body.token;
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      throw new Error("Token is invalid or expired");
    }
    if (!req.body.password) {
      throw new Error("Give password");
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "password updated",
    });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};

export { userLogin, userSignup, userProtect, forgotPassword, resetPassword };
