"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const ownerRoutes_1 = __importDefault(require("./routes/ownerRoutes"));
const protectedRoutes_1 = __importDefault(require("./routes/protectedRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
require("./config/google");
require("dotenv/config");
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
app.use("/api/v1/user", userRoutes_1.default);
app.use("/api/v1/owner", ownerRoutes_1.default);
app.use("/api/v1/protect", protectedRoutes_1.default);
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile"] }));
app.get("/auth/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: "http://localhost:5173/user/login",
}), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("http://localhost:5173");
});
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
const DB = (_a = process.env.DATABASE_URL) === null || _a === void 0 ? void 0 : _a.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose_1.default.connect(DB, {}).then(() => {
    console.log("Database Connected");
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});
