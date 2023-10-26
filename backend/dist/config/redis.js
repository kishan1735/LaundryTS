"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
let redisClient;
(() => __awaiter(void 0, void 0, void 0, function* () {
    //Creating redis object - default port 6379
    exports.redisClient = redisClient = (0, redis_1.createClient)();
    redisClient.on("connect", () => {
        console.log("Redis Connected");
    });
    redisClient.on("error", (error) => {
        console.log(`Error : ${error}`);
    });
    redisClient.on("end", () => {
        console.log("Connection ended");
    });
    yield redisClient.connect();
}))();
