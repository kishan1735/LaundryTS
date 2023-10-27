import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import ownerRoutes from "./routes/ownerRoutes";
import protectedRoutes from "./routes/protectedRoutes";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import cors from "cors";
import session from "express-session";
import "dotenv/config";
import "./config/passport";
import passport from "passport";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
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
app.set("trust proxy", 1);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/owner", ownerRoutes);
app.use("/api/v1/protect", protectedRoutes);

app.use("/auth", authRoutes);

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
