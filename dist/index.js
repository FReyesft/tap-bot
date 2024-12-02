"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const ready_1 = tslib_1.__importDefault(require("./listerners/ready"));
const environment_config_1 = require("./config/environment-config");
const token = environment_config_1.config.BOT_TOKEN;
const client = new discord_js_1.Client({
    intents: []
});
(0, ready_1.default)(client);
client.login(token);
