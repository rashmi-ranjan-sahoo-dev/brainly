"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userMiddleware = (req, res, next) => {
    const header = req.headers["authorization"];
    if (!header) {
        return res.status(401).json({ message: "Authorzation header missing" });
    }
    const token = header.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        req.userId = decoded.id;
        next();
    }
    catch (err) {
        res.status(403).json({ messsage: "Invalid or expired token" });
    }
};
exports.userMiddleware = userMiddleware;
