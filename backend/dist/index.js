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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//@ts-ignore
const config_1 = require("../config");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
//@ts-ignore
app.post('/api/v1/signup', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const validedDate = zod_1.z.object({
            email: zod_1.z.string().min(4).max(40).email(),
            password: zod_1.z.string().min(8).regex(/[A-Z]/, "Must include at least one uppercase letter")
                .regex(/[a-z]/, "Must include at least one lowercase letter")
                .regex(/[0-9]/, "Must include at least one digit")
                .regex(/[^A-Za-z0-9]/, "Must include at least one special character")
        });
        const parsedDataWithSuccess = validedDate.safeParse(req.body);
        if (!parsedDataWithSuccess.success) {
            res.json({
                message: "incorrect format",
                error: parsedDataWithSuccess.error
            });
            return;
        }
        const { email, password } = req.body;
        try {
            const existingUser = yield db_1.UsernModel.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: "user already exists" });
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = yield db_1.UsernModel.create({
                email: email,
                password: hashedPassword
            });
            res.json({
                message: "you are signend up"
            });
        }
        catch (error) {
            console.error("Error during user signup:", error);
            res.status(500).json({
                message: "An error occurred during signup",
                error: error.message
            });
        }
    });
});
app.post('/api/v1/signin', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const validedDate = zod_1.z.object({
            email: zod_1.z.string().min(4).max(40).email(),
            password: zod_1.z.string().min(8).regex(/[A-Z]/, "Must include at least one uppercase letter")
                .regex(/[a-z]/, "Must include at least one lowercase letter")
                .regex(/[0-9]/, "Must include at least one digit")
                .regex(/[^A-Za-z0-9]/, "Must include at least one special character")
        });
        const parsedDataWithSuccess = validedDate.safeParse(req.body);
        if (!parsedDataWithSuccess.success) {
            res.json({
                message: "incorrect format",
                error: parsedDataWithSuccess.error
            });
            return;
        }
        const { email, password } = req.body;
        try {
            const response = yield db_1.UsernModel.findOne({ email: email });
            if (!response) {
                res.status(403).json({
                    message: "User not found"
                });
            }
            const passwordMatch = yield bcrypt_1.default.compare(password, response.password);
            if (passwordMatch) {
                const token = jsonwebtoken_1.default.sign({ id: response._id, }, config_1.JWT_SECRET);
                res.json({
                    token
                });
            }
            else {
                res.status(403).json({
                    message: "Incorrect credentials"
                });
            }
        }
        catch (error) {
            res.status(500).json({
                message: "An error occurred during signin",
                error: error.message
            });
        }
    });
});
app.post('/api/v1/content', function (req, res) {
});
app.get('/api/v1/content', function (req, res) {
});
app.delete('/api/v1/content', function (req, res) {
});
// app.get('/api/v1/brain/":shareLink',function(req,res){
// })
function main() {
    mongoose_1.default.connect(config_1.MONGO_URL);
    app.listen(3000, () => console.log("app listening on the port no 3000"));
}
main();
