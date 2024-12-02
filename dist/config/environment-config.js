"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env.dev' });
exports.config = {
    BOT_TOKEN: process.env.BOT_TOKEN
};
