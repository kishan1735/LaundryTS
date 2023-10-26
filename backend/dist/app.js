"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const ownerRoutes_1 = __importDefault(require("./routes/ownerRoutes"));
const protectedRoutes_1 = __importDefault(require("./routes/protectedRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const express_flash_1 = __importDefault(require("express-flash"));
require("./config/google");
dotenv_1.default.config({ path: "./config.env" });
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173"],
}));
app.use((0, express_session_1.default)({
    resave: false,
    saveUninitialized: true,
    secret: "i am kishan",
    cookies: { secure: false },
}));
app.use((0, express_flash_1.default)());
app.use("/api/v1/user", userRoutes_1.default);
app.use("/api/v1/owner", ownerRoutes_1.default);
app.use("/api/v1/protect", protectedRoutes_1.default);
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.get("/auth/google", passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
}));
app.get("/auth/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: "/",
    successRedirect: `https://localhost:5173/user/login`,
    failureFlash: true,
    successFlash: "Successfully logged in!",
}));
const DB = (_a = process.env.DATABASE_URL) === null || _a === void 0 ? void 0 : _a.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose_1.default.connect(DB, {}).then(() => {
    console.log("Database Connected");
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});
