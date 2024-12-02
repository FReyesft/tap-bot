"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
exports.default = (client) => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            console.log(chalk_1.default.bgRed.bold(`The client cant be online`));
            return;
        }
        console.log(chalk_1.default.bgGreen.bold(`${client.user.username} is online and running`));
    });
};
