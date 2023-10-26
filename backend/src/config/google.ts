import User from "../models/userModel";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
const GoogleStrategy = require("passport-google-oauth20").Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:8000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("user profile is: ", profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const currentUser = await User.findOne({
    id,
  });
  done(null, currentUser);
});
