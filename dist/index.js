"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const environment_config_1 = require("./config/environment-config");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
client.once(discord_js_1.Events.ClientReady, readyClient => {
    console.log(chalk_1.default.bgRed.bold(`Ready! Logged in as ${readyClient.user.tag}`));
});
client.login(environment_config_1.config.BOT_TOKEN);
