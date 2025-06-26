"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentModel = exports.UsernModel = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
exports.UsernModel = (0, mongoose_1.model)("User", UserSchema);
const ContentSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
    tags: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
});
exports.ContentModel = (0, mongoose_1.model)("Content", ContentSchema);
