import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import ownerRoutes from "./routes/ownerRoutes";
import protectedRoutes from "./routes/protectedRoutes";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import flash from "express-flash";
import "./config/google";
dotenv.config({ path: "./config.env" });

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "i am kishan",
    cookies: { secure: false },
  })
);
app.use(flash());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/owner", ownerRoutes);
app.use("/api/v1/protect", protectedRoutes);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: `https://localhost:5173/user/login`,
    failureFlash: true,
    successFlash: "Successfully logged in!",
  })
);

const DB: any = process.env.DATABASE_URL?.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD!
)!;
mongoose.connect(DB, {}).then(() => {
  console.log("Database Connected");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
