import passport from "passport";
import "dotenv/config";
import User from "../models/userModel";

var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      let name, email, id;
      if (profile) {
        name = profile.displayName;
        email = profile.emails[0].value;
        id = profile.emails[0].value.slice(1, 9);
      }
      const user = await User.findOne({ email });
      if (!user) {
        await User.create({ email, id, name });
      }
      done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
