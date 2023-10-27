import express from "express";
import passport from "passport";
import { Request, Response } from "express";
import "../config/passport";
import jwt from "jsonwebtoken";

const router = express.Router();

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

router.get("/logout", (req: any, res) => {
  try {
    req.logout();
    res.status(201).json({ status: "success", message: "logged out" });
  } catch (err) {
    res.status(500).json({ status: "failed", message: err.messsage });
  }
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    accessType: "offline",
    prompt: "consent",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/user/login",
    session: true,
  }),
  function (req, res) {
    res.redirect(`http://localhost:5173/user/login`);
  }
);

router.get(
  "/getUser",

  function (req: any, res) {
    try {
      let access_token;
      let refresh_token;
      if (req.user) {
        access_token = signAccessToken(
          req.user.emails[0].value.slice(1, 9),
          "1h"
        );
        refresh_token = signRefreshToken(
          req.user.emails[0].value.slice(1, 9),
          "7d"
        );
      } else {
        throw new Error("Auth Failed");
      }
      res.status(200).json({
        status: "success",
        user: req.user,
        access_token,
        refresh_token,
      });
    } catch (err) {
      res.status(500).json({ status: "failed", message: err.message });
    }
  }
);

export default router;
